import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLoggerDto } from '~/common/dtos';
import {
  IAnimeRepository
} from '~/contracts/repositories';
import { IAnimeService } from '~/contracts/services';
import { Anime } from '~/models';
import { AnimeEdge } from '~/models/anime-edge.model';
import { LOGGER_CREATED } from '../common/constants/index';
import { IPaginateResult } from '../contracts/dtos/paginate-result.interface';
import {
  AnimeConnection,
  AnimeCoverImage,
  AnimeDescription,
  AnimeSynonyms,
  AnimeTitle,
  AnimeTrailer,
} from '../models/sub-models/anime-sub-models';

@Injectable()
export class AnimeService implements IAnimeService {
  private readonly logger = new Logger(AnimeService.name);

  constructor(
    @Inject(IAnimeRepository) private readonly animeRepo: IAnimeRepository,
    @InjectRepository(AnimeTitle) private readonly animeTitleRepo: Repository<AnimeTitle>,
    @InjectRepository(AnimeConnection) private readonly animeConnectionRepo: Repository<AnimeConnection>,
    @InjectRepository(AnimeSynonyms) private readonly animeSynonymsRepo: Repository<AnimeSynonyms>,
    @InjectRepository(AnimeCoverImage) private readonly animeCoverImageRepo: Repository<AnimeCoverImage>,
    @InjectRepository(AnimeEdge) private readonly animeEdgeRepo: Repository<AnimeEdge>,
    @InjectRepository(AnimeTrailer) private readonly animeTrailerRepo: Repository<AnimeTrailer>,
    @InjectRepository(AnimeDescription) private readonly animeDescRepo: Repository<AnimeDescription>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async saveAnime(anime: Partial<Anime>): Promise<Anime | null> {
    try {
      return await this.animeRepo.save(anime);
    } catch (error) {
      return this.handleServiceErrors(error, anime, 'AnimeService.saveAnime');
    }
  }

  public saveAnimeConnection(
    animeConnection: Partial<AnimeConnection>,
  ): Promise<Partial<AnimeConnection> & AnimeConnection> | null {
    try {
      return this.animeConnectionRepo.save(animeConnection);
    } catch (error) {
      return this.handleServiceErrors(
        error,
        animeConnection,
        'AnimeService.saveAnimeConnection',
      );
    }
  }

  public async saveManyAnimeEdge(
    animeEdgeList: Partial<AnimeEdge>[],
  ): Promise<(Partial<AnimeEdge> & AnimeEdge)[] | null> {
    try {
      return this.animeEdgeRepo.save(animeEdgeList);
    } catch (error) {
      return this.handleServiceErrors(
        error,
        animeEdgeList,
        'AnimeService.saveManyAnimeEdge',
      );
    }
  }

  public async saveAnimeDesc(
    animeDesc: Partial<AnimeDescription>,
  ): Promise<(Partial<AnimeDescription> & AnimeDescription) | null> {
    try {
      return this.animeDescRepo.save(animeDesc);
    } catch (error) {
      return this.handleServiceErrors(
        error,
        animeDesc,
        'AnimeService.saveAnimeDesc',
      );
    }
  }

  public async saveAnimeTrailer(
    animeTrailer: Partial<AnimeTrailer>,
  ): Promise<(Partial<AnimeTrailer> & AnimeTrailer) | null> {
    try {
      return await this.animeTrailerRepo.save(animeTrailer);
    } catch (error) {
      return this.handleServiceErrors(
        error,
        animeTrailer,
        'AnimeService.saveAnimeTrailer',
      );
    }
  }

  public async saveAnimeTitle(
    animeTitle: Partial<AnimeTitle>,
  ): Promise<(Partial<AnimeTitle> & AnimeTitle) | null> {
    try {
      return await this.animeTitleRepo.save(animeTitle);
    } catch (error) {
      return this.handleServiceErrors(
        error,
        animeTitle,
        'AnimeService.saveAnimeTitle',
      );
    }
  }

  public async saveAnimeSynonyms(
    animeSynonyms: Partial<AnimeSynonyms>,
  ): Promise<(Partial<AnimeSynonyms> & AnimeSynonyms) | null> {
    try {
      return await this.animeSynonymsRepo.save(animeSynonyms);
    } catch (error) {
      return this.handleServiceErrors(
        error,
        animeSynonyms,
        'AnimeService.saveAnimeSynonyms',
      );
    }
  }

  public async saveAnimeCoverImage(
    animeCoverImage: Partial<AnimeCoverImage>,
  ): Promise<(Partial<AnimeCoverImage> & AnimeCoverImage) | null> {
    try {
      return await this.animeCoverImageRepo.save(animeCoverImage);
    } catch (error) {
      return this.handleServiceErrors(
        error,
        animeCoverImage,
        'AnimeService.saveAnimeCoverImage',
      );
    }
  }

  public async createManyNewAnime(
    animeList: Partial<Anime>[],
  ): Promise<Anime[] | null> {
    try {
      return await this.animeRepo.saveMany(animeList);
    } catch (error) {
      return this.handleServiceErrors(
        error,
        animeList,
        'AnimeService.createNewAnime',
      );
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

  public async getAnimeListV1(
    page: number = 1,
    limit: number = 10,
  ): Promise<IPaginateResult<Anime>> {
    const [result, count] = await this.animeRepo.findAndCount({
      relations: {
        characters: {
          nodes: true,
        },
        staff: {
          nodes: true,
        },
        studios: {
          nodes: true,
        },
        airingSchedule: {
          nodes: true,
        },
        trends: {
          nodes: true,
        },
      },
      take: limit,
      skip: (page - 1) * limit,
      order: {
        idAnilist: 'ASC',
      },
    });

    const lastPage = Math.ceil(count / limit);
    const animePage: IPaginateResult<Anime> = {
      pageInfo: {
        total: count,
        perPage: limit,
        currentPage: page,
        lastPage,
        hasNextPage: page < lastPage,
      },
      docs: result,
    };

    return animePage;
  }

  private handleServiceErrors(
    error: any,
    obj: any,
    tracePath: string,
    notes?: string,
  ) {
    this.logger.error(error?.message);

    this.eventEmitter.emit(LOGGER_CREATED, {
      requestObject: JSON.stringify(obj),
      errorMessage: JSON.stringify(error),
      notes,
      tracePath: tracePath,
    } as CreateLoggerDto);

    return null;
  }
}
