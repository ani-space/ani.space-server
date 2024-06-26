import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { PaginationArgs } from './pagination.arg';
import { CharacterSortEnum } from '../dtos/characters/character-sort.enum';

@ArgsType()
export class QueryCharacterConnectionArg extends PaginationArgs {
  @Field(() => CharacterSortEnum)
  sort: CharacterSortEnum;
}
