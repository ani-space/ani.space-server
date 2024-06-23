import {
  ClassSerializerInterceptor,
  Inject,
  Injectable,
  Logger,
  UseInterceptors,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLoggerDto } from '~/common/dtos';
import { IAnimeRepository } from '~/contracts/repositories';
import { IAnimeInternalService } from '~/contracts/services';
import { QueryAnimeArg } from '~/graphql/types/args/query-anime.arg';
import { Anime } from '~/models';
import { AnimeEdge } from '~/models/anime-edge.model';
import { AnimeStreamingEpisode } from '~/models/sub-models/anime-sub-models/anime-streaming-episode.model';
import { either, Either } from '~/utils/tools/either';
import { getMethodName } from '~/utils/tools/functions';
import { LOGGER_CREATED } from '../common/constants/index';
import { AnimeByFuzzySearch } from '../contracts/dtos/fuzzy-search-anime-dto.interface';
import { IPaginateResult } from '../contracts/dtos/paginate-result.interface';
import { IAnimeExternalService } from '../contracts/services/anime-service.interface';
import { NotFoundAnimeError } from '../graphql/types/dtos/anime-response/not-found-anime.error';
import { MediaExternalLink } from '../models/media-external-link.model';
import {
  AnimeConnection,
  AnimeCoverImage,
  AnimeDescription,
  AnimeSynonyms,
  AnimeTitle,
  AnimeTrailer,
} from '../models/sub-models/anime-sub-models';
import { AnimeStreamingEpisodeSource } from '../models/sub-models/anime-sub-models/anime-streaming-episode-sources.model';
import { MapResultSelect } from '../utils/tools/object';

@Injectable()
export class AnimeService
  implements IAnimeInternalService, IAnimeExternalService
{
  private readonly logger = new Logger(AnimeService.name);

  constructor(
    @Inject(IAnimeRepository)
    private readonly animeRepo: IAnimeRepository,

    @InjectRepository(AnimeTitle)
    private readonly animeTitleRepo: Repository<AnimeTitle>,

    @InjectRepository(MediaExternalLink)
    private readonly mediaExternalLinkRepo: Repository<MediaExternalLink>,

    @InjectRepository(AnimeConnection)
    private readonly animeConnectionRepo: Repository<AnimeConnection>,

    @InjectRepository(AnimeSynonyms)
    private readonly animeSynonymsRepo: Repository<AnimeSynonyms>,

    @InjectRepository(AnimeCoverImage)
    private readonly animeCoverImageRepo: Repository<AnimeCoverImage>,

    @InjectRepository(AnimeEdge)
    private readonly animeEdgeRepo: Repository<AnimeEdge>,

    @InjectRepository(AnimeTrailer)
    private readonly animeTrailerRepo: Repository<AnimeTrailer>,

    @InjectRepository(AnimeDescription)
    private readonly animeDescRepo: Repository<AnimeDescription>,

    @InjectRepository(AnimeStreamingEpisode)
    private readonly animeStreamingEpisodeRepo: Repository<AnimeStreamingEpisode>,

    @InjectRepository(AnimeStreamingEpisodeSource)
    private readonly animeStreamingEpisodeSourceRepo: Repository<AnimeStreamingEpisodeSource>,

    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async getAnimeByConditions(
    mapResultSelect: MapResultSelect,
    queryAnimeArg: QueryAnimeArg,
  ): Promise<Either<NotFoundAnimeError, Anime>> {
    const anime = await this.animeRepo.getAnimeByConditions(
      mapResultSelect,
      queryAnimeArg,
    );

    if (!anime) {
      return either.error(
        new NotFoundAnimeError({ requestObject: queryAnimeArg }),
      );
    }

    return either.of(anime);
  }

  public async saveAnimeStreamingEpisode(
    animeStreamingEpisode: Partial<AnimeStreamingEpisode>,
  ): Promise<(Partial<AnimeStreamingEpisode> & AnimeStreamingEpisode) | null> {
    try {
      return await this.animeStreamingEpisodeRepo.save(animeStreamingEpisode);
    } catch (error) {
      return this.handleServiceErrors(
        error,
        animeStreamingEpisode,
        `${AnimeService.name}.${getMethodName()}`,
      );
    }
  }

  public async getAnimeStreamingEpisodePageV1(
    page: number = 1,
    limit: number = 10,
  ): Promise<IPaginateResult<AnimeStreamingEpisode>> {
    const [result, count] = await this.animeStreamingEpisodeRepo.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: {
        createdAt: 'DESC',
      },
      cache: true,
    });

    const lastPage = Math.ceil(count / limit);
    const animeStreamingEpsPage: IPaginateResult<AnimeStreamingEpisode> = {
      pageInfo: {
        total: count,
        perPage: limit,
        currentPage: page,
        lastPage,
        hasNextPage: page < lastPage,
      },
      docs: result,
    };

    return animeStreamingEpsPage;
  }

  public async saveManyAnimeStreamingEpisodeSource(
    animeStreamingEpisodeSources: Array<Partial<AnimeStreamingEpisodeSource>>,
  ): Promise<
    | (Partial<AnimeStreamingEpisodeSource> & AnimeStreamingEpisodeSource)[]
    | null
  > {
    try {
      return await this.animeStreamingEpisodeSourceRepo.save(
        animeStreamingEpisodeSources,
      );
    } catch (error) {
      return this.handleServiceErrors(
        error,
        animeStreamingEpisodeSources,
        `${AnimeService.name}.${getMethodName()}`,
      );
    }
  }

  public async saveAnimeStreamingEpisodeSource(
    animeStreamingEpisodeSource: Partial<AnimeStreamingEpisodeSource>,
  ): Promise<
    (Partial<AnimeStreamingEpisodeSource> & AnimeStreamingEpisodeSource) | null
  > {
    try {
      return await this.animeStreamingEpisodeSourceRepo.save(
        animeStreamingEpisodeSource,
      );
    } catch (error) {
      return this.handleServiceErrors(
        error,
        animeStreamingEpisodeSource,
        `${AnimeService.name}.${getMethodName()}`,
      );
    }
  }

  public async getMediaExternalLinkListV1(
    page: number = 1,
    limit: number = 10,
    site: string = '',
  ): Promise<IPaginateResult<MediaExternalLink>> {
    const [result, count] = await this.mediaExternalLinkRepo.findAndCount({
      where: {
        site,
      },
      relations: {
        anime: {
          title: true,
          description: true,
        },
      },
      take: limit,
      skip: (page - 1) * limit,
      order: {
        createdAt: 'DESC',
      },
      cache: true,
    });

    const lastPage = Math.ceil(count / limit);
    const melResult: IPaginateResult<MediaExternalLink> = {
      pageInfo: {
        total: count,
        perPage: limit,
        currentPage: page,
        lastPage,
        hasNextPage: page < lastPage,
      },
      docs: result,
    };

    return melResult;
  }

  public async saveAnime(anime: Partial<Anime>): Promise<Anime | null> {
    try {
      return await this.animeRepo.save(anime);
    } catch (error) {
      return this.handleServiceErrors(
        error,
        anime,
        `${AnimeService.name}.${getMethodName()}`,
      );
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  public async fuzzySearchAnimeByTitle(
    title: string,
    saveNotFoundLog?: boolean,
  ) {
    const animeList = await this.animeRepo.fuzzySearchAnimeByTitle(title);

    if (!animeList && saveNotFoundLog) {
      this.eventEmitter.emit(LOGGER_CREATED, {
        requestObject: JSON.stringify(title),
        notes: `Anime not found with title: ${title}`,
        tracePath: `${AnimeService.name}.${getMethodName()}`,
      } as CreateLoggerDto);
    }

    return animeList.map(
      (raw) =>
        new AnimeByFuzzySearch({
          id: raw.id,
          idAnilist: raw.idAnilist,
          maxScore: Math.max(
            raw.englishmatchingscore,
            raw.nativematchingscore,
            raw.romajimatchingscore,
            raw.userpreferredmatchingscore,
          ),
          englishMatchingScore: raw.englishmatchingscore,
          nativeMatchingScore: raw.nativematchingscore,
          romajiMatchingScore: raw.romajimatchingscore,
          userPreferredMatchingScore: raw.userpreferredmatchingscore,
        }),
    );
  }

  public async saveMediaExternalLink(
    mediaExternalLink: Partial<MediaExternalLink>,
  ) {
    try {
      return await this.mediaExternalLinkRepo.save(mediaExternalLink);
    } catch (error) {
      return this.handleServiceErrors(
        error,
        mediaExternalLink,
        `${AnimeService.name}.${getMethodName()}`,
      );
    }
  }

  public async findMediaExternalLink(
    animePath: string,
    saveNotFoundLog?: boolean,
  ) {
    const mediaExternalLink = await this.mediaExternalLinkRepo.findOne({
      where: {
        animePath,
      },
    });

    if (!mediaExternalLink && saveNotFoundLog) {
      this.eventEmitter.emit(LOGGER_CREATED, {
        requestObject: JSON.stringify(animePath),
        notes: `MediaExternalLink not found with animePath: ${animePath}`,
        tracePath: `${AnimeService.name}.${getMethodName()}`,
      } as CreateLoggerDto);
    }

    return mediaExternalLink;
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
        `${AnimeService.name}.${getMethodName()}`,
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
        `${AnimeService.name}.${getMethodName()}`,
      );
    }
  }

  public async saveAnimeEdge(animeEdge: Partial<AnimeEdge>) {
    try {
      return this.animeEdgeRepo.save(animeEdge);
    } catch (error) {
      return this.handleServiceErrors(
        error,
        animeEdge,
        `${AnimeService.name}.${getMethodName()}`,
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
        `${AnimeService.name}.${getMethodName()}`,
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
        `${AnimeService.name}.${getMethodName()}`,
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
        `${AnimeService.name}.${getMethodName()}`,
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
        `${AnimeService.name}.${getMethodName()}`,
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
        `${AnimeService.name}.${getMethodName()}`,
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
      relations: {
        mediaExternalLink: true,
      },
    });

    if (!anime && saveNotFoundLog) {
      this.eventEmitter.emit(LOGGER_CREATED, {
        requestObject: JSON.stringify(idAnilist),
        notes: `Anime not found with anilistId: ${idAnilist}`,
        tracePath: `${AnimeService.name}.${getMethodName()}`,
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
        createdAt: 'DESC',
      },
      cache: true,
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
