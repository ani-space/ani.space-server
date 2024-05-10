import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Anime } from '~/models/anime.model';
import { BaseEntity } from '~/models/base-models';
import { AnimeTrendConnection } from './anime-trend-connection.model';

@Entity({ name: 'animeTrends' })
@ObjectType()
export class AnimeTrend extends BaseEntity {
  @Field(() => Int)
  @Column({ type: 'int' })
  mediaId: number;

  @Field(() => Int, {
    description: 'The day the data was recorded (timestamp)',
  })
  @Column({ type: 'int' })
  date: number;

  @Field(() => Int, {
    description: 'The amount of media activity on the day',
  })
  @Column({ type: 'int' })
  trending: number;

  @Field(() => Int, {
    description: `A weighted average score of all the user's scores of the media`,
    nullable: true,
  })
  @Column({ type: 'int', nullable: true })
  averageScore?: number;

  @Field(() => Int, {
    description: `The number of users with the media on their list`,
    nullable: true,
  })
  @Column({ type: 'int', nullable: true })
  popularity?: number;

  @Field(() => Int, {
    description: `The number of users with watching/reading the media`,
    nullable: true,
  })
  @Column({ type: 'int', nullable: true })
  inProgress?: number;

  @Field({ description: `If the media was being released at this time` })
  @Column()
  releasing: boolean;

  @Field(() => Int, {
    description: `The episode number of the anime released on this day`,
    nullable: true,
  })
  @Column({ type: 'int', nullable: true })
  episode?: number;

  @Field((type) => Anime, { description: 'The related media' })
  @OneToOne(() => Anime)
  @JoinColumn()
  anime?: Anime;
}
