import { AutoMap } from '@automapper/classes';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export abstract class BaseDto {
  @AutoMap()
  @Field()
  id: string;

  @AutoMap()
  @Field()
  createdAt: Date;

  @AutoMap()
  @Field()
  updatedAt: Date;
}
