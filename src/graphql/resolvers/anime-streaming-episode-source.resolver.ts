import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject } from '@nestjs/common';
import { Args, Info, Query, Resolver } from '@nestjs/graphql';
import { AnimeStreamingEpisodeSourceDto } from '~/common/dtos/anime-dtos/anime-streaming-episode-sources.dto';
import { BuilderSelectAnimePipe } from '~/common/pipes/builder-select-anime.pipe';
import { IAnimeExternalService } from '~/contracts/services';
import { AnimeStreamingEpisodeSource } from '~/models/sub-models/anime-sub-models/anime-streaming-episode-sources.model';
import { MapResultSelect } from '~/utils/tools/object';
import { QueryStreamingEpisodeSourceArg } from '../types/args/query-anime-streaming-episode.arg';
import { AnimeStreamingEpisodeActions } from '../types/enums/actions.enum';

@Resolver(() => AnimeStreamingEpisodeSourceDto)
export class AnimeStreamingEpisodeSourceResolver {
  constructor(
    @Inject(IAnimeExternalService)
    private readonly animeService: IAnimeExternalService,

    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Query(() => [AnimeStreamingEpisodeSourceDto], {
    name: AnimeStreamingEpisodeActions.AnimeStreamingSource,
  })
  public async getAnimeStreamingEpisodeSources(
    @Args() queryStreamingEpisodeSourceArg: QueryStreamingEpisodeSourceArg,
    @Info(BuilderSelectAnimePipe) mapResultSelect: MapResultSelect,
  ) {
    const result = await this.animeService.getAnimeStreamingEpisodeSources(
      queryStreamingEpisodeSourceArg,
      mapResultSelect,
    );

    return this.mapper.mapArray(
      result,
      AnimeStreamingEpisodeSource,
      AnimeStreamingEpisodeSourceDto,
    );
  }
}
