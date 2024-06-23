import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { useMaskedErrors } from '@envelop/core';
import { YogaDriver, YogaDriverConfig } from '@graphql-yoga/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { GraphQLError } from 'graphql';
import { join } from 'path';
import { envSchema } from '~/configs/env.schema';
import { DatabaseConfig } from './configs/index';
import {
  AnilistModule,
  AnimeHayModule,
  AnimevsubModule,
  LoggerModule,
  MediaModule,
  TriggerModule,
} from './modules';
import { GogoAnimeModule } from './modules/gogoanime.module';
@Module({
  imports: [
    LoggerModule,
    MediaModule,
    TriggerModule,
    AnilistModule,
    AnimevsubModule,
    AnimeHayModule,
    GogoAnimeModule,

    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),

    EventEmitterModule.forRoot({
      ignoreErrors: true,
    }),

    ConfigModule.forRoot({
      cache: true,
      validationSchema: envSchema,
      load: [DatabaseConfig],
    }),

    GraphQLModule.forRootAsync<YogaDriverConfig>({
      driver: YogaDriver,
      useFactory: () => {
        return {
          playground: true,
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          maskedErrors: true,
          plugins: [
            useMaskedErrors({
              maskError: (error: any) => {
                return new GraphQLError('Sorry, something went wrong.');
              },
            }),
          ],
        };
      },
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const dbOptions: TypeOrmModuleOptions = {
          type: 'postgres',
          host: config.get<string>('PG_HOST'),
          port: Number(config.get<string>('PG_PORT')),
          username: config.get<string>('PG_USERNAME'),
          password: config.get<string>('PG_PASSWORD'),
          database: config.get<string>('PG_DB'),
          entities: ['dist/**/*.+(model|enum).js'],
          autoLoadEntities: true,
          migrations: ['dist/db/migrations/*.js'],
          migrationsRun: true,
          synchronize: false,
        };
        return dbOptions;
      },
    }),
  ],
})
export class AppModule {}
