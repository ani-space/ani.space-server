import { AutoMap } from '@automapper/classes';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { AnimeConnectionDto } from '../anime-dtos/anime-connection.dto';
import { BaseAnilistDto } from '../base-dtos/base-anilist.dto';
import { CharacterConnectionDto } from '../character-dtos/character-connection.dto';
import { FuzzyDateIntDto } from '../common-dtos/fuzzy-date-int.dto';
import { StaffImageDto } from './staff-image.dto';
import { StaffNameDto } from './staff-name.dto';
import { StaffPrimaryOccupationDto } from './staff-primary-occupations.dto';
import { StaffYearActiveDto } from './staff-year-active.dto';

@ObjectType()
export class StaffDto extends BaseAnilistDto {
  @AutoMap(() => StaffNameDto)
  @Field((type) => StaffNameDto, { nullable: true })
  name?: StaffNameDto;

  @AutoMap()
  @Field({ nullable: true })
  languageV2?: string;

  @AutoMap(() => StaffImageDto)
  @Field((type) => StaffImageDto, { nullable: true })
  image?: StaffImageDto;

  @AutoMap()
  @Field({ nullable: true })
  description?: string;

  @AutoMap()
  @Field({ nullable: true })
  gender?: string;

  @AutoMap(() => FuzzyDateIntDto)
  @Field((type) => FuzzyDateIntDto, { nullable: true })
  dateOfBirth?: FuzzyDateIntDto;

  @AutoMap(() => FuzzyDateIntDto)
  @Field((type) => FuzzyDateIntDto, { nullable: true })
  dateOfDeath?: FuzzyDateIntDto;

  @AutoMap(() => [StaffPrimaryOccupationDto])
  @Field(() => [StaffPrimaryOccupationDto], { nullable: true })
  primaryOccupations: StaffPrimaryOccupationDto[];

  @AutoMap()
  @Field((type) => Int, { nullable: true })
  age?: number;

  @AutoMap(() => StaffYearActiveDto)
  @Field((type) => StaffYearActiveDto, { nullable: true })
  yearsActive?: StaffYearActiveDto;

  @AutoMap()
  @Field({ nullable: true })
  homeTown?: string;

  @AutoMap()
  @Field({ nullable: true })
  bloodType?: string;

  @AutoMap(() => CharacterConnectionDto)
  @Field(() => CharacterConnectionDto, {
    nullable: true,
    description: 'Characters voiced by the actor',
  })
  characters?: CharacterConnectionDto;

  @AutoMap(() => AnimeConnectionDto)
  @Field(() => AnimeConnectionDto, {
    nullable: true,
    description: 'Media where the staff member has a production role',
  })
  staffAnime?: AnimeConnectionDto;

  @AutoMap()
  @Field((type) => Int, {
    nullable: true,
    description: `The amount of user's who have favourited the staff member`,
  })
  favorites?: number;
}
