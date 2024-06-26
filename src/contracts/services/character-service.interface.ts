import { QueryCharacterConnectionArg } from '~/graphql/types/args/query-character-connection.arg';
import { Character, CharacterEdge } from '~/models';
import {
  CharacterAlternative,
  CharacterAlternativeSpoilers,
  CharacterConnection,
  CharacterImage,
  CharacterName,
} from '~/models/sub-models/character-sub-models';
import { MapResultSelect } from '~/utils/tools/object';
import { IPaginateResult } from '../dtos';

export interface ICharacterExternalService {
  getCharacterConnectionPage(
    animeConnectionId: string,
    queryCharacterConnectionArg: QueryCharacterConnectionArg,
    mapResultSelect: MapResultSelect,
  ): Promise<Partial<CharacterConnection> | null>;
}

export const ICharacterExternalService = Symbol('ICharacterExternalService');

export interface ICharacterInternalService {
  getCharacterListV1(
    page?: number,
    limit?: number,
  ): Promise<IPaginateResult<Character>>;

  saveCharacter(character: Partial<Character>): Promise<Character | null>;

  saveManyCharacter(
    characters: Partial<Character>[],
  ): Promise<Character[] | null>;

  saveManyCharacterEdge(
    characterEdges: Partial<CharacterEdge>[],
  ): Promise<(Partial<CharacterEdge> & CharacterEdge)[] | null>;

  findOrCreateCharacter(characterParam: Partial<Character>): Promise<Character>;

  findCharacterByIdAnilist(
    anilistId: number,
    saveLogIfNotFound?: boolean,
  ): Promise<Character | null>;

  saveCharacterEdge(
    characterEdge: Partial<CharacterEdge>,
  ): Promise<(Partial<CharacterEdge> & CharacterEdge) | null>;

  saveCharacterConnection(
    characterConnection: Partial<CharacterConnection>,
  ): Promise<(Partial<CharacterConnection> & CharacterConnection) | null>;

  saveManyCharacterAlternative(
    characterAlternative: Partial<CharacterAlternative>[],
  ): Promise<(Partial<CharacterAlternative> & CharacterAlternative)[] | null>;

  saveCharacterName(
    characterName: Partial<CharacterName>,
  ): Promise<(Partial<CharacterName> & CharacterName) | null>;

  saveCharacterImage(
    characterImage: Partial<CharacterImage>,
  ): Promise<(Partial<CharacterImage> & CharacterImage) | null>;

  saveManyCharacterAlternativeSpoilers(
    characterAlternativeSpoilers: Partial<CharacterAlternativeSpoilers>[],
  ): Promise<
    | (Partial<CharacterAlternativeSpoilers> & CharacterAlternativeSpoilers)[]
    | null
  >;
}

export const ICharacterInternalService = Symbol('ICharacterInternalService');
