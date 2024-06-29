import { QueryCharacterConnectionArg } from '~/graphql/types/args/query-character-connection.arg';
import { Character } from '~/models';
import { CharacterConnection } from '~/models/sub-models/character-sub-models';
import { MapResultSelect } from '~/utils/tools/object';
import { IBaseRepository } from './base-repository.interface';
import { QueryCharacterArg } from '~/graphql/types/args/query-character.arg';

export interface ICharacterRepository extends IBaseRepository<Character> {
  getEdgesOrNodes(
    characterConnectionId: string,
    queryCharacterConnectionArg: QueryCharacterConnectionArg,
    mapResultSelect: MapResultSelect,
  ): Promise<Partial<CharacterConnection> | null>;

  getCharacterByConditions(
    queryCharacterArg: QueryCharacterArg,
    mapResultSelectParam: MapResultSelect,
  ): Promise<Character | null>;
}

export const ICharacterRepository = Symbol('ICharacterRepository');
