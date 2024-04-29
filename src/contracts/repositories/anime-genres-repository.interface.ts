import { AnimeGenres } from '~/models/sub-models/anime-sub-models';
import { IBaseRepository } from './base-repository.interface';

export interface IAnimeGenreRepository extends IBaseRepository<AnimeGenres> {}

export const IAnimeGenreRepository = Symbol('IAnimeGenreRepository');
