import { createUnionType } from '@nestjs/graphql';
import { AuthUserResponse } from './auth-user-response.dto';
import { CredentialsTakenError } from './credentials-taken-error.dto';
import { SocialAlreadyAssignedError } from './social-already-assigned-error.dto';
import { InvalidInputError } from '~/common/dtos/common-dtos/invalid-input.dto';
import { UnauthorizedError } from '~/common/dtos/common-dtos/unauthorized-error.dto';

export const RegisterSocialResultUnion = createUnionType({
  name: 'RegisterSocialResult',
  types: () => [
    AuthUserResponse,
    InvalidInputError,
    SocialAlreadyAssignedError,
    CredentialsTakenError,
    UnauthorizedError,
  ],
});
