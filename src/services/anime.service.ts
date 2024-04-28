import { Inject, Injectable } from '@nestjs/common';
import { IAnimeRepository } from '~/contracts/repositories';
import { IAnimeService } from '~/contracts/services';

@Injectable()
export class AnimeService implements IAnimeService {
  constructor(
    @Inject(IAnimeRepository) private readonly animeRepo: IAnimeRepository,
  ) {}

  public async createNewAnime() {
    // await this.animeRepo.save({
    //     title: {

    //     }
    // });
  }
}
