import { Entity, Column, OneToMany } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { CharacterAlternative } from './character-alternative.model';
import { CharacterAlternativeSpoilers } from './character-alternativeSpoiler.model';
import { BaseEntity } from '~/models/base-models/base.model';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'characterNames' })
@ObjectType()
export class CharacterName extends BaseEntity {
  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  first?: string;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  middle?: string;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  last?: string;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  full?: string;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  native?: string;

  @AutoMap(() => [CharacterAlternative])
  @Field(() => [CharacterAlternative], { nullable: true })
  @OneToMany(
    () => CharacterAlternative,
    (alternative) => alternative.characterName,
  )
  alternative?: CharacterAlternative[];

  @AutoMap(() => [CharacterAlternativeSpoilers])
  @Field(() => [CharacterAlternative], { nullable: true })
  @OneToMany(
    () => CharacterAlternativeSpoilers,
    (alternative) => alternative.characterName,
  )
  alternativeSpoiler?: CharacterAlternativeSpoilers[];
}
