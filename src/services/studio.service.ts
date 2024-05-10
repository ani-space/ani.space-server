import { Inject, Injectable, Logger } from '@nestjs/common';
import { LOGGER_CREATED } from '~/common/constants';
import { IStudioRepository } from '~/contracts/repositories';
import { IStudioService } from '~/contracts/services';
import { Studio } from '~/models/studio.model';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateLoggerDto } from '~/common/dtos';

@Injectable()
export class StudioService implements IStudioService {
  private readonly logger = new Logger(StudioService.name);

  constructor(
    @Inject(IStudioRepository)
    private readonly studioRepository: IStudioRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async saveManyStudio(studios: Partial<Studio>[]) {
    try {
      return this.studioRepository.saveMany(studios);
    } catch (error) {
      return this.handleServiceErrors(
        error,
        studios,
        'StudioService.saveManyStudio',
      );
    }
  }

  private handleServiceErrors(
    error: any,
    obj: any,
    tracePath: string,
    notes?: string,
  ) {
    this.logger.error(error?.message);

    this.eventEmitter.emit(LOGGER_CREATED, {
      requestObject: JSON.stringify(obj),
      errorMessage: JSON.stringify(error),
      notes,
      tracePath: tracePath,
    } as CreateLoggerDto);

    return null;
  }
}
