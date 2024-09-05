import { createUnionType } from '@nestjs/graphql';
import { StaffDto } from '~/common/dtos/staff-dtos/staff.dto';
import { NotFoundStaffError } from './not-found-staff.error';

export const StaffResultUnion = createUnionType({
  name: 'StaffResult',
  types: () => [StaffDto, NotFoundStaffError],
});
