import { Test, TestingModule } from '@nestjs/testing';
import { IAnimeRepository } from '~/contracts/repositories';
import { IAnimeExternalService } from '~/contracts/services';
import { QueryAnimeArg } from '~/graphql/types/args/query-anime.arg';
import { NotFoundAnimeError } from '~/graphql/types/dtos/anime-response/not-found-anime.error';
import { AnimeService } from '~/services';
import { either } from '~/utils/tools/either';
import { MapResultSelect } from '~/utils/tools/object';
import { animeDto } from '../__mocks__/anime.data';

describe('AnimeService', () => {
  let service: IAnimeExternalService;

  const mockAnimeRepo = {
    getAnimeByConditions: jest.fn(),
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
    mockAnimeRepo.getAnimeByConditions.mockResolvedValue(animeDto);

    // Call the service method
    const result = await service.getAnimeByConditions(
      mapResultSelect,
      queryAnimeArg,
    );

    // Expect the result to be a valid anime
    expect(result).toEqual(either.of(animeDto));
  });
});
