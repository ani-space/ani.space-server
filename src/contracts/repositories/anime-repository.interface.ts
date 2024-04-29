import { Anime } from '~/models';
import { IBaseRepository } from './base-repository.interface';

export interface IAnimeRepository extends IBaseRepository<Anime> {}

export const IAnimeRepository = Symbol('IAnimeRepository');
