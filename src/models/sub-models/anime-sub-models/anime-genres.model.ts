import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '~/models/base-models/base.model';

@Entity({ name: 'animeGenres' })
@ObjectType()
export class AnimeGenres extends BaseEntity {
  @PrimaryColumn()
  @Field()
  genre: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;
}
