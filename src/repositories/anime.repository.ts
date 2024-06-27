import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { Anime } from '~/models';
import { IAnimeRepository } from '~/contracts/repositories';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { MapResultSelect } from '../utils/tools/object';
import { QueryAnimeArg } from '~/graphql/types/args/query-anime.arg';
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

  get animeAlias() {
    return 'Anime';
  }

  get animeBuilder() {
    return this.dataSource
      .getRepository(Anime)
      .createQueryBuilder(this.animeAlias);
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

    const queryBuilder = this.createBuilderSelectAnime(
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

  private createBuilderSelectAnime(
    mapResultSelect: Record<string, any>,
    romajiTitle: string | undefined,
    id: string | undefined,
    idMal: number | undefined,
    idAnilist: number,
    isAdult: boolean | undefined,
  ) {
    return new QueryBuilderChainer(this.animeBuilder)
      .addSelect(mapResultSelect, this.animeAlias, true, [
        'genres',
        'rankings',
        'synonyms',
        'tags',
      ])
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
      .addSelect(mapResultSelect['mediaExternalLink'], 'mediaExternalLink')
      .applyJoinConditionally(
        !!mapResultSelect['rankings'],
        this.animeAlias,
        'rankings',
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
      )
      .applyWhereConditionally(this.animeAlias, 'id', id)
      .applyWhereConditionally(this.animeAlias, 'idMal', idMal)
      .applyWhereConditionally(this.animeAlias, 'idAnilist', idAnilist)
      .applyWhereConditionally(this.animeAlias, 'isAdult', isAdult)
      .applyWhereConditionally('title', 'romaji', romajiTitle)
      .getQueryBuilder();
  }
}
