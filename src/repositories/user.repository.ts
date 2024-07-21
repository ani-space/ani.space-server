import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '~/models/user.model';
import { IUserRepository } from '~/contracts/repositories/user-repository.interface';
import { SocialProvider } from '~/models/social-provider.model';

@Injectable()
export class UserRepository
  extends BaseRepository<User>
  implements IUserRepository
{
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private dataSource: DataSource,
  ) {
    super(userRepository);
  }

  public async saveProviderAndUser(
    user: Partial<User>,
    provider: Partial<SocialProvider>,
  ) {
    return this.dataSource.manager.transaction(async (transactionalManager) => {
      const createdUser = transactionalManager.create(User, user);
      const savedUser = await transactionalManager.save(createdUser);

      await transactionalManager.save(SocialProvider, {
        user: savedUser,
        ...provider,
      });

      return savedUser;
    });
  }
}
