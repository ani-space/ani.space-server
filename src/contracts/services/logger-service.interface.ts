import { CreateLoggerDto } from '~/common/dtos';

export interface ILoggerService {
  handleCreateLogger(payload: CreateLoggerDto): Promise<void>;
}

export const ILoggerService = Symbol('ILoggerService');
