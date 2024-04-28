import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseAnilistEntity } from '~/models/base-models/base-anilist.model';
import { AnimeRankType } from './anime-rank-type.enum';
import { AnimeFormat } from './anime-format.enum';
import { AnimeSeason } from './anime-season.enum';
import { Anime } from '~/models/anime.model';

@ObjectType()
@Entity({ name: 'animeRanks' })
export class AnimeRank extends BaseAnilistEntity {
  @ManyToOne(() => Anime, (anime) => anime.rankings)
  anime: Anime;

  @Field(() => Int, { description: `The numerical rank of the media` })
  @Column({ type: 'int' })
  rank: number;

  @Field(() => AnimeRankType)
  @Column({
    type: 'enum',
    enum: AnimeRankType,
  })
  type: AnimeRankType;

  @Field(() => AnimeFormat)
  @Column({
    type: 'enum',
    enum: AnimeFormat,
  })
  format: AnimeFormat;

  @Field((type) => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  year?: number;

  @Field((type) => AnimeSeason, { nullable: true })
  @Column({
    type: 'enum',
    enum: AnimeSeason,
  })
  season?: AnimeSeason;

  @Field({
    description: `If the ranking is based on all time instead of a season/year`,
  })
  @Column({ nullable: true })
  allTime?: boolean;

  @Field({
    description: `String that gives context to the ranking type and time span`,
  })
  @Column()
  context: string;
}
