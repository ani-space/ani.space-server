import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CharacterName } from './character-name.model';
import { BaseEntity } from '~/models/base-models/base.model';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'characterAlternatives' })
@ObjectType()
export class CharacterAlternative extends BaseEntity {
  @ManyToOne(() => CharacterName, (characterName) => characterName.alternative)
  characterName: CharacterName;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;
}
