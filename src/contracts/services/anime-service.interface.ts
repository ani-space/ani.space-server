import { Anime } from '~/models';

export interface IAnimeService {
  createNewAnime(anime: Partial<Anime>): Promise<Anime | null>;

  createManyNewAnime(animeList: Partial<Anime>[]): Promise<Anime[] | null>;
}

export const IAnimeService = Symbol('IAnimeService');
