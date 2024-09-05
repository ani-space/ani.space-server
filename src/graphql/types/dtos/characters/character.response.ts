import { createUnionType } from '@nestjs/graphql';
import { CharacterDto } from '~/common/dtos/character-dtos/character.dto';
import { NotFoundCharacterError } from './not-found-character.error';

export const CharacterResultUnion = createUnionType({
  name: 'CharacterResult',
  types: () => [CharacterDto, NotFoundCharacterError],
});
