import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { ITokenRepository } from '~/contracts/repositories/token-repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from '~/models/token.model';
import { Repository } from 'typeorm';

@Injectable()
export class TokenRepository
  extends BaseRepository<Token>
  implements ITokenRepository
{
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {
    super(tokenRepository);
  }
}
