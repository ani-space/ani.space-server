import { Field, InputType } from '@nestjs/graphql';
import { LoginSocialInput } from './login-social-input.dto';

@InputType()
export class RegisterSocialInput extends LoginSocialInput {
  @Field({ nullable: true })
  username?: string;
}
