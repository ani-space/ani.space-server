import { Injectable } from '@nestjs/common';
import { Studio } from '~/models/studio.model';
import { BaseRepository } from './base.repository';
import { IStudioRepository } from '~/contracts/repositories';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { MapResultSelect } from '~/utils/tools/object';
import { QueryStudioArg } from '~/graphql/types/args/query-studio.arg';
import { QueryBuilderChainer } from './libs/query-builder-chainer';

@Injectable()
export class StudioRepository
  extends BaseRepository<Studio>
  implements IStudioRepository
{
  constructor(
    @InjectRepository(Studio)
    private readonly studioRepository: Repository<Studio>,

    private dataSource: DataSource,
  ) {
    super(studioRepository);
  }

  get studioAlias() {
    return 'Studio';
  }

  get studioQueryBuilder() {
    return this.dataSource
      .getRepository(Studio)
      .createQueryBuilder(this.studioAlias);
  }

  public async getStudioByConditions(
    mapResultSelectParam: MapResultSelect,
    queryAnimeArg: QueryStudioArg,
  ) {
    const mapResultSelect = mapResultSelectParam as Record<string, any>;

    const queryBuilder = this.createQueryStudioByConditionsBuilder(
      mapResultSelect,
      queryAnimeArg,
    );

    const studio = await queryBuilder.getOne();

    return studio;
  }

  private createQueryStudioByConditionsBuilder(
    mapResultSelect: Record<string, any>,
    queryAnimeArg: QueryStudioArg,
  ) {
    const { id, idAnilist, isAnimationStudio, name } = queryAnimeArg;

    return (
      new QueryBuilderChainer(this.studioQueryBuilder)
        // query studio scalar fields
        .addSelect(mapResultSelect, this.studioAlias, true)

        // query studio.anime
        .applyJoinConditionally(
          !!mapResultSelect['anime'],
          this.studioAlias,
          'anime',
        )
        .addSelect(mapResultSelect['anime'], 'anime', false, ['nodes', 'edges'])

        // where filters
        .applyWhereConditionally(this.studioAlias, 'id', id)
        .applyWhereConditionally(this.studioAlias, 'idAnilist', idAnilist)
        .applyWhereConditionally(
          this.studioAlias,
          'isAnimationStudio',
          isAnimationStudio,
        )
        .applyWhereConditionally(this.studioAlias, 'name', name)

        .getQueryBuilder()
    );
  }
}
