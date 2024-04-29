import { Column, Entity, ManyToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Anime } from '../../anime.model';
import { BaseEntity } from '~/models/base-models/base.model';

@Entity({ name: 'animeSynonyms' })
@ObjectType()
export class AnimeSynonyms extends BaseEntity {
  @Field({ nullable: true })
  @Column({ nullable: true })
  synonym?: string;

  @Field(() => Anime, { nullable: true })
  @ManyToOne(() => Anime, (anime) => anime.synonyms)
  anime: Anime;
}
