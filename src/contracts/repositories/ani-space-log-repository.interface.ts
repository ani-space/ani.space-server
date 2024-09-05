import { AniSpaceLog } from '~/models';
import { IBaseRepository } from './base-repository.interface';

export interface IAniSpaceLogRepository extends IBaseRepository<AniSpaceLog> {}

export const IAniSpaceLogRepository = Symbol('IAniSpaceLogRepository');
