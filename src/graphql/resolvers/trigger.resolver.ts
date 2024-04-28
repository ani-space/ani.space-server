import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { TriggerGuard } from '~/guards';
import { TriggerArgs } from '../types/args/trigger-type.arg';

export enum TriggerResolverActionName {
  TRIGGER = 'trigger',
}

@Resolver(() => true)
export class TriggerResolver {
  @UseGuards(TriggerGuard)
  @Query(() => String, { name: TriggerResolverActionName.TRIGGER })
  handleTrigger(@Args() triggerArgs: TriggerArgs) {
    return 'ok';
  }
}
