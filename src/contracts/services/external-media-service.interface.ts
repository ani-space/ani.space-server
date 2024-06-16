export interface IExternalMediaService {
  handleSyncAllAnime(): Promise<void>;

  handleSyncAnimeStreamingEpisodes(
    page?: number,
    retryTimes?: number,
  ): Promise<void>;
}
