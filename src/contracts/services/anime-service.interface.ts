import { Anime } from '~/models';
import { IPaginateResult } from '../dtos';
import {
  AnimeCoverImage,
  AnimeDescription,
  AnimeSynonyms,
  AnimeTitle,
  AnimeTrailer,
} from '~/models/sub-models/anime-sub-models';

export interface IAnimeService {
  saveAnime(anime: Partial<Anime>): Promise<Anime | null>;

  createManyNewAnime(animeList: Partial<Anime>[]): Promise<Anime[] | null>;

  findAnimeByIdAnilist(
    idAnilist: number,
    saveNotFoundLog?: boolean,
  ): Promise<Anime | null>;

  getAnimeListV1(
    page?: number,
    limit?: number,
  ): Promise<IPaginateResult<Anime>>;

  saveAnimeTitle(
    animeTitle: Partial<AnimeTitle>,
  ): Promise<(Partial<AnimeTitle> & AnimeTitle) | null>;

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
