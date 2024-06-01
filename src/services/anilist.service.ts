import { InjectGraphQLClient } from '@golevelup/nestjs-graphql-request';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { GraphQLError } from 'graphql';
import { GraphQLClient, gql } from 'graphql-request';
import { unique } from 'radash';
import { Repository } from 'typeorm';
import { CreateLoggerDto } from '~/common/dtos';
import {
  IAnilistService,
  IAnimeGenreService,
  IAnimeService,
  IAnimeTagService,
  ICharacterService,
  IStaffService,
  IStudioService,
} from '~/contracts/services';
import { Anime, Character } from '~/models';
import { AnimeEdge } from '~/models/anime-edge.model';
import { CharacterEdge } from '~/models/character-edge.model';
import { StaffEdge } from '~/models/staff-edge.model';
import { StudioEdge } from '~/models/studio-edge.model';
import { Studio } from '~/models/studio.model';
import { FuzzyDateInt } from '~/models/sub-models/common-sub-models';
import { StaffConnection } from '~/models/sub-models/staff-sub-models/staff-connection.model';
import { StaffRoleType } from '~/models/sub-models/staff-sub-models/staff-role-type.model';
import { StudioConnection } from '~/models/sub-models/studio-sub-models/studio-connection.model';
import { LOGGER_CREATED } from '../common/constants/index';
import {
  animeConnection,
  characterConnection,
  characterFields,
  getAnime,
  getCharacterList,
  getStaffList,
  staffFields,
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
  CharacterConnection,
  CharacterImage,
  CharacterName,
} from '../models/sub-models/character-sub-models';
import { CharacterAlternative } from '../models/sub-models/character-sub-models/character-alternative.model';
import { CharacterAlternativeSpoilers } from '../models/sub-models/character-sub-models/character-alternativeSpoiler.model';
import { StaffImage, StaffName } from '../models/sub-models/staff-sub-models';
import { StaffAlternative } from '../models/sub-models/staff-sub-models/staff-name-alternative.model';
import { StaffPrimaryOccupation } from '../models/sub-models/staff-sub-models/staff-primary-occupations.model';
import { StaffYearActive } from '../models/sub-models/staff-sub-models/staff-year-active.model';
import { getMethodName } from '~/utils/tools/functions';

@Injectable()
export class AnilistService implements IAnilistService {
  private readonly AnilistRateLimit = 1500;
  private readonly logger = new Logger(AnilistService.name);

  constructor(
    @Inject(IAnimeGenreService)
    private readonly animeGenreService: IAnimeGenreService,

    @Inject(IStudioService)
    private readonly studioService: IStudioService,

    @Inject(IAnimeTagService)
    private readonly animeTagService: IAnimeTagService,

    @Inject(IAnimeService)
    private readonly animeService: IAnimeService,

    @Inject(ICharacterService)
    private readonly characterService: ICharacterService,

    @Inject(IStaffService)
    private readonly staffService: IStaffService,

    @InjectRepository(FuzzyDateInt)
    private readonly fuzzDateRepo: Repository<FuzzyDateInt>,

    @InjectGraphQLClient()
    private readonly gqlClient: GraphQLClient,

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
                  tracePath: `${AnilistService.name}.${getMethodName()}`,
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
                  tracePath: `${AnilistService.name}.${getMethodName()}`,
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
          tracePath: `${AnilistService.name}.${getMethodName()}`,
        } as CreateLoggerDto);

        // fetch and sync next page
        this.handleSaveRelationAnime(page + 1);
      }
    }, 2500);
  }

  @OnEvent(SynchronizedAnimeEnum.SAVE_ANIME_CHARACTERS_TYPE)
  public async handleSaveAnimeCharacterConnectionType(
    page: number = 1,
    chapterNumber: number = 1,
  ) {
    const { docs, pageInfo } = await this.animeService.getAnimeListV1(page, 1);
    const anime = docs[0];

    setTimeout(async () => {
      try {
        const document = gql`
          {
            Media(id: ${anime.idAnilist}) {
              id
              characters(page: ${chapterNumber}, perPage: 15) {
                ${characterConnection}
              }
            }
          }
        `;
        //@ts-ignore
        const { Media } = await this.gqlClient.request(document);
        if (!Media) throw new GraphQLError('Media is null or empty');

        const { characters } = Media;
        let { edges, nodes } = characters;

        // modify edges
        edges = await this.handleModifyCharacterEdge(edges);

        // modify nodes
        nodes = await this.handleModifyCharacterNodes(nodes);

        const characterConnectionRaw: Partial<CharacterConnection> =
          this.createCharacterConnectionRaw(edges, nodes);

        // modify edges
        if (
          Array.isArray(characterConnectionRaw.edges) &&
          characterConnectionRaw.edges.length > 0
        ) {
          for (const edge of characterConnectionRaw.edges) {
            if (anime.characters) {
              edge.characterConnection = anime.characters;
            }
            Object.assign(
              edge,
              await this.characterService.saveCharacterEdge(edge),
            );
          }
        }

        if (anime.characters && characterConnectionRaw.nodes) {
          anime.characters.nodes = [
            ...anime.characters.nodes,
            ...characterConnectionRaw.nodes,
          ];
          await this.characterService.saveCharacterConnection(anime.characters);
        }

        if (!anime.characters) {
          const savedCharacterConnection =
            await this.characterService.saveCharacterConnection(
              characterConnectionRaw,
            );

          if (savedCharacterConnection) {
            anime.characters = { ...savedCharacterConnection };
          }
        }

        if (await this.animeService.saveAnime(anime)) {
          this.logger.log(
            `Successfully saved anime characters ${anime.idAnilist} page: ${page}, chapterPage: ${chapterNumber}`,
          );
        }

        if (characters?.pageInfo?.hasNextPage) {
          this.handleSaveAnimeCharacterConnectionType(page, chapterNumber + 1);
        } else if (pageInfo.hasNextPage) {
          this.handleSaveAnimeCharacterConnectionType(page + 1, 1);
        }
      } catch (error) {
        this.eventEmitter.emit(LOGGER_CREATED, {
          requestObject: JSON.stringify(anime),
          errorMessage: JSON.stringify(error),
          notes: `Fetch error page: ${page}`,
          tracePath: `${AnilistService.name}.${getMethodName()}`,
        } as CreateLoggerDto);

        // fetch and sync next page
        this.handleSaveAnimeCharacterConnectionType(page + 1);
      }
    }, this.AnilistRateLimit);
  }

  @OnEvent(SynchronizedAnimeEnum.SAVE_ANIME_STAFF_TYPE)
  public async handleSaveAnimeStaffConnectionType(
    page: number = 1,
    staffPage: number = 1,
  ) {
    const { docs, pageInfo } = await this.animeService.getAnimeListV1(page, 1);
    const anime = docs[0];

    setTimeout(async () => {
      try {
        const document = gql`
        {
          Media(id: ${anime.idAnilist}) {
            id
            staff(page: ${staffPage}, perPage: 15) {
              edges {
                id
                node {
                  id
                }
                role
              }
              nodes {
                id
              }
              pageInfo {
                hasNextPage
              }
            }
          }
        }
        `;

        //@ts-ignore
        const { Media } = await this.gqlClient.request(document);
        if (!Media) throw new GraphQLError('Media is null or empty');

        const { staff } = Media;
        let { edges, nodes } = staff;

        // remove duplicated node (Anilist error data)
        // @ts-ignore
        edges = unique(edges, (e) => e.node?.id);
        // @ts-ignore
        nodes = unique(nodes, (n) => n.id);

        // modify edges
        if (Array.isArray(edges)) {
          for (const edge of edges) {
            // modify edges node
            const staffNode = await this.staffService.findStaffByIdAnilist(
              edge.node?.id,
              true,
            );
            if (staffNode) {
              Object.assign(edge.node, staffNode);
            } else {
              this.logger.warn(`Missing staff with id: ${edge.node?.id}`);

              // sleep 1s because rate limit
              await new Promise((r) => setTimeout(r, 1000));

              const newStaffNode = await this.handleSaveStaffById(
                edge.node?.id,
              );

              if (newStaffNode) {
                Object.assign(edge.node, newStaffNode);
              } else {
                this.logger.error(`Not found staff with id: ${edge.node?.id}`);

                this.eventEmitter.emit(LOGGER_CREATED, {
                  requestObject: JSON.stringify(edge.node?.id),
                  errorMessage: JSON.stringify(
                    `Not found character with id: ${edge.node?.id}`,
                  ),
                  tracePath: `${AnilistService.name}.${getMethodName()}`,
                } as CreateLoggerDto);
              }
            }
          }
        }

        // modify nodes
        if (Array.isArray(nodes)) {
          for (const node of nodes) {
            const staffNode = await this.staffService.findStaffByIdAnilist(
              node.id,
              true,
            );

            if (staffNode) {
              Object.assign(node, staffNode);
            } else {
              this.logger.warn(`Missing staff with id: ${node?.id}`);

              const newStaffNode = await this.handleSaveStaffById(node?.id);

              if (newStaffNode) {
                Object.assign(node, newStaffNode);
              } else {
                this.logger.error(`Not found staff with id: ${node?.id}`);

                this.eventEmitter.emit(LOGGER_CREATED, {
                  requestObject: JSON.stringify(node?.id),
                  errorMessage: JSON.stringify(
                    `Not found character with id: ${node?.id}`,
                  ),
                  tracePath: `${AnilistService.name}.${getMethodName()}`,
                } as CreateLoggerDto);
              }
            }
          }
        }

        const staffConnectionRaw: Partial<StaffConnection> = {
          edges: Array.isArray(edges)
            ? edges.map((e) => {
                return {
                  idAnilist: e.id,
                  node: e.node,
                  role: e.role,
                } as StaffEdge;
              })
            : [],
          nodes: Array.isArray(nodes) ? nodes.map((n) => n as Staff) : [],
        };

        // modify edges
        if (
          Array.isArray(staffConnectionRaw.edges) &&
          staffConnectionRaw.edges.length > 0
        ) {
          for (const edge of staffConnectionRaw.edges) {
            if (anime.staff) {
              edge.staffConnection = anime.staff;
            }

            Object.assign(edge, await this.staffService.saveStaffEdge(edge));
          }
        }

        if (anime.staff && staffConnectionRaw.nodes) {
          anime.staff.nodes = anime.staff.nodes.concat(
            staffConnectionRaw.nodes,
          );

          await this.staffService.saveStaffConnection(anime.staff);
        }

        if (!anime.staff) {
          const savedStaffConnection =
            await this.staffService.saveStaffConnection(staffConnectionRaw);

          if (savedStaffConnection) {
            anime.staff = { ...savedStaffConnection };
          }
        }

        if (await this.animeService.saveAnime(anime)) {
          this.logger.log(
            `Successfully saved anime staff ${anime.idAnilist} page: ${page}, chapterPage: ${staffPage}`,
          );
        }

        if (staff?.pageInfo?.hasNextPage) {
          this.handleSaveAnimeStaffConnectionType(page, staffPage + 1);
        } else if (pageInfo.hasNextPage) {
          this.handleSaveAnimeStaffConnectionType(page + 1, 1);
        } else {
          this.logger.log('SAVE DONE');
        }
      } catch (error) {
        this.eventEmitter.emit(LOGGER_CREATED, {
          requestObject: JSON.stringify(anime),
          errorMessage: JSON.stringify(error),
          notes: `Fetch error page: ${page}`,
          tracePath: `${AnilistService.name}.${getMethodName()}`,
        } as CreateLoggerDto);

        // fetch and sync next page
        this.handleSaveAnimeStaffConnectionType(page + 1);
      }
    }, this.AnilistRateLimit);
  }

  @OnEvent(SynchronizedAnimeEnum.SAVE_ANIME_STUDIO_TYPE)
  public async handleSaveAnimeStudioConnectionType(page: number = 1) {
    const { docs, pageInfo } = await this.animeService.getAnimeListV1(page, 1);
    const anime = docs[0];

    setTimeout(async () => {
      try {
        const document = gql`
          {
            Media(id: ${anime.idAnilist}) {
              studios {
                edges {
                  id
                  isMain
                  node {
                    id
                  }
                }
                nodes {
                  id
                }
              }
            }
          }
        `;

        //@ts-ignore
        const { Media } = await this.gqlClient.request(document);
        if (!Media) throw new GraphQLError('Media is null or empty');
        const { studios } = Media;
        let { edges, nodes } = studios;

        // modify edges
        if (Array.isArray(edges)) {
          // @ts-ignore, remove duplicated node (Anilist error data)
          edges = unique(edges, (e) => e.node?.id);
          for (const edge of edges) {
            const studioNode = await this.studioService.findStudioByIdAnilist(
              edge.node?.id,
            );

            if (studioNode) {
              Object.assign(edge.node, studioNode);
            } else {
              this.logger.warn(`Missing studio with id: ${edge.node?.id}`);

              // sleep 1s because rate limit
              await new Promise((r) => setTimeout(r, 1000));

              const newStudioNode = await this.handleSaveStudioById(
                edge.node?.id,
              );

              if (newStudioNode) {
                Object.assign(edge.node, newStudioNode);
              } else {
                this.logger.error(`Not found studio with id: ${edge.node?.id}`);

                this.eventEmitter.emit(LOGGER_CREATED, {
                  requestObject: JSON.stringify(edge.node?.id),
                  errorMessage: JSON.stringify(
                    `Not found studio with id: ${edge.node?.id}`,
                  ),
                  tracePath: `${AnilistService.name}.${getMethodName()}`,
                } as CreateLoggerDto);
              }
            }
          }
        }

        // modify nodes
        if (Array.isArray(nodes)) {
          // @ts-ignore
          nodes = unique(nodes, (n) => n.id);
          for (const node of nodes) {
            const studioNode = await this.studioService.findStudioByIdAnilist(
              node?.id,
            );

            if (studioNode) {
              Object.assign(node, studioNode);
            } else {
              this.logger.warn(`Missing studio with id: ${node?.id}`);

              // sleep 1s because rate limit
              await new Promise((r) => setTimeout(r, 1000));

              const newStudioNode = await this.handleSaveStudioById(node?.id);

              if (newStudioNode) {
                Object.assign(node, newStudioNode);
              } else {
                this.logger.error(`Not found studio with id: ${node?.id}`);

                this.eventEmitter.emit(LOGGER_CREATED, {
                  requestObject: JSON.stringify(node?.id),
                  errorMessage: JSON.stringify(
                    `Not found studio with id: ${node?.id}`,
                  ),
                  tracePath: `${AnilistService.name}.${getMethodName()}`,
                } as CreateLoggerDto);
              }
            }
          }
        }

        const studioConnectionRaw: Partial<StudioConnection> = {
          edges: Array.isArray(edges)
            ? edges.map((e: any) => {
                return {
                  idAnilist: e.id,
                  isMain: e.isMain,
                  node: e.node,
                } as StudioEdge;
              })
            : [],
          nodes: Array.isArray(nodes) ? nodes : [],
        };

        // save edges
        if (
          Array.isArray(studioConnectionRaw.edges) &&
          studioConnectionRaw.edges.length > 0
        ) {
          for (const edge of studioConnectionRaw.edges) {
            if (anime.studios) {
              edge.studioConnection = anime.studios;
            }

            Object.assign(edge, await this.studioService.saveStudioEdge(edge));
          }
        }

        if (anime.studios && studioConnectionRaw.nodes) {
          anime.studios.nodes = anime.studios.nodes.concat(
            studioConnectionRaw.nodes,
          );

          await this.studioService.saveStudioConnection(anime.studios);
        }

        if (!anime.studios) {
          const saveStudioConnection =
            await this.studioService.saveStudioConnection(studioConnectionRaw);

          if (saveStudioConnection) {
            anime.studios = { ...saveStudioConnection };
          }
        }

        if (await this.animeService.saveAnime(anime)) {
          this.logger.log(
            `Successfully saved anime studio ${anime.idAnilist} page: ${page}`,
          );
        }

        if (pageInfo.hasNextPage) {
          await this.handleSaveAnimeStudioConnectionType(page + 1);
        } else {
          this.logger.log('SAVE DONE');
        }
      } catch (error) {
        this.eventEmitter.emit(LOGGER_CREATED, {
          requestObject: JSON.stringify(anime),
          errorMessage: JSON.stringify(error),
          notes: `Fetch error page: ${page}`,
          tracePath: `${AnilistService.name}.${getMethodName()}`,
        } as CreateLoggerDto);

        // fetch and sync next page
        this.handleSaveAnimeStudioConnectionType(page + 1);
      }
    }, this.AnilistRateLimit);
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
          tracePath: `${AnilistService.name}.${getMethodName()}`,
        } as CreateLoggerDto);

        // fetch and sync next page
        this.handleSaveStaffsInfo(page + 1);
      }
    }, this.AnilistRateLimit);
  }

  @OnEvent(SynchronizedAnimeEnum.SAVE_STAFF_ANIME_TYPE)
  public async handleSaveStaffAnimeConnection(
    page: number = 1,
    animePage: number = 1,
  ) {
    const { docs, pageInfo } = await this.staffService.getStaffListV1(page, 1);
    const staff = docs[0];

    setTimeout(async () => {
      try {
        const document = gql`
          {
            Staff(id: ${staff.idAnilist}) {
              staffMedia(page: ${animePage}, perPage: 15) {
                ${animeConnection}
              }
            }
          }
        `;

        //@ts-ignore
        const { Staff } = await this.gqlClient.request(document);
        const { staffMedia } = Staff;
        let { edges, nodes } = staffMedia;

        // modify edges
        edges = await this.handleModifyAnimeEdges(edges);

        // modify nodes
        nodes = await this.handleModifyAnimeNodes(nodes);

        const animeConnectionRaw: Partial<AnimeConnection> =
          this.createAnimeConnectionRaw(edges, nodes);

        // save edges
        if (
          Array.isArray(animeConnectionRaw.edges) &&
          animeConnectionRaw.edges.length > 0
        ) {
          for (const edge of animeConnectionRaw.edges) {
            if (staff.staffAnime) {
              edge.animeConnection = staff.staffAnime;
            }

            Object.assign(edge, await this.animeService.saveAnimeEdge(edge));
          }
        }

        // save nodes
        if (staff.staffAnime && animeConnectionRaw.nodes) {
          staff.staffAnime.nodes = staff.staffAnime.nodes.concat(
            animeConnectionRaw.nodes,
          );

          await this.animeService.saveAnimeConnection(staff.staffAnime);
        }

        // save new connection raw
        if (!staff.staffAnime) {
          const savedAnimeConnection =
            await this.animeService.saveAnimeConnection(animeConnectionRaw);

          if (savedAnimeConnection) {
            staff.staffAnime = { ...savedAnimeConnection };
          }
        }

        if (await this.staffService.saveStaff(staff)) {
          this.logger.log(
            `Successfully saved staff anime ${staff.idAnilist} page: ${page}, animePage: ${animePage}`,
          );
        }

        if (staffMedia?.pageInfo?.hasNextPage) {
          await this.handleSaveStaffAnimeConnection(page, animePage + 1);
        } else if (pageInfo.hasNextPage) {
          await this.handleSaveStaffAnimeConnection(page + 1, 1);
        } else {
          this.logger.log(`Save staff anime DONE!`);
        }
      } catch (error) {
        this.eventEmitter.emit(LOGGER_CREATED, {
          requestObject: JSON.stringify(staff),
          errorMessage: JSON.stringify(error),
          notes: `Fetch error page: ${page}`,
          tracePath: `${AnilistService.name}.${getMethodName()}`,
        } as CreateLoggerDto);

        // fetch and sync next page
        this.handleSaveStaffAnimeConnection(page + 1);
      }
    }, this.AnilistRateLimit);
  }

  @OnEvent(SynchronizedAnimeEnum.SAVE_STAFF_CHARACTER_TYPE)
  public async handleSaveStaffCharacterConnection(
    page: number = 1,
    characterPage: number = 1,
  ) {
    const { docs, pageInfo } = await this.staffService.getStaffListV1(page, 1);
    const staff = docs[0];

    setTimeout(async () => {
      try {
        const document = gql`
          {
            Staff(id: ${staff.idAnilist}) {
              characters(page: ${characterPage}, perPage: 15) {
                ${characterConnection}
              }
            }
          }
        `;

        //@ts-ignore
        const { Staff } = await this.gqlClient.request(document);
        const { characters } = Staff;
        let { edges, nodes } = characters;

        // modify edges
        edges = await this.handleModifyCharacterEdge(edges);

        // modify nodes
        nodes = await this.handleModifyCharacterNodes(nodes);

        const characterConnectionRaw: Partial<CharacterConnection> =
          this.createCharacterConnectionRaw(edges, nodes);

        // save edges
        if (
          Array.isArray(characterConnectionRaw.edges) &&
          characterConnectionRaw.edges.length > 0
        ) {
          for (const edge of characterConnectionRaw.edges) {
            if (staff.characters) {
              edge.characterConnection = staff.characters;
            }
            Object.assign(
              edge,
              await this.characterService.saveCharacterEdge(edge),
            );
          }
        }

        // save nodes
        if (staff.characters && characterConnectionRaw.nodes) {
          staff.characters.nodes = [
            ...staff.characters.nodes,
            ...characterConnectionRaw.nodes,
          ];
          await this.characterService.saveCharacterConnection(staff.characters);
        }

        // save new staff-characterConnection
        if (!staff.characters) {
          const savedCharacterConnection =
            await this.characterService.saveCharacterConnection(
              characterConnectionRaw,
            );

          if (savedCharacterConnection) {
            staff.characters = { ...savedCharacterConnection };
          }
        }

        if (await this.staffService.saveStaff(staff)) {
          this.logger.log(
            `Successfully saved staff characters ${staff.idAnilist} page: ${page}, chapterPage: ${characterPage}`,
          );
        }

        if (characters?.pageInfo?.hasNextPage) {
          this.handleSaveStaffCharacterConnection(page, characterPage + 1);
        } else if (pageInfo.hasNextPage) {
          this.handleSaveStaffCharacterConnection(page + 1, 1);
        } else {
          this.logger.log('Save staff characters DONE');
        }
      } catch (error) {
        this.eventEmitter.emit(LOGGER_CREATED, {
          requestObject: JSON.stringify(staff),
          errorMessage: JSON.stringify(error),
          notes: `Fetch error page: ${page}`,
          tracePath: `${AnilistService.name}.${getMethodName()}`,
        } as CreateLoggerDto);

        // fetch and sync next page
        this.handleSaveStaffCharacterConnection(page + 1);
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

  @OnEvent(SynchronizedAnimeEnum.SAVE_CHARACTER_ANIME_TYPE)
  public async handleSaveCharacterAnimeConnectionType(
    page: number = 1,
    animePage: number = 1,
  ) {
    const { docs, pageInfo } = await this.characterService.getCharacterListV1(
      page,
      1,
    );
    const character = docs[0];

    setTimeout(async () => {
      try {
        const document = gql`
          {
            Character(id: ${character.idAnilist}) {
              media(page: ${animePage}, perPage: 15) {
                ${animeConnection}
              }
            }
          }
        `;

        //@ts-ignore
        const { Character } = await this.gqlClient.request(document);
        const { media } = Character;
        let { edges, nodes } = media;

        // modify edges
        edges = await this.handleModifyAnimeEdges(edges);

        // modify nodes
        nodes = await this.handleModifyAnimeNodes(nodes);

        const animeConnectionRaw: Partial<AnimeConnection> =
          this.createAnimeConnectionRaw(edges, nodes);

        // save edges
        if (
          Array.isArray(animeConnectionRaw.edges) &&
          animeConnectionRaw.edges.length > 0
        ) {
          for (const edge of animeConnectionRaw.edges) {
            if (character.anime) {
              edge.animeConnection = character.anime;
            }

            Object.assign(edge, await this.animeService.saveAnimeEdge(edge));
          }
        }

        // save nodes
        if (character.anime && animeConnectionRaw.nodes) {
          character.anime.nodes = character.anime.nodes.concat(
            animeConnectionRaw.nodes,
          );

          await this.animeService.saveAnimeConnection(character.anime);
        }

        // save new connection raw
        if (!character.anime) {
          const savedAnimeConnection =
            await this.animeService.saveAnimeConnection(animeConnectionRaw);

          if (savedAnimeConnection) {
            character.anime = { ...savedAnimeConnection };
          }
        }

        if (await this.characterService.saveCharacter(character)) {
          this.logger.log(
            `Successfully saved character anime ${character.idAnilist} page: ${page}, animePage: ${animePage}`,
          );
        }

        if (media?.pageInfo?.hasNextPage) {
          await this.handleSaveCharacterAnimeConnectionType(
            page,
            animePage + 1,
          );
        } else if (pageInfo.hasNextPage) {
          await this.handleSaveCharacterAnimeConnectionType(page + 1, 1);
        } else {
          this.logger.log(`Save character anime DONE!`);
        }
      } catch (error) {
        this.eventEmitter.emit(LOGGER_CREATED, {
          requestObject: JSON.stringify(character),
          errorMessage: JSON.stringify(error),
          notes: `Fetch error page: ${page}`,
          tracePath: `${AnilistService.name}.${getMethodName()}`,
        } as CreateLoggerDto);

        // fetch and sync next page
        this.handleSaveCharacterAnimeConnectionType(page + 1);
      }
    }, this.AnilistRateLimit);
  }

  @OnEvent(SynchronizedAnimeEnum.SAVE_STUDIO_TYPE)
  public async handleSaveStudiosInfo(page: number = 1) {
    const document = gql`
      {
        Page(page: ${page}, perPage: 15) {
          pageInfo {
            hasNextPage
          }
          studios {
            id
            name
            isAnimationStudio
          }
        }
      }
    `;

    setTimeout(async () => {
      try {
        //@ts-ignore
        const { Page } = await this.gqlClient.request(document);
        if (!Page) throw new GraphQLError('Page is null or empty');

        let { studios } = Page;

        if (Array.isArray(studios)) {
          // @ts-ignore: make sure anilist data not error
          studios = unique(studios, (s) => s.id);

          const studiosListRaw: Partial<Studio>[] = studios.map((e: any) => {
            return {
              idAnilist: e.id,
              name: e.name,
              isAnimationStudio: e.isAnimationStudio,
            } as Studio;
          });

          if (await this.studioService.saveManyStudio(studiosListRaw)) {
            this.logger.log(
              `Successfully saved page ${page} with ${studios.length} objects`,
            );
          }
        }

        //fetch and sync next page
        if (Page.pageInfo?.hasNextPage) {
          this.handleSaveStudiosInfo(page + 1);
        }
      } catch (error) {
        this.eventEmitter.emit(LOGGER_CREATED, {
          requestObject: JSON.stringify(page),
          errorMessage: JSON.stringify(error),
          notes: `Fetch error page: ${page}`,
          tracePath: `${AnilistService.name}.${getMethodName()}`,
        } as CreateLoggerDto);

        this.handleSaveStudiosInfo(page + 1);
      }
    }, this.AnilistRateLimit);
  }

  @OnEvent(SynchronizedAnimeEnum.SAVE_STUDIO_ANIME_TYPE)
  public async handleSaveStudioAnimeConnection(
    page: number = 1,
    animePage: number = 1,
  ) {
    const { docs, pageInfo } = await this.studioService.getStudioListV1(
      page,
      1,
    );
    const studio = docs[0];

    setTimeout(async () => {
      try {
        const document = gql`
          {
            Studio(id: ${studio.idAnilist}) {
              media(page: ${animePage}, perPage: 15) {
                ${animeConnection}
              }
            }
          }
        `;

        //@ts-ignore
        const { Studio } = await this.gqlClient.request(document);
        const { media } = Studio;
        let { edges, nodes } = media;

        // modify edges
        edges = await this.handleModifyAnimeEdges(edges);

        // modify nodes
        nodes = await this.handleModifyAnimeNodes(nodes);

        const animeConnectionRaw: Partial<AnimeConnection> =
          this.createAnimeConnectionRaw(edges, nodes);

        // save edges
        if (
          Array.isArray(animeConnectionRaw.edges) &&
          animeConnectionRaw.edges.length > 0
        ) {
          for (const edge of animeConnectionRaw.edges) {
            if (studio.anime) {
              edge.animeConnection = studio.anime;
            }

            Object.assign(edge, await this.animeService.saveAnimeEdge(edge));
          }
        }

        // save nodes
        if (studio.anime && animeConnectionRaw.nodes) {
          studio.anime.nodes = studio.anime.nodes.concat(
            animeConnectionRaw.nodes,
          );

          await this.animeService.saveAnimeConnection(studio.anime);
        }

        // save new connection raw
        if (!studio.anime) {
          const savedAnimeConnection =
            await this.animeService.saveAnimeConnection(animeConnectionRaw);

          if (savedAnimeConnection) {
            studio.anime = { ...savedAnimeConnection };
          }
        }

        if (await this.studioService.saveStudio(studio)) {
          this.logger.log(
            `Successfully saved studio anime ${studio.idAnilist} page: ${page}, animePage: ${animePage}`,
          );
        }

        if (media?.pageInfo?.hasNextPage) {
          await this.handleSaveStudioAnimeConnection(page, animePage + 1);
        } else if (pageInfo.hasNextPage) {
          await this.handleSaveStudioAnimeConnection(page + 1, 1);
        } else {
          this.logger.log(`Save studio anime DONE!`);
        }
      } catch (error) {
        this.eventEmitter.emit(LOGGER_CREATED, {
          requestObject: JSON.stringify('studio'),
          errorMessage: JSON.stringify(error),
          notes: `Fetch error page: ${page}`,
          tracePath: `${AnilistService.name}.${getMethodName()}`,
        } as CreateLoggerDto);

        // fetch and sync next page
        this.handleSaveStudioAnimeConnection(page + 1);
      }
    }, this.AnilistRateLimit);
  }

  private createCharacterConnectionRaw(
    edges: any,
    nodes: any,
  ): Partial<CharacterConnection> {
    return {
      edges: Array.isArray(edges)
        ? edges.map((e) => {
            return {
              idAnilist: e.id,
              node: e.node,
              role: e.role,
              name: e.name,
              voiceActors: e.voiceActors,
              voiceActorRoles: e.voiceActorRoles,
              anime: e.media,
            } as CharacterEdge;
          })
        : [],
      nodes: Array.isArray(nodes) ? nodes.map((n) => n as Character) : [],
    };
  }

  private async handleModifyCharacterNodes(nodes: any) {
    if (Array.isArray(nodes)) {
      nodes = unique(nodes, (n) => n.id).filter(Boolean);
      for (const node of nodes) {
        const characterNode =
          await this.characterService.findCharacterByIdAnilist(node.id, true);

        if (characterNode) {
          Object.assign(node, characterNode);
        } else {
          this.logger.warn(`Missing character with id: ${node?.id}`);

          const newCharacterNode = await this.handleSaveCharacterById(node?.id);

          if (newCharacterNode) {
            Object.assign(node, newCharacterNode);
          } else {
            this.logger.error(`Not found character with id: ${node?.id}`);

            this.eventEmitter.emit(LOGGER_CREATED, {
              requestObject: JSON.stringify(node?.id),
              errorMessage: JSON.stringify(
                `Not found character with id: ${node?.id}`,
              ),
              tracePath: `${AnilistService.name}.${getMethodName()}`,
            } as CreateLoggerDto);
          }
        }
      }
    }

    return await nodes;
  }

  private async handleModifyCharacterEdge(edges: any) {
    if (Array.isArray(edges)) {
      edges = unique(edges, (e) => e.node?.id).filter(Boolean);
      // modify edges node
      for (const edge of edges) {
        const characterNode =
          await this.characterService.findCharacterByIdAnilist(
            edge.node?.id,
            true,
          );

        if (characterNode) {
          Object.assign(edge.node, characterNode);
        } else {
          this.logger.warn(`Missing character with id: ${edge.node?.id}`);

          const newCharacterNode = await this.handleSaveCharacterById(
            edge.node?.id,
          );

          if (newCharacterNode) {
            Object.assign(edge.node, newCharacterNode);
          } else {
            this.logger.error(`Not found character with id: ${edge.node?.id}`);

            this.eventEmitter.emit(LOGGER_CREATED, {
              requestObject: JSON.stringify(edge.node?.id),
              errorMessage: JSON.stringify(
                `Not found character with id: ${edge.node?.id}`,
              ),
              tracePath: `${AnilistService.name}.${getMethodName()}`,
            } as CreateLoggerDto);
          }
        }
      }

      // modify edge voiceActors
      for (const edge of edges) {
        if (Array.isArray(edge.voiceActors) && edge.voiceActors.length > 0) {
          for (const voiceActor of edge.voiceActors) {
            // find existing staff in DB
            await this.handleAssignVoiceActorModel(voiceActor);
          }
        }
      }

      // modify edge voiceActorRoles
      for (const edge of edges) {
        if (
          Array.isArray(edge.voiceActorRoles) &&
          edge.voiceActorRoles.length > 0
        ) {
          for (const voiceActorRole of edge.voiceActorRoles) {
            // modify voice actor
            if (voiceActorRole.voiceActor) {
              await this.handleAssignVoiceActorModel(voiceActorRole.voiceActor);
            }

            const staffRoleTypeRaw: Partial<StaffRoleType> = {
              voiceActor: voiceActorRole.voiceActor,
              roleNotes: voiceActorRole.roleNotes,
              dubGroup: voiceActorRole.dubGroup,
            };

            Object.assign(
              voiceActorRole,
              await this.staffService.saveStaffRoleType(staffRoleTypeRaw),
            );
          }
        }
      }

      // modify edge media
      for (const edge of edges) {
        if (Array.isArray(edge.media) && edge.media.length > 0) {
          for (const anime of edge.media) {
            const animeModel = await this.animeService.findAnimeByIdAnilist(
              anime.id,
              true,
            );

            if (animeModel) {
              Object.assign(anime, animeModel);
            } else {
              const newAnimeNode = await this.handleSaveAnimeById(anime.id);

              if (newAnimeNode) {
                Object.assign(anime, animeModel);
              } else {
                this.logger.error(`Not found anime with id: ${anime.id}`);

                this.eventEmitter.emit(LOGGER_CREATED, {
                  requestObject: JSON.stringify(anime.id),
                  errorMessage: JSON.stringify(
                    `Not found anime with id: ${anime.id}`,
                  ),
                  tracePath: `${AnilistService.name}.${getMethodName()}`,
                } as CreateLoggerDto);
              }
            }
          }
        }
      }
    }

    return await edges;
  }

  private createAnimeConnectionRaw(
    edges: any,
    nodes: any,
  ): Partial<AnimeConnection> {
    return {
      edges: Array.isArray(edges)
        ? edges.map((e) => {
            return {
              idAnilist: e.id,
              node: e.node,
              relationType: e.relationType,
              isMainStudio: e.isMainStudio,
              characters: Array.isArray(e.characters) ? e.characters : [],
              characterRole: e.characterRole,
              characterName: e.characterName,
              roleNotes: e.roleNotes,
              dubGroup: e.dubGroup,
              staffRole: e.staffRole,
              voiceActors: Array.isArray(e.voiceActors) ? e.voiceActors : [],
              voiceActorRoles: Array.isArray(e.voiceActorRoles)
                ? e.voiceActorRoles
                : [],
            } as AnimeEdge;
          })
        : [],
      nodes: Array.isArray(nodes) ? nodes : [],
    };
  }

  private async handleModifyAnimeNodes(nodes: any) {
    if (Array.isArray(nodes)) {
      nodes = unique(nodes, (n) => n.id).filter((n) => n?.type !== 'MANGA');
      for (const node of nodes) {
        const animeNode = await this.animeService.findAnimeByIdAnilist(node.id);

        if (animeNode) {
          Object.assign(node, animeNode);
        } else {
          this.logger.warn(`Missing anime with id: ${node?.id}`);

          const newAnimeNode = await this.handleSaveAnimeById(node.id);

          if (newAnimeNode) {
            Object.assign(node, animeNode);
          }
        }
      }
    }
    return nodes;
  }

  private async handleModifyAnimeEdges(edges: any) {
    if (Array.isArray(edges)) {
      // @ts-ignore make sure remove duplicate error
      edges = unique(edges, (e) => e.node?.id).filter(
        (e) => e.node?.type !== 'MANGA',
      );

      for (const edge of edges) {
        // modify node
        const animeNode = await this.animeService.findAnimeByIdAnilist(
          edge.node?.id,
        );
        if (animeNode) {
          Object.assign(edge.node, animeNode);
        } else {
          this.logger.warn(`Missing anime with id: ${edge.node?.id}`);

          const newAnimeNode = await this.handleSaveAnimeById(edge.node?.id);

          if (newAnimeNode) {
            Object.assign(edge.node, animeNode);
          } else {
            this.logger.error(`Not found anime with id: ${edge.node?.id}`);

            this.eventEmitter.emit(LOGGER_CREATED, {
              requestObject: JSON.stringify(edge.node?.id),
              errorMessage: JSON.stringify(
                `Not found anime with id: ${edge.node?.id}`,
              ),
              tracePath: `${AnilistService.name}.${getMethodName()}`,
            } as CreateLoggerDto);
          }
        }

        // modify characters
        if (Array.isArray(edge.characters)) {
          edge.characters = edge.characters.filter(Boolean);
          for (const c of edge.characters) {
            const character =
              await this.characterService.findCharacterByIdAnilist(c.id, true);

            if (character) {
              Object.assign(c, character);
            } else {
              this.logger.error(`Not found character with id: ${c.id}`);

              // sleep 500ms because rate limit
              await new Promise((r) => setTimeout(r, 500));
              const newCharacter = await this.handleSaveCharacterById(c.id);

              if (newCharacter) {
                Object.assign(c, newCharacter);
              }
            }
          }
        }

        // modify voiceActors
        if (Array.isArray(edge.voiceActors)) {
          //@ts-ignore
          edge.voiceActors = unique(edge.voiceActors, (v) => v.id).filter(
            Boolean,
          );
          for (const va of edge.voiceActors) {
            const staff = await this.staffService.findStaffByIdAnilist(
              va.id,
              true,
            );

            if (staff) {
              Object.assign(va, staff);
            } else {
              // sleep 1s because rate limit
              await new Promise((r) => setTimeout(r, 500));

              const newStaff = await this.handleSaveStaffById(va.id);

              if (newStaff) {
                Object.assign(va, newStaff);
              }
            }
          }
        }

        // modify voiceActorRoles
        if (Array.isArray(edge.voiceActorRoles)) {
          for (const ev of edge.voiceActorRoles) {
            const voiceActor = await this.staffService.findStaffByIdAnilist(
              ev.voiceActor?.id,
            );

            if (voiceActor) {
              Object.assign(ev.voiceActor, voiceActor);
            }

            Object.assign(ev, await this.staffService.saveStaffRoleType(ev));
          }
        }
      }
    }
    return edges;
  }

  private async handleSaveStudioById(anilistId: number) {
    const document = gql`
      {
        Studio(id: ${anilistId}) {
          id
          name
          isAnimationStudio
        }
      }
    `;

    // sleep 1s because rate limit
    await new Promise((r) => setTimeout(r, 1000));

    // @ts-ignore
    const { Studio } = await this.gqlClient.request(document);

    if (!Studio) {
      return null;
    }

    return await this.studioService.saveStudio({
      idAnilist: Studio.id,
      name: Studio.name,
      isAnimationStudio: Studio.isAnimationStudio,
    });
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

  private async handleSaveCharacterById(anilistId: number) {
    // sleep 1s because rate limit
    await new Promise((r) => setTimeout(r, 1000));

    const document = gql`
      {
        Character(id: ${anilistId}) {
          ${characterFields}
        }
      }    
    `;

    // @ts-ignore
    const { Character } = await this.gqlClient.request(document);

    if (!Character) {
      return null;
    }

    return await this.characterService.saveCharacter(
      await this.handleMapCharacterModel(Character),
    );
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
    if (
      characterRaw.dateOfBirth?.year ||
      characterRaw.dateOfBirth?.month ||
      characterRaw.dateOfBirth?.day
    ) {
      Object.assign(
        characterRaw.dateOfBirth,
        await this.fuzzDateRepo.save(characterRaw.dateOfBirth),
      );
    }
    return characterRaw;
  }

  private async handleSaveStaffById(anilistId: number) {
    const document = gql`
      {
        Staff(id: ${anilistId}) {
          ${staffFields}
        }
      }
    `;

    // sleep 1s because rate limit
    await new Promise((r) => setTimeout(r, 1000));

    // @ts-ignore
    const { Staff } = await this.gqlClient.request(document);

    if (!Staff) {
      return null;
    }

    return this.staffService.saveStaff(await this.handleMapStaffModel(Staff));
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

  private async handleAssignVoiceActorModel(voiceActor: any) {
    const staffModel = await this.staffService.findStaffByIdAnilist(
      voiceActor.id,
      true,
    );

    // assign if have
    if (staffModel) {
      Object.assign(voiceActor, staffModel);
    }

    // get on anilist if not found
    else {
      this.logger.warn(`Missing staff with id: ${voiceActor.id}`);
      const newStaff = await this.handleSaveStaffById(voiceActor.id);

      // reassign if found
      if (newStaff) {
        Object.assign(voiceActor, newStaff);
      } else {
        this.logger.error(`Not found staff with id: ${voiceActor.id}`);

        this.eventEmitter.emit(LOGGER_CREATED, {
          requestObject: JSON.stringify(voiceActor.id),
          errorMessage: JSON.stringify(
            `Not found staff with id: ${voiceActor.id}`,
          ),
          tracePath: `${AnilistService.name}.${getMethodName()}`,
        } as CreateLoggerDto);
      }
    }
  }
}
