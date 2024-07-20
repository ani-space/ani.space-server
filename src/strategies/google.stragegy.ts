import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
//@ts-ignore
import { Strategy } from 'passport-google-token';
import { GoogleConfig } from 'src/configs';
import { AuthTypes } from '~/common/types/auth.type';

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  Strategy,
  AuthTypes.GOOGLE,
) {
  constructor(
    @Inject(GoogleConfig.KEY)
    private googleConf: ConfigType<typeof GoogleConfig>,
  ) {
    super({
      clientID: googleConf.clientID,
      clientSecret: googleConf.clientSecret,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: Function,
  ) {
    if (!profile) {
      return done(new UnauthorizedException(), false);
    }
    return done(null, profile);
  }
}
