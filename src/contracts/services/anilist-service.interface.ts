import { Anime } from '~/models';

export interface IAnilistService {
  handleSaveAnimeCharacterConnectionType(
    page: number | undefined,
    chapterNumber: number | undefined,
    anime: Anime,
  ): Promise<void>;

  handleSaveAnimeBasicInfo(page?: number): Promise<void>;

  handleSaveCharactersInfo(page?: number): Promise<void>;

  handleSaveStaffsInfo(page?: number): Promise<void>;
}

export const IAnilistService = Symbol('IAnilistService');
