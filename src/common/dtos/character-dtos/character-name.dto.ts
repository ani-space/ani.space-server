import { AutoMap } from '@automapper/classes';
import { Field, ObjectType } from '@nestjs/graphql';
import { CharacterAlternativeSpoilersDto } from './character-alternative-spoiler.dto';
import { CharacterAlternativeDto } from './character-alternative.dto';

@ObjectType()
export class CharacterNameDto {
  @AutoMap()
  @Field({ nullable: true })
  first?: string;

  @AutoMap()
  @Field({ nullable: true })
  middle?: string;

  @AutoMap()
  @Field({ nullable: true })
  last?: string;

  @AutoMap()
  @Field({ nullable: true })
  full?: string;

  @AutoMap()
  @Field({ nullable: true })
  native?: string;

  @AutoMap(() => [CharacterAlternativeDto])
  @Field(() => [CharacterAlternativeDto], { nullable: true })
  alternative?: CharacterAlternativeDto[];

  @AutoMap(() => [CharacterAlternativeSpoilersDto])
  @Field(() => [CharacterAlternativeSpoilersDto], { nullable: true })
  alternativeSpoiler?: CharacterAlternativeSpoilersDto[];
}
