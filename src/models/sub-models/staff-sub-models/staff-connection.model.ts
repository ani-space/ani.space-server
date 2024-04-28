import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '~/models/base-models';
import { IPageInfo } from '~/models/contracts';
import { IBaseConnection } from '~/models/contracts/base-connection.interface';
import { StaffEdge } from '~/models/staff-edge.model';
import { Staff } from '~/models/staff.model';
import { Entity, OneToMany } from 'typeorm';
import { PageInfo } from '../../base-models/page-info.model';

@ObjectType()
@Entity({ name: 'staffConnections' })
export class StaffConnection
  extends BaseEntity
  implements IBaseConnection<StaffEdge, Staff>
{
  @OneToMany(() => StaffEdge, (edges) => edges.staffConnection)
  @Field((type) => [StaffEdge], { nullable: true })
  edges: StaffEdge[];

  @OneToMany(() => Staff, (nodes) => nodes.staffConnection)
  @Field((type) => [Staff], { nullable: true })
  nodes: Staff[];

  @Field((type) => PageInfo)
  pageInfo: PageInfo;
}
