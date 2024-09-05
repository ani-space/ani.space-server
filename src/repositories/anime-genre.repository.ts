import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAnimeGenreRepository } from '~/contracts/repositories';
import { AnimeGenres } from '~/models/sub-models/anime-sub-models';
import { BaseRepository } from './base.repository';

@Injectable()
export class AnimeGenreRepository
  extends BaseRepository<AnimeGenres>
  implements IAnimeGenreRepository
{
  constructor(
    @InjectRepository(AnimeGenres)
    private readonly animeGenreRepository: Repository<AnimeGenres>,
  ) {
    super(animeGenreRepository);
  }
}
