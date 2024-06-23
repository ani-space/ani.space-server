import { Column, Entity, ManyToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Anime } from '../../anime.model';
import { BaseEntity } from '~/models/base-models/base.model';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'animeSynonyms' })
@ObjectType()
export class AnimeSynonyms extends BaseEntity {
  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  synonym?: string;

  @ManyToOne(() => Anime, (anime) => anime.synonyms)
  anime: Anime;
}
