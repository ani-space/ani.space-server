import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany, Index } from 'typeorm';
import { BaseEntity } from './base-models';
import { AnimeStreamingEpisode } from './sub-models/anime-sub-models/anime-streaming-episode.model';
import { ExternalLinkType } from './sub-models/media-external-sub-models/media-external-link-type.enum';
import { Anime } from './anime.model';
import { AutoMap } from '@automapper/classes';

@ObjectType()
@Entity({ name: 'mediaExternalLinks' })
export class MediaExternalLink extends BaseEntity {
  @AutoMap(() => Anime)
  @ManyToOne(() => Anime, (anime) => anime.mediaExternalLink)
  @Field(() => Anime)
  anime: Anime;

  @AutoMap(() => [AnimeStreamingEpisode])
  @Field(() => [AnimeStreamingEpisode], { nullable: true })
  @OneToMany(
    () => AnimeStreamingEpisode,
    (animeStreamingEpisodes) => animeStreamingEpisodes.mediaExternalLink,
  )
  animeStreamingEpisodes: AnimeStreamingEpisode[];

  @AutoMap()
  @Index({ unique: true })
  @Field({
    nullable: true,
    description: `The relative path leading to the details page of the anime`,
  })
  @Column({ nullable: true })
  animePath?: string;

  @AutoMap()
  @Field({
    nullable: true,
    description: `The url of the external link or name of link source`,
  })
  @Column({ nullable: true })
  site?: string;

  @AutoMap()
  @Field({
    nullable: true,
    description: `Determine if the mapping to an external source truly matches during synchronization.`,
  })
  @Column({ nullable: true })
  isMatching?: boolean;

  @AutoMap()
  @Field(() => Float, {
    nullable: true,
    description: `Determine the number of matching points in the fuzzy search process, the closer to 0, the more accurate`,
  })
  @Column({ type: 'float', nullable: true })
  matchingScore?: number;

  @AutoMap()
  @Field(() => ExternalLinkType, { nullable: true })
  @Column({
    type: 'enum',
    enum: ExternalLinkType,
    nullable: true,
  })
  type?: ExternalLinkType;

  @AutoMap()
  @Field({
    nullable: true,
    description: `Language the site content is in. See Staff language field for values.`,
  })
  @Column({ nullable: true })
  language?: string;

  @AutoMap()
  @Field({
    nullable: true,
  })
  @Column({ nullable: true })
  notes?: string;

  @AutoMap()
  @Field({
    nullable: true,
  })
  @Column({ nullable: true })
  isDisabled?: boolean;

  @Field({
    nullable: true,
    description: `"Serves the purpose of inspection and verification."`,
  })
  @Column({ nullable: true })
  metaInfo?: string;
}
