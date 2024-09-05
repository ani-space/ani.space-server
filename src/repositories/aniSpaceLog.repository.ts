import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { IAniSpaceLogRepository } from '~/contracts/repositories/ani-space-log-repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AniSpaceLog } from '~/models';

@Injectable()
export class AniSpaceLogRepository
  extends BaseRepository<AniSpaceLog>
  implements IAniSpaceLogRepository
{
  constructor(
    @InjectRepository(AniSpaceLog) private readonly aniSpaceRepository: Repository<AniSpaceLog>,
  ) {
    super(aniSpaceRepository);
  }
}
