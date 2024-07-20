import { Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from 'graphql';
import { GoogleConfig, JwtConfig } from '~/configs';
import { SocialProvider } from '~/models/social-provider.model';
import { UserModule } from './user.module';
import { GoogleStrategy, JwtStrategy, RefreshJwtStrategy } from '~/strategies';
import { ITokenRepository } from '~/contracts/repositories/token-repository.interface';
import { TokenRepository } from '~/repositories/token.repository';
import { IAuthService } from '~/contracts/services/auth-service.interface';
import { AuthService } from '~/services/auth.service';
import { ISocialProviderRepository } from '~/contracts/repositories/social-provider-repository.interface';
import { SocialProviderRepository } from '~/repositories/social-provider.repository';
import { AuthResolver } from '~/graphql/resolvers/auth.resolver';

const tokenRepositoryProvider: Provider = {
  provide: ITokenRepository,
  useClass: TokenRepository,
};
const authServiceProvider: Provider = {
  provide: IAuthService,
  useClass: AuthService,
};
const socialProviderRepository: Provider = {
  provide: ISocialProviderRepository,
  useClass: SocialProviderRepository,
};
@Module({
  imports: [
    UserModule,

    ConfigModule.forFeature(GoogleConfig),
    ConfigModule.forFeature(JwtConfig),
    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('jwt.secret'),
          signInOptions: {
            expiresIn: configService.get('jwt.expiresIn'),
          },
        };
      },
      inject: [ConfigService],
    }),

    TypeOrmModule.forFeature([Token, SocialProvider]),
  ],

  providers: [
    AuthResolver,

    GoogleStrategy,
    JwtStrategy,
    RefreshJwtStrategy,

    tokenRepositoryProvider,
    authServiceProvider,
    socialProviderRepository,
  ],
})
export class AuthModule {}
