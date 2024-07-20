import { registerEnumType } from '@nestjs/graphql';
import { SocialProviderTypes } from '~/models/social-provider.model';

export const AuthTypes = {
  ...SocialProviderTypes,
  JWT: 'jwt',
  RefreshJwt: 'refresh-jwt',
};

registerEnumType(AuthTypes, {
  name: 'AuthTypes',
});
