import { Column, Entity } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '~/models/base-models/base.model';

@Entity({ name: 'animeDescriptions' })
@ObjectType()
export class AnimeDescription extends BaseEntity {
  @Field({ nullable: true })
  @Column({ nullable: true })
  english?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  englishAIGenerate?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  vietnamese?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  vietnameseAIGenerate?: string;
}
