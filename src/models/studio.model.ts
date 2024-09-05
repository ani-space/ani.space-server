import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseAnilistEntity } from './base-models/base-anilist.model';
import { AnimeConnection } from './sub-models/anime-sub-models/anime-connection.model';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'studios' })
@ObjectType()
export class Studio extends BaseAnilistEntity {
  @AutoMap()
  @Field()
  @Column()
  name: string;

  @AutoMap()
  @Field({
    description:
      'If the studio is an animation studio or a different kind of company',
  })
  @Column()
  isAnimationStudio: boolean;

  @AutoMap(() => AnimeConnection)
  @Field((type) => AnimeConnection, {
    nullable: true,
    description: 'The media the studio has worked on',
  })
  @OneToOne(() => AnimeConnection, { nullable: true })
  @JoinColumn()
  anime?: AnimeConnection;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  siteUrl?: string;

  @AutoMap()
  @Field((type) => Int, {
    nullable: true,
    description: `The amount of user's who have favourited the studio`,
  })
  @Column({ type: 'int', nullable: true })
  favorites?: number;
}
