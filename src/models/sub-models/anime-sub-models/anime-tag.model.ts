import { AutoMap } from '@automapper/classes';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index } from 'typeorm';
import { BaseAnilistEntity } from '~/models/base-models/base-anilist.model';

@Entity({ name: 'animeTags' })
@ObjectType()
export class AnimeTag extends BaseAnilistEntity {
  @AutoMap()
  @Field()
  @Index({ unique: true })
  @Column()
  name: string;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  descriptionEn?: string;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  descriptionVi?: string;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  category?: string;

  @AutoMap()
  @Field((type) => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  rank: number;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  isGeneralSpoiler?: boolean;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  isMediaSpoiler?: boolean;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  isAdult?: boolean;
}
