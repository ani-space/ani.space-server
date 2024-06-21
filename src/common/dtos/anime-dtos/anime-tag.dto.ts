import { AutoMap } from '@automapper/classes';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseDto } from '../base-dtos/base.dto';

@ObjectType()
export class AnimeTagDto extends BaseDto {
  @AutoMap()
  @Field()
  name: string;

  @AutoMap()
  @Field({ nullable: true })
  descriptionEn?: string;

  @AutoMap()
  @Field({ nullable: true })
  descriptionVi?: string;

  @AutoMap()
  @Field({ nullable: true })
  category?: string;

  @AutoMap()
  @Field((type) => Int, { nullable: true })
  rank: number;

  @AutoMap()
  @Field({ nullable: true })
  isGeneralSpoiler?: boolean;

  @AutoMap()
  @Field({ nullable: true })
  isMediaSpoiler?: boolean;

  @AutoMap()
  @Field({ nullable: true })
  isAdult?: boolean;
}
