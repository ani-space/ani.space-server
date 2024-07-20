import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '~/models/user.model';
import { IUserRepository } from '~/contracts/repositories/user-repository.interface';

@Injectable()
export class UserRepository
  extends BaseRepository<User>
  implements IUserRepository
{
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }
}
