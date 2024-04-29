import { InjectGraphQLClient } from '@golevelup/nestjs-graphql-request';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { GraphQLError } from 'graphql';
import { GraphQLClient, gql } from 'graphql-request';
import {
  IAnilistService,
  IAnimeGenreService,
  IAnimeService,
  IAnimeTagService,
} from '~/contracts/services';
import { Anime } from '~/models';
import {
  GET_ANIME_SCALARS_TYPE
} from '../common/constants/index';
import { AnimeTag } from '../models/sub-models/anime-sub-models';
import { AnimeGenres } from '../models/sub-models/anime-sub-models/anime-genres.model';

@Injectable()
export class AnilistService implements IAnilistService {
  private readonly AnilistRateLimit = 1500;
  private readonly logger = new Logger(AnilistService.name);

  constructor(
    @Inject(IAnimeGenreService) private readonly animeGenreService: IAnimeGenreService,
    @Inject(IAnimeTagService) private readonly animeTagService: IAnimeTagService,
    @Inject(IAnimeService) private readonly animeService: IAnimeService,
    @InjectGraphQLClient() private readonly gqlClient: GraphQLClient,
  ) {}

  @OnEvent(GET_ANIME_SCALARS_TYPE)
  public async handleGetAnimeScalarsType(page: number = 1) {
    const document = gql`
      {
        Page(page: ${page}, perPage: 15) {
          pageInfo {
            hasNextPage
          }
          media(type: ANIME) {
            id
            idMal
            title {
              romaji
              english
              userPreferred
            }
            tags {
              id
              name
              description
              category
              rank
              isGeneralSpoiler
              isMediaSpoiler
              isAdult
            }
            genres
            synonyms
            format
            status
            description
            startDate {
              year
              month
              day
            }
            endDate {
              year
              month
              day
            }
            season
            seasonYear
            seasonInt
            episodes
            duration
            countryOfOrigin
            isLicensed
            source
            hashtag
            trailer {
              id
              site
              thumbnail
            }
            coverImage {
              extraLarge
              large
              medium
              color
            }
            bannerImage
            averageScore
            meanScore
            popularity
          }
        }
      }
    `;

    setTimeout(async () => {
      //@ts-ignore
      const { Page } = await this.gqlClient.request(document);
      if (!Page) throw new GraphQLError('Page is null or empty');

      const { media } = Page;
      if (Array.isArray(media)) {
        //@ts-ignore
        const animeListMappedRaw: Partial<Anime>[] = media.map((a) => {
          return {
            idAnilist: a.id,
            idMal: a.idMal,
            title: {
              romaji: a.title?.romaji,
              english: a.title?.english,
              userPreferred: a.title?.userPreferred,
              native: a.title?.native,
            },
            genres: Array.isArray(a.genres)
              ? a.genres.map((g: any) => {
                  return {
                    genre: g,
                  } as AnimeGenres;
                })
              : null,
            tags: Array.isArray(a.tags)
              ? a.tags.map((t: any) => {
                  return {
                    idAnilist: t.id,
                    name: t.name,
                    descriptionEn: t.description,
                    category: t.category,
                    rank: t.rank,
                    isGeneralSpoiler: t.isGeneralSpoiler,
                    isMediaSpoiler: t.isMediaSpoiler,
                    isAdult: t.isAdult,
                  } as AnimeTag;
                })
              : null,
            format: a.format,
            status: a.status,
            description: {
              english: a.description,
            },
            startDate: {
              year: a.startDate?.year,
              month: a.startDate?.month,
              day: a.startDate?.day,
            },
            endDate: {
              year: a.endDate?.year,
              month: a.endDate?.month,
              day: a.endDate?.day,
            },
            season: a.season,
            seasonYear: a.seasonYear,
            seasonInt: a.seasonInt,
            episodes: a.episodes,
            duration: a.duration,
            countryOfOrigin: a.countryOfOrigin,
            isLicensed: a.isLicensed,
            source: a.source,
            hashtag: a.hashtag,
            trailer: {
              _id: a.trailer?.id,
              site: a.trailer?.site,
              thumbnail: a.trailer?.thumbnail,
            },
            coverImage: {
              extraLarge: a.coverImage?.extraLarge,
              large: a.coverImage?.large,
              medium: a.coverImage?.medium,
              color: a.coverImage?.color,
            },
            bannerImage: a.bannerImage,
            averageScore: a.averageScore,
            meanScore: a.meanScore,
            popularity: a.popularity,
          };
        });

        //modify genre obj
        for (const aniRaw of animeListMappedRaw) {
          if (!Array.isArray(aniRaw.genres)) {
            continue;
          }

          for (let i = 0; i < aniRaw.genres.length; i++) {
            const animeGenreObj =
              await this.animeGenreService.findOrCreateAnimeGenre({
                genre: aniRaw.genres[i].genre,
              });
            Object.assign(aniRaw.genres[i], animeGenreObj);
          }
        }

        //modify tag obj
        for (const aniRaw of animeListMappedRaw) {
          if (!Array.isArray(aniRaw.tags)) {
            continue;
          }

          for (let i = 0; i < aniRaw.tags.length; i++) {
            const tag = aniRaw.tags[i];
            const animeTagObj = await this.animeTagService.findOrCreateAnimeTag(
              { name: tag.name, idAnilist: tag.idAnilist },
            );
            Object.assign(aniRaw.tags[i], animeTagObj);
          }
        }

        //save all anime per page
        this.animeService.createManyNewAnime(animeListMappedRaw);

        this.logger.log(
          `Successfully saved page ${page} with ${media.length} objects`,
        );
      }

      // fetch and sync next page
      if (Page.pageInfo?.hasNextPage) {
        this.handleGetAnimeScalarsType(page + 1);
      }
    }, this.AnilistRateLimit);
  }
}
