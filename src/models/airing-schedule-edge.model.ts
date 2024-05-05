import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne } from 'typeorm';
import { AiringSchedule } from './airing-schedule.model';
import { BaseAnilistEntity } from './base-models/base-anilist.model';
import { AiringScheduleConnection } from './sub-models/airing-schedule-sub-models/airing-schedule-connection.model';

@ObjectType()
@Entity({ name: 'airingScheduleEdges' })
export class AiringScheduleEdge extends BaseAnilistEntity {
  @Field((type) => AiringSchedule, { nullable: true })
  @ManyToOne(() => AiringSchedule)
  node?: AiringSchedule;

  @ManyToOne(
    () => AiringScheduleConnection,
    (airingScheduleConnection) => airingScheduleConnection.edges,
  )
  airingScheduleConnection: AiringScheduleConnection;
}
