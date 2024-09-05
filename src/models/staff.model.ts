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
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'staffs' })
@ObjectType()
export class Staff extends BaseAnilistEntity {
  @AutoMap(() => StaffName)
  @Field((type) => StaffName, { nullable: true })
  @OneToOne(() => StaffName, { nullable: true })
  @JoinColumn()
  name?: StaffName;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  languageV2?: string;

  @AutoMap(() => StaffImage)
  @Field((type) => StaffImage, { nullable: true })
  @OneToOne(() => StaffImage, { nullable: true })
  @JoinColumn()
  image?: StaffImage;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  gender?: string;

  @AutoMap(() => FuzzyDateInt)
  @Field((type) => FuzzyDateInt, { nullable: true })
  @OneToOne(() => FuzzyDateInt, { nullable: true })
  @JoinColumn()
  dateOfBirth?: FuzzyDateInt;

  @AutoMap(() => FuzzyDateInt)
  @Field((type) => FuzzyDateInt, { nullable: true })
  @OneToOne(() => FuzzyDateInt, { nullable: true })
  @JoinColumn()
  dateOfDeath?: FuzzyDateInt;

  @AutoMap(() => StaffPrimaryOccupation)
  @Field(() => [StaffPrimaryOccupation], { nullable: true })
  @OneToMany(
    () => StaffPrimaryOccupation,
    (primaryOccupations) => primaryOccupations.staff,
  )
  primaryOccupations: StaffPrimaryOccupation[];

  @AutoMap()
  @Field((type) => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  age?: number;

  @AutoMap(() => StaffYearActive)
  @Field((type) => StaffYearActive, { nullable: true })
  @OneToOne(() => StaffYearActive, { nullable: true })
  @JoinColumn()
  yearsActive?: StaffYearActive;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  homeTown?: string;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  bloodType?: string;

  @AutoMap(() => CharacterConnection)
  @Field(() => CharacterConnection, {
    nullable: true,
    description: 'Characters voiced by the actor',
  })
  @OneToOne(() => CharacterConnection, { nullable: true })
  @JoinColumn()
  characters?: CharacterConnection;

  @AutoMap(() => AnimeConnection)
  @Field(() => AnimeConnection, {
    nullable: true,
    description: 'Media where the staff member has a production role',
  })
  @OneToOne(() => AnimeConnection, { nullable: true })
  @JoinColumn()
  staffAnime?: AnimeConnection;

  @AutoMap()
  @Field((type) => Int, {
    nullable: true,
    description: `The amount of user's who have favourited the staff member`,
  })
  @Column({ type: 'int', nullable: true })
  favorites?: number;
}
