import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { AiringSchedule } from './airing-schedule.model';
import { BaseAnilistEntity } from './base-models/base-anilist.model';
import { MediaExternalLink } from './media-external-link.model';
import { AiringScheduleConnection } from './sub-models/airing-schedule-sub-models/airing-schedule-connection.model';
import {
  AnimeConnection,
  AnimeCoverImage,
  AnimeDescription,
  AnimeFormat,
  AnimeGenres,
  AnimeRank,
  AnimeSeason,
  AnimeSource,
  AnimeStatus,
  AnimeSynonyms,
  AnimeTag,
  AnimeTitle,
  AnimeTrailer,
  AnimeTrendConnection,
} from './sub-models/anime-sub-models';
import { CharacterConnection } from './sub-models/character-sub-models';
import { FuzzyDateInt } from './sub-models/common-sub-models';
import { StaffConnection } from './sub-models/staff-sub-models/staff-connection.model';
import { StudioConnection } from './sub-models/studio-sub-models/studio-connection.model';
import { AutoMap } from '@automapper/classes';

@ObjectType()
@Entity({ name: 'anime' })
export class Anime extends BaseAnilistEntity {
  @AutoMap()
  @Column({ nullable: true })
  @Field((type) => Int, { nullable: true })
  idMal: number;

  @AutoMap(() => FuzzyDateInt)
  @Field((type) => FuzzyDateInt, { nullable: true })
  @OneToOne(() => FuzzyDateInt, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn()
  startDate?: FuzzyDateInt;

  @AutoMap(() => FuzzyDateInt)
  @Field((type) => FuzzyDateInt, { nullable: true })
  @OneToOne(() => FuzzyDateInt, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn()
  endDate?: FuzzyDateInt;

  @AutoMap(() => AnimeTitle)
  @Field((type) => AnimeTitle, { nullable: true })
  @OneToOne(() => AnimeTitle, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn()
  title?: AnimeTitle;

  @AutoMap()
  @Field((type) => AnimeFormat, { nullable: true })
  @Column({
    type: 'enum',
    enum: AnimeFormat,
    nullable: true,
  })
  format?: AnimeFormat;

  @AutoMap()
  @Field((type) => AnimeStatus, { nullable: true })
  @Column({
    type: 'enum',
    enum: AnimeStatus,
    nullable: true,
  })
  status?: AnimeStatus;

  @AutoMap(() => AnimeDescription)
  @Field((type) => AnimeDescription, { nullable: true })
  @OneToOne(() => AnimeDescription, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn()
  description?: AnimeDescription;

  @AutoMap()
  @Field((type) => AnimeSeason, { nullable: true })
  @Column({
    type: 'enum',
    enum: AnimeSeason,
    nullable: true,
  })
  season?: AnimeSeason;

  @AutoMap()
  @Field((type) => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  seasonYear?: number;

  @AutoMap()
  @Field((type) => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  seasonInt?: number;

  @AutoMap()
  @Field((type) => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  episodes?: number;

  @AutoMap()
  @Field((type) => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  duration?: number;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  countryOfOrigin?: string;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  isLicensed?: boolean;

  @AutoMap()
  @Field((type) => AnimeSource, { nullable: true })
  @Column({
    type: 'enum',
    enum: AnimeSource,
    nullable: true,
  })
  source?: AnimeSource;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  hashtag?: string;

  @AutoMap(() => AnimeTrailer)
  @Field((type) => AnimeTrailer, { nullable: true })
  @OneToOne(() => AnimeTrailer, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn()
  trailer?: AnimeTrailer;

  @AutoMap()
  @Field((type) => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  updateAt?: number;

  @AutoMap(() => AnimeCoverImage)
  @Field((type) => AnimeCoverImage, { nullable: true })
  @OneToOne(() => AnimeCoverImage, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn()
  coverImage?: AnimeCoverImage;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  bannerImage?: string;

  @AutoMap(() => [AnimeGenres])
  @Field((type) => [AnimeGenres], { nullable: true })
  @ManyToMany(() => AnimeGenres, { nullable: true })
  @JoinTable()
  genres?: AnimeGenres[];

  @AutoMap(() => [AnimeSynonyms])
  @Field((type) => [AnimeSynonyms], { nullable: true })
  @OneToMany(() => AnimeSynonyms, (synonyms) => synonyms.anime, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  synonyms?: AnimeSynonyms[];

  @AutoMap()
  @Field((type) => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  averageScore?: number;

  @AutoMap()
  @Field((type) => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  meanScore?: number;

  @AutoMap()
  @Field((type) => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  popularity?: number;

  @AutoMap(() => [AnimeTag])
  @Field((type) => [AnimeTag], { nullable: true })
  @ManyToMany(() => AnimeTag, { nullable: true })
  @JoinTable()
  tags?: AnimeTag[];

  @AutoMap(() => AnimeConnection)
  @Field((type) => AnimeConnection, { nullable: true })
  @ManyToOne(() => AnimeConnection, (relations) => relations.nodes)
  relations?: AnimeConnection;

  @AutoMap(() => CharacterConnection)
  @Field(() => CharacterConnection, { nullable: true })
  @OneToOne(() => CharacterConnection, { nullable: true })
  @JoinColumn()
  characters?: CharacterConnection;

  @AutoMap(() => StaffConnection)
  @Field(() => StaffConnection, {
    nullable: true,
    description: `The staff who produced the media`,
  })
  @OneToOne(() => StaffConnection, { nullable: true })
  @JoinColumn()
  staff?: StaffConnection;

  @AutoMap(() => StudioConnection)
  @Field(() => StudioConnection, {
    nullable: true,
    description: `The companies who produced the media`,
  })
  @OneToOne(() => StudioConnection, { nullable: true })
  @JoinColumn()
  studios?: StudioConnection;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  isAdult?: boolean;

  @AutoMap(() => AiringSchedule)
  @Field((type) => AiringSchedule, {
    nullable: true,
    description: `The media's next episode airing schedule`,
  })
  @OneToOne(() => AiringSchedule, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn()
  nextAiringEpisode?: AiringSchedule;

  @AutoMap(() => AiringScheduleConnection)
  @Field((type) => AiringScheduleConnection, {
    nullable: true,
    description: `The media's entire airing schedule`,
  })
  @OneToOne(() => AiringScheduleConnection, { nullable: true })
  @JoinColumn()
  airingSchedule?: AiringScheduleConnection;

  @AutoMap(() => AnimeTrendConnection)
  @Field((type) => AnimeTrendConnection, {
    nullable: true,
    description: `The media's daily trend stats`,
  })
  @OneToOne(() => AnimeTrendConnection, { nullable: true })
  @JoinColumn()
  trends?: AnimeTrendConnection;

  @AutoMap(() => [MediaExternalLink])
  @Field(() => [MediaExternalLink], {
    nullable: true,
    description: `On-demand streaming sources (May not be official!)`,
  })
  @OneToMany(
    () => MediaExternalLink,
    (mediaExternalLink) => mediaExternalLink.anime,
    { nullable: true, onDelete: 'CASCADE' },
  )
  mediaExternalLink?: MediaExternalLink[];

  @AutoMap(() => [AnimeRank])
  @Field((type) => [AnimeRank], {
    nullable: true,
    description: `The ranking of the media in a particular time span and format compared to other media`,
  })
  @OneToMany(() => AnimeRank, (rankings) => rankings.anime, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  rankings: AnimeRank[];

  // reviews: TODO after implement auth

  // recommendations: TODO after implement auth
}
