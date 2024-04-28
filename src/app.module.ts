import { join } from 'path';
import { UserResolver } from '~/graphql/resolvers/user.resolver';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envSchema } from '~/configs/env.schema';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MediaModule } from './modules';
import { YogaDriver, YogaDriverConfig } from '@graphql-yoga/nestjs';

@Module({
  imports: [
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
            console.log('error: ', error)
            // return {
            //   message: error.message,
            //   code: error.extensions?.code,
            // };
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
