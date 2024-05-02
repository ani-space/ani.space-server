import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { Character } from '~/models';
import { ICharacterRepository } from '~/contracts/repositories';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CharacterRepository
  extends BaseRepository<Character>
  implements ICharacterRepository
{
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
  ) {
    super(characterRepository);
  }
}
