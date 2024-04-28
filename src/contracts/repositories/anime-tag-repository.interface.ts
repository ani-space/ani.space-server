import { AnimeTag } from '~/models/sub-models/anime-sub-models';
import { IBaseRepository } from './base-repository.interface';

export interface IAnimeTagRepository extends IBaseRepository<AnimeTag> {}

export const IAnimeTagRepository = Symbol('IAnimeTagRepository');
