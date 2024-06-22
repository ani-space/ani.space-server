import { AutoMap } from '@automapper/classes';
import { Field, ObjectType } from '@nestjs/graphql';
import { AnimeConnectionDto } from '../anime-dtos/anime-connection.dto';
import { BaseAnilistDto } from '../base-dtos/base-anilist.dto';
import { FuzzyDateIntDto } from '../common-dtos/fuzzy-date-int.dto';
import { CharacterImageDto } from './character-image.dto';
import { CharacterNameDto } from './character-name.dto';

@ObjectType()
export class CharacterDto extends BaseAnilistDto {
  @AutoMap(() => CharacterNameDto)
  @Field((type) => CharacterNameDto, { nullable: true })
  name?: CharacterNameDto;

  @AutoMap(() => CharacterImageDto)
  @Field((type) => CharacterImageDto, { nullable: true })
  image?: CharacterImageDto;

  @AutoMap()
  @Field({ nullable: true })
  description?: string;

  @AutoMap()
  @Field({ nullable: true })
  gender?: string;

  @AutoMap(() => FuzzyDateIntDto)
  @Field((type) => FuzzyDateIntDto, { nullable: true })
  dateOfBirth?: FuzzyDateIntDto;

  @AutoMap()
  @Field({ nullable: true })
  age?: string;

  @AutoMap()
  @Field({ nullable: true })
  bloodType?: string;

  @AutoMap(() => AnimeConnectionDto)
  @Field(() => AnimeConnectionDto, { nullable: true })
  anime?: AnimeConnectionDto;
}
