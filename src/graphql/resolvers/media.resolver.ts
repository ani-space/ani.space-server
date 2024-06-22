import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject } from '@nestjs/common';
import { Args, Info, Query, Resolver } from '@nestjs/graphql';
import { AnimeDto } from '~/common/dtos/anime-dtos/anime.dto';
import {
  IAnimeExternalService,
  IAnimeInternalService,
} from '~/contracts/services';
import { Anime } from '~/models';
import { MapResultSelect } from '~/utils/tools/object';
import { BuilderSelectAnimePipe } from '../../common/pipes/builder-select-anime.pipe';
import { QueryAnimeArg } from '../types/args/query-anime.arg';
import { AnimeResultUnion } from '../types/dtos/anime-response/anime.response';
import { AnimeActions } from '../types/enums/actions.enum';

@Resolver()
export class MediaResolver {
  constructor(
    @Inject(IAnimeInternalService)
    private readonly animeService: IAnimeExternalService,

    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Query(() => [AnimeResultUnion], { name: AnimeActions.Anime })
  public async getAnimeInfo(
    @Info(BuilderSelectAnimePipe) mapResultSelect: MapResultSelect,
    @Args() queryAnimeArg: QueryAnimeArg,
  ) {
    const result = await this.animeService.getAnimeByConditions(
      mapResultSelect,
      queryAnimeArg,
    );

    if (result.isError()) {
      return [result.value];
    }

    return [this.mapper.map(result.value, Anime, AnimeDto)];
  }
}
