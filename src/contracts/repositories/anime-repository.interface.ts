import { Anime } from '~/models';
import { IBaseRepository } from './base-repository.interface';
import { MapResultSelect } from '~/utils/tools/object';
import { QueryAnimeArg } from '~/graphql/types/args/query-anime.arg';
import { AnimeConnection } from '~/models/sub-models/anime-sub-models';

export interface IAnimeRepository extends IBaseRepository<Anime> {
  fuzzySearchAnimeByTitle(title: string): Promise<Array<any>>;

  getAnimeByConditions(
    mapResultSelect: MapResultSelect,
    queryAnimeArg: QueryAnimeArg,
  ): Promise<Anime | null>;

  getEdgesOrNodes(
    animeConnectionId: string,
    mapResultSelectParam: MapResultSelect,
  ): Promise<AnimeConnection | null>;
}

export const IAnimeRepository = Symbol('IAnimeRepository');
