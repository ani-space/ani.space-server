import { Character } from '~/models';
import {IBaseRepository} from './base-repository.interface';

export interface ICharacterRepository extends IBaseRepository<Character> {}

export const ICharacterRepository = Symbol('ICharacterRepository');
