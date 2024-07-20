import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtConfig } from '~/configs';
import { ISocialProviderRepository } from '~/contracts/repositories/social-provider-repository.interface';
import { ITokenRepository } from '~/contracts/repositories/token-repository.interface';
import { IAuthService } from '~/contracts/services/auth-service.interface';
import { IUserService } from '~/contracts/services/user-service.interface';

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
}
