import { createUnionType } from '@nestjs/graphql';
import { UnauthorizedError } from '~/common/dtos/common-dtos/unauthorized-error.dto';
import { UserDto } from '~/common/dtos/user-dtos/user.dto';

export const CurrentUserResultUnion = createUnionType({
  name: 'CurrentUserResultUnion',
  types: () => [UserDto, UnauthorizedError],
});
