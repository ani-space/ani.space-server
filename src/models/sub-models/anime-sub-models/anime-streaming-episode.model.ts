import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '~/models/base-models';
import { MediaExternalLink } from '../../media-external-link.model';
import { ServerType } from './anime-streaming-server-type.enum';
import { TranslationType } from './anime-streaming-translation-type.enum';

@ObjectType()
@Entity({ name: 'animeStreamingEpisodes' })
export class AnimeStreamingEpisode extends BaseEntity {
  @Field(() => MediaExternalLink)
  @ManyToOne(
    () => MediaExternalLink,
    (mediaExternalLink) => mediaExternalLink.animeStreamingEpisodes,
  )
  mediaExternalLink: MediaExternalLink;

  @Field(() => TranslationType, { nullable: true })
  @Column({
    type: 'enum',
    enum: TranslationType,
    nullable: true,
  })
  translationType?: TranslationType;

  @Field({
    nullable: true,
    description: `The language of the episode is dubbed (not the original language).`,
  })
  @Column({ nullable: true })
  language?: string;

  @Field({
    nullable: true,
    description: `The url of the external link or base url of link source`,
  })
  @Column({ nullable: true })
  site?: string;

  @Field({ nullable: true, description: `Title of the episode` })
  @Column({ nullable: true })
  title?: string;

  @Field({ nullable: true, description: `Url of episode image thumbnail` })
  @Column({ nullable: true })
  thumbnail?: string;

  @Field({ nullable: true, description: `The url of the episode` })
  @Column({ nullable: true })
  url?: string;

  @Field({ nullable: true, description: `The name server of the episode` })
  @Column({ nullable: true })
  serverName?: string;

  @Field(() => ServerType, { nullable: true })
  @Column({
    type: 'enum',
    enum: ServerType,
    nullable: true,
  })
  serverType?: ServerType;

  @Field(() => AnimeStreamingEpisode, { nullable: true })
  @ManyToOne(() => AnimeStreamingEpisode, (fallbackServer) => fallbackServer.id)
  @JoinColumn()
  fallbackServer?: AnimeStreamingEpisode;

  @Field({ nullable: true })
  @Column({ nullable: true })
  cachedProxy?: string;
}
