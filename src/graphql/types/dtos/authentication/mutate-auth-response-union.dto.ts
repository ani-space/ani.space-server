import { createUnionType } from '@nestjs/graphql';
import { InvalidInputError } from '~/common/dtos/common-dtos/invalid-input.dto';
import { UnauthorizedError } from '~/common/dtos/common-dtos/unauthorized-error.dto';
import { MutateAuthResponse } from './mutate-auth-response.dto';
import { InvalidCredentialsError } from './invalid-credentials-error.dto';

export const MutateAuthResultUnion = createUnionType({
  name: 'SignOutUserResultUnion',
  types: () => [
    MutateAuthResponse,
    UnauthorizedError,
    InvalidInputError,
    InvalidCredentialsError,
  ],
});
