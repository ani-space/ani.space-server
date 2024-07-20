import { AutoMap } from '@automapper/classes';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { BaseDto } from '../base-dtos/base.dto';

@ObjectType()
export class UserDto extends BaseDto {
  @AutoMap()
  @Field({ nullable: true })
  userName?: string;

  @AutoMap()
  @Field()
  @IsEmail()
  email: string;

  @AutoMap()
  @Field({ nullable: true })
  displayName?: string;
}
