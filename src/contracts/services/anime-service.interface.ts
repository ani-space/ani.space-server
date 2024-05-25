import { Anime, AnimeEdge, AniSpaceLog } from '~/models';
import { AnimeByFuzzySearch, IPaginateResult } from '../dtos';
import {
  AnimeConnection,
  AnimeCoverImage,
  AnimeDescription,
  AnimeSynonyms,
  AnimeTitle,
  AnimeTrailer,
} from '~/models/sub-models/anime-sub-models';
import { MediaExternalLink } from '~/models/media-external-link.model';

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
