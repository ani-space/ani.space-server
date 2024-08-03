import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { GqlUser } from '~/common/decorators/gql-user.decorator';
import { UserDto } from '~/common/dtos/user-dtos/user.dto';
import { IUserService } from '~/contracts/services/user-service.interface';
import { JwtAuthGuard } from '~/guards';
import { User } from '~/models/user.model';
import { UserActions } from '../types/enums/actions.enum';
import { UnauthorizedExceptionFilter } from '~/common/filters/unauthorized-exception.filter';
import { CurrentUserResultUnion } from '../types/dtos/users/get-current-user-dto.repsonse';

@Resolver(() => UserDto)
@UseFilters(UnauthorizedExceptionFilter)
export class UserResolver {
  constructor(
    @Inject(IUserService)
    private readonly userService: IUserService,

    @InjectMapper()
    private readonly mapper: Mapper,
  ) {}

  @Query((returns) => [CurrentUserResultUnion], {
    name: UserActions.CurrentUser,
  })
  @UseGuards(JwtAuthGuard)
  getUserInfo(@GqlUser() currentUser: User) {
    return [this.mapper.map(currentUser, User, UserDto)];
  }
}
