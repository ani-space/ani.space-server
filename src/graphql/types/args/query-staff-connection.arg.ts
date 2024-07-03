import { ArgsType, Field } from '@nestjs/graphql';
import { StaffSortEnum } from '../dtos/staff/staff-sort.enum';
import { PaginationArgs } from './pagination.arg';

@ArgsType()
export class QueryStaffConnectionArg extends PaginationArgs {
  @Field(() => StaffSortEnum, { nullable: true })
  sort?: StaffSortEnum;
}
