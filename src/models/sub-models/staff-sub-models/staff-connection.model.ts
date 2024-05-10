import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from '~/models/base-models';
import { IBaseConnection } from '~/models/contracts/base-connection.interface';
import { StaffEdge } from '~/models/staff-edge.model';
import { Staff } from '~/models/staff.model';
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

  @ManyToMany(() => Staff)
  @JoinTable()
  @Field((type) => [Staff], { nullable: true })
  nodes: Staff[];

  @Field((type) => PageInfo)
  pageInfo: PageInfo;
}
