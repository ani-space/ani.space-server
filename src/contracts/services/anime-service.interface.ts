import { QueryAnimeArg } from '~/graphql/types/args/query-anime.arg';
import { Anime, AnimeEdge } from '~/models';
import { MediaExternalLink } from '~/models/media-external-link.model';
import {
  AnimeConnection,
  AnimeCoverImage,
  AnimeDescription,
  AnimeSynonyms,
  AnimeTitle,
  AnimeTrailer,
} from '~/models/sub-models/anime-sub-models';
import { AnimeStreamingEpisodeSource } from '~/models/sub-models/anime-sub-models/anime-streaming-episode-sources.model';
import { AnimeStreamingEpisode } from '~/models/sub-models/anime-sub-models/anime-streaming-episode.model';
import { MapResultSelect } from '../../utils/tools/object';
import { AnimeByFuzzySearch, IPaginateResult } from '../dtos';
import { Either } from '~/utils/tools/either';
import { NotFoundAnimeError } from '~/graphql/types/dtos/anime-response/not-found-anime.error';

// These services will be exposed and utilized by the GraphQL client
export interface IAnimeExternalService {
  getAnimeByConditions(
    filterCondition: MapResultSelect,
    queryAnimeArg: QueryAnimeArg,
  ): Promise<Either<NotFoundAnimeError, Anime>>;
}

export const IAnimeExternalService = Symbol('IAnimeExternalService');

// These services will be encapsulated and used internally within the system
export interface IAnimeInternalService {
  getAnimeStreamingEpisodePageV1(
    page?: number,
    limit?: number,
  ): Promise<IPaginateResult<AnimeStreamingEpisode>>;

  saveManyAnimeStreamingEpisodeSource(
    animeStreamingEpisodeSources: Array<Partial<AnimeStreamingEpisodeSource>>,
  ): Promise<
    | (Partial<AnimeStreamingEpisodeSource> & AnimeStreamingEpisodeSource)[]
    | null
  >;

  saveAnimeStreamingEpisodeSource(
    animeStreamingEpisodeSource: Partial<AnimeStreamingEpisodeSource>,
  ): Promise<
    (Partial<AnimeStreamingEpisodeSource> & AnimeStreamingEpisodeSource) | null
  >;

  saveAnime(anime: Partial<Anime>): Promise<Anime | null>;

  createManyNewAnime(animeList: Partial<Anime>[]): Promise<Anime[] | null>;

  saveAnimeStreamingEpisode(
    animeStreamingEpisode: Partial<AnimeStreamingEpisode>,
  ): Promise<(Partial<AnimeStreamingEpisode> & AnimeStreamingEpisode) | null>;

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

export const IAnimeInternalService = Symbol('IAnimeInternalService');
