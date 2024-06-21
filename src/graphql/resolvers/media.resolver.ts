import { Inject } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { AnimeDto } from '~/common/dtos/anime-dtos/anime.dto';
import { IAnimeService } from '~/contracts/services';
import { AnimeActions } from '../types/enums/actions.enum';

@Resolver()
export class MediaResolver {
  constructor(
    @Inject(IAnimeService) private readonly animeService: IAnimeService,
  ) {}

  @Query(() => AnimeDto, { name: AnimeActions.Anime })
  public async getAnimeInfo() {
    return { id: 'test' } as AnimeDto;
  }
}
