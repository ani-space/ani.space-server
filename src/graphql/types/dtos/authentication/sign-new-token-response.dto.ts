import { createUnionType } from '@nestjs/graphql';
import { UnauthorizedError } from '~/common/dtos/common-dtos/unauthorized-error.dto';
import { AuthUserResponse } from './auth-user-response.dto';

export const SignNewTokenResultUnion = createUnionType({
  name: 'SignNewTokenResultUnion',
  types: () => [AuthUserResponse, UnauthorizedError],
});
