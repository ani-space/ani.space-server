import { Module } from '@nestjs/common';
import { TriggerResolver } from '../graphql/resolvers/trigger.resolver';
import { ConfigModule } from '@nestjs/config';
import { TriggerConfig } from '../configs/index';

@Module({
  imports: [ConfigModule.forFeature(TriggerConfig)],
  providers: [TriggerResolver],
})
export class TriggerModule {}
