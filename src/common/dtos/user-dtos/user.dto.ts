import { AutoMap } from '@automapper/classes';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@ObjectType()
export class UserDto {
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
