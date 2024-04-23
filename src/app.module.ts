import { join } from 'path';
import { UserResolver } from '~/graphql/resolvers/user.resolver';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: () => {
        return {
          playground: true,
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          formatError: (error) => {
            return {
              message: error.message,
              code: error.extensions?.code,
            };
          },
        };
      },
    }),
  ],
  controllers: [],
  providers: [UserResolver],
})
export class AppModule {}
