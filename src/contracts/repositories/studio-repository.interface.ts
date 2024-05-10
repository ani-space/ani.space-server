import { Studio } from '~/models/studio.model';
import { IBaseRepository } from './base-repository.interface';

export interface IStudioRepository extends IBaseRepository<Studio> {}

export const IStudioRepository = Symbol('IStudioRepository ');
