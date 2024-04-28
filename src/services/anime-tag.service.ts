import { Injectable, Inject } from '@nestjs/common';
import { IAnimeTagRepository } from '~/contracts/repositories';
import { IAnimeTagService } from '~/contracts/services';

@Injectable()
export class AnimeTagService implements IAnimeTagService {
  constructor(
    @Inject(IAnimeTagRepository)
    private readonly animeTagRepo: IAnimeTagRepository,
  ) {}
}
