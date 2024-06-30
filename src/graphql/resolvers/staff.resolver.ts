import { Inject } from '@nestjs/common';
import { Args, Info, Query, Resolver } from '@nestjs/graphql';
import { StaffDto } from '~/common/dtos/staff-dtos/staff.dto';
import { StaffResultUnion } from '../types/dtos/staff/staff.response';
import { StaffActions } from '../types/enums/actions.enum';
import { BuilderSelectStaffPipe } from '~/common/pipes/builder-select-staff.pipe';
import { MapResultSelect } from '~/utils/tools/object';
import { QueryStaffArg } from '../types/args/query-staff.arg';
import { IStaffExternalService } from '~/contracts/services';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Staff } from '~/models';

@Resolver(() => StaffDto)
export class StaffResolver {
  constructor(
    @Inject(IStaffExternalService)
    private readonly staffService: IStaffExternalService,

    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Query(() => [StaffResultUnion], { name: StaffActions.Staff })
  public async getStaffInfo(
    @Info(BuilderSelectStaffPipe) mapResultSelect: MapResultSelect,
    @Args() queryStaffArg: QueryStaffArg,
  ) {
    const result = await this.staffService.getStaffByConditions(
      mapResultSelect,
      queryStaffArg,
    );

    if (result.isError()) {
      return [result.value];
    }

    return [this.mapper.map(result.value, Staff, StaffDto)];
  }
}
