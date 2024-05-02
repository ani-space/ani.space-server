import { Anime } from '~/models';

export interface IAnilistService {
  handleSaveAnimeCharacterConnectionType(
    page: number | undefined,
    chapterNumber: number | undefined,
    anime: Anime,
  ): Promise<void>;

  handleSaveAnimeBasicInfo(page?: number): Promise<void>;
}

export const IAnilistService = Symbol('IAnilistService');
