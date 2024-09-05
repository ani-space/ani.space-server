import { AutoMap } from '@automapper/classes';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseDto } from '../base-dtos/base.dto';

@ObjectType()
export class AnimeDescriptionDto extends BaseDto {
  @AutoMap()
  @Field({ nullable: true })
  english?: string;

  @AutoMap()
  @Field({ nullable: true })
  englishAIGenerate?: string;

  @AutoMap()
  @Field({ nullable: true })
  vietnamese?: string;

  @AutoMap()
  @Field({ nullable: true })
  vietnameseAIGenerate?: string;
}
