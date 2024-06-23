import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IPageInfo } from '../contracts';
import { AutoMap } from '@automapper/classes';

@ObjectType()
export class PageInfo implements IPageInfo {
  @AutoMap()
  @Field((type) => Int)
  total: number;

  @AutoMap()
  @Field((type) => Int)
  perPage: number;

  @AutoMap()
  @Field((type) => Int)
  currentPage: number;

  @AutoMap()
  @Field((type) => Int)
  lastPage: number;

  @AutoMap()
  @Field()
  hasNextPage: boolean;
}
