import { AutoMap } from '@automapper/classes';
import { Field, ObjectType } from '@nestjs/graphql';
import { ServerType } from '../../../models/sub-models/anime-sub-models/anime-streaming-server-type.enum';
import { TranslationType } from '../../../models/sub-models/anime-sub-models/anime-streaming-translation-type.enum';
import { BaseDto } from '../base-dtos/base.dto';
import { AnimeStreamingEpisodeSourceDto } from './anime-streaming-episode-sources.dto';
import { MediaExternalLinkDto } from './media-external-link.dto';

@ObjectType()
export class AnimeStreamingEpisodeDto extends BaseDto {
  @AutoMap()
  @Field({
    nullable: true,
    description: `The important field for sorting the order of episodes in a anime.`,
  })
  epId?: string;

  @AutoMap()
  @Field({
    nullable: true,
    description: `The episode ID that leads to the streaming source.`,
  })
  epHash?: string;

  @AutoMap(() => MediaExternalLinkDto)
  @Field(() => MediaExternalLinkDto)
  mediaExternalLink: MediaExternalLinkDto;

  @AutoMap()
  @Field(() => TranslationType, { nullable: true })
  translationType?: string;

  @AutoMap()
  @Field({
    nullable: true,
    description: `The language of the episode is dubbed (not the original language).`,
  })
  language?: string;

  @AutoMap()
  @Field({
    nullable: true,
    description: `The url of the external link or base url of link source`,
  })
  site?: string;

  @AutoMap()
  @Field({ nullable: true, description: `Title of the episode` })
  title?: string;

  @AutoMap()
  @Field({ nullable: true, description: `Url of episode image thumbnail` })
  thumbnail?: string;

  @AutoMap(() => [AnimeStreamingEpisodeSourceDto])
  @Field(() => [AnimeStreamingEpisodeSourceDto], {
    nullable: true,
    description: `The streaming urls of the episode`,
  })
  sources?: AnimeStreamingEpisodeSourceDto[];

  @AutoMap()
  @Field({ nullable: true, description: `The name server of the episode` })
  serverName?: string;

  @AutoMap()
  @Field(() => ServerType, { nullable: true })
  serverType?: string;

  @AutoMap()
  @Field({ nullable: true })
  referer?: string;

  @AutoMap()
  @Field({ nullable: true })
  download?: string;
}
