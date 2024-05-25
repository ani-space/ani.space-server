import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { Anime } from '~/models';
import { IAnimeRepository } from '~/contracts/repositories';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class AnimeRepository
  extends BaseRepository<Anime>
  implements IAnimeRepository
{
  constructor(
    @InjectRepository(Anime)
    private readonly animeRepository: Repository<Anime>,
    private dataSource: DataSource,
  ) {
    super(animeRepository);
  }

  public async fuzzySearchAnimeByTitle(title: string) {
    const rawData = await this.dataSource.manager.query(`
      SELECT 
        word_similarity(at.english, '${title}') as englishMatchingScore, 
        word_similarity(at.romaji, '${title}') as romajiMatchingScore,
        word_similarity(at.native, '${title}') as nativeMatchingScore,
        word_similarity(at."userPreferred", '${title}') as userPreferredMatchingScore,
        a."idAnilist",
        a.id
      FROM "anime" as a
      INNER JOIN "animeTitles" as at ON a."titleId" = at.id
      WHERE at.romaji % '${title}'
        OR at.english % '${title}'
        OR at.native % '${title}'
        OR at."userPreferred" % '${title}'
      `);

    return rawData;
  }
}
