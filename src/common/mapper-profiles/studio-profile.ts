import { Mapper, MappingProfile, createMap } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { StudioEdge } from '~/models/studio-edge.model';
import { Studio } from '~/models/studio.model';
import { StudioConnection } from '../../models/sub-models/studio-sub-models/studio-connection.model';
import { StudioConnectionDto } from '../dtos/studio-dtos/studio-connection.dto';
import { StudioEdgeDto } from '../dtos/studio-dtos/studio-edge.dto';
import { StudioDto } from '../dtos/studio-dtos/studio.dto';

@Injectable()
export class StudioProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap(mapper, Studio, StudioDto);
      createMap(mapper, StudioConnection, StudioConnectionDto);
      createMap(mapper, StudioEdge, StudioEdgeDto);
    };
  }
}
