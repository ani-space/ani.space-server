import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { AnimeTag } from '~/models/sub-models/anime-sub-models';
import { IAnimeTagRepository } from '~/contracts/repositories';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AnimeTagRepository
  extends BaseRepository<AnimeTag>
  implements IAnimeTagRepository
{
  constructor(
    @InjectRepository(AnimeTag)
    private readonly animeTagRepo: Repository<AnimeTag>,
  ) {
    super(animeTagRepo);
  }
}
