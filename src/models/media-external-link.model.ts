import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
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

  @Field({
    nullable: true,
    description: `The url of the external link or base url of link source`,
  })
  @Column({ nullable: true })
  site?: string;

  @Field({
    nullable: true,
    description: `The links website site id`,
  })
  @Column({ type: 'int', nullable: true })
  siteId?: number;

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
  color?: string;

  @Field({
    nullable: true,
    description: `The icon image url of the site. Not available for all links. Transparent PNG 64x64`,
  })
  @Column({ nullable: true })
  icon?: string;

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
