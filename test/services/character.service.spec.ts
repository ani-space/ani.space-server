import { Test, TestingModule } from '@nestjs/testing';
import {
  characterConnectionListDto,
  characterListDto,
} from '../__mocks__/character.data';
import { ICharacterRepository } from '~/contracts/repositories';
import { ICharacterExternalService } from '~/contracts/services';
import { QueryCharacterArg } from '~/graphql/types/args/query-character.arg';
import { NotFoundCharacterError } from '~/graphql/types/dtos/characters/not-found-character.error';
import { CharacterService } from '~/services';
import { either } from '~/utils/tools/either';
import { MapResultSelect } from '~/utils/tools/object';
import { QueryCharacterConnectionArg } from '~/graphql/types/args/query-character-connection.arg';
import { CharacterSortEnum } from '~/graphql/types/dtos/characters/character-sort.enum';

describe('CharacterService', () => {
  let service: ICharacterExternalService;

  const mockCharacterRepo = {
    getCharacterByConditions: jest.fn(),
    getEdgesOrNodes: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ICharacterExternalService,
          useClass: CharacterService,
        },
        {
          provide: ICharacterRepository,
          useValue: mockCharacterRepo,
        },
      ],
    })
      .useMocker((token) => {
        return jest.fn();
      })
      .compile();

    service = module.get<ICharacterExternalService>(ICharacterExternalService);
  });

  it('getCharacterConnectionPage should return null', async () => {
    // arrange
    const animeConnectionId = '2f6c8303-30c5-4d17-abc1-cc37423a8a7a';
    const queryCharacterConnectionArg: QueryCharacterConnectionArg = {
      limit: 10,
      page: 1,
      sort: 'ID' as CharacterSortEnum,
    };
    const mapResultSelect: MapResultSelect = {};
    mockCharacterRepo.getEdgesOrNodes.mockResolvedValue(null);

    // act
    const result = await service.getCharacterConnectionPage(
      animeConnectionId,
      queryCharacterConnectionArg,
      mapResultSelect,
    );

    // assert
    expect(result).toEqual(null);
  });

  it('getCharacterConnectionPage should return characterConnection', async () => {
    // arrange
    const animeConnectionId = '2f6c8303-30c5-4d17-abc1-cc37423a8a7a';
    const queryCharacterConnectionArg: QueryCharacterConnectionArg = {
      limit: 10,
      page: 1,
      sort: 'ID' as CharacterSortEnum,
    };
    const mapResultSelect: MapResultSelect = {};
    mockCharacterRepo.getEdgesOrNodes.mockResolvedValue(
      characterConnectionListDto[0],
    );

    // act
    const result = await service.getCharacterConnectionPage(
      animeConnectionId,
      queryCharacterConnectionArg,
      mapResultSelect,
    );

    // assert
    expect(result).toMatchObject(characterConnectionListDto[0]);
  });

  it('getCharacterByConditions should return a NotFoundCharacterError when no character is found', async () => {
    // arrange
    const queryCharacterArg: QueryCharacterArg = {
      idAnilist: 142593,
    };
    const mapResultSelect: MapResultSelect = {};
    mockCharacterRepo.getCharacterByConditions.mockResolvedValue(null);

    // act
    const result = await service.getCharacterByConditions(
      queryCharacterArg,
      mapResultSelect,
    );

    // assert
    expect(result).toEqual(
      either.error(
        new NotFoundCharacterError({ requestObject: queryCharacterArg }),
      ),
    );
  });

  it('getCharacterByConditions should return a valid character when no anime is found', async () => {
    // arrange
    const queryCharacterArg: QueryCharacterArg = {
      idAnilist: 142593,
    };
    const mapResultSelect: MapResultSelect = {};
    mockCharacterRepo.getCharacterByConditions.mockResolvedValue(
      characterListDto[0],
    );

    // act
    const result = await service.getCharacterByConditions(
      queryCharacterArg,
      mapResultSelect,
    );

    // assert
    expect(result).toEqual(either.of(characterListDto[0]));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
