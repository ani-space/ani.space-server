import { Field, ObjectType } from '@nestjs/graphql';
import { BaseDto } from '../base-dtos/base.dto';
import { AutoMap } from '@automapper/classes';

@ObjectType()
export class StaffImageDto extends BaseDto {
  @AutoMap()
  @Field({ nullable: true })
  large?: string;

  @AutoMap()
  @Field({ nullable: true })
  medium?: string;
}
