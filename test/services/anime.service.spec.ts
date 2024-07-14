import { Test, TestingModule } from '@nestjs/testing';
import { IAnimeRepository } from '~/contracts/repositories';
import { IAnimeExternalService } from '~/contracts/services';
import { QueryAnimeArg } from '~/graphql/types/args/query-anime.arg';
import { NotFoundAnimeError } from '~/graphql/types/dtos/anime-response/not-found-anime.error';
import { AnimeService } from '~/services';
import { either } from '~/utils/tools/either';
import { MapResultSelect } from '~/utils/tools/object';
import { animeListDto } from '../__mocks__/anime.data';
import { QueryStreamingEpisodeSourceArg } from '~/graphql/types/args/query-anime-streaming-episode.arg';
import { animeStreamingEpsSources } from '../__mocks__/anime-source.data';
import { QueryAnimePageArg } from '~/graphql/types/args/query-anime-page.arg';

describe('AnimeService', () => {
  let service: IAnimeExternalService;

  const mockAnimeRepo = {
    getAnimeByConditions: jest.fn(),
    getAnimeStreamingEpisodeSources: jest.fn(),
    getAnimeList: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: IAnimeExternalService,
          useClass: AnimeService,
        },
        {
          provide: IAnimeRepository,
          useValue: mockAnimeRepo,
        },
      ],
    })
      .useMocker((token) => {
        return jest.fn();
      })
      .compile();

    service = module.get<IAnimeExternalService>(IAnimeExternalService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getAnimeList should return Anime list', async () => {
    // arrange
    const queryAnimePageArg: QueryAnimePageArg = {
      limit: 10,
      page: 1,
    };
    const mapResultSelect: MapResultSelect = {};
    mockAnimeRepo.getAnimeList.mockResolvedValue({
      animeList: animeListDto,
      count: 19944,
    });

    // act
    const { animeList, pageInfo } = await service.getAnimeList(
      queryAnimePageArg,
      mapResultSelect,
    );

    // assert
    expect(animeList).toEqual(animeListDto);
    expect(pageInfo).toMatchObject({
      currentPage: 1,
      hasNextPage: true,
      lastPage: 1995,
      perPage: 10,
      total: 19944,
    });
  });

  it('getAnimeList should return empty Anime list', async () => {
    // arrange
    const queryAnimePageArg: QueryAnimePageArg = {
      limit: 15,
      page: 1,
    };
    const mapResultSelect: MapResultSelect = {};
    mockAnimeRepo.getAnimeList.mockResolvedValue({
      animeList: [],
      count: 0,
    });

    // act
    const { animeList, pageInfo } = await service.getAnimeList(
      queryAnimePageArg,
      mapResultSelect,
    );

    // assert
    expect(animeList).toEqual([]);
    expect(pageInfo).toMatchObject({
      total: 0,
      currentPage: 1,
      hasNextPage: false,
      lastPage: 0,
      perPage: 15,
    });
  });

  it('getAnimeStreamingEpisodeSources should return sources list', async () => {
    // arrange
    const queryStreamingEpisodeSourceArg: QueryStreamingEpisodeSourceArg = {
      animeStreamingEpisodeId: '1f1a43cd-0a8a-4d09-81a4-3c70b3b75b8c',
    };
    const mapResultSelect: MapResultSelect = {};
    mockAnimeRepo.getAnimeStreamingEpisodeSources.mockResolvedValue(
      animeStreamingEpsSources,
    );

    // act
    const result = await service.getAnimeStreamingEpisodeSources(
      queryStreamingEpisodeSourceArg,
      mapResultSelect,
    );

    // assert
    expect(result).toMatchObject(animeStreamingEpsSources);
  });

  it('getAnimeStreamingEpisodeSources should return empty list', async () => {
    // arrange
    const queryStreamingEpisodeSourceArg: QueryStreamingEpisodeSourceArg = {
      animeStreamingEpisodeId: '1f1a43cd-0a8a-4d09-81a4-3c70b3b75b8c',
    };
    const mapResultSelect: MapResultSelect = {};
    mockAnimeRepo.getAnimeStreamingEpisodeSources.mockResolvedValue([]);

    // act
    const result = await service.getAnimeStreamingEpisodeSources(
      queryStreamingEpisodeSourceArg,
      mapResultSelect,
    );

    // assert
    expect(result).toEqual([]);
  });

  it('should return a NotFoundAnimeError when no anime is found', async () => {
    // Create a test queryAnimeArg and mapResultSelect
    const queryAnimeArg: QueryAnimeArg = { idAnilist: 10 };
    const mapResultSelect: MapResultSelect = { id: true };

    // Mock the animeRepo to return null
    mockAnimeRepo.getAnimeByConditions.mockResolvedValue(null);

    // Call the service method
    const result = await service.getAnimeByConditions(
      mapResultSelect,
      queryAnimeArg,
    );

    // Expect the result to be an error
    expect(result).toEqual(
      either.error(new NotFoundAnimeError({ requestObject: queryAnimeArg })),
    );
  });

  it('should return a valid anime when one is found', async () => {
    // Create a test queryAnimeArg and mapResultSelect
    const queryAnimeArg: QueryAnimeArg = { idAnilist: 1985 };
    const mapResultSelect: MapResultSelect = { id: true };

    // Mock the animeRepo to return animeDto
    mockAnimeRepo.getAnimeByConditions.mockResolvedValue(animeListDto[0]);

    // Call the service method
    const result = await service.getAnimeByConditions(
      mapResultSelect,
      queryAnimeArg,
    );

    // Expect the result to be a valid anime
    expect(result).toEqual(either.of(animeListDto[0]));
  });
});
