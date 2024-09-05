import { AutoMap } from '@automapper/classes';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '~/models/base-models/base.model';

@Entity({ name: 'animeTrailers' })
@ObjectType()
export class AnimeTrailer extends BaseEntity {
  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  _id?: string;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  site?: string;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  thumbnail?: string;
}
