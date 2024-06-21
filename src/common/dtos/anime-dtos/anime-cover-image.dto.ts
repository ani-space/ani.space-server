import { AutoMap } from '@automapper/classes';
import { BaseDto } from '../base-dtos/base.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AnimeCoverImageDto extends BaseDto {
  @AutoMap()
  @Field({ nullable: true })
  extraLarge?: string;

  @AutoMap()
  @Field({ nullable: true })
  large?: string;

  @AutoMap()
  @Field({ nullable: true })
  medium?: string;

  @AutoMap()
  @Field({ nullable: true })
  color?: string;
}
