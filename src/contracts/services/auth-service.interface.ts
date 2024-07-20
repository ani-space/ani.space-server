import { AuthUserResponse } from '~/graphql/types/dtos/authentication/auth-user-response.dto';
import { CredentialsTakenError } from '~/graphql/types/dtos/authentication/credentials-taken-error.dto';
import { RegisterUserInput } from '~/graphql/types/dtos/authentication/register-user.input';
import { User } from '~/models/user.model';
import { Either } from '~/utils/tools/either';

export interface IAuthService {
  registerUser(
    user: RegisterUserInput,
  ): Promise<Either<CredentialsTakenError, User>>;

  signTokens(user: User): Promise<AuthUserResponse>;
}

export const IAuthService = Symbol('IAuthService');
