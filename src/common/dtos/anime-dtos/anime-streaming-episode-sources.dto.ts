import { AutoMap } from '@automapper/classes';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseDto } from '../base-dtos/base.dto';
import { AnimeStreamingEpisodeDto } from './anime-streaming-episode.dto';

@ObjectType()
export class AnimeStreamingEpisodeSourceDto extends BaseDto {
  @AutoMap(() => AnimeStreamingEpisodeDto)
  @Field((type) => AnimeStreamingEpisodeDto, { nullable: true })
  animeStreamingEpisode: AnimeStreamingEpisodeDto;

  @AutoMap()
  @Field({ nullable: true, description: `url of the episode` })
  url?: string;

  @AutoMap()
  @Field({ nullable: true, description: `quality of the episode` })
  quality?: string;

  @AutoMap()
  @Field({
    description: `check whether the source format is m3u8`,
  })
  isM3U8: boolean;
}
