import { Mapper, MappingProfile, createMap } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { PageInfo } from '../../models/base-models/page-info.model';
import { FuzzyDateInt } from '../../models/sub-models/common-sub-models';
import { FuzzyDateIntDto } from '../dtos/common-dtos/fuzzy-date-int.dto';

@Injectable()
export class CommonProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap(mapper, FuzzyDateInt, FuzzyDateIntDto);
      createMap(mapper, PageInfo, PageInfo);
    };
  }
}
