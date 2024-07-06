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

describe('AnimeService', () => {
  let service: IAnimeExternalService;

  const mockAnimeRepo = {
    getAnimeByConditions: jest.fn(),
    getAnimeStreamingEpisodeSources: jest.fn(),
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
