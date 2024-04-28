import { ArgsType, Field, Int } from '@nestjs/graphql';
import { SynchronizedAnimeEnum } from '../enums/synchronization-type.enum';

@ArgsType()
export class TriggerArgs {
  @Field((type) => SynchronizedAnimeEnum, { nullable: true })
  animeSynchronization?: SynchronizedAnimeEnum;

  @Field(() => Int, { defaultValue: 1 })
  page: number;
}
