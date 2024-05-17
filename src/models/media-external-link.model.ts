import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany, Index } from 'typeorm';
import { BaseEntity } from './base-models';
import { AnimeStreamingEpisode } from './sub-models/anime-sub-models/anime-streaming-episode.model';
import { ExternalLinkType } from './sub-models/media-external-sub-models/media-external-link-type.enum';
import { Anime } from './anime.model';

@ObjectType()
@Entity({ name: 'mediaExternalLinks' })
export class MediaExternalLink extends BaseEntity {
  @ManyToOne(() => Anime, (anime) => anime.mediaExternalLink)
  @Field(() => Anime)
  anime: Anime;

  @Field(() => [AnimeStreamingEpisode], { nullable: true })
  @OneToMany(
    () => AnimeStreamingEpisode,
    (animeStreamingEpisodes) => animeStreamingEpisodes.mediaExternalLink,
  )
  animeStreamingEpisodes: AnimeStreamingEpisode[];

  @Index({ unique: true })
  @Field({
    nullable: true,
    description: `The relative path leading to the details page of the anime`,
  })
  @Column({ nullable: true })
  animePath?: string;

  @Field({
    nullable: true,
    description: `The url of the external link or name of link source`,
  })
  @Column({ nullable: true })
  site?: string;

  @Field({
    nullable: true,
    description: `Determine if the mapping to an external source truly matches during synchronization.`,
  })
  @Column({ nullable: true })
  isMatching?: boolean;

  @Field(() => Float, {
    nullable: true,
    description: `Determine the number of matching points in the fuzzy search process, the closer to 0, the more accurate`,
  })
  @Column({ type: 'float', nullable: true })
  matchingScore?: number;

  @Field(() => ExternalLinkType, { nullable: true })
  @Column({
    type: 'enum',
    enum: ExternalLinkType,
    nullable: true,
  })
  type?: ExternalLinkType;

  @Field({
    nullable: true,
    description: `Language the site content is in. See Staff language field for values.`,
  })
  @Column({ nullable: true })
  language?: string;

  @Field({
    nullable: true,
  })
  @Column({ nullable: true })
  notes?: string;

  @Field({
    nullable: true,
  })
  @Column({ nullable: true })
  isDisabled?: boolean;
}
