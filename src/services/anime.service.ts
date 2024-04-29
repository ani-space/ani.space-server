import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateLoggerDto } from '~/common/dtos';
import { IAnimeRepository } from '~/contracts/repositories';
import { IAnimeService } from '~/contracts/services';
import { Anime } from '~/models';
import { LOGGER_CREATED } from '../common/constants/index';

@Injectable()
export class AnimeService implements IAnimeService {
  private readonly logger = new Logger(AnimeService.name);

  constructor(
    @Inject(IAnimeRepository) private readonly animeRepo: IAnimeRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async saveAnime(anime: Partial<Anime>): Promise<Anime | null> {
    try {
      return await this.animeRepo.save(anime);
    } catch (error) {
      this.logger.error(error?.message);

      this.eventEmitter.emit(LOGGER_CREATED, {
        requestObject: JSON.stringify(anime),
        errorMessage: JSON.stringify(error),
        tracePath: `AnimeService.createNewAnime`,
      } as CreateLoggerDto);

      return null;
    }
  }

  public async createManyNewAnime(
    animeList: Partial<Anime>[],
  ): Promise<Anime[] | null> {
    try {
      return await this.animeRepo.saveMany(animeList);
    } catch (error) {
      this.logger.error(error?.message);

      this.eventEmitter.emit(LOGGER_CREATED, {
        requestObject: JSON.stringify(animeList),
        errorMessage: JSON.stringify(error),
        tracePath: `AnimeService.createNewAnime`,
      } as CreateLoggerDto);

      return null;
    }
  }

  public async findAnimeByIdAnilist(
    idAnilist: number,
    saveNotFoundLog?: boolean,
  ): Promise<Anime | null> {
    const anime = await this.animeRepo.findByCondition({
      where: {
        idAnilist,
      },
    });

    if (!anime && saveNotFoundLog) {
      this.eventEmitter.emit(LOGGER_CREATED, {
        requestObject: JSON.stringify(idAnilist),
        notes: `Anime not found with anilistId: ${idAnilist}`,
        tracePath: `AnimeService.findAnimeByIdAnilist`,
      } as CreateLoggerDto);
    }

    return anime;
  }
}
