import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { IAnimeRepository } from '~/contracts/repositories';
import { QueryAnimeArg } from '~/graphql/types/args/query-anime.arg';
import { Anime } from '~/models';
import { AnimeRepository } from '~/repositories';
import { MapResultSelect } from '~/utils/tools/object';
import { animeConnectionListDto, animeListDto } from '../__mocks__/anime.data';
import { mockDataSource } from '../__mocks__/data-source';
import { QueryStreamingEpisodeSourceArg } from '~/graphql/types/args/query-anime-streaming-episode.arg';
import { animeStreamingEpsSources } from '../__mocks__/anime-source.data';
import { QueryAnimePageArg } from '~/graphql/types/args/query-anime-page.arg';

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

  it('getAnimeList should return Anime List', async () => {
    // arrange
    const queryAnimePageArg: QueryAnimePageArg = {
      limit: 15,
      page: 1,
    };
    const totalRecords = 999;
    const mapResultSelectParam: MapResultSelect = {};
    mockDataSource.getManyAndCount.mockResolvedValue([
      animeListDto,
      totalRecords,
    ]);

    // act
    const { animeList, count } = await animeRepository.getAnimeList(
      queryAnimePageArg,
      mapResultSelectParam,
    );

    // assert
    expect(animeList).toMatchObject(animeListDto);
    expect(count).toEqual(totalRecords);
  });

  it('getAnimeList should return empty Anime List', async () => {
    // arrange
    const queryAnimePageArg: QueryAnimePageArg = {
      limit: 15,
      page: 1,
    };
    const mapResultSelectParam: MapResultSelect = {};
    mockDataSource.getManyAndCount.mockResolvedValue([[], 0]);

    // act
    const { animeList, count } = await animeRepository.getAnimeList(
      queryAnimePageArg,
      mapResultSelectParam,
    );

    // assert
    expect(animeList).toEqual([]);
    expect(count).toEqual(0);
  });

  it('getAnimeStreamingEpisodeSources should return anime source list', async () => {
    // arrange
    const queryStreamingEpisodeSourceArg: QueryStreamingEpisodeSourceArg = {
      animeStreamingEpisodeId: '1f1a43cd-0a8a-4d09-81a4-3c70b3b75b8c',
    };
    const mapResultSelectParam: MapResultSelect = {};
    mockDataSource.getMany.mockResolvedValue(animeStreamingEpsSources);

    // act
    const result = await animeRepository.getAnimeStreamingEpisodeSources(
      queryStreamingEpisodeSourceArg,
      mapResultSelectParam,
    );

    // assert
    expect(result).toMatchObject(animeStreamingEpsSources);
  });

  it('getAnimeStreamingEpisodeSources should return empty list', async () => {
    // arrange
    const queryStreamingEpisodeSourceArg: QueryStreamingEpisodeSourceArg = {
      animeStreamingEpisodeId: '1f1a43cd-0a8a-4d09-81a4-3c70b3b75b8c',
    };
    const mapResultSelectParam: MapResultSelect = {};
    mockDataSource.getMany.mockResolvedValue([]);

    // act
    const result = await animeRepository.getAnimeStreamingEpisodeSources(
      queryStreamingEpisodeSourceArg,
      mapResultSelectParam,
    );

    // assert
    expect(result).toEqual([]);
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
