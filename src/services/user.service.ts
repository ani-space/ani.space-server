import { Inject, Injectable } from '@nestjs/common';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { IUserRepository } from '~/contracts/repositories/user-repository.interface';
import { IUserService } from '~/contracts/services/user-service.interface';
import { User } from '~/models/user.model';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(IUserRepository)
    private readonly usersRepository: IUserRepository,

    private dataSource: DataSource,
  ) {}

  public async getUserByConditions(user: Partial<User>) {
    const { password, ...userWithoutPassword } = user;
    const result = await this.usersRepository.findByCondition({
      where: userWithoutPassword as FindOptionsWhere<User>,
    });

    return result;
  }

  public async existsByCredentials(
    user: Pick<User, 'email' | 'userName'>,
  ): Promise<boolean> {
    const result = await this.usersRepository.findByCondition({
      where: [{ email: user.email }, { userName: user.userName }],
    });
    return !!result;
  }

  public async createUser(
    user: Partial<User>,
  ): Promise<Omit<User, 'password'>> {
    const newUser = this.usersRepository.create(user);
    await this.usersRepository.save(newUser);
    const { password, ...newUserWithoutPassword } = newUser;

    return newUserWithoutPassword as Omit<User, 'password'>;
  }

  public async updateUserPassword(userId: string, newPassword: string) {
    const user = await this.usersRepository.findOneById(userId);

    if (!user) {
      return null;
    }

    user.password = newPassword;
    return await this.usersRepository.save(user);
  }
}
