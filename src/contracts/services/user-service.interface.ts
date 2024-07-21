import { SocialProvider } from '~/models/social-provider.model';
import { User } from '~/models/user.model';

export interface IUserService {
  getUserByConditions(user: Partial<User>): Promise<User | null>;

  existsByCredentials(user: Pick<User, 'email' | 'userName'>): Promise<boolean>;

  createUser(user: Partial<User>): Promise<Omit<User, 'password'>>;

  updateUserPassword(userId: string, newPassword: string): Promise<User | null>;

  saveProviderAndUser(
    user: Partial<User>,
    provider: Partial<SocialProvider>,
  ): Promise<User>;
}

export const IUserService = Symbol('IUserService');
