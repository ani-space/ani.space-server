import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ObjectLiteral, Repository } from 'typeorm';
import { IAnimeRepository } from '~/contracts/repositories';
import { QueryAnimeArg } from '~/graphql/types/args/query-anime.arg';
import { Anime } from '~/models';
import { AnimeConnection } from '~/models/sub-models/anime-sub-models';
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

  readonly ignoreColumnsReferencesAnime = [
    'genres',
    'rankings',
    'synonyms',
    'tags',
    'mediaExternalLink',
    'animeStreamingEpisodes',
  ];

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

  get animeConnectionBuilder() {
    return this.dataSource
      .getRepository(AnimeConnection)
      .createQueryBuilder(this.animeConnectionAlias);
  }

  public async getEdgesOrNodes(
    animeConnectionId: string,
    mapResultSelectParam: MapResultSelect,
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
          this.ignoreColumnsReferencesAnime,
        )
        .applyJoinConditionally(
          !!mapResultSelect['relations'],
          this.animeAlias,
          'relations',
          true,
        )
        .applyJoinConditionally(
          !!mapResultSelect['characters'],
          this.animeAlias,
          'characters',
          true,
        )
        .applyJoinConditionally(
          !!mapResultSelect['startDate'],
          this.animeAlias,
          'startDate',
        )
        .addSelect(mapResultSelect['startDate'], 'startDate')
        .applyJoinConditionally(
          !!mapResultSelect['endDate'],
          this.animeAlias,
          'endDate',
        )
        .addSelect(mapResultSelect['endDate'], 'endDate')
        .applyJoinConditionally(
          !!mapResultSelect['title'] || !!romajiTitle,
          this.animeAlias,
          'title',
        )
        .addSelect(mapResultSelect['title'], 'title')
        .applyJoinConditionally(
          !!mapResultSelect['description'],
          this.animeAlias,
          'description',
        )
        .addSelect(mapResultSelect['description'], 'description')
        .applyJoinConditionally(
          !!mapResultSelect['trailer'],
          this.animeAlias,
          'trailer',
        )
        .addSelect(mapResultSelect['trailer'], 'trailer')
        .applyJoinConditionally(
          !!mapResultSelect['coverImage'],
          this.animeAlias,
          'coverImage',
        )
        .addSelect(mapResultSelect['coverImage'], 'coverImage')
        .applyJoinConditionally(
          !!mapResultSelect['genres'],
          this.animeAlias,
          'genres',
        )
        .addSelect(mapResultSelect['genres'], 'genres')
        .applyJoinConditionally(
          !!mapResultSelect['synonyms'],
          this.animeAlias,
          'synonyms',
        )
        .addSelect(mapResultSelect['synonyms'], 'synonyms')
        .applyJoinConditionally(
          !!mapResultSelect['tags'],
          this.animeAlias,
          'tags',
        )
        .addSelect(mapResultSelect['tags'], 'tags')
        .applyJoinConditionally(
          !!mapResultSelect['nextAiringEpisode'],
          this.animeAlias,
          'nextAiringEpisode',
        )
        .addSelect(mapResultSelect['nextAiringEpisode'], 'nextAiringEpisode')
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
        .addSelect(mapResultSelect['rankings'], 'rankings')
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
          !!mapResultSelect['mediaExternalLink']?.animeStreamingEpisodes
            ?.sources,
          'animeStreamingEpisodes',
          'sources',
        )
        .addSelect(
          mapResultSelect['mediaExternalLink']?.animeStreamingEpisodes?.sources,
          'sources',
        )
        .applyJoinConditionally(
          !!mapResultSelect['rankings'],
          this.animeAlias,
          'rankings',
        )
        .addSelect(mapResultSelect['rankings'], 'rankings')
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
        this.ignoreColumnsReferencesAnime,
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
        this.ignoreColumnsReferencesAnime,
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
}
