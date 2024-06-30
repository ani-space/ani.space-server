import { Staff } from '~/models';
import { IBaseRepository } from './base-repository.interface';
import { MapResultSelect } from '~/utils/tools/object';
import { QueryStaffArg } from '~/graphql/types/args/query-staff.arg';

export interface IStaffRepository extends IBaseRepository<Staff> {
  getStaffByConditions(
    mapResultSelectParam: MapResultSelect,
    queryStaffArg: QueryStaffArg,
  ): Promise<Staff | null>;
}

export const IStaffRepository = Symbol('IStaffRepository');
