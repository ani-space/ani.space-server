import { SocialProvider } from '~/models/social-provider.model';
import { IBaseRepository } from './base-repository.interface';

export interface ISocialProviderRepository
  extends IBaseRepository<SocialProvider> {}

export const ISocialProviderRepository = Symbol('ISocialProviderRepository');
