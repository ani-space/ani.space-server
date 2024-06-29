import { ArgsType, Field } from '@nestjs/graphql';
import { CharacterSortEnum } from '../dtos/characters/character-sort.enum';
import { PaginationArgs } from './pagination.arg';

@ArgsType()
export class QueryCharacterConnectionArg extends PaginationArgs {
  @Field(() => CharacterSortEnum)
  sort: CharacterSortEnum;
}
