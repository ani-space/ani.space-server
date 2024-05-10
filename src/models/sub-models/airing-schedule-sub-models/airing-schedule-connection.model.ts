import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { AiringScheduleEdge } from '~/models/airing-schedule-edge.model';
import { AiringSchedule } from '~/models/airing-schedule.model';
import { BaseEntity } from '~/models/base-models';
import { PageInfo } from '~/models/base-models/page-info.model';
import { IBaseConnection } from '~/models/contracts/base-connection.interface';

@ObjectType()
@Entity({ name: 'airingScheduleConnections' })
export class AiringScheduleConnection
  extends BaseEntity
  implements IBaseConnection<AiringScheduleEdge, AiringSchedule>
{
  @OneToMany(
    () => AiringScheduleEdge,
    (edges) => edges.airingScheduleConnection,
  )
  @Field(() => [AiringScheduleEdge], { nullable: true })
  edges: AiringScheduleEdge[];

  @ManyToMany(() => AiringSchedule)
  @JoinTable()
  @Field(() => [AiringSchedule], { nullable: true })
  nodes: AiringSchedule[];

  @Field((type) => PageInfo)
  pageInfo: PageInfo;
}
