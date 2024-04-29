import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { BaseAnilistEntity } from '~/models/base-models/base-anilist.model';

@Entity({ name: 'animeTags' })
@ObjectType()
export class AnimeTag extends BaseAnilistEntity {
  @Field()
  @Index({ unique: true })
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  descriptionEn?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  descriptionVi?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  category?: string;

  @Field((type) => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  rank: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  isGeneralSpoiler?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  isMediaSpoiler?: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  isAdult?: boolean;
}
