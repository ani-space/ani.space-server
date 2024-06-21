import { AutoMap } from '@automapper/classes';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { AnimeDto } from '../anime-dtos/anime.dto';
import { BaseAnilistDto } from '../base-dtos/base-anilist.dto';

@ObjectType()
export class AiringScheduleDto extends BaseAnilistDto {
  @AutoMap()
  @Field((type) => Int, { description: 'The time the episode airs at' })
  airingAt: number;

  @AutoMap()
  @Field((type) => Int, { description: 'Seconds until episode starts airing' })
  timeUntilAiring: number;

  @AutoMap()
  @Field((type) => Int, { description: 'The airing episode number' })
  episode: number;

  @AutoMap()
  @Field((type) => Int, {
    description: 'The associate media id of the airing episode',
  })
  mediaId: number;

  @AutoMap(() => AnimeDto)
  @Field(() => AnimeDto, {
    description: 'The associate media of the airing episode',
  })
  anime: AnimeDto;
}
