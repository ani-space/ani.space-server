import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '~/models/base-models/base.model';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'animeGenres' })
@ObjectType()
export class AnimeGenres extends BaseEntity {
  @AutoMap()
  @PrimaryColumn()
  @Field()
  genre: string;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;
}
