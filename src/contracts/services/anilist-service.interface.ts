export interface IAnilistService {
  handleSaveAnimeObjectsType(page?: number): Promise<void>;

  handleSaveAnimeBasicInfo(page?: number): Promise<void>;
}

export const IAnilistService = Symbol('IAnilistService');
