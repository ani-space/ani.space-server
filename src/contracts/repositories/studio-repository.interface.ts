import { Studio } from '~/models/studio.model';
import { IBaseRepository } from './base-repository.interface';
import { MapResultSelect } from '~/utils/tools/object';
import { QueryStudioArg } from '~/graphql/types/args/query-studio.arg';

export interface IStudioRepository extends IBaseRepository<Studio> {
  getStudioByConditions(
    mapResultSelectParam: MapResultSelect,
    queryAnimeArg: QueryStudioArg,
  ): Promise<Studio | null>;
}

export const IStudioRepository = Symbol('IStudioRepository ');
