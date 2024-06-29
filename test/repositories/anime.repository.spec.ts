import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { IAnimeRepository } from '~/contracts/repositories';
import { QueryAnimeArg } from '~/graphql/types/args/query-anime.arg';
import { Anime } from '~/models';
import { AnimeRepository } from '~/repositories';
import { MapResultSelect } from '~/utils/tools/object';
import { animeConnectionListDto, animeListDto } from '../__mocks__/anime.data';
import { mockDataSource } from '../__mocks__/data-source';

describe('AnimeRepository', () => {
  let animeRepository: IAnimeRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: IAnimeRepository,
          useClass: AnimeRepository,
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

    animeRepository = module.get<IAnimeRepository>(IAnimeRepository);
    mockDataSource.getRepository.mockReturnValue(mockDataSource);
    mockDataSource.createQueryBuilder.mockReturnValue(mockDataSource);
  });

  it('getEdgesOrNodes should return AnimeConnection', async () => {
    // arrange
    const animeConnectionId = 'c0f5ae83-e820-4e2a-ae4d-698a77c37af4';
    const mapResultSelectParam: MapResultSelect = {};
    const animeConnection = animeConnectionListDto[0];
    mockDataSource.getOne.mockResolvedValue(animeConnection);

    // actual
    const result = await animeRepository.getEdgesOrNodes(
      animeConnectionId,
      mapResultSelectParam,
    );

    // assert
    expect(result).toMatchObject(animeConnection);
  });

  it('getEdgesOrNodes should return null', async () => {
    // arrange
    const animeConnectionId = 'c0f5ae83-e820-4e2a-ae4d-698a77c37af4';
    const mapResultSelectParam: MapResultSelect = {};
    mockDataSource.getOne.mockResolvedValue(null);

    // actual
    const result = await animeRepository.getEdgesOrNodes(
      animeConnectionId,
      mapResultSelectParam,
    );

    // assert
    expect(result).toEqual(null);
  });

  it('getAnimeByConditions should return null', async () => {
    // arrange
    const mapResultSelectParam: MapResultSelect = {};
    const queryAnimeArg: QueryAnimeArg = {
      idAnilist: 10,
    };
    mockDataSource.getOne.mockResolvedValue(null);

    // actual
    const result = await animeRepository.getAnimeByConditions(
      mapResultSelectParam,
      queryAnimeArg,
    );

    // assert
    expect(result).toEqual(null);
  });

  it('getAnimeByConditions should return Anime', async () => {
    // arrange
    const mapResultSelectParam: MapResultSelect = {};
    const queryAnimeArg: QueryAnimeArg = {
      idAnilist: 10,
    };
    const anime: Partial<Anime> = animeListDto[0];
    mockDataSource.getOne.mockResolvedValue(anime);

    // actual
    const result = await animeRepository.getAnimeByConditions(
      mapResultSelectParam,
      queryAnimeArg,
    );

    // assert
    expect(result).toMatchObject(anime);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
