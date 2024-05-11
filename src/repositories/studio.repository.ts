import { Injectable } from '@nestjs/common';
import { Studio } from '~/models/studio.model';
import { BaseRepository } from './base.repository';
import { IStudioRepository } from '~/contracts/repositories';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StudioRepository
  extends BaseRepository<Studio>
  implements IStudioRepository
{
  constructor(
    @InjectRepository(Studio)
    private readonly studioRepository: Repository<Studio>,
  ) {
    super(studioRepository);
  }
}
