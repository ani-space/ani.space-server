import { AnimeTag } from '~/models/sub-models/anime-sub-models';

export interface IAnimeTagService {
  findOrCreateAnimeTag(tagParam: Partial<AnimeTag>): Promise<AnimeTag>;
}

export const IAnimeTagService = Symbol('IAnimeTagService');
