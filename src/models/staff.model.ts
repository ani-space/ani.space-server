import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseAnilistEntity } from './base-models/base-anilist.model';
import { CharacterConnection } from './sub-models/character-sub-models';
import { FuzzyDateInt } from './sub-models/common-sub-models';
import {
  StaffImage,
  StaffName,
  StaffPrimaryOccupation,
  StaffYearActive,
} from './sub-models/staff-sub-models';
import { AnimeConnection } from './sub-models/anime-sub-models';

@Entity({ name: 'staffs' })
@ObjectType()
export class Staff extends BaseAnilistEntity {
  @Field((type) => StaffName, { nullable: true })
  @OneToOne(() => StaffName, { nullable: true })
  @JoinColumn()
  name?: StaffName;

  @Field({ nullable: true })
  @Column({ nullable: true })
  languageV2?: string;

  @Field((type) => StaffImage, { nullable: true })
  @OneToOne(() => StaffImage, { nullable: true })
  @JoinColumn()
  image?: StaffImage;

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

  @Field((type) => FuzzyDateInt, { nullable: true })
  @OneToOne(() => FuzzyDateInt, { nullable: true })
  @JoinColumn()
  dateOfDeath?: FuzzyDateInt;

  @Field(() => [StaffPrimaryOccupation], { nullable: true })
  @OneToMany(
    () => StaffPrimaryOccupation,
    (primaryOccupations) => primaryOccupations.staff,
  )
  primaryOccupations: StaffPrimaryOccupation[];

  @Field((type) => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  age?: number;

  @Field((type) => StaffYearActive, { nullable: true })
  @OneToOne(() => StaffYearActive, { nullable: true })
  @JoinColumn()
  yearsActive?: StaffYearActive;

  @Field({ nullable: true })
  @Column({ nullable: true })
  homeTown?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  bloodType?: string;

  @Field(() => CharacterConnection, {
    nullable: true,
    description: 'Characters voiced by the actor',
  })
  @OneToOne(() => CharacterConnection, { nullable: true })
  @JoinColumn()
  characters?: CharacterConnection;

  @Field(() => AnimeConnection, {
    nullable: true,
    description: 'Media where the staff member has a production role',
  })
  @OneToOne(() => AnimeConnection, { nullable: true })
  @JoinColumn()
  staffAnime?: AnimeConnection;

  @Field((type) => Int, {
    nullable: true,
    description: `The amount of user's who have favourited the staff member`,
  })
  @Column({ type: 'int', nullable: true })
  favorites?: number;
}
