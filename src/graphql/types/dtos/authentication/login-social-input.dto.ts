import { Field, InputType } from '@nestjs/graphql';
import { IsString, MinLength } from 'class-validator';
import { SocialProviderTypes } from '~/models/social-provider.model';

@InputType()
export class LoginSocialInput {
  @Field()
  @IsString()
  @MinLength(1)
  accessToken: string;

  @Field((_type) => SocialProviderTypes)
  provider: SocialProviderTypes;
}
