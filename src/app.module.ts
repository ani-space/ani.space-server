import { YogaDriver, YogaDriverConfig } from '@graphql-yoga/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { envSchema } from '~/configs/env.schema';
import { UserResolver } from '~/graphql/resolvers/user.resolver';
import { LoggerModule, MediaModule } from './modules';

@Module({
  imports: [
    LoggerModule,
    MediaModule,

    ConfigModule.forRoot({
      cache: true,
      validationSchema: envSchema,
    }),

    GraphQLModule.forRootAsync<YogaDriverConfig>({
      driver: YogaDriver,
      useFactory: () => {
        return {
          playground: true,
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          catch: (error) => {
            console.log('error: ', error);
            // TODO: format Error here
          },
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
          synchronize: true,
          entities: ['dist/**/*.+(model|enum).js'],
          autoLoadEntities: true,
        };
        return dbOptions;
      },
    }),
  ],
  controllers: [],
  providers: [UserResolver],
})
export class AppModule {}
