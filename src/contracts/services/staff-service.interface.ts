import { Staff, StaffEdge } from '~/models';
import {
  StaffAlternative,
  StaffImage,
  StaffName,
  StaffPrimaryOccupation,
  StaffYearActive,
} from '~/models/sub-models/staff-sub-models';
import { StaffConnection } from '~/models/sub-models/staff-sub-models/staff-connection.model';
import { StaffRoleType } from '~/models/sub-models/staff-sub-models/staff-role-type.model';
import { IPaginateResult } from '../dtos';
import { MapResultSelect } from '~/utils/tools/object';
import { QueryStaffArg } from '~/graphql/types/args/query-staff.arg';
import { Either } from '~/utils/tools/either';
import { NotFoundStaffError } from '~/graphql/types/dtos/staff/not-found-staff.error';

export interface IStaffExternalService {
  getStaffByConditions(
    mapResultSelect: MapResultSelect,
    queryStaffArg: QueryStaffArg,
  ): Promise<Either<NotFoundStaffError, never> | Either<never, Staff>>;
}

export const IStaffExternalService = Symbol('IStaffExternalService');

export interface IStaffInternalService {
  saveStaff(staff: Partial<Staff>): Promise<(Partial<Staff> & Staff) | null>;

  getStaffListV1(
    page?: number,
    limit?: number,
  ): Promise<IPaginateResult<Staff>>;

  saveStaffName(
    staffName: Partial<StaffName>,
  ): Promise<(Partial<StaffName> & StaffName) | null>;

  findStaffByIdAnilist(
    idAnilist: number,
    saveErrorNotFound?: boolean,
  ): Promise<Staff | null>;

  saveStaffRoleType(
    staffRoleTypeParam: Partial<StaffRoleType>,
  ): Promise<(Partial<StaffRoleType> & StaffRoleType) | null>;

  saveManyStaffEdge(
    staffEdges: Partial<StaffEdge>[],
  ): Promise<(Partial<StaffEdge> & StaffEdge)[] | null>;

  saveStaffConnection(
    staffConnection: Partial<StaffConnection>,
  ): Promise<(Partial<StaffConnection> & StaffConnection) | null>;

  saveManyStaffAlternative(
    staffAlternative: Partial<StaffAlternative>[],
  ): Promise<(Partial<StaffAlternative> & StaffAlternative)[] | null>;

  saveManyStaffPrimaryOccupation(
    staffPrimaryOccupationList: Partial<StaffPrimaryOccupation>[],
  ): Promise<
    (Partial<StaffPrimaryOccupation> & StaffPrimaryOccupation)[] | null
  >;

  saveStaffImage(
    staffImage: Partial<StaffImage>,
  ): Promise<(Partial<StaffImage> & StaffImage) | null>;

  saveStaffYearActive(
    staffYearActive: Partial<StaffYearActive>,
  ): Promise<(Partial<StaffYearActive> & StaffYearActive) | null>;

  saveManyStaff(
    staffs: Partial<Staff>[],
  ): Promise<(Partial<Staff> & Staff)[] | null>;

  saveStaffEdge(
    staffEdge: Partial<StaffEdge>,
  ): Promise<(Partial<StaffEdge> & StaffEdge) | null>;
}

export const IStaffInternalService = Symbol('IStaffInternalService');
