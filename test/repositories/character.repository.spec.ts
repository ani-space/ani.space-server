import { Test, TestingModule } from '@nestjs/testing';
import { mockDataSource } from '../__mocks__/data-source';
import { DataSource } from 'typeorm';
import { ICharacterRepository } from '~/contracts/repositories';
import { CharacterRepository } from '~/repositories';
import { QueryCharacterConnectionArg } from '~/graphql/types/args/query-character-connection.arg';
import { CharacterSortEnum } from '~/graphql/types/dtos/characters/character-sort.enum';
import { MapResultSelect } from '~/utils/tools/object';
import {
  characterConnectionListDto,
  characterListDto,
} from '../__mocks__/character.data';
import { QueryCharacterArg } from '~/graphql/types/args/query-character.arg';

describe('CharacterRepository', () => {
  let characterRepository: ICharacterRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ICharacterRepository,
          useClass: CharacterRepository,
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

    characterRepository =
      module.get<ICharacterRepository>(ICharacterRepository);
    mockDataSource.getRepository.mockReturnValue(mockDataSource);
    mockDataSource.createQueryBuilder.mockReturnValue(mockDataSource);
  });

  it('getCharacterByConditions should return character', async () => {
    // arrange
    const queryCharacterArg: QueryCharacterArg = {
      idAnilist: 142593,
    };
    const mapResultSelectParam: MapResultSelect = {};
    const characterDto = characterListDto[0];
    mockDataSource.getOne.mockResolvedValue(characterDto);

    // act
    const result = await characterRepository.getCharacterByConditions(
      queryCharacterArg,
      mapResultSelectParam,
    );

    // assert
    expect(result).toMatchObject(characterDto);
  });

  it('getCharacterByConditions should return null', async () => {
    // arrange
    const queryCharacterArg: QueryCharacterArg = {
      idAnilist: 142593,
    };
    const mapResultSelectParam: MapResultSelect = {};
    mockDataSource.getOne.mockResolvedValue(null);

    // act
    const result = await characterRepository.getCharacterByConditions(
      queryCharacterArg,
      mapResultSelectParam,
    );

    // assert
    expect(result).toEqual(null);
  });

  it('getEdgesOrNodes should return null', async () => {
    // arrange
    const characterConnectionId = '00002639-e23a-44a3-83a1-1b38610ca095';
    const queryCharacterConnectionArg: QueryCharacterConnectionArg = {
      limit: 10,
      page: 1,
      sort: 'ID_DESC' as CharacterSortEnum,
    };
    const mapResultSelect: MapResultSelect = {};
    mockDataSource.getOne.mockResolvedValue(null);

    // act
    const result = await characterRepository.getEdgesOrNodes(
      characterConnectionId,
      queryCharacterConnectionArg,
      mapResultSelect,
    );

    // assert
    expect(result).toEqual(null);
  });

  it('getEdgesOrNodes should return CharacterConnection', async () => {
    // arrange
    const characterConnectionId = 'c0f5ae83-e820-4e2a-ae4d-698a77c37af4';
    const queryCharacterConnectionArg: QueryCharacterConnectionArg = {
      limit: 10,
      page: 1,
      sort: 'ID' as CharacterSortEnum,
    };
    const mapResultSelect: MapResultSelect = {};
    const characterConnection = characterConnectionListDto[0];
    mockDataSource.getOne.mockResolvedValue(characterConnection);

    // actual
    const result = await characterRepository.getEdgesOrNodes(
      characterConnectionId,
      queryCharacterConnectionArg,
      mapResultSelect,
    );

    // assert
    expect(result).toMatchObject(characterConnection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
