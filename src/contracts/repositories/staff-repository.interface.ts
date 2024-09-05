import { Staff } from '~/models';
import { IBaseRepository } from './base-repository.interface';
import { MapResultSelect } from '~/utils/tools/object';
import { QueryStaffArg } from '~/graphql/types/args/query-staff.arg';
import { QueryStaffConnectionArg } from '~/graphql/types/args/query-staff-connection.arg';
import { StaffConnection } from '~/models/sub-models/staff-sub-models/staff-connection.model';

export interface IStaffRepository extends IBaseRepository<Staff> {
  getStaffByConditions(
    mapResultSelectParam: MapResultSelect,
    queryStaffArg: QueryStaffArg,
  ): Promise<Staff | null>;

  getEdgesOrNodes(
    staffConnectionId: string,
    queryStaffConnectionArg: QueryStaffConnectionArg,
    mapResultSelectParam: MapResultSelect,
  ): Promise<StaffConnection | null>;
}

export const IStaffRepository = Symbol('IStaffRepository');
