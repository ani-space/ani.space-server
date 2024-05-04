import { Staff } from '~/models';
import {
  StaffAlternative,
  StaffImage,
  StaffName,
  StaffYearActive,
} from '~/models/sub-models/staff-sub-models';

export interface IStaffService {
  saveStaff(staff: Partial<Staff>): Promise<(Partial<Staff> & Staff) | null>;

  saveStaffName(
    staffName: Partial<StaffName>,
  ): Promise<(Partial<StaffName> & StaffName) | null>;

  saveStaffAlternative(
    staffAlternative: Partial<StaffAlternative>,
  ): Promise<(Partial<StaffAlternative> & StaffAlternative) | null>;

  saveStaffImage(
    staffImage: Partial<StaffImage>,
  ): Promise<(Partial<StaffImage> & StaffImage) | null>;

  saveStaffYearActive(
    staffYearActive: Partial<StaffYearActive>,
  ): Promise<(Partial<StaffYearActive> & StaffYearActive) | null>;

  saveManyStaff(
    staffs: Partial<Staff>[],
  ): Promise<(Partial<Staff> & Staff)[] | null>;
}

export const IStaffService = Symbol('IStaffService');
