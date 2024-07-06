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
import { AnimeConnectionDto } from '~/common/dtos/anime-dtos/anime-connection.dto';
import { AnimeDto } from '~/common/dtos/anime-dtos/anime.dto';
import { StaffConnectionDto } from '~/common/dtos/staff-dtos/staff-connection.dto';
import {
  IAnimeExternalService,
  ICharacterExternalService,
  IStaffExternalService,
} from '~/contracts/services';
import { Anime } from '~/models';
import { AnimeConnection } from '~/models/sub-models/anime-sub-models';
import { CharacterConnection } from '~/models/sub-models/character-sub-models';
import { StaffConnection } from '~/models/sub-models/staff-sub-models/staff-connection.model';
import { MapResultSelect } from '~/utils/tools/object';
import { CharacterConnectionDto } from '../../common/dtos/character-dtos/character-connection.dto';
import { BuilderSelectAnimePipe } from '../../common/pipes/builder-select-anime.pipe';
import { QueryAnimeConnectionArg } from '../types/args/query-anime-connection.arg';
import { QueryAnimeArg } from '../types/args/query-anime.arg';
import { QueryCharacterConnectionArg } from '../types/args/query-character-connection.arg';
import { QueryStaffConnectionArg } from '../types/args/query-staff-connection.arg';
import { AnimeResultUnion } from '../types/dtos/anime-response/anime.response';
import { AnimeActions } from '../types/enums/actions.enum';

@Resolver(() => AnimeDto)
export class MediaResolver {
  constructor(
    @Inject(IAnimeExternalService)
    private readonly animeService: IAnimeExternalService,

    @Inject(ICharacterExternalService)
    private readonly characterService: ICharacterExternalService,

    @Inject(IStaffExternalService)
    private readonly staffService: IStaffExternalService,

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
    { nullable: true },
  )
  public async getCharactersByAnime(
    @Parent() animeDto: AnimeDto,
    @Args() queryCharacterConnectionArg: QueryCharacterConnectionArg,
    @Info(BuilderSelectAnimePipe) mapResultSelect: MapResultSelect,
  ) {
    if (!animeDto?.characters?.id) return null;

    const result = await this.characterService.getCharacterConnectionPage(
      animeDto.characters.id,
      queryCharacterConnectionArg,
      mapResultSelect,
    );

    if (!result) return null;

    return this.mapper.map(result, CharacterConnection, CharacterConnectionDto);
  }

  @ResolveField(
    nameof<AnimeDto>((a) => a.relations),
    (returns) => AnimeConnectionDto,
    { nullable: true },
  )
  public async getAnimeRelationsByAnime(
    @Parent() animeDto: AnimeDto,
    @Args() queryAnimeConnectionArg: QueryAnimeConnectionArg,
    @Info(BuilderSelectAnimePipe) mapResultSelect: MapResultSelect,
  ) {
    if (!animeDto?.relations?.id) return null;

    const animeConnection = await this.animeService.getAnimeConnectionPage(
      animeDto?.relations?.id,
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

  @ResolveField(
    nameof<AnimeDto>((a) => a.staff),
    (returns) => StaffConnectionDto,
    { nullable: true },
  )
  public async getStaffByAnime(
    @Parent() animeDto: AnimeDto,
    @Args() queryStaffConnectionArg: QueryStaffConnectionArg,
    @Info(BuilderSelectAnimePipe) mapResultSelect: MapResultSelect,
  ) {
    if (!animeDto?.staff?.id) return null;

    // get staff connection
    const staffConnection = await this.staffService.getStaffConnectionPage(
      animeDto?.staff?.id,
      queryStaffConnectionArg,
      mapResultSelect,
    );

    // check null
    if (!staffConnection) return null;

    // map dto
    return this.mapper.map(
      staffConnection,
      StaffConnection,
      StaffConnectionDto,
    );
  }
}
