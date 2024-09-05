import { Inject } from '@nestjs/common';
import {
  Args,
  Info,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { StaffDto } from '~/common/dtos/staff-dtos/staff.dto';
import { StaffResultUnion } from '../types/dtos/staff/staff.response';
import { StaffActions } from '../types/enums/actions.enum';
import { BuilderSelectStaffPipe } from '~/common/pipes/builder-select-staff.pipe';
import { MapResultSelect } from '~/utils/tools/object';
import { QueryStaffArg } from '../types/args/query-staff.arg';
import {
  IAnimeExternalService,
  ICharacterExternalService,
  IStaffExternalService,
} from '~/contracts/services';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Staff } from '~/models';
import { nameof } from 'ts-simple-nameof';
import { CharacterConnection } from '~/models/sub-models/character-sub-models';
import { CharacterConnectionDto } from '~/common/dtos/character-dtos/character-connection.dto';
import { QueryCharacterConnectionArg } from '../types/args/query-character-connection.arg';
import { QueryAnimeConnectionArg } from '../types/args/query-anime-connection.arg';
import { AnimeConnectionDto } from '~/common/dtos/anime-dtos/anime-connection.dto';
import { AnimeConnection } from '~/models/sub-models/anime-sub-models';

@Resolver(() => StaffDto)
export class StaffResolver {
  constructor(
    @Inject(IStaffExternalService)
    private readonly staffService: IStaffExternalService,

    @Inject(ICharacterExternalService)
    private readonly characterService: ICharacterExternalService,

    @Inject(IAnimeExternalService)
    private readonly animeService: IAnimeExternalService,

    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Query(() => [StaffResultUnion], { name: StaffActions.Staff })
  public async getStaffInfo(
    @Info(BuilderSelectStaffPipe) mapResultSelect: MapResultSelect,
    @Args() queryStaffArg: QueryStaffArg,
  ) {
    const result = await this.staffService.getStaffByConditions(
      mapResultSelect,
      queryStaffArg,
    );

    if (result.isError()) {
      return [result.value];
    }

    return [this.mapper.map(result.value, Staff, StaffDto)];
  }

  @ResolveField(
    nameof<Staff>((s) => s.characters),
    () => CharacterConnectionDto,
    { nullable: true },
  )
  public async getCharactersByStaff(
    @Parent() staffDto: StaffDto,
    @Args() queryCharacterConnectionArg: QueryCharacterConnectionArg,
    @Info(BuilderSelectStaffPipe) mapResultSelect: MapResultSelect,
  ) {
    if (!staffDto?.characters?.id) return null;

    const result = await this.characterService.getCharacterConnectionPage(
      staffDto.characters.id,
      queryCharacterConnectionArg,
      mapResultSelect,
    );

    if (!result) return null;

    return this.mapper.map(result, CharacterConnection, CharacterConnectionDto);
  }

  @ResolveField(nameof<Staff>((s) => s.staffAnime), () => AnimeConnectionDto, {
    nullable: true,
  })
  public async getAnimeByStaff(
    @Parent() staffDto: StaffDto,
    @Args() queryAnimeConnectionArg: QueryAnimeConnectionArg,
    @Info(BuilderSelectStaffPipe) mapResultSelect: MapResultSelect,
  ) {
    if (!staffDto?.staffAnime?.id) return null;

    const animeConnection = await this.animeService.getAnimeConnectionPage(
      staffDto?.staffAnime?.id,
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
