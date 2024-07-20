import { User } from '~/models/user.model';

export interface IUserService {
  getUserByConditions(user: Partial<User>): Promise<User | null>;

  existsByCredentials(user: Pick<User, 'email' | 'userName'>): Promise<boolean>;

  createUser(user: Partial<User>): Promise<Omit<User, 'password'>>;

  updateUserPassword(userId: string, newPassword: string): Promise<User | null>;
}

export const IUserService = Symbol('IUserService');
