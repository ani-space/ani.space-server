import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { cluster, sort } from 'radash';
import { LOGGER_CREATED } from '~/common/constants';
import { CreateLoggerDto } from '~/common/dtos';
import { IAnimeService } from '~/contracts/services';
import { AnimeVsubConfig } from '../configs/index';
import { IAnimevsubService } from '../contracts/services/animevsub-service.interface';
import { SynchronizedAnimeEnum } from '../graphql/types/enums/synchronization-type.enum';
import { MediaExternalLink } from '../models/media-external-link.model';
import { ExternalLinkType } from '../models/sub-models/media-external-sub-models/media-external-link-type.enum';
import {
  fuzzySearch,
  generateDocumentFromBrowser,
  getMethodName,
} from '../utils/tools/functions';
import { HttpService } from '@nestjs/axios';
import { AnimeTitle } from '~/models/sub-models/anime-sub-models';
import { AnimeDescription } from '../models/sub-models/anime-sub-models';
import { AnimeStreamingEpisode } from '../models/sub-models/anime-sub-models/anime-streaming-episode.model';
import { TranslationType } from '../models/sub-models/anime-sub-models/anime-streaming-translation-type.enum';
import { ServerType } from '../models/sub-models/anime-sub-models/anime-streaming-server-type.enum';

@Injectable()
export class AnimevsubService implements IAnimevsubService {
  private readonly logger = new Logger(AnimevsubService.name);
  // meta source infos
  private readonly site = 'AnimeVSub';
  private readonly type = ExternalLinkType.STREAMING;
  private readonly language = 'Vietnamese';

  constructor(
    @Inject(IAnimeService) private readonly animeService: IAnimeService,

    @Inject(AnimeVsubConfig.KEY)
    private readonly animeVsub: ConfigType<typeof AnimeVsubConfig>,

    private readonly eventEmitter: EventEmitter2,

    private readonly httpService: HttpService,
  ) {}

  @OnEvent(SynchronizedAnimeEnum.SYNC_ANIME_STREAMING_EPISODES)
  public async handleSyncAnimeStreamingEpisodes(
    page: number = 1,
    tryTimes: number = 1,
  ) {
    const { docs, pageInfo } =
      await this.animeService.getMediaExternalLinkListV1(page, 1);
    const mel = docs[0];

    try {
      const documentStreamingPage = await generateDocumentFromBrowser(
        `${this.animeVsub.endpoint}${mel.animePath}xem-phim.html`,
      );
      const episodeListsRaw = documentStreamingPage.querySelectorAll(
        '.list-episode.tab-pane .episode a',
      );

      for await (const ep of episodeListsRaw) {
        const epId = ep.getAttribute('data-id');
        const title = ep.getAttribute('title');
        const site = `${ep.getAttribute('href')}`
          .replace(`${this.animeVsub.endpoint}`, '')
          .replace(`${mel.animePath}`, '');
        const epHash = ep.getAttribute('data-hash');
        const serverName = ep.getAttribute('data-source');

        const epStreamingResult = await this.getAnimeStreamingLink(
          epHash,
          epId,
          title,
          mel.animePath,
        );

        if (!epStreamingResult) {
          this.eventEmitter.emit(LOGGER_CREATED, {
            requestObject: JSON.stringify({
              epHash,
              epId,
              animePath: mel.animePath,
              site,
            }),
            notes: `Can not find streaming episode ${mel.animePath} on AnimeVSub`,
            tracePath: `${AnimevsubService.name}.${getMethodName()}`,
          } as CreateLoggerDto);

          continue;
        }

        //@ts-ignore
        const { url, isM3U8, quality, formatType, fallbackUrls } =
          epStreamingResult;
        const animeStreamingEpisodeRaw: Partial<AnimeStreamingEpisode> = {
          mediaExternalLink: mel, // important field
          url, // important field (the streaming url source)
          epId, // important field (the order of episode)
          title,
          site,
          epHash,
          isM3U8,
          quality,
          formatType,
          serverName: serverName,
          serverType: ServerType.PRIMARY,
          translationType: TranslationType.SUBBING_TRANSLATION,
          language: this.language,
        };
        const savedAnimeStreamingEpisode =
          await this.animeService.saveAnimeStreamingEpisode(
            animeStreamingEpisodeRaw,
          );

        if (savedAnimeStreamingEpisode) {
          this.logger.log(
            `Save episode ${title} of ${mel.animePath} successfully page: ${page}`,
          );

          // save fallback urls
          if (Array.isArray(fallbackUrls) && fallbackUrls.length > 0) {
            await Promise.allSettled(
              fallbackUrls.map(async (e) => {
                return await this.animeService.saveAnimeStreamingEpisodeFallBackUrl(
                  {
                    fallbackUrl: e.fallbackUrl,
                    formatType: e?.type,
                    quality: e?.label,
                    isM3U8: e?.type === 'hls',
                  },
                );
              }),
            );
          }
        }
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
        tracePath: `${AnimevsubService.name}.${getMethodName()}V2`,
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

  @OnEvent(SynchronizedAnimeEnum.SYNC_ANIMEVSUB)
  public async scrapAllLib() {
    const lib = [
      {
        page: '0-9',
        total: 2,
      },
      {
        page: 'A',
        total: 8,
      },
      {
        page: 'B',
        total: 12,
      },
      {
        page: 'C',
        total: 13,
      },
      {
        page: 'D',
        total: 9,
      },
      {
        page: 'E',
        total: 2,
      },
      {
        page: 'F',
        total: 4,
      },
      {
        page: 'G',
        total: 8,
      },
      {
        page: 'H',
        total: 13,
      },
      {
        page: 'I',
        total: 4,
      },
      {
        page: 'J',
        total: 2,
      },
      {
        page: 'K',
        total: 13,
      },
      {
        page: 'L',
        total: 5,
      },
      {
        page: 'M',
        total: 10,
      },
      {
        page: 'N',
        total: 9,
      },
      {
        page: 'O',
        total: 6,
      },
      {
        page: 'P',
        total: 6,
      },
      {
        page: 'Q',
        total: 1,
      },
      {
        page: 'R',
        total: 4,
      },
      {
        page: 'S',
        total: 15,
      },
      {
        page: 'T',
        total: 20,
      },
      {
        page: 'U',
        total: 3,
      },
      {
        page: 'V',
        total: 3,
      },
      {
        page: 'W',
        total: 2,
      },
      {
        page: 'X',
        total: 1,
      },
      {
        page: 'Y',
        total: 4,
      },
      {
        page: 'Z',
        total: 1,
      },
    ];

    for await (const item of lib) {
      await this.syncAnimeVsub(1, item.total, item.page);
    }
  }

  @OnEvent(SynchronizedAnimeEnum.SEARCH_ANIMEVSUB)
  public async searchAnime(page: number = 1) {
    const { docs, pageInfo } = await this.animeService.getAnimeListV1(page, 1);
    const anime = docs[0];

    try {
      const searchKeyword = anime.title?.english || anime.title?.native || '';

      let animeList: Array<any> = await this.searchKeywordByPage(searchKeyword);

      const searchResult = fuzzySearch(searchKeyword, animeList, {
        keys: ['title'],
        includeScore: true,
        shouldSort: true,
      });

      if (searchResult.length > 0) {
        const resultMatch = searchResult[0];

        const mediaExternalLinkRaw: Partial<MediaExternalLink> = {
          anime,
          animePath: resultMatch.item.animePath,
          site: this.site,
          // "If there are more than 1 result, this is not a perfect match yet."
          isMatching: !(searchResult.length > 1),
          matchingScore: parseFloat(
            parseFloat(`${resultMatch?.score}`).toFixed(10),
          ),
          type: this.type,
          language: this.language,
        };

        if (
          await this.animeService.saveMediaExternalLink(mediaExternalLinkRaw)
        ) {
          this.logger.log(
            `Successfully saved ${searchKeyword} mediaExternalLink ${anime.idAnilist} page: ${page}`,
          );
        }
      } else {
        this.logger.warn(
          `Can not find anime ${searchKeyword} on AnimeVSub page: ${page}`,
        );

        this.eventEmitter.emit(LOGGER_CREATED, {
          requestObject: JSON.stringify(anime),
          notes: `Can not find anime ${searchKeyword} on AnimeVSub`,
          tracePath: `${AnimevsubService.name}.${getMethodName()}V2`,
        } as CreateLoggerDto);
      }

      if (pageInfo.hasNextPage) {
        this.searchAnime(page + 1);
      }
    } catch (error) {
      this.eventEmitter.emit(LOGGER_CREATED, {
        requestObject: JSON.stringify(anime),
        errorMessage: JSON.stringify(error),
        notes: `Fetch error page: ${page}`,
        tracePath: `${AnimevsubService.name}.${getMethodName()}`,
      } as CreateLoggerDto);

      this.searchAnime(page + 1);
    }
  }

  private async handleSyncAnimeTitleAndDescription(
    document: any,
    animeTitle?: Partial<AnimeTitle>,
    animeDescription?: Partial<AnimeDescription>,
  ) {
    const mainTitle = document.querySelector('.Title')?.textContent.trim();
    const description = document
      .querySelector('.Description')
      ?.textContent.trim();

    if (mainTitle && animeTitle) {
      animeTitle.vietnamese = mainTitle;
      await this.animeService.saveAnimeTitle(animeTitle);
    }

    if (description && animeDescription) {
      animeDescription.vietnamese = description;
      await this.animeService.saveAnimeDesc(animeDescription);
    }
  }

  private async getAnimeStreamingLink(
    epHash?: string,
    epId?: string,
    title?: string,
    animePath?: string,
    retryTimes: number = 1,
  ) {
    if (!epHash || !epId) {
      return null;
    }
    // sleep fallback rate limit
    await new Promise((r) => setTimeout(r, 500));

    try {
      const form = new FormData();
      form.append('link', epHash);
      form.append('id', epId);

      const { data } = await this.httpService.axiosRef.post(
        `${this.animeVsub.endpoint}/ajax/player?v=2019a`,
        form,
        {
          headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
        },
      );

      if (Array.isArray(data?.link)) {
        return {
          url: data.link[0]?.file,
          formatType: data.link[0]?.type,
          isM3U8: data.link[0]?.type === 'hls',
          quality: data.link[0]?.label,
          fallbackUrls: data.link.slice(1).map((e: any) => ({
            fallbackUrl: e?.file,
            formatType: e?.type,
            quality: e?.label,
            isM3U8: e?.type === 'hls',
          })),
        };
      }
    } catch (error) {
      this.logger.error('Fetching episode error: ', { epHash, epId });

      this.eventEmitter.emit(LOGGER_CREATED, {
        requestObject: JSON.stringify({
          epHash,
          epId,
          title,
          animePath,
        }),
        tracePath: `${AnimevsubService.name}.${getMethodName()}`,
        errorMessage: JSON.stringify(error),
      } as CreateLoggerDto);

      if (retryTimes <= 10) {
        await new Promise((r) => setTimeout(r, 1000));
        await this.getAnimeStreamingLink(
          epHash,
          epId,
          title,
          animePath,
          retryTimes + 1,
        );
      } else {
        return null;
      }
    }
  }

  private parseAnimeListResult(document: any) {
    const searchItems = document.querySelectorAll('.TPostMv');
    const animeList = searchItems.map((s: any) => {
      return {
        title: s.querySelector('.Title')?.textContent?.trim(),
        animePath: `${s.querySelector('a')?.getAttribute('href')}`.replace(
          `${this.animeVsub.endpoint}`,
          '',
        ),
      };
    });
    return animeList;
  }

  private parseAnimeIdFromAnimePath(animePath: string) {
    return animePath.split('-').slice(-1)[0].replace('a', '').replace('/', '');
  }

  private async searchKeywordByPage(searchKeyword: string) {
    const document = await generateDocumentFromBrowser(
      `${this.animeVsub.endpoint}/tim-kiem/${encodeURI(searchKeyword)}/`,
    );

    let animeList: Array<any> = [];

    // parse result list
    animeList = await this.parseSearchResultList(
      document,
      animeList,
      searchKeyword,
    );

    return animeList;
  }

  private async parseSearchResultList(
    document: any,
    animeList: any[],
    searchKeyword: string,
  ) {
    // check pagination
    const paginationElement = document.querySelector('.wp-pagenavi');

    if (paginationElement) {
      const totalPagesElement = paginationElement.querySelector('.pages');
      const totalPages = Number(
        `${totalPagesElement?.textContent.trim()}`.split(' ').slice(-1)[0],
      );

      // parse page 1
      animeList = this.parseAnimeListResult(document);

      // sleep 500ms fallback rate limit
      await new Promise((r) => setTimeout(r, 500));
      for (let i = 2; i <= totalPages; i++) {
        const document = await generateDocumentFromBrowser(
          `${this.animeVsub.endpoint}/tim-kiem/${encodeURI(searchKeyword)}/trang-${i}.html`,
        );

        const newResultPage = this.parseAnimeListResult(document);
        if (Array.isArray(newResultPage) && newResultPage.length > 0) {
          animeList = animeList.concat(newResultPage);
        }

        // sleep 500ms fallback rate limit
        await new Promise((r) => setTimeout(r, 500));
      }
    } else {
      animeList = this.parseAnimeListResult(document);
    }

    return animeList;
  }

  private async syncAnimeVsub(
    page: number = 1,
    total: number = 1,
    char: string = '',
  ) {
    for (let i = page; i <= total; i++) {
      const document = await generateDocumentFromBrowser(
        `${this.animeVsub.endpoint}/anime/library/${char}/trang-${i}.html`,
      );

      const cardsElements = document.querySelectorAll('.mlnew'); //TPostMv
      const cardsElementsCluster = cluster(cardsElements, 5);

      for (const group of cardsElementsCluster) {
        await Promise.allSettled(
          group.map(async (s: any) => {
            const animePath =
              `${s.querySelector('a')?.getAttribute('href')}`.replace(
                `${this.animeVsub.endpoint}`,
                '',
              );

            // check existing animePath
            if (await this.animeService.findMediaExternalLink(animePath)) {
              this.eventEmitter.emit(LOGGER_CREATED, {
                requestObject: JSON.stringify(animePath),
                notes: `Duplicated animePath ${animePath} on AnimeVSub`,
                tracePath: `${AnimevsubService.name}.${getMethodName()}`,
              } as CreateLoggerDto);

              return;
            }

            const document = await generateDocumentFromBrowser(
              `${this.animeVsub.endpoint}${animePath}`,
            );
            const subTitle = document
              .querySelector('.SubTitle')
              ?.textContent.trim();
            const mainTitle = document
              .querySelector('.Title')
              ?.textContent.trim();

            const startDate = document
              .querySelector('.Date.AAIco-date_range a')
              ?.textContent.trim();

            const episodes = document
              .querySelector('.Time.AAIco-access_time')
              ?.innerText.trim();

            const img = document
              .querySelector('.Image img')
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
                  this.logger.log(`syncAnimeVsub Successfully page: ${i}`);
                }
              } else {
                this.logger.warn(
                  `Can not find anime ${subTitle} on AnimeVSub page: ${i}`,
                );

                this.eventEmitter.emit(LOGGER_CREATED, {
                  requestObject: JSON.stringify(anime),
                  tracePath: 'AnimevsubService.syncAnimeVsub',
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
  }
}
