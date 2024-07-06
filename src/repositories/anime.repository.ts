import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { alphabetical, sort } from 'radash';
import { DataSource, ObjectLiteral, Repository } from 'typeorm';
import { IAnimeRepository } from '~/contracts/repositories';
import { QueryAnimeConnectionArg } from '~/graphql/types/args/query-anime-connection.arg';
import { QueryStreamingEpisodeSourceArg } from '~/graphql/types/args/query-anime-streaming-episode.arg';
import { QueryAnimeArg } from '~/graphql/types/args/query-anime.arg';
import { AnimeSortEnum } from '~/graphql/types/dtos/anime-response/anime-sort.enum';
import { Anime } from '~/models';
import { MediaExternalLink } from '~/models/media-external-link.model';
import { AnimeConnection } from '~/models/sub-models/anime-sub-models';
import { AnimeStreamingEpisodeSource } from '~/models/sub-models/anime-sub-models/anime-streaming-episode-sources.model';
import { AnimeStreamingEpisode } from '~/models/sub-models/anime-sub-models/anime-streaming-episode.model';
import { paginate } from '~/utils/tools/functions';
import { MapResultSelect } from '../utils/tools/object';
import { BaseRepository } from './base.repository';
import { QueryBuilderChainer } from './libs/query-builder-chainer';

@Injectable()
export class AnimeRepository
  extends BaseRepository<Anime>
  implements IAnimeRepository
{
  constructor(
    @InjectRepository(Anime)
    private readonly animeRepository: Repository<Anime>,

    private dataSource: DataSource,
  ) {
    super(animeRepository);
  }

  static readonly ignoreColumnsReferencesAnime = [
    'genres',
    'rankings',
    'synonyms',
    'tags',
    'mediaExternalLink',
    'animeStreamingEpisodes',
  ];

  get mediaExternalLinkAlias() {
    return 'MediaExternalLink';
  }

  get mediaAnimeStreamingEpisodeAlias() {
    return 'AnimeStreamingEpisode';
  }

  get animeStreamingEpisodeSourceAlias() {
    return 'AnimeStreamingEpisodeSource';
  }

  get animeAlias() {
    return 'Anime';
  }

  get animeConnectionAlias() {
    return 'AnimeConnection';
  }

  get animeBuilder() {
    return this.dataSource
      .getRepository(Anime)
      .createQueryBuilder(this.animeAlias);
  }

  get animeStreamingEpisodeSourceBuilder() {
    return this.dataSource
      .getRepository(AnimeStreamingEpisodeSource)
      .createQueryBuilder(this.animeStreamingEpisodeSourceAlias);
  }

  get animeStreamingEpisodeBuilder() {
    return this.dataSource
      .getRepository(AnimeStreamingEpisode)
      .createQueryBuilder(this.mediaAnimeStreamingEpisodeAlias);
  }

  get animeConnectionBuilder() {
    return this.dataSource
      .getRepository(AnimeConnection)
      .createQueryBuilder(this.animeConnectionAlias);
  }

  get mediaExternalLinkBuilder() {
    return this.dataSource
      .getRepository(MediaExternalLink)
      .createQueryBuilder(this.mediaExternalLinkAlias);
  }

  public async getAnimeStreamingEpisodeSources(
    queryStreamingEpisodeSourceArg: QueryStreamingEpisodeSourceArg,
    mapResultSelectParam: MapResultSelect,
  ) {
    const mapResultSelect = mapResultSelectParam as Record<string, any>;

    const queryBuilder = this.createQueryAnimeStreamingEpisodeSourceBuilder(
      mapResultSelect,
      queryStreamingEpisodeSourceArg,
    );

    const animeStreamingEpisodeSources = await queryBuilder.getMany();

    return animeStreamingEpisodeSources;
  }

  public async getEdgesOrNodes(
    animeConnectionId: string,
    mapResultSelectParam: MapResultSelect,
    queryAnimeConnectionArg?: QueryAnimeConnectionArg,
  ) {
    const mapResultSelect = mapResultSelectParam as Record<string, any>;

    const queryBuilderChainer = new QueryBuilderChainer(
      this.animeConnectionBuilder,
    );
    const queryBuilder = this.createBuilderSelectAndWhereAnimeConnection(
      queryBuilderChainer,
      mapResultSelect,
      animeConnectionId,
    );

    const animeConnection = await queryBuilder.getOne();

    // pagination (to reduce testing effort & query complexity,
    // we will handle pagination in application layer)
    this.paginationAnimeConnection(animeConnection, queryAnimeConnectionArg);

    return animeConnection;
  }

  public async fuzzySearchAnimeByTitle(title: string) {
    const rawData = await this.dataSource.manager.query(`
      SELECT 
        word_similarity(at.english, '${title}') as englishMatchingScore, 
        word_similarity(at.romaji, '${title}') as romajiMatchingScore,
        word_similarity(at.native, '${title}') as nativeMatchingScore,
        word_similarity(at."userPreferred", '${title}') as userPreferredMatchingScore,
        a."idAnilist",
        a.id
      FROM "anime" as a
      INNER JOIN "animeTitles" as at ON a."titleId" = at.id
      WHERE at.romaji % '${title}'
        OR at.english % '${title}'
        OR at.native % '${title}'
        OR at."userPreferred" % '${title}'
      `);

    return rawData;
  }

  public async getAnimeByConditions(
    mapResultSelectParam: MapResultSelect,
    queryAnimeArg: QueryAnimeArg,
  ) {
    const mapResultSelect = mapResultSelectParam as Record<string, any>;
    const { id, idMal, idAnilist, isAdult, romajiTitle } = queryAnimeArg;

    const queryBuilder = this.createBuilderSelectAndWhereAnime(
      mapResultSelect,
      romajiTitle,
      id,
      idMal,
      idAnilist,
      isAdult,
    );

    const anime = await queryBuilder.getOne();

    return anime;
  }

  // public common query for sub query other entity has relation ship width Anime
  public static createBuilderSelectAnime<Entity extends ObjectLiteral>(
    builderChainer: QueryBuilderChainer<Entity>,
    rootAlias: string,
    mapResultSelect: Record<string, any>,
  ) {
    if (!mapResultSelect || !Object.keys(mapResultSelect).length) {
      return builderChainer;
    }

    return builderChainer
      .addSelect(mapResultSelect, rootAlias, false, [
        'genres',
        'rankings',
        'synonyms',
        'tags',
        'mediaExternalLink',
        'animeStreamingEpisodes',
      ])

      .applyJoinConditionally(
        !!mapResultSelect['relations'],
        rootAlias,
        'relations',
        true,
      )

      .applyJoinConditionally(!!mapResultSelect['staff'], rootAlias, 'staff')
      .addSelect(mapResultSelect['staff'], 'staff', false, ['edges', 'nodes'])

      .applyJoinConditionally(
        !!mapResultSelect['characters'],
        rootAlias,
        'characters',
        true,
      )

      .applyJoinConditionally(
        !!mapResultSelect['startDate'],
        rootAlias,
        'startDate',
      )
      .addSelect(mapResultSelect['startDate'], 'startDate')

      .applyJoinConditionally(
        !!mapResultSelect['endDate'],
        rootAlias,
        'endDate',
      )
      .addSelect(mapResultSelect['endDate'], 'endDate')

      .applyJoinConditionally(
        !!mapResultSelect['description'],
        rootAlias,
        'description',
      )
      .addSelect(mapResultSelect['description'], 'description')

      .applyJoinConditionally(
        !!mapResultSelect['trailer'],
        rootAlias,
        'trailer',
      )
      .addSelect(mapResultSelect['trailer'], 'trailer')

      .applyJoinConditionally(!!mapResultSelect['title'], rootAlias, 'title')
      .addSelect(mapResultSelect['title'], 'title')

      .applyJoinConditionally(
        !!mapResultSelect['coverImage'],
        rootAlias,
        'coverImage',
      )
      .addSelect(mapResultSelect['coverImage'], 'coverImage')

      .applyJoinConditionally(!!mapResultSelect['genres'], rootAlias, 'genres')
      .addSelect(mapResultSelect['genres'], 'genres')

      .applyJoinConditionally(
        !!mapResultSelect['synonyms'],
        rootAlias,
        'synonyms',
      )
      .addSelect(mapResultSelect['synonyms'], 'synonyms')

      .applyJoinConditionally(!!mapResultSelect['tags'], rootAlias, 'tags')
      .addSelect(mapResultSelect['tags'], 'tags')

      .applyJoinConditionally(
        !!mapResultSelect['nextAiringEpisode'],
        rootAlias,
        'nextAiringEpisode',
      )
      .addSelect(mapResultSelect['nextAiringEpisode'], 'nextAiringEpisode')

      .applyJoinConditionally(
        !!mapResultSelect['mediaExternalLink'],
        rootAlias,
        'mediaExternalLink',
      )
      .addSelect(
        mapResultSelect['mediaExternalLink'],
        'mediaExternalLink',
        false,
        ['animeStreamingEpisodes'],
      )

      .applyJoinConditionally(
        !!mapResultSelect['mediaExternalLink']?.animeStreamingEpisodes,
        'mediaExternalLink',
        'animeStreamingEpisodes',
      )
      .addSelect(
        mapResultSelect['mediaExternalLink']?.animeStreamingEpisodes,
        'animeStreamingEpisodes',
        false,
        ['sources'],
      )

      .applyJoinConditionally(
        !!mapResultSelect['mediaExternalLink']?.animeStreamingEpisodes?.sources,
        'animeStreamingEpisodes',
        'sources',
      )
      .addSelect(
        mapResultSelect['mediaExternalLink']?.animeStreamingEpisodes?.sources,
        'sources',
      )

      .applyJoinConditionally(
        !!mapResultSelect['rankings'],
        rootAlias,
        'rankings',
      )
      .addSelect(mapResultSelect['rankings'], 'rankings');
  }

  private paginationAnimeConnection(
    animeConnection?: AnimeConnection | null,
    queryAnimeConnectionArg?: QueryAnimeConnectionArg,
  ) {
    if (!animeConnection || !queryAnimeConnectionArg) return;

    const { limit, page, sort: sortQuery } = queryAnimeConnectionArg;

    switch (sortQuery) {
      case AnimeSortEnum.ID:
        animeConnection.edges = sort(animeConnection.edges, (e) =>
          Number(e?.node?.idAnilist),
        );
        animeConnection.nodes = sort(animeConnection.nodes, (n) =>
          Number(n.idAnilist),
        );
        break;

      case AnimeSortEnum.ID_DESC:
        animeConnection.edges = sort(
          animeConnection.edges,
          (e) => Number(e?.node?.idAnilist),
          true,
        );
        animeConnection.nodes = sort(
          animeConnection.nodes,
          (n) => Number(n.idAnilist),
          true,
        );
        break;

      case AnimeSortEnum.TITLE_ROMAJI:
        animeConnection.edges = alphabetical(
          animeConnection.edges,
          (e) => `${e?.node?.title?.romaji}`,
        );
        animeConnection.nodes = alphabetical(
          animeConnection.nodes,
          (n) => `${n?.title?.romaji}`,
        );
        break;

      case AnimeSortEnum.TITLE_ROMAJI_DESC:
        animeConnection.edges = alphabetical(
          animeConnection.edges,
          (e) => `${e?.node?.title?.romaji}`,
          'desc',
        );
        animeConnection.nodes = alphabetical(
          animeConnection.nodes,
          (n) => `${n?.title?.romaji}`,
          'desc',
        );
        break;

      case AnimeSortEnum.TITLE_ENGLISH:
        animeConnection.edges = alphabetical(
          animeConnection.edges,
          (e) => `${e?.node?.title?.english}`,
        );
        animeConnection.nodes = alphabetical(
          animeConnection.nodes,
          (n) => `${n?.title?.english}`,
        );
        break;

      case AnimeSortEnum.TITLE_ENGLISH_DESC:
        animeConnection.edges = alphabetical(
          animeConnection.edges,
          (e) => `${e?.node?.title?.english}`,
          'desc',
        );
        animeConnection.nodes = alphabetical(
          animeConnection.nodes,
          (n) => `${n?.title?.english}`,
          'desc',
        );
        break;

      case AnimeSortEnum.TITLE_NATIVE:
        animeConnection.edges = alphabetical(
          animeConnection.edges,
          (e) => `${e?.node?.title?.native}`,
        );
        animeConnection.nodes = alphabetical(
          animeConnection.nodes,
          (n) => `${n?.title?.native}`,
        );
        break;

      case AnimeSortEnum.TITLE_NATIVE_DESC:
        animeConnection.edges = alphabetical(
          animeConnection.edges,
          (e) => `${e?.node?.title?.native}`,
          'desc',
        );
        animeConnection.nodes = alphabetical(
          animeConnection.nodes,
          (n) => `${n?.title?.native}`,
          'desc',
        );
        break;

      case AnimeSortEnum.FORMAT:
        animeConnection.edges = alphabetical(
          animeConnection.edges,
          (e) => `${e?.node?.format}`,
        );
        animeConnection.nodes = alphabetical(
          animeConnection.nodes,
          (n) => `${n?.format}`,
        );
        break;

      case AnimeSortEnum.FORMAT_DESC:
        animeConnection.edges = alphabetical(
          animeConnection.edges,
          (e) => `${e?.node?.format}`,
          'desc',
        );
        animeConnection.nodes = alphabetical(
          animeConnection.nodes,
          (n) => `${n?.format}`,
          'desc',
        );
        break;

      case AnimeSortEnum.START_DATE:
        animeConnection.edges = sort(animeConnection.edges, (e) =>
          new Date(
            e?.node?.startDate?.year ?? 0,
            e?.node?.startDate?.month ?? 1,
            e?.node?.startDate?.day ?? 1,
          ).getTime(),
        );
        animeConnection.nodes = sort(animeConnection.nodes, (n) =>
          new Date(
            n?.startDate?.year ?? 0,
            n?.startDate?.month ?? 1,
            n?.startDate?.day ?? 1,
          ).getTime(),
        );
        break;

      case AnimeSortEnum.START_DATE_DESC:
        animeConnection.edges = sort(
          animeConnection.edges,
          (e) =>
            new Date(
              e?.node?.startDate?.year ?? 0,
              e?.node?.startDate?.month ?? 1,
              e?.node?.startDate?.day ?? 1,
            ).getTime(),
          true,
        );
        animeConnection.nodes = sort(
          animeConnection.nodes,
          (n) =>
            new Date(
              n?.startDate?.year ?? 0,
              n?.startDate?.month ?? 1,
              n?.startDate?.day ?? 1,
            ).getTime(),
          true,
        );
        break;

      case AnimeSortEnum.END_DATE:
        animeConnection.edges = sort(animeConnection.edges, (e) =>
          new Date(
            e?.node?.endDate?.year ?? 0,
            e?.node?.endDate?.month ?? 1,
            e?.node?.endDate?.day ?? 1,
          ).getTime(),
        );
        animeConnection.nodes = sort(animeConnection.nodes, (n) =>
          new Date(
            n?.endDate?.year ?? 0,
            n?.endDate?.month ?? 1,
            n?.endDate?.day ?? 1,
          ).getTime(),
        );
        break;

      case AnimeSortEnum.END_DATE_DESC:
        animeConnection.edges = sort(
          animeConnection.edges,
          (e) =>
            new Date(
              e?.node?.endDate?.year ?? 0,
              e?.node?.endDate?.month ?? 1,
              e?.node?.endDate?.day ?? 1,
            ).getTime(),
          true,
        );
        animeConnection.nodes = sort(
          animeConnection.nodes,
          (n) =>
            new Date(
              n?.endDate?.year ?? 0,
              n?.endDate?.month ?? 1,
              n?.endDate?.day ?? 1,
            ).getTime(),
          true,
        );
        break;

      case AnimeSortEnum.SCORE:
        animeConnection.edges = sort(animeConnection.edges, (e) =>
          Number(e?.node?.averageScore),
        );
        animeConnection.nodes = sort(animeConnection.nodes, (n) =>
          Number(n.averageScore),
        );
        break;

      case AnimeSortEnum.SCORE_DESC:
        animeConnection.edges = sort(
          animeConnection.edges,
          (e) => Number(e?.node?.averageScore),
          true,
        );
        animeConnection.nodes = sort(
          animeConnection.nodes,
          (n) => Number(n.averageScore),
          true,
        );
        break;

      case AnimeSortEnum.POPULARITY:
        animeConnection.edges = sort(animeConnection.edges, (e) =>
          Number(e?.node?.popularity),
        );
        animeConnection.nodes = sort(animeConnection.nodes, (n) =>
          Number(n.popularity),
        );
        break;

      case AnimeSortEnum.POPULARITY_DESC:
        animeConnection.edges = sort(
          animeConnection.edges,
          (e) => Number(e?.node?.popularity),
          true,
        );
        animeConnection.nodes = sort(
          animeConnection.nodes,
          (n) => Number(n.popularity),
          true,
        );
        break;

      case AnimeSortEnum.EPISODES:
        animeConnection.edges = sort(animeConnection.edges, (e) =>
          Number(e?.node?.episodes),
        );
        animeConnection.nodes = sort(animeConnection.nodes, (n) =>
          Number(n.episodes),
        );
        break;

      case AnimeSortEnum.EPISODES_DESC:
        animeConnection.edges = sort(
          animeConnection.edges,
          (e) => Number(e?.node?.episodes),
          true,
        );
        animeConnection.nodes = sort(
          animeConnection.nodes,
          (n) => Number(n.episodes),
          true,
        );
        break;

      case AnimeSortEnum.DURATION:
        animeConnection.edges = sort(animeConnection.edges, (e) =>
          Number(e?.node?.duration),
        );
        animeConnection.nodes = sort(animeConnection.nodes, (n) =>
          Number(n.duration),
        );
        break;

      case AnimeSortEnum.DURATION_DESC:
        animeConnection.edges = sort(
          animeConnection.edges,
          (e) => Number(e?.node?.duration),
          true,
        );
        animeConnection.nodes = sort(
          animeConnection.nodes,
          (n) => Number(n.duration),
          true,
        );
        break;

      case AnimeSortEnum.STATUS:
        animeConnection.edges = alphabetical(
          animeConnection.edges,
          (e) => `${e?.node?.status}`,
        );
        animeConnection.nodes = alphabetical(
          animeConnection.nodes,
          (n) => `${n.status}`,
        );
        break;

      case AnimeSortEnum.STATUS_DESC:
        animeConnection.edges = alphabetical(
          animeConnection.edges,
          (e) => `${e?.node?.status}`,
          'desc',
        );
        animeConnection.nodes = alphabetical(
          animeConnection.nodes,
          (n) => `${n.status}`,
          'desc',
        );
        break;

      case AnimeSortEnum.SEASON:
        animeConnection.edges = alphabetical(
          animeConnection.edges,
          (e) => `${e?.node?.season}`,
        );
        animeConnection.nodes = alphabetical(
          animeConnection.nodes,
          (n) => `${n.season}`,
        );
        break;

      case AnimeSortEnum.SEASON_DESC:
        animeConnection.edges = alphabetical(
          animeConnection.edges,
          (e) => `${e?.node?.season}`,
          'desc',
        );
        animeConnection.nodes = alphabetical(
          animeConnection.nodes,
          (n) => `${n.season}`,
          'desc',
        );
        break;
    }

    const totalPages =
      animeConnection.edges.length || animeConnection.nodes.length;
    const lastPage = Math.ceil(totalPages / limit);

    animeConnection.pageInfo = {
      total: totalPages,
      perPage: limit,
      lastPage,
      currentPage: page,
      hasNextPage: page < lastPage,
    };

    animeConnection.edges = paginate(limit, page, animeConnection.edges);
    animeConnection.nodes = paginate(limit, page, animeConnection.nodes);

    return animeConnection;
  }

  private createBuilderSelectAndWhereAnime(
    mapResultSelect: Record<string, any>,
    romajiTitle: string | undefined,
    id: string | undefined,
    idMal: number | undefined,
    idAnilist: number,
    isAdult: boolean | undefined,
  ) {
    return (
      new QueryBuilderChainer(this.animeBuilder)
        .addSelect(
          mapResultSelect,
          this.animeAlias,
          true,
          AnimeRepository.ignoreColumnsReferencesAnime,
        )

        // query anime.relations
        .applyJoinConditionally(
          !!mapResultSelect['relations'],
          this.animeAlias,
          'relations',
          true,
        )

        // query anime.characters
        .applyJoinConditionally(
          !!mapResultSelect['characters'],
          this.animeAlias,
          'characters',
          true,
        )

        // query anime.startDate
        .applyJoinConditionally(
          !!mapResultSelect['startDate'],
          this.animeAlias,
          'startDate',
        )
        .addSelect(mapResultSelect['startDate'], 'startDate')

        // query anime.staff
        .applyJoinConditionally(
          !!mapResultSelect['staff'],
          this.animeAlias,
          'staff',
        )
        .addSelect(mapResultSelect['staff'], 'staff', false, ['edges', 'nodes'])

        // query anime.endDate
        .applyJoinConditionally(
          !!mapResultSelect['endDate'],
          this.animeAlias,
          'endDate',
        )
        .addSelect(mapResultSelect['endDate'], 'endDate')

        // query anime.title
        .applyJoinConditionally(
          !!mapResultSelect['title'] || !!romajiTitle,
          this.animeAlias,
          'title',
        )
        .addSelect(mapResultSelect['title'], 'title')

        // query anime.description
        .applyJoinConditionally(
          !!mapResultSelect['description'],
          this.animeAlias,
          'description',
        )
        .addSelect(mapResultSelect['description'], 'description')

        // query anime.trailer
        .applyJoinConditionally(
          !!mapResultSelect['trailer'],
          this.animeAlias,
          'trailer',
        )
        .addSelect(mapResultSelect['trailer'], 'trailer')

        // query anime.coverImage
        .applyJoinConditionally(
          !!mapResultSelect['coverImage'],
          this.animeAlias,
          'coverImage',
        )
        .addSelect(mapResultSelect['coverImage'], 'coverImage')

        // query anime.genres
        .applyJoinConditionally(
          !!mapResultSelect['genres'],
          this.animeAlias,
          'genres',
        )
        .addSelect(mapResultSelect['genres'], 'genres')

        // query anime.synonyms
        .applyJoinConditionally(
          !!mapResultSelect['synonyms'],
          this.animeAlias,
          'synonyms',
        )
        .addSelect(mapResultSelect['synonyms'], 'synonyms')

        // query anime.tags
        .applyJoinConditionally(
          !!mapResultSelect['tags'],
          this.animeAlias,
          'tags',
        )
        .addSelect(mapResultSelect['tags'], 'tags')

        // query anime.nextAiringEpisode
        .applyJoinConditionally(
          !!mapResultSelect['nextAiringEpisode'],
          this.animeAlias,
          'nextAiringEpisode',
        )
        .addSelect(mapResultSelect['nextAiringEpisode'], 'nextAiringEpisode')

        // query anime.mediaExternalLink
        .applyJoinConditionally(
          !!mapResultSelect['mediaExternalLink'],
          this.animeAlias,
          'mediaExternalLink',
        )
        .addSelect(
          mapResultSelect['mediaExternalLink'],
          'mediaExternalLink',
          false,
          ['animeStreamingEpisodes'],
        )

        // query anime.mediaExternalLink.animeStreamingEpisodes
        .applyJoinConditionally(
          !!mapResultSelect['mediaExternalLink']?.animeStreamingEpisodes,
          'mediaExternalLink',
          'animeStreamingEpisodes',
        )
        .addSelect(
          mapResultSelect['mediaExternalLink']?.animeStreamingEpisodes,
          'animeStreamingEpisodes',
          false,
          ['sources'],
        )

        // query anime.mediaExternalLink.animeStreamingEpisodes.sources
        .applyJoinConditionally(
          !!mapResultSelect['mediaExternalLink']?.animeStreamingEpisodes
            ?.sources,
          'animeStreamingEpisodes',
          'sources',
        )
        .addSelect(
          mapResultSelect['mediaExternalLink']?.animeStreamingEpisodes?.sources,
          'sources',
        )

        // query anime.rankings
        .applyJoinConditionally(
          !!mapResultSelect['rankings'],
          this.animeAlias,
          'rankings',
        )
        .addSelect(mapResultSelect['rankings'], 'rankings')

        // apply filters
        .applyWhereConditionally(this.animeAlias, 'id', id)
        .applyWhereConditionally(this.animeAlias, 'idMal', idMal)
        .applyWhereConditionally(this.animeAlias, 'idAnilist', idAnilist)
        .applyWhereConditionally(this.animeAlias, 'isAdult', isAdult)
        .applyWhereConditionally('title', 'romaji', romajiTitle)
        // Note: To reduce query complexity,
        // paginate and filter animeStreamingEpisodes will handle in other resolver
        .applyOrderByConditionally(
          !!mapResultSelect['mediaExternalLink']?.animeStreamingEpisodes,
          'animeStreamingEpisodes.epId',
          'DESC',
        )
        .getQueryBuilder()
    );
  }

  private createBuilderSelectAndWhereAnimeConnection(
    edgesNodeQueryBuilder: QueryBuilderChainer<AnimeConnection>,
    mapResultSelect: Record<string, any>,
    animeConnectionId: string,
  ) {
    const queryBuilder = edgesNodeQueryBuilder
      .addSelect(mapResultSelect, this.animeConnectionAlias, false, [
        'nodes',
        'edges',
      ])

      // nodes queries
      .applyJoinConditionally(
        !!mapResultSelect['nodes'],
        this.animeConnectionAlias,
        'nodes',
      )
      .addSelect(
        mapResultSelect['nodes'],
        'nodes',
        false,
        AnimeRepository.ignoreColumnsReferencesAnime,
      )

      // edges queries
      .applyJoinConditionally(
        !!mapResultSelect['edges'],
        this.animeConnectionAlias,
        'edges',
      )
      .addSelect(mapResultSelect['edges'], 'edges')

      // edges node queries:
      .applyJoinConditionally(!!mapResultSelect['edges']?.node, 'edges', 'node')
      .addSelect(
        mapResultSelect['edges']?.node,
        'node',
        false,
        AnimeRepository.ignoreColumnsReferencesAnime,
      );

    AnimeRepository.createBuilderSelectAnime(
      queryBuilder,
      'nodes',
      mapResultSelect['nodes'],
    );
    AnimeRepository.createBuilderSelectAnime(
      queryBuilder,
      'node',
      mapResultSelect['edges']?.node,
    );

    return queryBuilder
      .applyWhereConditionally(
        this.animeConnectionAlias,
        'id',
        animeConnectionId,
      )
      .getQueryBuilder();
  }

  private createQueryAnimeStreamingEpisodeSourceBuilder(
    mapResultSelect: MapResultSelect,
    queryStreamingEpisodeSourceArg: QueryStreamingEpisodeSourceArg,
  ) {
    const { id, animeStreamingEpisodeId } = queryStreamingEpisodeSourceArg;

    return new QueryBuilderChainer(this.animeStreamingEpisodeSourceBuilder)
      .addSelect(mapResultSelect, this.animeStreamingEpisodeSourceAlias, true)
      .applyWhereConditionally(this.animeStreamingEpisodeSourceAlias, 'id', id)
      .applyWhereConditionally(
        this.animeStreamingEpisodeSourceAlias,
        'animeStreamingEpisodeId',
        animeStreamingEpisodeId,
      )
      .getQueryBuilder();
  }
}
