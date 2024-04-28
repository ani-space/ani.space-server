import { Entity, Column, OneToMany } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { CharacterAlternative } from './character-alternative.model';
import { CharacterAlternativeSpoilers } from './character-alternativeSpoiler.model';
import { BaseEntity } from '~/models/base-models/base.model';

@Entity({ name: 'characterNames' })
@ObjectType()
export class CharacterName extends BaseEntity {
  @Field({ nullable: true })
  @Column({ nullable: true })
  first?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  middle?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  last?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  full?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  native?: string;

  @Field(() => [CharacterAlternative], { nullable: true })
  @OneToMany(
    () => CharacterAlternative,
    (alternative) => alternative.characterName,
  )
  alternative?: CharacterAlternative[];

  @Field(() => [CharacterAlternative], { nullable: true })
  @OneToMany(
    () => CharacterAlternativeSpoilers,
    (alternative) => alternative.characterName,
  )
  alternativeSpoiler?: CharacterAlternativeSpoilers[];
}
