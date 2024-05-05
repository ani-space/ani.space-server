import { InjectGraphQLClient } from '@golevelup/nestjs-graphql-request';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { GraphQLError } from 'graphql';
import { GraphQLClient, gql } from 'graphql-request';
import { Repository } from 'typeorm';
import { CreateLoggerDto } from '~/common/dtos';
import {
  IAnilistService,
  IAnimeGenreService,
  IAnimeService,
  IAnimeTagService,
  ICharacterService,
  IStaffService,
} from '~/contracts/services';
import { Anime, Character, CharacterEdge } from '~/models';
import { AnimeEdge } from '~/models/anime-edge.model';
import { FuzzyDateInt } from '~/models/sub-models/common-sub-models';
import { LOGGER_CREATED } from '../common/constants/index';
import {
  getAnime,
  getCharacterList,
  getStaffList,
} from '../graphql/requests/queries/index';
import { SynchronizedAnimeEnum } from '../graphql/types/enums/synchronization-type.enum';
import { Staff } from '../models/staff.model';
import {
  AnimeConnection,
  AnimeCoverImage,
  AnimeDescription,
  AnimeSynonyms,
  AnimeTag,
  AnimeTitle,
  AnimeTrailer,
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
import { StaffPrimaryOccupation } from '../models/sub-models/staff-sub-models/staff-primary-occupations.model';
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
    @Inject(IStaffService) private readonly staffService: IStaffService,
    @InjectRepository(FuzzyDateInt) private readonly fuzzDateRepo: Repository<FuzzyDateInt>,
    @InjectGraphQLClient() private readonly gqlClient: GraphQLClient,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @OnEvent(SynchronizedAnimeEnum.SAVE_ANIME_RELATIONS_TYPE)
  public async handleSaveRelationAnime(page: number = 1) {
    const { docs, pageInfo } = await this.animeService.getAnimeListV1(page, 1);
    const anime = docs[0];

    setTimeout(async () => {
      try {
        const document = gql`
        {
          Media(id: ${anime.idAnilist}) {
            relations {
              edges {
                node {
                  id
                  type
                }
                id
                relationType(version: 2)
                isMainStudio
              }
              nodes {
                id
                type
              }
            }
          }
        }
      `;

        // @ts-ignore
        const { Media } = await this.gqlClient.request(document);

        if (!Media) throw new GraphQLError('Media is null or empty');

        const { relations } = Media;
        let { edges, nodes } = relations;

        // modify edges node
        if (Array.isArray(edges)) {
          edges = edges.filter((e) => e.node?.type === 'ANIME');

          for (const edge of edges) {
            const animeNode = await this.animeService.findAnimeByIdAnilist(
              edge.node?.id,
              true,
            );

            if (animeNode) {
              Object.assign(edge.node, animeNode);
            } else {
              this.logger.warn(`Missing anime with id: ${edge.node?.id}`);
              const newAnimeNode = await this.handleSaveAnimeById(
                edge.node?.id,
              );

              if (newAnimeNode) {
                Object.assign(edge.node, newAnimeNode);
              } else {
                this.logger.error(`Not found anime with id: ${edge.node?.id}`);

                this.eventEmitter.emit(LOGGER_CREATED, {
                  requestObject: JSON.stringify(edge.node?.id),
                  errorMessage: JSON.stringify(
                    `Not found anime with id: ${edge.node?.id}`,
                  ),
                  tracePath: `AnilistService.handleSaveRelationAnime`,
                } as CreateLoggerDto);
              }
            }
          }
        }

        // modify nodes
        if (Array.isArray(nodes)) {
          nodes = nodes.filter((n) => n.type === 'ANIME');

          for (const node of nodes) {
            const animeNode = await this.animeService.findAnimeByIdAnilist(
              node?.id,
              true,
            );

            if (animeNode) {
              Object.assign(node, animeNode);
            } else {
              this.logger.warn(`Missing anime with id: ${node?.id}`);

              const newAnimeNode = await this.handleSaveAnimeById(node?.id);

              if (newAnimeNode) {
                Object.assign(node, newAnimeNode);
              } else {
                this.logger.error(`Not found anime with id: ${node?.id}`);

                this.eventEmitter.emit(LOGGER_CREATED, {
                  requestObject: JSON.stringify(node?.id),
                  errorMessage: JSON.stringify(
                    `Not found anime with id: ${node?.id}`,
                  ),
                  tracePath: `AnilistService.handleSaveRelationAnime`,
                } as CreateLoggerDto);
              }
            }
          }
        }

        const animeConnectionRaw: Partial<AnimeConnection> = {
          edges: Array.isArray(edges)
            ? edges.map((e) => {
                return {
                  node: e.node,
                  idAnilist: e.id,
                  relationType: e.relationType,
                  isMainStudio: e.isMainStudio,
                } as AnimeEdge;
              })
            : [],
          nodes: Array.isArray(nodes)
            ? nodes.map((n) => {
                return n as Anime;
              })
            : [],
        };

        // modify edges
        if (
          Array.isArray(animeConnectionRaw.edges) &&
          animeConnectionRaw.edges.length > 0
        ) {
          Object.assign(
            animeConnectionRaw.edges,
            await this.animeService.saveManyAnimeEdge(animeConnectionRaw.edges),
          );
        }

        const savedAnimeConnection =
          await this.animeService.saveAnimeConnection(animeConnectionRaw);

        if (savedAnimeConnection) {
          anime.relations = { ...savedAnimeConnection };

          if (await this.animeService.saveAnime(anime)) {
            this.logger.log(
              `Successfully saved anime ${anime.idAnilist} page: ${page}`,
            );
          }
        }

        if (pageInfo.hasNextPage) {
          await this.handleSaveRelationAnime(page + 1);
        }
      } catch (error) {
        this.eventEmitter.emit(LOGGER_CREATED, {
          requestObject: JSON.stringify(anime),
          errorMessage: JSON.stringify(error),
          notes: `Fetch error page: ${page}`,
          tracePath: `AnilistService.handleSaveRelationAnime`,
        } as CreateLoggerDto);

        // fetch and sync next page
        this.handleSaveRelationAnime(page + 1);
      }
    }, 2500);
  }

  @OnEvent(SynchronizedAnimeEnum.SAVE_STAFFS_TYPE)
  public async handleSaveStaffsInfo(page: number = 1) {
    const document = gql`
    {
      Page(page: ${page}, perPage: 15) {
        pageInfo {
          hasNextPage
        }
        ${getStaffList}
      }
    }
    `;

    setTimeout(async () => {
      try {
        //@ts-ignore
        const { Page } = await this.gqlClient.request(document);
        if (!Page) throw new GraphQLError('Page is null or empty');

        const { staff } = Page;
        if (Array.isArray(staff)) {
          const staffListRaw: Partial<Staff>[] = await Promise.all(
            staff.map(async (s) => this.handleMapStaffModel(s)),
          );

          // save all characters per page
          if (await this.staffService.saveManyStaff(staffListRaw)) {
            this.logger.log(
              `Successfully saved page ${page} with ${staffListRaw.length} objects`,
            );
          }
        }

        // fetch and sync next page
        if (Page.pageInfo?.hasNextPage) {
          this.handleSaveStaffsInfo(page + 1);
        }
      } catch (error) {
        this.eventEmitter.emit(LOGGER_CREATED, {
          requestObject: JSON.stringify(page),
          errorMessage: JSON.stringify(error),
          notes: `Fetch error page: ${page}`,
          tracePath: `AnilistService.handleSaveStaffsInfo`,
        } as CreateLoggerDto);

        // fetch and sync next page
        this.handleSaveStaffsInfo(page + 1);
      }
    }, this.AnilistRateLimit);
  }

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

        // modify tag obj
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

        // modify title obj
        for (const aniRaw of animeListMappedRaw) {
          if (!aniRaw.title) continue;

          Object.assign(
            aniRaw.title,
            await this.animeService.saveAnimeTitle(aniRaw.title),
          );
        }

        // modify description obj
        for (const aniRaw of animeListMappedRaw) {
          if (!aniRaw.description) continue;

          Object.assign(
            aniRaw.description,
            await this.animeService.saveAnimeDesc(aniRaw.description),
          );
        }

        // modify startDate & endDate obj
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

        // modify trailer obj
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

        // modify coverImage obj
        for (const aniRaw of animeListMappedRaw) {
          if (!aniRaw.coverImage) continue;

          Object.assign(
            aniRaw.coverImage,
            await this.animeService.saveAnimeCoverImage(aniRaw.coverImage),
          );
        }

        // modify synonyms obj
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

  @OnEvent(SynchronizedAnimeEnum.SAVE_CHARACTERS_TYPE)
  public async handleSaveCharactersInfo(page: number = 1) {
    const document = gql`
    {
      Page(page: ${page}, perPage: 15) {
        pageInfo {
          hasNextPage
        }
        ${getCharacterList}
      }
    }
    `;

    setTimeout(async () => {
      //@ts-ignore
      const { Page } = await this.gqlClient.request(document);
      if (!Page) throw new GraphQLError('Page is null or empty');

      const { characters } = Page;
      if (Array.isArray(characters)) {
        const charactersMappedRaw = await Promise.all(
          characters.map(async (c) => {
            return await this.handleMapCharacterModel(c);
          }),
        );

        //save all characters per page
        if (
          await this.characterService.saveManyCharacter(charactersMappedRaw)
        ) {
          this.logger.log(
            `Successfully saved page ${page} with ${characters.length} objects`,
          );
        }
      }

      //fetch and sync next page
      if (Page.pageInfo?.hasNextPage) {
        this.handleSaveCharactersInfo(page + 1);
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
            anime: characterEdge?.media,
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

  private async handleSaveAnimeById(anilistId: number) {
    const document = gql`
    {
      Media(id: ${anilistId}) {
        ${getAnime}
      }
    }
    `;

    // sleep 1s because rate limit
    await new Promise((r) => setTimeout(r, 1000));

    // @ts-ignore
    const { Media } = await this.gqlClient.request(document);

    if (!Media) {
      return null;
    }

    return await this.handleMapAnimeModel(Media);
  }

  private async handleMapAnimeModel(a: any) {
    const aniRaw: Partial<Anime> = {
      idAnilist: a.id,
      idMal: a.idMal,
      isAdult: a.isAdult,
      title: {
        romaji: a.title?.romaji,
        english: a.title?.english,
        userPreferred: a.title?.userPreferred,
        native: a.title?.native,
      } as AnimeTitle,
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
      } as AnimeDescription,
      startDate: {
        year: a.startDate?.year,
        month: a.startDate?.month,
        day: a.startDate?.day,
      } as FuzzyDateInt,
      endDate: {
        year: a.endDate?.year,
        month: a.endDate?.month,
        day: a.endDate?.day,
      } as FuzzyDateInt,
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
      } as AnimeTrailer,
      coverImage: {
        extraLarge: a.coverImage?.extraLarge,
        large: a.coverImage?.large,
        medium: a.coverImage?.medium,
        color: a.coverImage?.color,
      } as AnimeCoverImage,
      bannerImage: a.bannerImage,
      averageScore: a.averageScore,
      meanScore: a.meanScore,
      popularity: a.popularity,
    };

    // modify genre obj
    if (Array.isArray(aniRaw.genres)) {
      for (let i = 0; i < aniRaw.genres.length; i++) {
        const animeGenreObj =
          await this.animeGenreService.findOrCreateAnimeGenre({
            genre: aniRaw.genres[i].genre,
          });
        Object.assign(aniRaw.genres[i], animeGenreObj);
      }
    }

    // modify anime title
    if (aniRaw.title) {
      Object.assign(
        aniRaw.title,
        await this.animeService.saveAnimeTitle(aniRaw.title),
      );
    }

    // modify description obj
    if (aniRaw.description) {
      Object.assign(
        aniRaw.description,
        await this.animeService.saveAnimeDesc(aniRaw.description),
      );
    }

    // modify startDate & endDate obj
    if (aniRaw.startDate) {
      Object.assign(
        aniRaw.startDate,
        await this.fuzzDateRepo.save(aniRaw.startDate),
      );
    }
    if (aniRaw.endDate) {
      Object.assign(
        aniRaw.endDate,
        await this.fuzzDateRepo.save(aniRaw.endDate),
      );
    }

    // modify trailer obj
    if (
      aniRaw.trailer?._id ||
      aniRaw.trailer?.site ||
      aniRaw.trailer?.thumbnail
    ) {
      Object.assign(
        aniRaw.trailer,
        await this.animeService.saveAnimeTrailer(aniRaw.trailer),
      );
    }

    // modify coverImage obj
    if (aniRaw.coverImage) {
      Object.assign(
        aniRaw.coverImage,
        await this.animeService.saveAnimeCoverImage(aniRaw.coverImage),
      );
    }

    // modify synonyms obj
    if (Array.isArray(aniRaw.synonyms)) {
      for (let i = 0; i < aniRaw.synonyms.length; i++) {
        Object.assign(
          aniRaw.synonyms[i],
          await this.animeService.saveAnimeSynonyms(aniRaw.synonyms[i]),
        );
      }
    }

    return await this.animeService.saveAnime(aniRaw);
  }

  private async handleSaveCharacter(characterEdge: any) {
    const characterNode = characterEdge.node;
    const characterRaw: Partial<Character> =
      await this.handleMapCharacterModel(characterNode);

    return await this.characterService.saveCharacter(characterRaw);
  }

  private async handleMapCharacterModel(characterNode: any) {
    const characterRaw: Partial<Character> = {
      idAnilist: characterNode?.id,
      name: {
        first: characterNode?.name?.first,
        middle: characterNode?.name?.middle,
        last: characterNode?.name?.last,
        full: characterNode?.name?.full,
        native: characterNode?.name?.native,
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
    return characterRaw;
  }

  private async handleMapStaffModel(s: any) {
    const staffRaw: Partial<Staff> = {
      idAnilist: s.id,
      name: {
        first: s.name?.first,
        middle: s.name?.middle,
        last: s.name?.last,
        full: s.name?.full,
        native: s.name?.native,
        alternative: Array.isArray(s.name?.alternative)
          ? s.name?.alternative.map((a: any) => {
              return {
                name: a,
              } as StaffAlternative;
            })
          : null,
        userPreferred: s.name?.userPreferred,
      } as StaffName,
      languageV2: s.languageV2,
      image: {
        large: s.image?.large,
        medium: s.image?.medium,
      } as StaffImage,
      primaryOccupations: Array.isArray(s.primaryOccupations)
        ? s.primaryOccupations.map((p: any) => {
            return {
              occupation: p,
            } as StaffPrimaryOccupation;
          })
        : null,
      description: s.description,
      gender: s.gender,
      dateOfBirth: {
        year: s.dateOfBirth?.year,
        month: s.dateOfBirth?.month,
        day: s.dateOfBirth?.day,
      } as FuzzyDateInt,
      dateOfDeath: {
        year: s.dateOfDeath?.year,
        month: s.dateOfDeath?.month,
        day: s.dateOfDeath?.day,
      } as FuzzyDateInt,
      age: s.age,
      yearsActive: {
        startYear: s?.yearsActive?.length > 0 ? s?.yearsActive[0] : null,
        endYear: s?.yearsActive?.length > 1 ? s?.yearsActive[1] : null,
      } as StaffYearActive,
      homeTown: s.homeTown,
      bloodType: s.bloodType,
    };

    // modify StaffName
    if (staffRaw.name?.alternative) {
      Object.assign(
        staffRaw.name?.alternative,
        await this.staffService.saveManyStaffAlternative(
          staffRaw.name?.alternative,
        ),
      );
    }
    if (staffRaw.name) {
      Object.assign(
        staffRaw.name,
        await this.staffService.saveStaffName(staffRaw.name),
      );
    }

    // modify StaffImage
    if (staffRaw.image) {
      Object.assign(
        staffRaw.image,
        await this.staffService.saveStaffImage(staffRaw.image),
      );
    }

    // modify primaryOccupations
    if (staffRaw.primaryOccupations) {
      Object.assign(
        staffRaw.primaryOccupations,
        await this.staffService.saveManyStaffPrimaryOccupation(
          staffRaw.primaryOccupations,
        ),
      );
    }

    // modify dateOfBirth, dateOfDeath
    if (
      staffRaw.dateOfBirth?.year ||
      staffRaw.dateOfBirth?.month ||
      staffRaw.dateOfBirth?.day
    ) {
      Object.assign(
        staffRaw.dateOfBirth,
        await this.fuzzDateRepo.save(staffRaw.dateOfBirth),
      );
    }
    if (
      staffRaw.dateOfDeath?.year ||
      staffRaw.dateOfDeath?.month ||
      staffRaw.dateOfDeath?.day
    ) {
      Object.assign(
        staffRaw.dateOfDeath,
        await this.fuzzDateRepo.save(staffRaw.dateOfDeath),
      );
    }

    // modify StaffYearActive
    if (staffRaw.yearsActive?.startYear || staffRaw.yearsActive?.endYear) {
      Object.assign(
        staffRaw.yearsActive,
        await this.staffService.saveStaffYearActive(staffRaw.yearsActive),
      );
    }

    return staffRaw;
  }
}
