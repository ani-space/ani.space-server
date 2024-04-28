import { Inject, Injectable, Logger } from '@nestjs/common';
import { ILoggerService } from '~/contracts/services';
import { IAniSpaceLogRepository } from '~/contracts/repositories';
import { OnEvent } from '@nestjs/event-emitter';
import { LOGGER_CREATED } from '../common/constants/index';
import { CreateLoggerDto } from '~/common/dtos';

@Injectable()
export class LoggerService implements ILoggerService {
  private readonly logger = new Logger(LoggerService.name);

  constructor(
    @Inject(IAniSpaceLogRepository) private readonly aniSpaceLogger: IAniSpaceLogRepository,
  ) {}

  @OnEvent(LOGGER_CREATED)
  public async handleCreateLogger(payload: CreateLoggerDto): Promise<void> {
    try {
      await this.aniSpaceLogger.save(payload);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
