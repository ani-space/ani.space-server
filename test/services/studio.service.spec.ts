import { Test, TestingModule } from '@nestjs/testing';
import { StudioListDto } from '../__mocks__/studio.data';
import { IStudioRepository } from '~/contracts/repositories';
import { IStudioExternalService } from '~/contracts/services';
import { QueryStudioArg } from '~/graphql/types/args/query-studio.arg';
import { NotFoundStudioError } from '~/graphql/types/dtos/studio/not-found-studio.error';
import { StudioService } from '~/services/studio.service';
import { either } from '~/utils/tools/either';
import { MapResultSelect } from '~/utils/tools/object';

describe('StudioService', () => {
  let service: IStudioExternalService;

  const mockStudioRepo = {
    getStudioByConditions: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: IStudioExternalService,
          useClass: StudioService,
        },
        {
          provide: IStudioRepository,
          useValue: mockStudioRepo,
        },
      ],
    })
      .useMocker((token) => {
        return jest.fn();
      })
      .compile();

    service = module.get<IStudioExternalService>(IStudioExternalService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getStudioByConditions should return not found studio error if not found studio', async () => {
    // arrange
    const mapResultSelect: MapResultSelect = {};
    const queryAnimeArg: QueryStudioArg = {
      idAnilist: 140,
    };
    mockStudioRepo.getStudioByConditions.mockResolvedValue(null);

    // act
    const result = await service.getStudioByConditions(
      mapResultSelect,
      queryAnimeArg,
    );

    // assert
    expect(result).toEqual(
      either.error(new NotFoundStudioError({ requestObject: queryAnimeArg })),
    );
  });

  it('getStudioByConditions should return studio value if found studio', async () => {
    // arrange
    const mapResultSelect: MapResultSelect = {};
    const queryAnimeArg: QueryStudioArg = {
      idAnilist: 140,
    };
    mockStudioRepo.getStudioByConditions.mockResolvedValue(StudioListDto[0]);

    // act
    const result = await service.getStudioByConditions(
      mapResultSelect,
      queryAnimeArg,
    );

    // assert
    expect(result).toEqual(either.of(StudioListDto[0]));
  });
});
