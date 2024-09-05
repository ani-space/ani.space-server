import { ArgsType, Field } from '@nestjs/graphql';
import { PaginationArgs } from './pagination.arg';
import { AnimeSortEnum } from '../dtos/anime-response/anime-sort.enum';

@ArgsType()
export class QueryAnimeConnectionArg extends PaginationArgs {
  @Field(() => AnimeSortEnum)
  sort: AnimeSortEnum;
}
