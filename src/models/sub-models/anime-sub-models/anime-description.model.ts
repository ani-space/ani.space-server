import { Column, Entity } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '~/models/base-models/base.model';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'animeDescriptions' })
@ObjectType()
export class AnimeDescription extends BaseEntity {
  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  english?: string;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  englishAIGenerate?: string;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  vietnamese?: string;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  vietnameseAIGenerate?: string;
}
