import { AutoMap } from '@automapper/classes';
import { BaseDto } from './base.dto';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export abstract class BaseAnilistDto extends BaseDto {
  @AutoMap()
  @Field((type) => Int)
  idAnilist: number;
}
