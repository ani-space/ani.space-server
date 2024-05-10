import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from '~/models/base-models';
import { PageInfo } from '~/models/base-models/page-info.model';
import { IBaseConnection } from '~/models/contracts/base-connection.interface';
import { AnimeTrendEdge } from './anime-trend-edge.model';
import { AnimeTrend } from './anime-trend.model';

@ObjectType()
@Entity({ name: 'animeTrendConnections' })
export class AnimeTrendConnection
  extends BaseEntity
  implements IBaseConnection<AnimeTrendEdge, AnimeTrend>
{
  @OneToMany(() => AnimeTrendEdge, (edges) => edges.animeTrendConnection)
  @Field(() => [AnimeTrendEdge], { nullable: true })
  edges: AnimeTrendEdge[];

  @ManyToMany(() => AnimeTrend)
  @JoinTable()
  @Field(() => [AnimeTrend], { nullable: true })
  nodes: AnimeTrend[];

  @Field((type) => PageInfo)
  pageInfo: PageInfo;
}
