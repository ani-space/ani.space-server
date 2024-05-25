import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IAnimeHayService } from '~/contracts/services';
import { AnimeHayService } from '~/services/animehay.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          baseURL: configService.get<string>('ANIMEHAY_ENDPOINT') as string,
          headers: {
            Origin: configService.get<string>('ANIMEHAY_ENDPOINT') as string,
            Referer: configService.get<string>('ANIMEHAY_ENDPOINT') as string,
            Accept: '*/*',
            'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36`,
          },
        };
      },
    }),
  ],
  providers: [
    {
      provide: IAnimeHayService,
      useClass: AnimeHayService,
    },
  ],
})
export class AnimeHayModule {}
