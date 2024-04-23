import { User } from '~/models/user.model';
import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class UserResolver {
  @Query((returns) => User, { name: 'User' })
  getUser() {
    return {
      id: 1,
      userName: 'userName',
    };
  }
}
