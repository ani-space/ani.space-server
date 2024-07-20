import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ValidateInput } from '~/common/decorators/validate-input.decorator';
import { IAuthService } from '~/contracts/services/auth-service.interface';
import { RegisterUserResultUnion } from '../types/dtos/authentication/register-user-response.dto';
import { AuthActions } from '../types/enums/actions.enum';
import { RegisterUserInput } from '../types/dtos/authentication/register-user.input';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { UserDto } from '~/common/dtos/user-dtos/user.dto';
import { User } from '~/models/user.model';
import { LoginUserResultUnion } from '../types/dtos/authentication/login-user-response.dto';
import { LoginUserInput } from '../types/dtos/authentication/login-user.input';
import { InvalidCredentialsError } from '../types/dtos/authentication/invalid-credentials-error.dto';

@Resolver()
export class AuthResolver {
  constructor(
    @Inject(IAuthService)
    private readonly authService: IAuthService,

    @InjectMapper()
    private readonly mapper: Mapper,
  ) {}

  @ValidateInput()
  @Mutation(() => [RegisterUserResultUnion], {
    name: AuthActions.SignUpInternal,
  })
  public async register(
    @Args('registerUserInput') registerUserInput: RegisterUserInput,
  ) {
    const result = await this.authService.registerUser(registerUserInput);

    if (result.isError()) {
      return [result.value];
    }

    const authUser = await this.authService.signTokens(result.value);

    authUser.user = this.mapper.map(authUser.user, User, UserDto);
    return [authUser];
  }

  @ValidateInput()
  @Mutation(() => [LoginUserResultUnion], {
    name: AuthActions.SignInInternal,
  })
  public async signInInternal(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
  ): Promise<Array<typeof LoginUserResultUnion>> {
    const result = await this.authService.validateCredentials(
      loginUserInput.email,
      loginUserInput.password,
    );

    if (result.isError()) {
      return [result.value as unknown as InvalidCredentialsError];
    }

    const authUser = await this.authService.signTokens(result.value);
    authUser.user = this.mapper.map(authUser.user, User, UserDto);
    return [authUser];
  }
}
