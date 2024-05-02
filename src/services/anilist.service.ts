import { InjectGraphQLClient } from '@golevelup/nestjs-graphql-request';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { GraphQLError } from 'graphql';
import { GraphQLClient, gql } from 'graphql-request';
import { Repository } from 'typeorm';
import {
  IAnilistService,
  IAnimeGenreService,
  IAnimeService,
  IAnimeTagService,
  ICharacterService,
} from '~/contracts/services';
import { Anime, Character, CharacterEdge } from '~/models';
import { FuzzyDateInt } from '~/models/sub-models/common-sub-models';
import { SynchronizedAnimeEnum } from '../graphql/types/enums/synchronization-type.enum';
import { Staff } from '../models/staff.model';
import {
  AnimeSynonyms,
  AnimeTag
} from '../models/sub-models/anime-sub-models';
import { AnimeGenres } from '../models/sub-models/anime-sub-models/anime-genres.model';
import {
  CharacterImage,
  CharacterName,
} from '../models/sub-models/character-sub-models';
import { CharacterAlternative } from '../models/sub-models/character-sub-models/character-alternative.model';
import { CharacterAlternativeSpoilers } from '../models/sub-models/character-sub-models/character-alternativeSpoiler.model';
import { StaffImage, StaffName } from '../models/sub-models/staff-sub-models';
import { StaffAlternative } from '../models/sub-models/staff-sub-models/staff-name-alternative.model';
import { StaffRoleType } from '../models/sub-models/staff-sub-models/staff-role-type.model';
import { StaffYearActive } from '../models/sub-models/staff-sub-models/staff-year-active.model';

@Injectable()
export class AnilistService implements IAnilistService {
  private readonly AnilistRateLimit = 1500;
  private readonly logger = new Logger(AnilistService.name);

  constructor(  
    @Inject(IAnimeGenreService) private readonly animeGenreService: IAnimeGenreService,
    @Inject(IAnimeTagService) private readonly animeTagService: IAnimeTagService,
    @Inject(IAnimeService) private readonly animeService: IAnimeService,
    @Inject(ICharacterService) private readonly characterService: ICharacterService,
    @InjectRepository(FuzzyDateInt) private readonly fuzzDateRepo: Repository<FuzzyDateInt>,
    @InjectGraphQLClient() private readonly gqlClient: GraphQLClient,
  ) {}

  @OnEvent(SynchronizedAnimeEnum.ANIME_SCALAR_TYPE)
  public async handleSaveAnimeBasicInfo(page: number = 1) {
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
              native
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
            isAdult
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
            isAdult: a.isAdult,
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
            synonyms: Array.isArray(a.synonyms)
              ? a.synonyms.map((s: any) => {
                  return {
                    synonym: s,
                  } as AnimeSynonyms;
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
            const animeTagObj =
              await this.animeTagService.findOrCreateAnimeTag(tag);
            Object.assign(aniRaw.tags[i], animeTagObj);
          }
        }

        //modify title obj
        for (const aniRaw of animeListMappedRaw) {
          if (!aniRaw.title) continue; 

          Object.assign(aniRaw.title, await this.animeService.saveAnimeTitle(aniRaw.title));
        }

        //modify description obj
        for (const aniRaw of animeListMappedRaw) {
          if (!aniRaw.description) continue;

          Object.assign(
            aniRaw.description,
            await this.animeService.saveAnimeDesc(aniRaw.description),
          );
        }

        //modify startDate & endDate obj
        for (const aniRaw of animeListMappedRaw) {
          if (aniRaw.startDate) {
            const startDateObj = await this.fuzzDateRepo.save(aniRaw.startDate);
            Object.assign(aniRaw.startDate, startDateObj);
          }

          if (aniRaw.endDate) {
            const endDateObj = await this.fuzzDateRepo.save(aniRaw.endDate);
            Object.assign(aniRaw.endDate, endDateObj);
          }
        }

        //modify trailer obj
        for (const aniRaw of animeListMappedRaw) {
          if (
            !aniRaw.trailer ||
            (!aniRaw.trailer?._id &&
              !aniRaw.trailer?.site &&
              !aniRaw.trailer?.thumbnail)
          )
            continue;

          Object.assign(
            aniRaw.trailer,
            await this.animeService.saveAnimeTrailer(aniRaw.trailer),
          );
        }

        //modify coverImage obj
        for (const aniRaw of animeListMappedRaw) {
          if (!aniRaw.coverImage) continue;

          Object.assign(
            aniRaw.coverImage,
            await this.animeService.saveAnimeCoverImage(aniRaw.coverImage),
          );
        }

        //modify synonyms obj
        for (const aniRaw of animeListMappedRaw) {
          if (!Array.isArray(aniRaw.synonyms)) {
            continue;
          }

          for (let i = 0; i < aniRaw.synonyms.length; i++) {
            Object.assign(
              aniRaw.synonyms[i],
              await this.animeService.saveAnimeSynonyms(aniRaw.synonyms[i]),
            );
          }
        }

        //save all anime per page
        if (await this.animeService.createManyNewAnime(animeListMappedRaw)) {
          this.logger.log(
            `Successfully saved page ${page} with ${media.length} objects`,
          );
        }
      }

      // fetch and sync next page
      if (Page.pageInfo?.hasNextPage) {
        this.handleSaveAnimeBasicInfo(page + 1);
      }
    }, this.AnilistRateLimit);
  }

  @OnEvent(SynchronizedAnimeEnum.SAVE_ANIME_CHARACTERS_TYPE)
  public async handleSaveAnimeCharacterConnectionType(
    page: number = 1,
    chapterNumber: number = 1,
  ) {
    const { docs, pageInfo } = await this.animeService.getAnimeListV1(page, 1);
    const anime = docs[0];

    setTimeout(async () => {
      const document = gql`
      {
        Media(id: ${anime.idAnilist}) {
          id
          characters(page: ${chapterNumber}, perPage: 15) {
            pageInfo {
              total
              currentPage
              hasNextPage
            }
            edges {
              node {
                id
                name {
                  first
                  middle
                  last
                  full
                  native
                  alternative
                  alternativeSpoiler
                  userPreferred
                }
                image {
                  large
                  medium
                }
                description
                gender
                dateOfBirth {
                  year
                  month
                  day
                }
                age
                bloodType
              }
              id
              role
              name
              voiceActors {
                id
                name {
                  first
                  middle
                  last
                  full
                  native
                  alternative
                  userPreferred
                }
                languageV2
                image {
                  large
                  medium
                }
                description
                gender
                dateOfBirth {
                  year
                  month
                  day
                }
                dateOfDeath {
                  year
                  month
                  day
                }
                age
                yearsActive
                homeTown
                bloodType
              }
              voiceActorRoles {
                voiceActor {
                  id
                }
                roleNotes
                dubGroup
              }
              media {
                id
              }
            }
          }
        }
      }
    `;
      //@ts-ignore
      const { Media } = await this.gqlClient.request(document);
      if (!Media) throw new GraphQLError('Media is null or empty');

      const { characters } = Media;
      if (Array.isArray(characters?.edges) && characters?.edges.length > 0) {
        for (const characterEdge of characters?.edges) {
          const savedCharacter = await this.handleSaveCharacter(characterEdge);

          const characterEdgeRaw: Partial<CharacterEdge> = {
            node: savedCharacter || undefined,
            idAnilist: characterEdge?.id,
            role: characterEdge?.role,
            name: characterEdge?.name,
            voiceActors: Array.isArray(characterEdge?.voiceActors)
              ? characterEdge?.voiceActors.map((v: any) => {
                  return {
                    idAnilist: v?.id,
                    name: {
                      first: v?.name?.first,
                      middle: v?.name?.middle,
                      last: v?.name?.last,
                      full: v?.name?.full,
                      native: v?.name?.native,
                      alternative: Array.isArray(v?.name?.alternative)
                        ? v?.name?.alternative.map((a: any) => {
                            return {
                              name: a,
                            } as StaffAlternative;
                          })
                        : null,
                    } as StaffName,
                    languageV2: v?.languageV2,
                    image: {
                      large: v?.image?.large,
                      medium: v?.image?.medium,
                    } as StaffImage,
                    description: v?.description,
                    gender: v?.gender,
                    dateOfBirth: {
                      year: v?.dateOfBirth?.year,
                      month: v?.dateOfBirth?.month,
                      day: v?.dateOfBirth?.day,
                    } as FuzzyDateInt,
                    dateOfDeath: {
                      year: v?.dateOfDeath?.year,
                      month: v?.dateOfDeath?.month,
                      day: v?.dateOfDeath?.day,
                    } as FuzzyDateInt,
                    age: v?.age,
                    yearsActive: {
                      startYear:
                        v?.yearsActive?.length > 0 ? v?.yearsActive[0] : null,
                      endYear:
                        v?.yearsActive?.length > 1 ? v?.yearsActive[1] : null,
                    } as StaffYearActive,
                    homeTown: v?.homeTown,
                    bloodType: v?.bloodType,
                  } as Staff;
                })
              : null,
            voiceActorRoles: Array.isArray(characterEdge?.voiceActorRoles)
              ? characterEdge?.voiceActorRoles.map((v: any) => {
                  return {
                    voiceActor: {
                      idAnilist: v?.voiceActor.id,
                    },
                    roleNotes: v?.roleNotes,
                    dubGroup: v?.dubGroup,
                  } as StaffRoleType;
                })
              : null,
            anime: characterEdge?.media
          };

          // modify voiceActors
        }
      }

      if (characters?.pageInfo?.hasNextPage) {
        this.handleSaveAnimeCharacterConnectionType(page, chapterNumber + 1);
      } else if (pageInfo.hasNextPage) {
        this.handleSaveAnimeCharacterConnectionType(page + 1, 1);
      }
    }, this.AnilistRateLimit);
  }

  private async handleSaveCharacter(characterEdge: any) {
    const characterNode = characterEdge.node;
    const characterRaw: Partial<Character> = {
      idAnilist: characterNode?.id,
      name: {
        first: characterNode?.name?.first,
        middle: characterNode?.name?.middle,
        last: characterNode?.name?.last,
        full: characterNode?.name?.full,
        alternative: Array.isArray(characterNode?.name?.alternative)
          ? characterNode?.name?.alternative.map((a: string) => {
              return {
                name: a,
              } as CharacterAlternative;
            })
          : null,
        alternativeSpoiler: Array.isArray(
          characterNode?.name?.alternativeSpoiler,
        )
          ? characterNode?.name?.alternativeSpoiler.map((a: string) => {
              return {
                name: a,
              } as CharacterAlternativeSpoilers;
            })
          : null,
      } as CharacterName,
      image: {
        large: characterNode?.image?.large,
        medium: characterNode?.image?.medium,
      } as CharacterImage,
      description: characterNode?.description,
      gender: characterNode?.gender,
      dateOfBirth: {
        year: characterNode?.dateOfBirth?.year,
        month: characterNode?.dateOfBirth?.month,
        day: characterNode?.dateOfBirth?.day,
      } as FuzzyDateInt,
      age: characterNode?.age,
      bloodType: characterNode?.bloodType,
    };

    //modify CharacterAlternative name
    if (characterRaw.name?.alternative) {
      Object.assign(
        characterRaw.name?.alternative,
        await this.characterService.saveManyCharacterAlternative(
          characterRaw.name?.alternative,
        ),
      );
    }

    //modify alternativeSpoiler name
    if (characterRaw.name?.alternativeSpoiler) {
      Object.assign(
        characterRaw.name?.alternativeSpoiler,
        await this.characterService.saveManyCharacterAlternativeSpoilers(
          characterRaw.name?.alternativeSpoiler,
        ),
      );
    }

    //modify name
    if (characterRaw.name) {
      Object.assign(
        characterRaw.name,
        await this.characterService.saveCharacterName(characterRaw.name),
      );
    }

    //modify image
    if (characterRaw.image) {
      Object.assign(
        characterRaw.image,
        await this.characterService.saveCharacterImage(characterRaw.image),
      );
    }

    //modify dateOfBirth
    if (characterRaw.dateOfBirth) {
      Object.assign(
        characterRaw.dateOfBirth,
        await this.fuzzDateRepo.save(characterRaw.dateOfBirth),
      );
    }

    return await this.characterService.saveCharacter(characterRaw);
  }
}
