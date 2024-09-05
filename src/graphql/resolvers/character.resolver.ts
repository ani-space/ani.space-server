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
import { CharacterDto } from '~/common/dtos/character-dtos/character.dto';
import { BuilderSelectCharacterPipe } from '~/common/pipes/builder-select-character.pipe';
import {
  IAnimeExternalService,
  ICharacterExternalService,
} from '~/contracts/services';
import { Character } from '~/models';
import { MapResultSelect } from '~/utils/tools/object';
import { QueryCharacterArg } from '../types/args/query-character.arg';
import { CharacterResultUnion } from '../types/dtos/characters/character.response';
import { CharacterActions } from '../types/enums/actions.enum';
import { QueryAnimeConnectionArg } from '../types/args/query-anime-connection.arg';
import { AnimeConnection } from '~/models/sub-models/anime-sub-models';

@Resolver(() => CharacterDto)
export class CharacterResolver {
  constructor(
    @Inject(ICharacterExternalService)
    private readonly characterService: ICharacterExternalService,

    @Inject(IAnimeExternalService)
    private readonly animeService: IAnimeExternalService,

    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Query(() => [CharacterResultUnion], { name: CharacterActions.Character })
  public async getCharacterInfo(
    @Info(BuilderSelectCharacterPipe) mapResultSelect: MapResultSelect,
    @Args() queryAnimeArg: QueryCharacterArg,
  ) {
    const result = await this.characterService.getCharacterByConditions(
      queryAnimeArg,
      mapResultSelect,
    );

    if (result.isError()) {
      return [result.value];
    }

    return [this.mapper.map(result.value, Character, CharacterDto)];
  }

  @ResolveField(
    nameof<CharacterDto>((c) => c.anime),
    (returns) => AnimeConnectionDto,
    { nullable: true },
  )
  public async getAnimeByCharacter(
    @Parent() characterDto: CharacterDto,
    @Args() queryAnimeConnectionArg: QueryAnimeConnectionArg,
    @Info(BuilderSelectCharacterPipe) mapResultSelect: MapResultSelect,
  ) {
    if (!characterDto?.anime?.id) return null;

    const animeConnection = await this.animeService.getAnimeConnectionPage(
      characterDto?.anime?.id,
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
