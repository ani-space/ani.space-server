import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '~/models/base-models';
import { IPageInfo } from '~/models/contracts';
import { IBaseConnection } from '~/models/contracts/base-connection.interface';
import { StudioEdge } from '~/models/studio-edge.model';
import { Studio } from '~/models/studio.model';
import { Entity, OneToMany } from 'typeorm';
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

  @OneToMany(() => Studio, (nodes) => nodes.studioConnection)
  @Field(() => [Studio], { nullable: true })
  nodes: Studio[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
