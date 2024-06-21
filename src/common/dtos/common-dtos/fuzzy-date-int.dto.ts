import { AutoMap } from '@automapper/classes';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseDto } from '../base-dtos/base.dto';

@ObjectType()
export class FuzzyDateIntDto extends BaseDto {
  @AutoMap()
  @Field((type) => Int, { nullable: true })
  year?: number;

  @AutoMap()
  @Field((type) => Int, { nullable: true })
  month?: number;

  @AutoMap()
  @Field((type) => Int, { nullable: true })
  day?: number;
}
