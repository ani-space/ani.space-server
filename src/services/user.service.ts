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
}
