import { Column, Entity } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '~/models/base-models/base.model';

@Entity({ name: 'animeTitles' })
@ObjectType()
export class AnimeTitle extends BaseEntity {
  @Field({ nullable: true })
  @Column({ nullable: true })
  romaji?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  english?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  vietnamese?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  native?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  userPreferred?: string;
}
