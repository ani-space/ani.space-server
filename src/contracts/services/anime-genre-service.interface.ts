import { AnimeGenres } from '~/models/sub-models/anime-sub-models';

export interface IAnimeGenreService {
  findOrCreateAnimeGenre(
    genreParam: Partial<AnimeGenres>,
  ): Promise<AnimeGenres>;
}

export const IAnimeGenreService = Symbol('IAnimeGenreService');
