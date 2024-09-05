import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Anime } from './anime.model';
import { BaseAnilistEntity } from './base-models/base-anilist.model';
import { AutoMap } from '@automapper/classes';

@ObjectType()
@Entity({ name: 'airingSchedules' })
export class AiringSchedule extends BaseAnilistEntity {
  @AutoMap()
  @Field((type) => Int, { description: 'The time the episode airs at' })
  @Column()
  airingAt: number;

  @AutoMap()
  @Field((type) => Int, { description: 'Seconds until episode starts airing' })
  @Column()
  timeUntilAiring: number;

  @AutoMap()
  @Field((type) => Int, { description: 'The airing episode number' })
  @Column()
  episode: number;

  @AutoMap()
  @Field((type) => Int, {
    description: 'The associate media id of the airing episode',
  })
  @Column()
  mediaId: number;

  @AutoMap(() => Anime)
  @Field(() => Anime, {
    description: 'The associate media of the airing episode',
  })
  @OneToOne(() => Anime)
  @JoinColumn()
  anime: Anime;
}
