import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Profile } from 'passport';
import { JwtConfig } from '~/configs';
import { ISocialProviderRepository } from '~/contracts/repositories/social-provider-repository.interface';
import { ITokenRepository } from '~/contracts/repositories/token-repository.interface';
import { IAuthService } from '~/contracts/services/auth-service.interface';
import { IUserService } from '~/contracts/services/user-service.interface';
import { AuthUserResponse } from '~/graphql/types/dtos/authentication/auth-user-response.dto';
import { CredentialsTakenError } from '~/graphql/types/dtos/authentication/credentials-taken-error.dto';
import { InvalidCredentialsError } from '~/graphql/types/dtos/authentication/invalid-credentials-error.dto';
import { RegisterUserInput } from '~/graphql/types/dtos/authentication/register-user.input';
import { SignOutUserInput } from '~/graphql/types/dtos/authentication/signout-user-input.dto';
import { SocialAlreadyAssignedError } from '~/graphql/types/dtos/authentication/social-already-assigned-error.dto';
import { ErrorResponse } from '~/graphql/types/dtos/error-response.interface';
import { SocialProviderTypes } from '~/models/social-provider.model';
import { User } from '~/models/user.model';
import { either, Either } from '~/utils/tools/either';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(IUserService)
    private readonly userService: IUserService,

    @Inject(ITokenRepository)
    private readonly tokenRepository: ITokenRepository,

    @Inject(JwtConfig.KEY)
    private readonly jwtConf: ConfigType<typeof JwtConfig>,

    @Inject(ISocialProviderRepository)
    private readonly socialProviderRepository: ISocialProviderRepository,

    private readonly jwtService: JwtService,
  ) {}

  public async registerUser(
    user: RegisterUserInput,
  ): Promise<Either<CredentialsTakenError, User>> {
    if (await this.userService.existsByCredentials(user)) {
      return either.error(
        new CredentialsTakenError({
          providedEmail: user.email,
        }),
      );
    }

    const newUser = await this.userService.createUser(user);
    return either.of(newUser);
  }

  public async signTokens(user: User): Promise<AuthUserResponse> {
    const payload = { email: user.email, sub: user.id };
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtConf.refreshSecret,
      expiresIn: this.jwtConf.refreshExpiresIn,
    });

    await this.tokenRepository.save({ user, token: refreshToken });

    return new AuthUserResponse({
      user,
      access_token: this.jwtService.sign(payload),
      refresh_token: refreshToken,
    });
  }

  public async validateCredentials(
    email: string,
    password: string,
  ): Promise<Either<InvalidCredentialsError, User>> {
    const user = await this.userService.getUserByConditions({ email });

    if (!user || !(await user?.comparePassword(password))) {
      return either.error(
        new InvalidCredentialsError({
          providedEmail: email,
        }),
      );
    }

    return either.of(user);
  }

  public async changeUserPassword(user: User, newPassword: string) {
    return this.userService.updateUserPassword(user.id, newPassword);
  }

  public async signOutUser(signOutUserInput: SignOutUserInput) {
    const { refresh_token } = signOutUserInput;

    return await this.tokenRepository.delete({ token: refresh_token });
  }

  public async registerExternalUser(
    profile: Profile,
    username: string,
    provider: SocialProviderTypes,
  ): Promise<Either<ErrorResponse, User>> {
    const email = profile.emails![0].value;
    const socialId = profile.id;

    // check existing social account
    if (
      await this.socialProviderRepository.findByCondition({
        where: { socialId },
      })
    ) {
      return either.error(
        new SocialAlreadyAssignedError({
          provider,
        }),
      );
    }

    // check existing account link to social
    if (
      await this.userService.existsByCredentials({
        email,
        userName: username,
      })
    ) {
      return either.error(
        new CredentialsTakenError({
          providedEmail: email,
          providedUsername: username,
        }),
      );
    }

    const newUser = await this.userService.saveProviderAndUser(
      {
        userName: username,
        email,
        password: randomStringGenerator(),
      },
      {
        provider,
        socialId,
      },
    );

    return either.of(newUser);
  }
}
