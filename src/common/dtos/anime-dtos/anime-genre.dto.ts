import { AutoMap } from '@automapper/classes';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseDto } from '../base-dtos/base.dto';

@ObjectType()
export class AnimeGenresDto extends BaseDto {
  @AutoMap()
  @Field({ nullable: true })
  genre?: string;

  @AutoMap()
  @Field({ nullable: true })
  description?: string;
}
