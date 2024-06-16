import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { parse } from 'node-html-parser';
import { cluster, sort } from 'radash';
import { LOGGER_CREATED } from '~/common/constants';
import { CreateLoggerDto } from '~/common/dtos';
import { IAnimeHayService, IAnimeService } from '~/contracts/services';
import { ServerType } from '~/models/sub-models/anime-sub-models/anime-streaming-server-type.enum';
import { generateDocumentFromBrowser } from '~/utils/tools/functions';
import { AnimeHayConfig } from '../configs/index';
import { SynchronizedAnimeEnum } from '../graphql/types/enums/synchronization-type.enum';
import { MediaExternalLink } from '../models/media-external-link.model';
import { AnimeStreamingEpisode } from '../models/sub-models/anime-sub-models/anime-streaming-episode.model';
import { TranslationType } from '../models/sub-models/anime-sub-models/anime-streaming-translation-type.enum';
import { ExternalLinkType } from '../models/sub-models/media-external-sub-models/media-external-link-type.enum';
import { getPageFromBrowser } from '../utils/tools/functions';

@Injectable()
export class AnimeHayService implements IAnimeHayService {
  private readonly logger = new Logger(AnimeHayService.name);
  // meta source infos
  private readonly site = 'AnimeHay';
  private readonly type = ExternalLinkType.STREAMING;
  private readonly language = 'Vietnamese';
  private readonly animeHayEndpoint?: string;

  constructor(
    private readonly eventEmitter: EventEmitter2,

    @Inject(IAnimeService) private readonly animeService: IAnimeService,

    @Inject(AnimeHayConfig.KEY)
    private readonly animeHayConfig: ConfigType<typeof AnimeHayConfig>,
  ) {
    this.animeHayEndpoint = animeHayConfig.endpoint;
  }

  @OnEvent(SynchronizedAnimeEnum.SYNC_ANIMEHAY)
  public async handleSyncAllAnime(page: number = 1): Promise<void> {
    for (let i = page; i <= 136; i++) {
      await this.syncAnimehay(i);
    }
  }

  @OnEvent(SynchronizedAnimeEnum.SYNC_ANIMEHAY_STREAMING_EPISODES)
  public async handleSyncAnimeStreamingEpisodes(
    page: number = 1,
    tryTimes: number = 1,
  ): Promise<void> {
    const { docs, pageInfo } =
      await this.animeService.getMediaExternalLinkListV1(page, 1, this.site);
    const mel = docs[0];

    try {
      const documentStreamingPage = await generateDocumentFromBrowser(
        `${this.animeHayEndpoint}${mel.animePath}`,
      );
      const episodeListsRaw = documentStreamingPage
        .querySelectorAll('.list-item-episode.scroll-bar a')
        .map((e: any) => {
          return {
            url: e.getAttribute('href'),
            title: e.textContent?.trim(),
          };
        });
      const episodeListsCluster = cluster(episodeListsRaw, 10);
      for await (const epList of episodeListsCluster) {
        await Promise.allSettled(
          epList.map(async (e: any) => {
            const browserPage = await getPageFromBrowser(e.url);

            try {
              if (!e.url) {
                this.logger.error(`Missing episode url: ${mel.animePath}`);
                this.eventEmitter.emit(LOGGER_CREATED, {
                  tracePath: `${AnimeHayService.name}.handleSyncAnimeStreamingEpisodes`,
                  requestObject: JSON.stringify({
                    animePath: mel.animePath,
                  }),
                } as CreateLoggerDto);
                return;
              }
              // @ts-ignore
              const data = await browserPage.evaluate(
                // @ts-ignore
                () => document.documentElement.outerHTML,
              );
              // @ts-ignorer
              const documentStreamingPage = parse(data);
              const info_play_video: any =
                await browserPage.evaluate('$info_play_video');
              const videoUrl = info_play_video?.tik;
              const currentServer = documentStreamingPage
                .querySelector('#list_sv a.bg-green')
                ?.textContent.trim();

              await browserPage.close();

              if (!videoUrl) {
                this.logger.error(`Can not find video id of: ${e.url}`);
                this.eventEmitter.emit(LOGGER_CREATED, {
                  tracePath: `${AnimeHayService.name}.handleSyncAnimeStreamingEpisodes`,
                  requestObject: JSON.stringify({
                    url: e.url,
                    animePath: mel.animePath,
                  }),
                } as CreateLoggerDto);
                return;
              }

              const animeStreamingEpisodeRaw =
                AnimeStreamingEpisode.createAnimeStreamingEpisode({
                  mediaExternalLink: mel, // important field
                  epId: e.url.split('-').slice(-1)[0].replace(/\D/g, ''), // important field (the order of episode)
                  // url: `${videoUrl}`, // important field
                  site: this.site, // important field
                  title: e.title,
                  // isM3U8: `${videoUrl}`.includes('m3u8'),
                  translationType: TranslationType.SUBBING_TRANSLATION,
                  language: this.language,

                  serverType: ServerType.PRIMARY,
                  // quality: 'HD',
                  serverName: currentServer,
                });

              if (
                await this.animeService.saveAnimeStreamingEpisode(
                  animeStreamingEpisodeRaw,
                )
              ) {
                this.logger.log(
                  `Save episode ${e.title} of ${mel.animePath}: ${mel.id} successfully page: ${page}`,
                );
              }
            } catch (error) {
              await browserPage.close();
            }
          }),
        );
      }

      if (pageInfo.hasNextPage) {
        this.handleSyncAnimeStreamingEpisodes(page + 1);
      } else {
        this.logger.log(`Save anime episodes DONE!`);
      }
    } catch (error) {
      this.logger.error(
        `Sync Anime Streaming Episodes error page: ${page}: ${error}`,
      );

      this.eventEmitter.emit(LOGGER_CREATED, {
        tracePath: `${AnimeHayService.name}.handleSyncAnimeStreamingEpisodes`,
        errorMessage: JSON.stringify(error),
      } as CreateLoggerDto);

      // retry 10 times if error
      if (tryTimes <= 10) {
        await new Promise((r) => setTimeout(r, 1000));
        await this.handleSyncAnimeStreamingEpisodes(page, tryTimes + 1);
      } else {
        await this.handleSyncAnimeStreamingEpisodes(page + 1, 1);
      }
    }
  }

  private async syncAnimehay(page: number) {
    const document = await generateDocumentFromBrowser(
      `${this.animeHayEndpoint}/phim-moi-cap-nhap/trang-${page}.html`,
    );

    const movieItemList = document.querySelectorAll('.movie-item');
    const movieItemListCluster = cluster(movieItemList, 5);

    for (const group of movieItemListCluster) {
      await Promise.allSettled(
        group.map(async (s: any) => {
          const animePath = s
            .querySelector('> a')
            ?.getAttribute('href')
            ?.replace(this.animeHayEndpoint!, '');

          // check existing animePath
          if (await this.animeService.findMediaExternalLink(`${animePath}`)) {
            const logObj = {
              requestObject: JSON.stringify(animePath),
              notes: `Duplicated animePath ${animePath} on Animehay`,
              tracePath: `${AnimeHayService.name}.syncAnimehay`,
            } as CreateLoggerDto;

            this.eventEmitter.emit(LOGGER_CREATED, logObj);

            return;
          }

          const document = await generateDocumentFromBrowser(
            `${this.animeHayEndpoint!}${animePath}`,
          );

          const mainTitle = document
            .querySelector('.heading_movie')
            ?.textContent.trim();
          const subTitle =
            document
              .querySelector('div.name_other > div:nth-child(2)')
              ?.textContent.trim() ?? mainTitle;
          const startDate = document
            .querySelector('.update_time div:nth-child(2)')
            ?.textContent.trim();
          const episodes = document
            .querySelector('.duration > div:nth-child(2)')
            ?.textContent.trim();
          const img = document
            .querySelector('.head.ah-frame-bg > div.first > img')
            ?.getAttribute('src');

          const animeList = await this.animeService.fuzzySearchAnimeByTitle(
            `${subTitle}`,
          );
          const sortedAnimeList = sort(animeList, (a) => a.maxScore, true);

          if (sortedAnimeList.length > 0) {
            const anime = await this.animeService.findAnimeByIdAnilist(
              sortedAnimeList[0].idAnilist,
            );

            if (
              anime &&
              anime.mediaExternalLink?.filter((m) => m.site === this.site)
                .length === 0
            ) {
              const mediaExternalLinkRaw: Partial<MediaExternalLink> = {
                anime,
                animePath: animePath,
                site: this.site,
                // "If there are more than 1 result, this is not a perfect match yet."
                isMatching: !(sortedAnimeList.length > 1),
                matchingScore: parseFloat(
                  parseFloat(`${sortedAnimeList[0]?.maxScore}`).toFixed(10),
                ),
                type: this.type,
                language: this.language,
                metaInfo: JSON.stringify({
                  mainTitle,
                  subTitle,
                  startDate,
                  episodes,
                  img,
                  animePath,
                }),
              };

              if (
                await this.animeService.saveMediaExternalLink(
                  mediaExternalLinkRaw,
                )
              ) {
                this.logger.log(`syncAnimeHay Successfully page: ${page}`);
              } else {
                this.logger.warn(
                  `Can not find anime ${subTitle} on AnimeHay page: ${page}`,
                );

                this.eventEmitter.emit(LOGGER_CREATED, {
                  requestObject: JSON.stringify(anime),
                  tracePath: `${AnimeHayService.name}.syncAnimehay`,
                  notes: JSON.stringify({
                    mainTitle,
                    subTitle,
                    startDate,
                    episodes,
                    img,
                    animePath,
                  }),
                } as CreateLoggerDto);
              }
            } else {
              this.logger.warn(
                `Can not find anime ${subTitle} on AnimeHay page: ${page}`,
              );

              this.eventEmitter.emit(LOGGER_CREATED, {
                requestObject: JSON.stringify(anime),
                tracePath: `${AnimeHayService.name}.syncAnimehay`,
                notes: JSON.stringify({
                  mainTitle,
                  subTitle,
                  startDate,
                  episodes,
                  img,
                  animePath,
                }),
              } as CreateLoggerDto);
            }
          }
        }),
      );
    }
  }

  private extractPageNumberFromUrl(url?: string) {
    if (!url) return 0;

    return Number(
      url
        .split('/')
        .slice(-1)[0]
        .replace(/[^0-9]/g, ''),
    );
  }

  private async getAnimeHayTotalPages() {
    const document = await generateDocumentFromBrowser(
      `${this.animeHayEndpoint}`,
    );

    return this.extractPageNumberFromUrl(
      document
        .querySelector('.pagination div > a:nth-child(6)')
        ?.getAttribute('href'),
    );
  }
}
