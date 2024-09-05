import { Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { IPaginateResult } from '~/contracts/dtos';
import { PageInfo } from '~/models/base-models/page-info.model';

export function PaginateResult<T>(ItemType: Type<T>) {
  @ObjectType({ isAbstract: true })
  abstract class PageClass implements IPaginateResult<T> {
    @Field()
    pageInfo: PageInfo;

    //@ts-ignore
    @Field(() => [ItemType])
    docs: T[];
  }

  return PageClass;
}
