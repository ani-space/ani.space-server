import { Mapper, MappingProfile, createMap } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { Staff } from '~/models/staff.model';
import { StaffEdge } from '../../models/staff-edge.model';
import {
  StaffImage,
  StaffName,
  StaffPrimaryOccupation,
  StaffYearActive,
} from '../../models/sub-models/staff-sub-models';
import { StaffConnection } from '../../models/sub-models/staff-sub-models/staff-connection.model';
import { StaffAlternative } from '../../models/sub-models/staff-sub-models/staff-name-alternative.model';
import { StaffConnectionDto } from '../dtos/staff-dtos/staff-connection.dto';
import { StaffEdgeDto } from '../dtos/staff-dtos/staff-edge.dto';
import { StaffImageDto } from '../dtos/staff-dtos/staff-image.dto';
import { StaffAlternativeDto } from '../dtos/staff-dtos/staff-name-alternative.dto';
import { StaffNameDto } from '../dtos/staff-dtos/staff-name.dto';
import { StaffPrimaryOccupationDto } from '../dtos/staff-dtos/staff-primary-occupations.dto';
import { StaffYearActiveDto } from '../dtos/staff-dtos/staff-year-active.dto';
import { StaffDto } from '../dtos/staff-dtos/staff.dto';
import { StaffRoleType } from '../../models/sub-models/staff-sub-models/staff-role-type.model';
import { StaffRoleTypeDto } from '../dtos/staff-dtos/staff-role-type.dto';

@Injectable()
export class StaffProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap(mapper, Staff, StaffDto);
      createMap(mapper, StaffRoleType, StaffRoleTypeDto);
      createMap(mapper, StaffImage, StaffImageDto);
      createMap(mapper, StaffYearActive, StaffYearActiveDto);
      createMap(mapper, StaffPrimaryOccupation, StaffPrimaryOccupationDto);
      createMap(mapper, StaffName, StaffNameDto);
      createMap(mapper, StaffAlternative, StaffAlternativeDto);
      createMap(mapper, StaffEdge, StaffEdgeDto);
      createMap(mapper, StaffConnection, StaffConnectionDto);
    };
  }
}
