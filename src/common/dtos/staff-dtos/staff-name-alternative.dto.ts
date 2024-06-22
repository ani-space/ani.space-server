import { Field, ObjectType } from '@nestjs/graphql';
import { BaseDto } from '../base-dtos/base.dto';
import { AutoMap } from '@automapper/classes';

@ObjectType()
export class StaffAlternativeDto extends BaseDto {
  @AutoMap()
  @Field({ nullable: true })
  name?: string;
}
