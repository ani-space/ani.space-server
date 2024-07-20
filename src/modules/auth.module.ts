import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from 'graphql';
import { GoogleConfig, JwtConfig } from '~/configs';
import { SocialProvider } from '~/models/social-provider.model';

@Module({
  imports: [
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

    // UserModule,
    TypeOrmModule.forFeature([Token, SocialProvider]),
  ],
})
export class AuthModule {}
