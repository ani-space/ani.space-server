import { BaseEntity } from '~/models/base-models';
import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, Column, ManyToOne } from 'typeorm';
import { AnimeStreamingEpisode } from './anime-streaming-episode.model';

@ObjectType()
@Entity({ name: 'animeStreamingEpisodeFallBackUrls' })
export class AnimeStreamingEpisodeFallBackUrl extends BaseEntity {
  @Field((type) => AnimeStreamingEpisode, { nullable: true })
  @ManyToOne(
    () => AnimeStreamingEpisode,
    (animeStreamingEpisode) => animeStreamingEpisode.fallbackUrls,
  )
  animeStreamingEpisode: AnimeStreamingEpisode;

  @Field({ nullable: true, description: `The fallback url of the episode` })
  @Column({ nullable: true })
  fallbackUrl?: string;

  @Field({ nullable: true, description: `Quality of the episode` })
  @Column({ nullable: true })
  quality?: string;

  @Field({
    description: `Check whether the source format is m3u8`,
  })
  @Column({ default: false })
  isM3U8: boolean;

  @Field({
    nullable: true,
    description: `The format of the video source`,
  })
  @Column({ nullable: true })
  formatType?: string;
}
