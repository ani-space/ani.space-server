import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject } from '@nestjs/common';
import {
  Args,
  Info,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { nameof } from 'ts-simple-nameof';
import { AnimeDto } from '~/common/dtos/anime-dtos/anime.dto';
import {
  IAnimeExternalService,
  ICharacterExternalService,
} from '~/contracts/services';
import { Anime } from '~/models';
import { CharacterConnection } from '~/models/sub-models/character-sub-models';
import { MapResultSelect } from '~/utils/tools/object';
import { CharacterConnectionDto } from '../../common/dtos/character-dtos/character-connection.dto';
import { BuilderSelectAnimePipe } from '../../common/pipes/builder-select-anime.pipe';
import { QueryAnimeArg } from '../types/args/query-anime.arg';
import { QueryCharacterConnectionArg } from '../types/args/query-character-connection.arg';
import { AnimeResultUnion } from '../types/dtos/anime-response/anime.response';
import { AnimeActions } from '../types/enums/actions.enum';
import { AnimeConnectionDto } from '~/common/dtos/anime-dtos/anime-connection.dto';
import { AnimeConnection } from '~/models/sub-models/anime-sub-models';

@Resolver(() => AnimeDto)
export class MediaResolver {
  constructor(
    @Inject(IAnimeExternalService)
    private readonly animeService: IAnimeExternalService,

    @Inject(ICharacterExternalService)
    private readonly characterService: ICharacterExternalService,

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

  @ResolveField(
    nameof<AnimeDto>((a) => a.characters),
    (returns) => CharacterConnectionDto,
  )
  public async getCharactersByAnime(
    @Parent() animeDto: AnimeDto,
    @Args() queryCharacterConnectionArg: QueryCharacterConnectionArg,
    @Info(BuilderSelectAnimePipe) mapResultSelect: MapResultSelect,
  ) {
    const result = await this.characterService.getCharacterConnectionPage(
      animeDto.characters?.id ?? '',
      queryCharacterConnectionArg,
      mapResultSelect,
    );

    if (!result) return null;

    return this.mapper.map(result, CharacterConnection, CharacterConnectionDto);
  }

  @ResolveField(
    nameof<AnimeDto>((a) => a.relations),
    (returns) => AnimeConnectionDto,
  )
  public async getAnimeRelationsByAnime(
    @Parent() animeDto: AnimeDto,
    @Info(BuilderSelectAnimePipe) mapResultSelect: MapResultSelect,
  ) {
    const animeConnection = await this.animeService.getAnimeConnectionPage(
      animeDto?.relations?.id ?? '',
      mapResultSelect,
    );

    return this.mapper.map(
      animeConnection,
      AnimeConnection,
      AnimeConnectionDto,
    );
  }
}
