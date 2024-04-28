import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { BaseAnilistEntity } from './base-models/base-anilist.model';
import {
  CharacterImage,
  CharacterName,
} from './sub-models/character-sub-models';
import { CharacterConnection } from './sub-models/character-sub-models/character-connection.model';
import { FuzzyDateInt } from './sub-models/common-sub-models';

@ObjectType()
@Entity({ name: 'characters' })
export class Character extends BaseAnilistEntity {
  @Field((type) => CharacterName, { nullable: true })
  @OneToOne(() => CharacterName, { nullable: true })
  @JoinColumn()
  name?: CharacterName;

  @ManyToOne(
    () => CharacterConnection,
    (characterConnection) => characterConnection.nodes,
  )
  characterConnection: CharacterConnection;

  @Field((type) => CharacterImage, { nullable: true })
  @OneToOne(() => CharacterImage, { nullable: true })
  @JoinColumn()
  image?: CharacterImage;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  gender?: string;

  @Field((type) => FuzzyDateInt, { nullable: true })
  @OneToOne(() => FuzzyDateInt, { nullable: true })
  @JoinColumn()
  dateOfBirth?: FuzzyDateInt;

  @Field({ nullable: true })
  @Column({ nullable: true })
  age?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  bloodType?: string;
}
