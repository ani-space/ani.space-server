import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from '~/models/base-models';
import { IBaseConnection } from '~/models/contracts/base-connection.interface';
import { StudioEdge } from '~/models/studio-edge.model';
import { Studio } from '~/models/studio.model';
import { PageInfo } from '../../base-models/page-info.model';

@ObjectType()
@Entity({ name: 'studioConnections' })
export class StudioConnection
  extends BaseEntity
  implements IBaseConnection<StudioEdge, Studio>
{
  @OneToMany(() => StudioEdge, (edges) => edges.studioConnection)
  @Field(() => [StudioEdge], { nullable: true })
  edges: StudioEdge[];

  @ManyToMany(() => Studio)
  @JoinTable()
  @Field(() => [Studio], { nullable: true })
  nodes: Studio[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
