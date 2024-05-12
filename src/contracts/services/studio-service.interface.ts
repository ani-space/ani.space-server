import { StudioEdge } from '~/models/studio-edge.model';
import { Studio } from '~/models/studio.model';
import { StudioConnection } from '~/models/sub-models/studio-sub-models/studio-connection.model';
import { IPaginateResult } from '../dtos';

export interface IStudioService {
  saveManyStudio(studios: Partial<Studio>[]): Promise<Studio[] | null>;

  getStudioListV1(
    page?: number,
    limit?: number,
  ): Promise<IPaginateResult<Studio>>;

  findStudioByIdAnilist(
    idAnilist: number,
    saveErrorNotFound?: boolean,
  ): Promise<Studio | null>;

  saveStudio(studio: Partial<Studio>): Promise<Studio | null>;

  saveStudioEdge(
    studioEdge: Partial<StudioEdge>,
  ): Promise<(Partial<StudioEdge> & StudioEdge) | null>;

  saveStudioConnection(
    studioConnection: Partial<StudioConnection>,
  ): Promise<(Partial<StudioConnection> & StudioConnection) | null>;
}

export const IStudioService = Symbol('IStudioService');
