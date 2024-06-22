import { AutoMap } from '@automapper/classes';
import { Field, ObjectType } from '@nestjs/graphql';
import { ExternalLinkType } from '../../../models/sub-models/media-external-sub-models/media-external-link-type.enum';
import { BaseDto } from '../base-dtos/base.dto';
import { AnimeStreamingEpisodeDto } from './anime-streaming-episode.dto';
import { AnimeDto } from './anime.dto';

@ObjectType()
export class MediaExternalLinkDto extends BaseDto {
  @AutoMap(() => AnimeDto)
  @Field(() => AnimeDto)
  anime: AnimeDto;

  @AutoMap(() => [AnimeStreamingEpisodeDto])
  @Field(() => [AnimeStreamingEpisodeDto], { nullable: true })
  animeStreamingEpisodes: AnimeStreamingEpisodeDto[];

  @AutoMap()
  @Field({
    nullable: true,
    description: `The relative path leading to the details page of the anime`,
  })
  animePath?: string;

  @AutoMap()
  @Field({
    nullable: true,
    description: `The url of the external link or name of link source`,
  })
  site?: string;

  @AutoMap()
  @Field(() => ExternalLinkType, { nullable: true })
  type?: string;

  @AutoMap()
  @Field({
    nullable: true,
    description: `Language the site content is in. See Staff language field for values.`,
  })
  language?: string;

  @AutoMap()
  @Field({
    nullable: true,
  })
  notes?: string;

  @AutoMap()
  @Field({
    nullable: true,
  })
  isDisabled?: boolean;
}
