import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IAniSpaceLogRepository } from '~/contracts/repositories';
import { ILoggerService } from '~/contracts/services';
import { AniSpaceLog } from '~/models';
import { AniSpaceLogRepository } from '~/repositories';
import { LoggerService } from '~/services';

@Module({
  imports: [TypeOrmModule.forFeature([AniSpaceLog])],
  providers: [
    {
      provide: IAniSpaceLogRepository,
      useClass: AniSpaceLogRepository,
    },
    {
      provide: ILoggerService,
      useClass: LoggerService,
    },
  ],
  exports: [
    {
      provide: IAniSpaceLogRepository,
      useClass: AniSpaceLogRepository,
    },
    {
      provide: ILoggerService,
      useClass: LoggerService,
    },
  ],
})
export class LoggerModule {}
