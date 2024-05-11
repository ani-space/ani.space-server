import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { AiringSchedule } from './airing-schedule.model';
import { BaseEntity } from './base-models';
import { AiringScheduleConnection } from './sub-models/airing-schedule-sub-models/airing-schedule-connection.model';

@ObjectType()
@Entity({ name: 'airingScheduleEdges' })
export class AiringScheduleEdge extends BaseEntity {
  @Column()
  @Field((type) => Int)
  idAnilist: number;

  @Field((type) => AiringSchedule, { nullable: true })
  @ManyToOne(() => AiringSchedule)
  node?: AiringSchedule;

  @ManyToOne(
    () => AiringScheduleConnection,
    (airingScheduleConnection) => airingScheduleConnection.edges,
  )
  airingScheduleConnection: AiringScheduleConnection;
}
