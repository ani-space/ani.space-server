import { AutoMap } from '@automapper/classes';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseDto } from '../base-dtos/base.dto';

@ObjectType()
export class AnimeTrailerDto extends BaseDto {
  @AutoMap()
  @Field({ nullable: true })
  _id?: string;

  @AutoMap()
  @Field({ nullable: true })
  site?: string;

  @AutoMap()
  @Field({ nullable: true })
  thumbnail?: string;
}
