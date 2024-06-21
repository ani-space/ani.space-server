import { AutoMap } from '@automapper/classes';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseDto } from '../base-dtos/base.dto';
import { AnimeDto } from './anime.dto';

@ObjectType()
export class AnimeTrendDto extends BaseDto {
  @AutoMap()
  @Field(() => Int)
  mediaId: number;

  @AutoMap()
  @Field(() => Int, {
    description: 'The day the data was recorded (timestamp)',
  })
  date: number;

  @AutoMap()
  @Field(() => Int, {
    description: 'The amount of media activity on the day',
  })
  trending: number;

  @AutoMap()
  @Field(() => Int, {
    description: `A weighted average score of all the user's scores of the media`,
    nullable: true,
  })
  averageScore?: number;

  @AutoMap()
  @Field(() => Int, {
    description: `The number of users with the media on their list`,
    nullable: true,
  })
  popularity?: number;

  @AutoMap()
  @Field(() => Int, {
    description: `The number of users with watching/reading the media`,
    nullable: true,
  })
  inProgress?: number;

  @AutoMap()
  @Field({ description: `If the media was being released at this time` })
  releasing: boolean;

  @AutoMap()
  @Field(() => Int, {
    description: `The episode number of the anime released on this day`,
    nullable: true,
  })
  episode?: number;

  @AutoMap(() => AnimeDto)
  @Field((type) => AnimeDto, { description: 'The related media' })
  anime?: AnimeDto;
}
