import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IAniSpaceLogRepository } from '~/contracts/repositories';
import { AniSpaceLog } from '~/models';
import { AniSpaceLogRepository } from '~/repositories';

@Module({
  imports: [TypeOrmModule.forFeature([AniSpaceLog])],
  providers: [
    {
      provide: IAniSpaceLogRepository,
      useClass: AniSpaceLogRepository,
    },
  ],
  exports: [],
})
export class LoggerModule {}
