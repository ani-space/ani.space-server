import { Studio } from '~/models/studio.model';

export interface IStudioService {
  saveManyStudio(studios: Partial<Studio>[]): Promise<Studio[] | null>;
}

export const IStudioService = Symbol('IStudioService');
