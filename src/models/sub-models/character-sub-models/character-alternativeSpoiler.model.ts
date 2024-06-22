import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CharacterName } from './character-name.model';
import { BaseEntity } from '~/models/base-models/base.model';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'characterAlternativeSpoilers' })
@ObjectType()
export class CharacterAlternativeSpoilers extends BaseEntity {
  @ManyToOne(
    () => CharacterName,
    (characterName) => characterName.alternativeSpoiler,
  )
  characterName: CharacterName;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;
}
