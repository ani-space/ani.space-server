import { Character, CharacterEdge } from '~/models';
import {
  CharacterAlternative,
  CharacterAlternativeSpoilers,
  CharacterConnection,
  CharacterImage,
  CharacterName,
} from '~/models/sub-models/character-sub-models';

export interface ICharacterService {
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

export const ICharacterService = Symbol('ICharacterService');
