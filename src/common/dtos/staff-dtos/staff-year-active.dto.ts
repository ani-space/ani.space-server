import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseDto } from '../base-dtos/base.dto';
import { AutoMap } from '@automapper/classes';

@ObjectType()
export class StaffYearActiveDto extends BaseDto {
  @AutoMap()
  @Field((type) => Int, { nullable: true })
  startYear?: number;

  @AutoMap()
  @Field((type) => Int, { nullable: true })
  endYear?: number;
}
