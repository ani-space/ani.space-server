import { Anime, AnimeEdge, AniSpaceLog } from '~/models';
import { MediaExternalLink } from '~/models/media-external-link.model';
import {
  AnimeConnection,
  AnimeCoverImage,
  AnimeDescription,
  AnimeSynonyms,
  AnimeTitle,
  AnimeTrailer,
} from '~/models/sub-models/anime-sub-models';
import { AnimeStreamingEpisodeFallBackUrl } from '~/models/sub-models/anime-sub-models/anime-streaming-episode-fallback-url.model';
import { AnimeStreamingEpisode } from '~/models/sub-models/anime-sub-models/anime-streaming-episode.model';
import { AnimeByFuzzySearch, IPaginateResult } from '../dtos';

export interface IAnimeService {
  //TODO: remove after test
  getMediaExternalLinkListFromLog(): Promise<AniSpaceLog[]>;

  //TODO: remove after test
  mutateMediaExternalLink(
    action: string,
    mid: string,
    actualLink?: string,
    idAnilist?: string,
    animePath?: string,
  ): Promise<void>;

  //TODO: remove after test
  getMediaExternalLinkList(): Promise<MediaExternalLink[]>;

  saveAnime(anime: Partial<Anime>): Promise<Anime | null>;

  createManyNewAnime(animeList: Partial<Anime>[]): Promise<Anime[] | null>;

  getMediaExternalLinkList(): Promise<MediaExternalLink[]>;

  saveAnimeStreamingEpisode(
    animeStreamingEpisode: Partial<AnimeStreamingEpisode>,
  ): Promise<(Partial<AnimeStreamingEpisode> & AnimeStreamingEpisode) | null>;

  saveAnimeStreamingEpisodeFallBackUrl(
    animeStreamingEpisodeFallBackUrl: Partial<AnimeStreamingEpisodeFallBackUrl>,
  ): Promise<
    | (Partial<AnimeStreamingEpisodeFallBackUrl> &
        AnimeStreamingEpisodeFallBackUrl)
    | null
  >;

  getMediaExternalLinkListV1(
    page?: number,
    limit?: number,
    site?: string,
  ): Promise<IPaginateResult<MediaExternalLink>>;

  fuzzySearchAnimeByTitle(
    title: string,
    saveNotFoundLog?: boolean,
  ): Promise<AnimeByFuzzySearch[]>;

  findMediaExternalLink(
    animePath: string,
    saveNotFoundLog?: boolean,
  ): Promise<MediaExternalLink | null>;

  saveMediaExternalLink(
    mediaExternalLink: Partial<MediaExternalLink>,
  ): Promise<(Partial<MediaExternalLink> & MediaExternalLink) | null>;

  findAnimeByIdAnilist(
    idAnilist: number,
    saveNotFoundLog?: boolean,
  ): Promise<Anime | null>;

  saveAnimeEdge(
    animeEdge: Partial<AnimeEdge>,
  ): Promise<(Partial<AnimeEdge> & AnimeEdge) | null>;

  getAnimeListV1(
    page?: number,
    limit?: number,
  ): Promise<IPaginateResult<Anime>>;

  saveAnimeConnection(
    animeConnection: Partial<AnimeConnection>,
  ): Promise<Partial<AnimeConnection> & AnimeConnection> | null;

  saveAnimeTitle(
    animeTitle: Partial<AnimeTitle>,
  ): Promise<(Partial<AnimeTitle> & AnimeTitle) | null>;

  saveManyAnimeEdge(
    animeEdgeList: Partial<AnimeEdge>[],
  ): Promise<(Partial<AnimeEdge> & AnimeEdge)[] | null>;

  saveAnimeSynonyms(
    animeSynonyms: Partial<AnimeSynonyms>,
  ): Promise<(Partial<AnimeSynonyms> & AnimeSynonyms) | null>;

  saveAnimeCoverImage(
    animeCoverImage: Partial<AnimeCoverImage>,
  ): Promise<(Partial<AnimeCoverImage> & AnimeCoverImage) | null>;

  saveAnimeTrailer(
    animeTrailer: Partial<AnimeTrailer>,
  ): Promise<(Partial<AnimeTrailer> & AnimeTrailer) | null>;

  saveAnimeDesc(
    animeDesc: Partial<AnimeDescription>,
  ): Promise<(Partial<AnimeDescription> & AnimeDescription) | null>;
}

export const IAnimeService = Symbol('IAnimeService');
