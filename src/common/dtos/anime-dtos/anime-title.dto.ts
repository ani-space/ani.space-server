import { AutoMap } from '@automapper/classes';
import { BaseDto } from '../base-dtos/base.dto';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AnimeTitleDto extends BaseDto {
  @AutoMap()
  @Field({ nullable: true })
  romaji?: string;

  @AutoMap()
  @Field({ nullable: true })
  english?: string;

  @AutoMap()
  @Field({ nullable: true })
  vietnamese?: string;

  @AutoMap()
  @Field({ nullable: true })
  native?: string;

  @AutoMap()
  @Field({ nullable: true })
  userPreferred?: string;
}
