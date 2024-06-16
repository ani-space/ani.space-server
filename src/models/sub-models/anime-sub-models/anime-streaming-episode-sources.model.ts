import { BaseEntity } from '~/models/base-models';
import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, Column, ManyToOne } from 'typeorm';
import { AnimeStreamingEpisode } from './anime-streaming-episode.model';

@ObjectType()
@Entity({ name: 'animeStreamingEpisodeSource' })
export class AnimeStreamingEpisodeSource extends BaseEntity {
  @Field((type) => AnimeStreamingEpisode, { nullable: true })
  @ManyToOne(
    () => AnimeStreamingEpisode,
    (animeStreamingEpisode) => animeStreamingEpisode.sources,
  )
  animeStreamingEpisode: AnimeStreamingEpisode;

  @Field({ nullable: true, description: `url of the episode` })
  @Column({ nullable: true })
  url?: string;

  @Field({ nullable: true, description: `quality of the episode` })
  @Column({ nullable: true })
  quality?: string;

  @Field({
    description: `check whether the source format is m3u8`,
  })
  @Column({ default: false })
  isM3U8: boolean;
}
