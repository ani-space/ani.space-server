import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { BaseAnilistEntity } from './base-models/base-anilist.model';
import { AnimeConnection } from './sub-models/anime-sub-models/anime-connection.model';

@Entity({ name: 'studios' })
@ObjectType()
export class Studio extends BaseAnilistEntity {
  @Field()
  @Column()
  name: string;

  @Field({
    description:
      'If the studio is an animation studio or a different kind of company',
  })
  @Column()
  isAnimationStudio: boolean;

  @Field((type) => AnimeConnection, {
    nullable: true,
    description: 'The media the studio has worked on',
  })
  anime?: AnimeConnection;

  @Field({ nullable: true })
  @Column({ nullable: true })
  siteUrl?: string;

  @Field((type) => Int, {
    nullable: true,
    description: `The amount of user's who have favourited the studio`,
  })
  @Column({ type: 'int', nullable: true })
  favorites?: number;
}
