import { QueryAnimeConnectionArg } from '~/graphql/types/args/query-anime-connection.arg';
import { QueryStreamingEpisodeSourceArg } from '~/graphql/types/args/query-anime-streaming-episode.arg';
import { QueryAnimeArg } from '~/graphql/types/args/query-anime.arg';
import { Anime } from '~/models';
import { AnimeConnection } from '~/models/sub-models/anime-sub-models';
import { AnimeStreamingEpisodeSource } from '~/models/sub-models/anime-sub-models/anime-streaming-episode-sources.model';
import { MapResultSelect } from '~/utils/tools/object';
import { IBaseRepository } from './base-repository.interface';
import { QueryAnimePageArg } from '~/graphql/types/args/query-anime-page.arg';

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

  getAnimeStreamingEpisodeSources(
    queryStreamingEpisodeSourceArg: QueryStreamingEpisodeSourceArg,
    mapResultSelectParam: MapResultSelect,
  ): Promise<AnimeStreamingEpisodeSource[]>;

  getAnimeList(
    queryAnimePageArg: QueryAnimePageArg,
    mapResultSelectParam: MapResultSelect,
  ): Promise<{
    animeList: Anime[];
    count: number;
  }>;
}

export const IAnimeRepository = Symbol('IAnimeRepository');
