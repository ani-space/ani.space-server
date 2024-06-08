import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '~/models/base-models';
import { MediaExternalLink } from '../../media-external-link.model';
import { ServerType } from './anime-streaming-server-type.enum';
import { TranslationType } from './anime-streaming-translation-type.enum';
import { AnimeStreamingEpisodeFallBackUrl } from './anime-streaming-episode-fallback-url.model';

@ObjectType()
@Entity({ name: 'animeStreamingEpisodes' })
export class AnimeStreamingEpisode extends BaseEntity {
  @Field({ nullable: true })
  @Column({ nullable: true })
  epId?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  epHash?: string;

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

  @Field(() => [AnimeStreamingEpisodeFallBackUrl], {
    nullable: true,
    description: `The fallback urls of the episode`,
  })
  @OneToMany(
    () => AnimeStreamingEpisodeFallBackUrl,
    (fallbackUrls) => fallbackUrls.animeStreamingEpisode,
    {
      nullable: true,
      onDelete: 'CASCADE',
    },
  )
  fallbackUrls?: AnimeStreamingEpisodeFallBackUrl[];

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

  static createAnimeStreamingEpisode(params: {
    mediaExternalLink: MediaExternalLink;
    url: string;
    epId: string;
    title: string;
    site: string;
    isM3U8: boolean;
    serverType: ServerType;
    translationType: TranslationType;
    language: string;

    epHash?: string;
    quality?: string;
    formatType?: string;
    serverName?: string;
  }) {
    return {
      mediaExternalLink: params.mediaExternalLink,
      url: params.url,
      epId: params.epId,
      title: params.title,
      site: params.site,
      isM3U8: params.isM3U8,
      formatType: params.formatType,
      serverType: params.serverType,
      language: params.language,

      epHash: params.epHash,
      quality: params.quality,
      serverName: params.serverName,
    } as AnimeStreamingEpisode;
  }
}
