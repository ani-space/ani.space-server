import { Token } from '~/models/token.model';
import { IBaseRepository } from './base-repository.interface';

export interface ITokenRepository extends IBaseRepository<Token> {}

export const ITokenRepository = Symbol('ITokenRepository');
