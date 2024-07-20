import { Field, InputType, PickType } from '@nestjs/graphql';
import { MinLength } from 'class-validator';
import { UserDto } from '~/common/dtos/user-dtos/user.dto';

@InputType('RegisterUserInput')
export class RegisterUserInput extends PickType(UserDto, ['email'], InputType) {
  @Field()
  @MinLength(6)
  password: string;
}
