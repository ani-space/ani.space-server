import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import parse from 'node-html-parser';
import { cluster, sort } from 'radash';
import { LOGGER_CREATED } from '~/common/constants';
import { CreateLoggerDto } from '~/common/dtos';
import { IAnimeService, IGogoAnimeService } from '~/contracts/services';
import { AnimeStreamingEpisode } from '~/models/sub-models/anime-sub-models/anime-streaming-episode.model';
import { ServerType } from '~/models/sub-models/anime-sub-models/anime-streaming-server-type.enum';
import { TranslationType } from '~/models/sub-models/anime-sub-models/anime-streaming-translation-type.enum';
import { GogoAnimeConfig } from '../configs/index';
import { SynchronizedAnimeEnum } from '../graphql/types/enums/synchronization-type.enum';
import { MediaExternalLink } from '../models/media-external-link.model';
import { AnimeStreamingEpisodeSource } from '../models/sub-models/anime-sub-models/anime-streaming-episode-sources.model';
import { ExternalLinkType } from '../models/sub-models/media-external-sub-models/media-external-link-type.enum';

@Injectable()
export class GogoAnimeService implements IGogoAnimeService {
  private readonly logger = new Logger(GogoAnimeService.name);

  // meta source infos
  private readonly site = 'GogoAnime';
  private readonly type = ExternalLinkType.STREAMING;
  private readonly language = 'English';
  private readonly gogoAnimeEndpoint: string;
  private readonly consumetEndpoint = 'http://0.0.0.0:5000';

  constructor(
    private readonly gogoAnimeHttpClient: HttpService,

    private readonly eventEmitter: EventEmitter2,

    @Inject(IAnimeService)
    private readonly animeService: IAnimeService,

    @Inject(GogoAnimeConfig.KEY)
    private readonly gogoAnimeConfig: ConfigType<typeof GogoAnimeConfig>,
  ) {
    this.gogoAnimeEndpoint =
      gogoAnimeConfig.endpoint ?? 'https://gogoanime3.co';
  }

  @OnEvent(SynchronizedAnimeEnum.SYNC_GOGOANIME)
  public async handleSyncAllAnime(page: number = 1): Promise<void> {
    for (let i = page; i <= 99; i++) {
      const animeListCluster = await this.getAnimeListPerPage(i);

      for await (const aniList of animeListCluster) {
        await Promise.allSettled(
          aniList.map(async (e) => {
            // check existing animePath
            if (
              await this.animeService.findMediaExternalLink(`${e.animePath}`)
            ) {
              this.eventEmitter.emit(LOGGER_CREATED, {
                requestObject: JSON.stringify(`${e.animePath}`),
                notes: `Duplicated animePath ${`${e.animePath}`} on AnimeVSub`,
                tracePath: `${GogoAnimeService.name}.handleSyncAllAnime`,
              } as CreateLoggerDto);

              return;
            }

            // save meta info
            const metaInfoDocument = parse(`${e.metaInfo}`);
            const img = metaInfoDocument
              .querySelector('.thumnail_tool img')
              ?.getAttribute('src');
            const startDate = metaInfoDocument
              .querySelectorAll('.type')
              .find((e) => e.innerText.includes('Released'))
              ?.innerText.trim();
            const mainTitle = e.name;

            // fuzzy search anime in DB
            const animeList = await this.animeService.fuzzySearchAnimeByTitle(
              `${mainTitle}`,
            );
            const sortedAnimeList = sort(animeList, (a) => a.maxScore, true);

            // save top score
            if (sortedAnimeList.length > 0) {
              const anime = await this.animeService.findAnimeByIdAnilist(
                sortedAnimeList[0].idAnilist,
              );

              // save media external link
              if (
                anime &&
                anime.mediaExternalLink?.filter(
                  (m) => m.animePath === e.animePath,
                ).length === 0
              ) {
                const mediaExternalLinkRaw: Partial<MediaExternalLink> = {
                  anime,
                  animePath: e.animePath,
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
                    subTitle: mainTitle,
                    startDate,
                    episodes: 'N/A',
                    img,
                    animePath: e.animePath,
                  }),
                };

                if (
                  await this.animeService.saveMediaExternalLink(
                    mediaExternalLinkRaw,
                  )
                ) {
                  this.logger.log(`Sync GogoAnime Successfully page: ${i}`);
                } else {
                  this.logger.warn(
                    `Can not find anime ${mainTitle} on AnimeVSub page: ${i}`,
                  );

                  this.eventEmitter.emit(LOGGER_CREATED, {
                    requestObject: JSON.stringify(anime),
                    tracePath: 'GogoAnimeService.handleSyncAllAnime',
                    notes: JSON.stringify({
                      mainTitle,
                      subTitle: mainTitle,
                      startDate,
                      episodes: 'N/A',
                      img,
                      animePath: e.animePath,
                    }),
                  } as CreateLoggerDto);
                }
              }
            }
          }),
        );
      }
    }
  }

  @OnEvent(SynchronizedAnimeEnum.SYNC_GOGOANIME_STREAMING_EPISODES)
  public async handleSyncAnimeStreamingEpisodes(
    page: number = 1,
    retryTimes: number = 1,
  ): Promise<void> {
    const { docs, pageInfo } =
      await this.animeService.getMediaExternalLinkListV1(page, 1, this.site);
    const mel = docs[0];

    try {
      // get anime streaming eps info
      const pureAnimePath = mel.animePath?.replace('/category/', '');
      const { data: animeInfo } = await this.gogoAnimeHttpClient.axiosRef.get(
        `${this.consumetEndpoint}/anime/gogoanime/info/${pureAnimePath}`,
      );

      // save anime streaming eps info
      const cacheAnimeStreamingEpisode: Record<string, AnimeStreamingEpisode> =
        {};
      const { episodes, subOrDub } = animeInfo;
      if (!Array.isArray(episodes)) {
        this.eventEmitter.emit(LOGGER_CREATED, {
          tracePath: `${GogoAnimeService.name}.handleSyncAnimeStreamingEpisodes`,
          requestObject: JSON.stringify(mel),
          errorMessage: `Can not find episodes`,
        } as CreateLoggerDto);
        await this.handleSyncAnimeStreamingEpisodes(page + 1, 1);
        return;
      }
      await Promise.allSettled(
        episodes.map(async (e: any) => {
          const animeStreamingEpsRaw =
            AnimeStreamingEpisode.createAnimeStreamingEpisode({
              mediaExternalLink: mel,
              site: this.site,
              title: `${e?.number}`,
              serverName: 'gogocdn',
              translationType:
                subOrDub === 'sub'
                  ? TranslationType.SUBBING_TRANSLATION
                  : TranslationType.DUBBING_TRANSLATION,
              serverType: ServerType.PRIMARY,
              epId: `${e?.number}`,
              epHash: e?.id,
              language: this.language,
            });

          const animeStreamingEps =
            await this.animeService.saveAnimeStreamingEpisode(
              animeStreamingEpsRaw,
            );

          if (animeStreamingEps) {
            this.logger.log(`Save anime streaming ep successfully: ${e.id}`);
            cacheAnimeStreamingEpisode[e.id] = animeStreamingEps;
          }
        }),
      );

      // get & save anime streaming eps source
      await Promise.allSettled(
        Object.keys(cacheAnimeStreamingEpisode).map(async (e) => {
          const animeEps = cacheAnimeStreamingEpisode[e];
          const { epHash } = animeEps;
          //@ts-ignore
          await this.saveAnimeStreamingEpsSources(epHash, animeEps);
        }),
      );

      this.logger.log(`--- Save sources successfully page: ${page} ---`);

      if (pageInfo.hasNextPage) {
        await this.handleSyncAnimeStreamingEpisodes(page + 1, 1);
      } else {
        this.logger.log(`Save all sources successfully`);
      }
    } catch (error) {
      this.logger.error(
        `Sync Anime Streaming Episodes error page: ${page}: ${error}`,
      );

      this.eventEmitter.emit(LOGGER_CREATED, {
        tracePath: `${GogoAnimeService.name}.handleSyncAnimeStreamingEpisodes`,
        errorMessage: JSON.stringify(error),
      } as CreateLoggerDto);

      // retry
      if (retryTimes <= 3) {
        await new Promise((r) => setTimeout(r, 1000));
        await this.handleSyncAnimeStreamingEpisodes(page, retryTimes + 1);
      } else {
        await this.handleSyncAnimeStreamingEpisodes(page + 1, 1);
      }
    }
  }

  private async saveAnimeStreamingEpsSources(
    epHash: string | undefined,
    animeEps: AnimeStreamingEpisode,
    retryTimes: number = 1,
  ) {
    try {
      //@ts-ignore
      const { data } = await this.gogoAnimeHttpClient.axiosRef.get(
        `${this.consumetEndpoint}/anime/gogoanime/watch/${epHash}`,
      );
      const { headers, sources, download } = data;
      const sourcesListRaw = Array.isArray(sources)
        ? sources.map((s) => {
            return AnimeStreamingEpisodeSource.createSource({
              animeStreamingEpisode: animeEps,
              url: s.url,
              isM3U8: s.isM3U8,
              quality: s.quality,
            });
          })
        : [];

      if (headers && headers.Referer) {
        animeEps.referer = headers.Referer;
      }
      if (download) {
        animeEps.download = download;
      }

      await this.animeService.saveAnimeStreamingEpisode(animeEps);

      if (
        await this.animeService.saveManyAnimeStreamingEpisodeSource(
          sourcesListRaw,
        )
      ) {
        this.logger.log(
          `Save all total sources: ${sourcesListRaw.length} of episode: ${animeEps.epHash}`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Sync Anime Streaming Episodes Source error epHash: ${epHash}: ${error}`,
      );

      this.eventEmitter.emit(LOGGER_CREATED, {
        tracePath: `${GogoAnimeService.name}.saveAnimeStreamingEpsSources`,
        errorMessage: JSON.stringify(error),
      } as CreateLoggerDto);

      // retry
      if (retryTimes <= 3) {
        await new Promise((r) => setTimeout(r, 1000));
        await this.saveAnimeStreamingEpsSources(
          epHash,
          animeEps,
          retryTimes + 1,
        );
      }
    }
  }

  private async getAnimeListPerPage(i: number) {
    const { data } = await this.gogoAnimeHttpClient.axiosRef.get(
      `/anime-list.html?page=${i}`,
    );
    const document = parse(data);
    const animeList = document.querySelectorAll('.listing li').map((e) => {
      const aTag = e.querySelector('a');
      return {
        metaInfo: e.getAttribute('title'),
        animePath: aTag?.getAttribute('href'),
        name: aTag?.textContent?.trim(),
      };
    });
    const animeListCluster = cluster(animeList, 10);
    return animeListCluster;
  }
}
