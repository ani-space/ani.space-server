import { Field, ObjectType } from '@nestjs/graphql';
import { BaseDto } from '../base-dtos/base.dto';
import { AutoMap } from '@automapper/classes';

@ObjectType()
export class StaffPrimaryOccupationDto extends BaseDto {
  @AutoMap()
  @Field({ nullable: true })
  occupation?: string;
}
