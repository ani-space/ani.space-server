import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLoggerDto } from '~/common/dtos';
import { ICharacterRepository } from '~/contracts/repositories';
import { ICharacterService } from '~/contracts/services';
import { Character, CharacterEdge } from '~/models';
import { LOGGER_CREATED } from '../common/constants/index';
import { IPaginateResult } from '../contracts/dtos/paginate-result.interface';
import {
  CharacterConnection,
  CharacterImage,
  CharacterName,
} from '../models/sub-models/character-sub-models';
import { CharacterAlternative } from '../models/sub-models/character-sub-models/character-alternative.model';
import { CharacterAlternativeSpoilers } from '../models/sub-models/character-sub-models/character-alternativeSpoiler.model';
import { getMethodName } from '~/utils/tools/functions';

@Injectable()
export class CharacterService implements ICharacterService {
  private readonly logger = new Logger(CharacterService.name);

  constructor(
    @Inject(ICharacterRepository)
    private readonly characterRepo: ICharacterRepository,
    @InjectRepository(CharacterEdge)
    private readonly characterEdgeRepo: Repository<CharacterEdge>,
    @InjectRepository(CharacterConnection)
    private readonly characterConnectionRepo: Repository<CharacterConnection>,
    @InjectRepository(CharacterAlternative)
    private readonly characterAlternativeRepo: Repository<CharacterAlternative>,
    @InjectRepository(CharacterAlternativeSpoilers)
    private readonly characterAlternativeSpoilersRepo: Repository<CharacterAlternativeSpoilers>,
    @InjectRepository(CharacterName)
    private readonly characterNameRepo: Repository<CharacterName>,
    @InjectRepository(CharacterImage)
    private readonly characterImageRepo: Repository<CharacterImage>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async findOrCreateCharacter(
    characterParam: Partial<Character>,
  ): Promise<Character> {
    const character = await this.characterRepo.findByCondition({
      where: [
        { idAnilist: characterParam.idAnilist },
        { id: characterParam?.id },
      ],
    });

    if (character) {
      return character;
    }

    return await this.characterRepo.save(characterParam);
  }

  public async findCharacterByIdAnilist(
    anilistId: number,
    saveLogIfNotFound?: boolean,
  ) {
    const character = await this.characterRepo.findByCondition({
      where: {
        idAnilist: anilistId,
      },
    });

    if (!character && saveLogIfNotFound) {
      this.eventEmitter.emit(LOGGER_CREATED, {
        requestObject: JSON.stringify(anilistId),
        notes: `Anime not found with anilistId: ${anilistId}`,
        tracePath: `${CharacterService.name}.${getMethodName()}`,
      } as CreateLoggerDto);
    }

    return character;
  }

  public async saveManyCharacter(
    characters: Partial<Character>[],
  ): Promise<Character[] | null> {
    try {
      return this.characterRepo.saveMany(characters);
    } catch (error) {
      return this.handleServiceErrors(
        error,
        characters,
        `${CharacterService.name}.${getMethodName()}`,
      );
    }
  }

  public async saveCharacterImage(
    characterImage: Partial<CharacterImage>,
  ): Promise<(Partial<CharacterImage> & CharacterImage) | null> {
    try {
      return await this.characterImageRepo.save(characterImage);
    } catch (error) {
      return this.handleServiceErrors(
        error,
        characterImage,
        `${CharacterService.name}.${getMethodName()}`,
      );
    }
  }

  public async saveCharacterName(
    characterName: Partial<CharacterName>,
  ): Promise<(Partial<CharacterName> & CharacterName) | null> {
    try {
      return await this.characterNameRepo.save(characterName);
    } catch (error) {
      return this.handleServiceErrors(
        error,
        characterName,
        `${CharacterService.name}.${getMethodName()}`,
      );
    }
  }

  public async saveManyCharacterAlternativeSpoilers(
    characterAlternativeSpoilers: Partial<CharacterAlternativeSpoilers>[],
  ): Promise<
    | (Partial<CharacterAlternativeSpoilers> & CharacterAlternativeSpoilers)[]
    | null
  > {
    try {
      return await this.characterAlternativeSpoilersRepo.save(
        characterAlternativeSpoilers,
      );
    } catch (error) {
      return this.handleServiceErrors(
        error,
        characterAlternativeSpoilers,
        `${CharacterService.name}.${getMethodName()}`,
      );
    }
  }

  public async saveManyCharacterAlternative(
    characterAlternative: Partial<CharacterAlternative>[],
  ): Promise<(Partial<CharacterAlternative> & CharacterAlternative)[] | null> {
    try {
      return await this.characterAlternativeRepo.save(characterAlternative);
    } catch (error) {
      return this.handleServiceErrors(
        error,
        characterAlternative,
        `${CharacterService.name}.${getMethodName()}`,
      );
    }
  }

  public async saveCharacter(
    character: Partial<Character>,
  ): Promise<Character | null> {
    try {
      return await this.characterRepo.save(character);
    } catch (error) {
      return this.handleServiceErrors(
        error,
        character,
        `${CharacterService.name}.${getMethodName()}`,
      );
    }
  }

  public async saveManyCharacterEdge(
    characterEdges: Partial<CharacterEdge>[],
  ): Promise<(Partial<CharacterEdge> & CharacterEdge)[] | null> {
    try {
      return await this.characterEdgeRepo.save(characterEdges);
    } catch (error) {
      return this.handleServiceErrors(
        error,
        characterEdges,
        `${CharacterService.name}.${getMethodName()}`,
      );
    }
  }

  public async saveCharacterEdge(characterEdge: Partial<CharacterEdge>) {
    try {
      return await this.characterEdgeRepo.save(characterEdge);
    } catch (error) {
      return this.handleServiceErrors(
        error,
        characterEdge,
        `${CharacterService.name}.${getMethodName()}`,
      );
    }
  }

  public async saveCharacterConnection(
    characterConnection: Partial<CharacterConnection>,
  ) {
    try {
      return await this.characterConnectionRepo.save(characterConnection);
    } catch (error) {
      return this.handleServiceErrors(
        error,
        characterConnection,
        `${CharacterService.name}.${getMethodName()}`,
      );
    }
  }

  public async getCharacterListV1(page: number = 1, limit: number = 10) {
    const [result, count] = await this.characterRepo.findAndCount({
      relations: {
        anime: {
          nodes: true,
        },
      },
      take: limit,
      skip: (page - 1) * limit,
      order: {
        idAnilist: 'ASC',
      },
    });

    const lastPage = Math.ceil(count / limit);
    const charactersPage: IPaginateResult<Character> = {
      pageInfo: {
        total: count,
        perPage: limit,
        currentPage: page,
        lastPage,
        hasNextPage: page < lastPage,
      },
      docs: result,
    };

    return charactersPage;
  }

  private handleServiceErrors(
    error: any,
    obj: any,
    tracePath: string,
    notes?: string,
  ) {
    this.logger.error(error?.message);

    this.eventEmitter.emit(LOGGER_CREATED, {
      requestObject: JSON.stringify(obj),
      errorMessage: JSON.stringify(error),
      notes,
      tracePath: tracePath,
    } as CreateLoggerDto);

    return null;
  }
}
