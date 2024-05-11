import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseAnilistEntity } from './base-models/base-anilist.model';
import {
  CharacterImage,
  CharacterName,
} from './sub-models/character-sub-models';
import { FuzzyDateInt } from './sub-models/common-sub-models';
import { AnimeConnection } from './sub-models/anime-sub-models';

@ObjectType()
@Entity({ name: 'characters' })
export class Character extends BaseAnilistEntity {
  @Field((type) => CharacterName, { nullable: true })
  @OneToOne(() => CharacterName, { nullable: true })
  @JoinColumn()
  name?: CharacterName;

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

  @Field(() => AnimeConnection, { nullable: true })
  @OneToOne(() => AnimeConnection, { nullable: true })
  @JoinColumn()
  anime?: AnimeConnection;
}
