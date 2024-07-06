import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

// https://docs.nestjs.com/graphql/resolvers#class-inheritance
@ArgsType()
export class PaginationArgs {
  @Field((type) => Int, { defaultValue: 1 })
  @Min(1)
  page: number = 1;

  @Field((type) => Int, { defaultValue: 15 })
  @Min(1)
  @Max(50)
  limit: number = 15;
}
