import { Module } from '@nestjs/common';
import { IAnilistService } from '~/contracts/services';
import { AnilistService } from '~/services';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLRequestModule } from '@golevelup/nestjs-graphql-request';

@Module({
  imports: [
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
