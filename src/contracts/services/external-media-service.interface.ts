export interface IExternalMediaService {
  searchAnime(): Promise<void>;

  handleSyncAllAnime(): Promise<void>;

  handleSyncAnimeStreamingEpisodes(
    page?: number,
    retryTimes?: number,
  ): Promise<void>;
}
