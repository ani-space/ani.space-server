import { createUnionType } from '@nestjs/graphql';
import { AuthUserResponse } from './auth-user-response.dto';
import { InvalidCredentialsError } from './invalid-credentials-error.dto';
import { InvalidInputError } from '~/common/dtos/common-dtos/invalid-input.dto';

export const LoginUserResultUnion = createUnionType({
  name: 'LoginUserResult',
  types: () => [AuthUserResponse, InvalidInputError, InvalidCredentialsError],
});
