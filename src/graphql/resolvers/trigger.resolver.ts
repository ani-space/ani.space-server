import { UseGuards } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { TriggerGuard } from '~/guards';
import { TriggerArgs } from '../types/args/trigger-type.arg';

export enum TriggerResolverActionName {
  TRIGGER = 'trigger',
}

@Resolver(() => true)
export class TriggerResolver {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  @UseGuards(TriggerGuard)
  @Query(() => String, { name: TriggerResolverActionName.TRIGGER })
  handleTrigger(@Args() triggerArgs: TriggerArgs) {
    const { page } = triggerArgs;

    this.eventEmitter.emit(`${triggerArgs.animeSynchronization}`, page);

    return 'ok';
  }
}
