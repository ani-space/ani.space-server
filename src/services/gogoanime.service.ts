import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import parse from 'node-html-parser';
import { cluster, sort } from 'radash';
import { LOGGER_CREATED } from '~/common/constants';
import { CreateLoggerDto } from '~/common/dtos';
import { IAnimeService, IGogoAnimeService } from '~/contracts/services';
import { GogoAnimeConfig } from '../configs/index';
import { SynchronizedAnimeEnum } from '../graphql/types/enums/synchronization-type.enum';
import { MediaExternalLink } from '../models/media-external-link.model';
import { ExternalLinkType } from '../models/sub-models/media-external-sub-models/media-external-link-type.enum';

@Injectable()
export class GogoAnimeService implements IGogoAnimeService {
  private readonly logger = new Logger(GogoAnimeService.name);

  // meta source infos
  private readonly site = 'GogoAnime';
  private readonly type = ExternalLinkType.STREAMING;
  private readonly language = 'English';
  private readonly gogoAnimeEndpoint: string;

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

  public async handleSyncAnimeStreamingEpisodes(
    page?: number,
    retryTimes?: number,
  ): Promise<void> {
    throw new Error('Method not implemented.');
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
