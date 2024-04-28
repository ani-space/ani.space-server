import { Inject, Injectable } from '@nestjs/common';
import { IAnimeGenreRepository } from '~/contracts/repositories';
import { IAnimeGenreService } from '~/contracts/services';

@Injectable()
export class AnimeGenreService implements IAnimeGenreService {
  constructor(
    @Inject(IAnimeGenreRepository)
    private readonly animeGenreRepo: IAnimeGenreRepository,
  ) {}
}
