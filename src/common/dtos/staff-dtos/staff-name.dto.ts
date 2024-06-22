import { AutoMap } from '@automapper/classes';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseDto } from '../base-dtos/base.dto';
import { StaffAlternativeDto } from './staff-name-alternative.dto';

@ObjectType()
export class StaffNameDto extends BaseDto {
  @AutoMap()
  @Field({ nullable: true })
  first?: string;

  @AutoMap()
  @Field({ nullable: true })
  middle?: string;

  @AutoMap()
  @Field({ nullable: true })
  last?: string;

  @AutoMap()
  @Field({ nullable: true })
  full?: string;

  @AutoMap()
  @Field({ nullable: true })
  native?: string;

  @AutoMap()
  @Field({ nullable: true })
  userPreferred?: string;

  @AutoMap(() => [StaffAlternativeDto])
  @Field(() => [StaffAlternativeDto], { nullable: true })
  alternative?: StaffAlternativeDto[];
}
