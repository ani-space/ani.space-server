import { Mapper, MappingProfile, createMap } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import {
  CharacterName,
  CharacterImage,
  CharacterConnection,
} from '../../models/sub-models/character-sub-models';
import { CharacterNameDto } from '../dtos/character-dtos/character-name.dto';
import { CharacterImageDto } from '../dtos/character-dtos/character-image.dto';
import { CharacterConnectionDto } from '../dtos/character-dtos/character-connection.dto';
import { Character } from '~/models';
import { CharacterDto } from '../dtos/character-dtos/character.dto';
import { CharacterAlternative } from '../../models/sub-models/character-sub-models/character-alternative.model';
import { CharacterAlternativeDto } from '../dtos/character-dtos/character-alternative.dto';
import { CharacterAlternativeSpoilers } from '../../models/sub-models/character-sub-models/character-alternativeSpoiler.model';
import { CharacterAlternativeSpoilersDto } from '../dtos/character-dtos/character-alternative-spoiler.dto';

@Injectable()
export class CharacterProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap(mapper, Character, CharacterDto);
      createMap(mapper, CharacterName, CharacterNameDto);
      createMap(
        mapper,
        CharacterAlternativeSpoilers,
        CharacterAlternativeSpoilersDto,
      );
      createMap(mapper, CharacterAlternative, CharacterAlternativeDto);
      createMap(mapper, CharacterImage, CharacterImageDto);
      createMap(mapper, CharacterConnection, CharacterConnectionDto);
    };
  }
}
