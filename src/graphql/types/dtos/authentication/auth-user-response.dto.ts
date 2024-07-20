import { Field, ObjectType } from '@nestjs/graphql';
import { UserDto } from '~/common/dtos/user-dtos/user.dto';

@ObjectType()
export class AuthUserResponse {
  @Field((_type) => UserDto)
  user: UserDto;

  @Field()
  access_token: string;

  @Field()
  refresh_token: string;

  constructor(partial?: Partial<AuthUserResponse>) {
    Object.assign(this, partial);
  }
}
