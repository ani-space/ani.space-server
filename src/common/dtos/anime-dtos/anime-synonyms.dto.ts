import { AutoMap } from '@automapper/classes';
import { Field, ObjectType } from '@nestjs/graphql';
import { AnimeDto } from './anime.dto';
import { BaseDto } from '../base-dtos/base.dto';

@ObjectType()
export class AnimeSynonymsDto extends BaseDto {
  @AutoMap()
  @Field({ nullable: true })
  synonym?: string;

  @AutoMap(() => AnimeDto)
  anime: AnimeDto;
}
