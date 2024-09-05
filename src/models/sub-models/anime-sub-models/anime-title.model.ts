import { AutoMap } from '@automapper/classes';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '~/models/base-models/base.model';

@Entity({ name: 'animeTitles' })
@ObjectType()
export class AnimeTitle extends BaseEntity {
  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  romaji?: string;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  english?: string;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  vietnamese?: string;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  native?: string;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  userPreferred?: string;
}
