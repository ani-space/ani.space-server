import { Anime } from '~/models';
import { IBaseRepository } from './base-repository.interface';

export interface IAnimeRepository extends IBaseRepository<Anime> {
  fuzzySearchAnimeByTitle(title: string): Promise<Array<any>>;
}

export const IAnimeRepository = Symbol('IAnimeRepository');
