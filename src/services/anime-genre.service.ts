import { Inject, Injectable } from '@nestjs/common';
import { IAnimeGenreRepository } from '~/contracts/repositories';
import { IAnimeGenreService } from '~/contracts/services';
import { AnimeGenres } from '~/models/sub-models/anime-sub-models';

@Injectable()
export class AnimeGenreService implements IAnimeGenreService {
  constructor(
    @Inject(IAnimeGenreRepository)
    private readonly animeGenreRepo: IAnimeGenreRepository,
  ) {}

  public async findOrCreateAnimeGenre(
    genreParam: Partial<AnimeGenres>,
  ): Promise<AnimeGenres> {
    const animeGenre = await this.animeGenreRepo.findByCondition({
      where: { genre: genreParam.genre },
    });

    if (animeGenre) {
      return animeGenre;
    }

    return await this.animeGenreRepo.save(genreParam);
  }
}
