import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { Anime } from '~/models';
import { IAnimeRepository } from '~/contracts/repositories';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AnimeRepository
  extends BaseRepository<Anime>
  implements IAnimeRepository
{
  constructor(
    @InjectRepository(Anime)
    private readonly animeRepository: Repository<Anime>,
  ) {
    super(animeRepository);
  }
}
