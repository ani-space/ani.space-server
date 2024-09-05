import {
  Args,
  Info,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { StudioDto } from '~/common/dtos/studio-dtos/studio.dto';
import { StudioResultUnion } from '../types/dtos/studio/studio.response';
import { StudioActions } from '../types/enums/actions.enum';
import { BuilderSelectStudioPipe } from '~/common/pipes/builder-select-studio.pipe';
import { MapResultSelect } from '~/utils/tools/object';
import { QueryStudioArg } from '../types/args/query-studio.arg';
import { Inject } from '@nestjs/common';
import {
  IAnimeExternalService,
  IStudioExternalService,
} from '~/contracts/services';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Studio } from '~/models/studio.model';
import { nameof } from 'ts-simple-nameof';
import { AnimeConnectionDto } from '~/common/dtos/anime-dtos/anime-connection.dto';
import { QueryAnimeConnectionArg } from '../types/args/query-anime-connection.arg';
import { AnimeConnection } from '~/models/sub-models/anime-sub-models';

@Resolver(() => StudioDto)
export class StudioResolver {
  constructor(
    @Inject(IStudioExternalService)
    private readonly studioExternalService: IStudioExternalService,

    @Inject(IAnimeExternalService)
    private readonly animeService: IAnimeExternalService,

    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Query(() => [StudioResultUnion], { name: StudioActions.Studio })
  public async getStudioInfo(
    @Info(BuilderSelectStudioPipe) mapResultSelect: MapResultSelect,
    @Args() queryAnimeArg: QueryStudioArg,
  ) {
    const result = await this.studioExternalService.getStudioByConditions(
      mapResultSelect,
      queryAnimeArg,
    );

    if (result.isError()) {
      return [result.value];
    }

    return [this.mapper.map(result.value, Studio, StudioDto)];
  }

  @ResolveField(
    nameof<Studio>((s) => s.anime),
    (returns) => AnimeConnectionDto,
    { nullable: true },
  )
  public async getAnimeByCharacter(
    @Parent() studioDto: StudioDto,
    @Args() queryAnimeConnectionArg: QueryAnimeConnectionArg,
    @Info(BuilderSelectStudioPipe) mapResultSelect: MapResultSelect,
  ) {
    if (!studioDto?.anime?.id) return null;

    const animeConnection = await this.animeService.getAnimeConnectionPage(
      studioDto?.anime?.id,
      mapResultSelect,
      queryAnimeConnectionArg,
    );

    if (!animeConnection) return null;

    return this.mapper.map(
      animeConnection,
      AnimeConnection,
      AnimeConnectionDto,
    );
  }
}
