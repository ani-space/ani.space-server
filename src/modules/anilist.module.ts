import { GraphQLRequestModule } from '@golevelup/nestjs-graphql-request';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IAnilistService } from '~/contracts/services';
import { AnilistService } from '~/services';
import { MediaModule } from './media.module';
import {
  AnimeTitle,
  AnimeSynonyms,
  AnimeCoverImage,
  AnimeTrailer,
  AnimeDescription,
} from '../models/sub-models/anime-sub-models';
import { FuzzyDateInt } from '~/models/sub-models/common-sub-models';

@Module({
  imports: [
    MediaModule,

    TypeOrmModule.forFeature([
      AnimeTitle,
      AnimeSynonyms,
      AnimeCoverImage,
      AnimeTrailer,
      AnimeDescription,
      FuzzyDateInt,
    ]),

    GraphQLRequestModule.forRootAsync(GraphQLRequestModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          endpoint: config.get<string>('ANILIST_GRAPHQL_ENDPOINT') as string,
          options: {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          },
        };
      },
    }),
  ],
  providers: [
    {
      provide: IAnilistService,
      useClass: AnilistService,
    },
  ],
})
export class AnilistModule {}
