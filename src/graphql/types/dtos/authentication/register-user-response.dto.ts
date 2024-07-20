import { createUnionType } from '@nestjs/graphql';
import { AuthUserResponse } from './auth-user-response.dto';
import { InvalidInputError } from '~/common/dtos/common-dtos/invalid-input.dto';
import { CredentialsTakenError } from './credentials-taken-error.dto';

export const RegisterUserResultUnion = createUnionType({
  name: 'RegisterUserResult',
  types: () => [AuthUserResponse, InvalidInputError, CredentialsTakenError],
});
