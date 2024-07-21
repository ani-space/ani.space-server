import { User } from '~/models/user.model';
import { IBaseRepository } from './base-repository.interface';
import { SocialProvider } from '~/models/social-provider.model';

export interface IUserRepository extends IBaseRepository<User> {
  saveProviderAndUser(
    user: Partial<User>,
    provider: Partial<SocialProvider>,
  ): Promise<User>;
}

export const IUserRepository = Symbol('IUserRepository');
