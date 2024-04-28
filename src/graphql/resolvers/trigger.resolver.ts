import { UseGuards } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { TriggerGuard } from '~/guards';
import { GET_ANIME_SCALARS_TYPE } from '../../common/constants/index';
import { TriggerArgs } from '../types/args/trigger-type.arg';
import { SynchronizedAnimeEnum } from '../types/enums/synchronization-type.enum';

export enum TriggerResolverActionName {
  TRIGGER = 'trigger',
}

@Resolver(() => true)
export class TriggerResolver {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  @UseGuards(TriggerGuard)
  @Query(() => String, { name: TriggerResolverActionName.TRIGGER })
  handleTrigger(@Args() triggerArgs: TriggerArgs) {
    if (
      triggerArgs.animeSynchronization ===
      SynchronizedAnimeEnum.ANIME_SCALAR_TYPE
    ) {
      this.eventEmitter.emit(GET_ANIME_SCALARS_TYPE);
    }

    return 'ok';
  }
}
