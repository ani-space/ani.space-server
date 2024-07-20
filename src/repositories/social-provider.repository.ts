import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { SocialProvider } from '~/models/social-provider.model';
import { ISocialProviderRepository } from '~/contracts/repositories/social-provider-repository.interface';

@Injectable()
export class SocialProviderRepository
  extends BaseRepository<SocialProvider>
  implements ISocialProviderRepository
{
  constructor(
    @InjectRepository(SocialProvider)
    private readonly socialProviderRepository: Repository<SocialProvider>,
  ) {
    super(socialProviderRepository);
  }
}
