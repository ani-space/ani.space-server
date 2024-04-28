import { User } from '~/models/user.model';
import { Query, Resolver } from '@nestjs/graphql';
import { Anime } from '~/models';

@Resolver()
export class UserResolver {
  @Query((returns) => User, { name: 'User' })
  getUser() {
    return {
      id: 1,
      userName: 'userName',
    };
  }

  @Query((returns) => Anime, { name: 'Anime' })
  test() {
    return {
      id: 1,
      userName: 'userName',
    };
  }
}
