import { User } from '~/models/user.model';

export interface IUserService {
  getUserByConditions(user: Partial<User>): Promise<User | null>;
}

export const IUserService = Symbol('IUserService');
