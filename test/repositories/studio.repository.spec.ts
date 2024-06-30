import { Test, TestingModule } from '@nestjs/testing';
import { mockDataSource } from '../__mocks__/data-source';
import { DataSource } from 'typeorm';
import { IStudioRepository } from '~/contracts/repositories';
import { StudioRepository } from '~/repositories';
import { MapResultSelect } from '~/utils/tools/object';
import { QueryStudioArg } from '~/graphql/types/args/query-studio.arg';
import { StudioListDto } from '../__mocks__/studio.data';

describe('StudioRepository', () => {
  let studioRepository: IStudioRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: IStudioRepository,
          useClass: StudioRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    })
      .useMocker((token) => {
        return jest.fn();
      })
      .compile();

    studioRepository = module.get<IStudioRepository>(IStudioRepository);
    mockDataSource.getRepository.mockReturnValue(mockDataSource);
    mockDataSource.createQueryBuilder.mockReturnValue(mockDataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getStudioByConditions should return null', async () => {
    // arrange
    const mapResultSelectParam: MapResultSelect = {};
    const queryAnimeArg: QueryStudioArg = {
      idAnilist: 140,
    };
    mockDataSource.getOne.mockResolvedValue(null);

    // act
    const result = await studioRepository.getStudioByConditions(
      mapResultSelectParam,
      queryAnimeArg,
    );

    // assert
    expect(result).toEqual(null);
  });

  it('getStudioByConditions should return studio', async () => {
    // arrange
    const mapResultSelectParam: MapResultSelect = {};
    const queryAnimeArg: QueryStudioArg = {
      idAnilist: 140,
    };
    mockDataSource.getOne.mockResolvedValue(StudioListDto[0]);

    // act
    const result = await studioRepository.getStudioByConditions(
      mapResultSelectParam,
      queryAnimeArg,
    );

    // assert
    expect(result).toMatchObject(StudioListDto[0]);
  });
});
