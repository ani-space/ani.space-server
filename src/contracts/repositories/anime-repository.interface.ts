import { Anime } from '~/models';
import { IBaseRepository } from './base-repository.interface';
import { MapResultSelect } from '~/utils/tools/object';
import { QueryAnimeArg } from '~/graphql/types/args/query-anime.arg';
import { AnimeConnection } from '~/models/sub-models/anime-sub-models';
import { QueryAnimeConnectionArg } from '~/graphql/types/args/query-anime-connection.arg';

export interface IAnimeRepository extends IBaseRepository<Anime> {
  fuzzySearchAnimeByTitle(title: string): Promise<Array<any>>;

  getAnimeByConditions(
    mapResultSelect: MapResultSelect,
    queryAnimeArg: QueryAnimeArg,
  ): Promise<Anime | null>;

  getEdgesOrNodes(
    animeConnectionId: string,
    mapResultSelectParam: MapResultSelect,
    queryAnimeConnectionArg?: QueryAnimeConnectionArg,
  ): Promise<AnimeConnection | null>;
}

export const IAnimeRepository = Symbol('IAnimeRepository');
