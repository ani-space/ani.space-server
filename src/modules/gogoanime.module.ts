import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GogoAnimeConfig } from '../configs/index';
import { MediaModule } from './media.module';
import { HttpModule } from '@nestjs/axios';
import { IGogoAnimeService } from '~/contracts/services';
import { GogoAnimeService } from '../services/gogoanime.service';

@Module({
  imports: [
    MediaModule,

    ConfigModule.forFeature(GogoAnimeConfig),

    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          baseURL: configService.get<string>('GOGOANIME_ENDPOINT') as string,
          headers: {
            Origin: configService.get<string>('GOGOANIME_ENDPOINT') as string,
            Referer: configService.get<string>('GOGOANIME_ENDPOINT') as string,
            Accept: '*/*',
            'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36`,
          },
        };
      },
    }),
  ],
  providers: [
    {
      provide: IGogoAnimeService,
      useClass: GogoAnimeService,
    },
  ],
})
export class GogoAnimeModule {}
