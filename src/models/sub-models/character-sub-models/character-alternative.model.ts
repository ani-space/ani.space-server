import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CharacterName } from './character-name.model';
import { BaseEntity } from '~/models/base-models/base.model';

@Entity({ name: 'characterAlternatives' })
@ObjectType()
export class CharacterAlternative extends BaseEntity {
  @ManyToOne(() => CharacterName, (characterName) => characterName.alternative)
  characterName: CharacterName;

  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;
}
