import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from '~/models/base-models';
import { PageInfo } from '~/models/base-models/page-info.model';
import { IBaseConnection } from '~/models/contracts/base-connection.interface';
import { AnimeTrendEdge } from './anime-trend-edge.model';
import { AnimeTrend } from './anime-trend.model';
import { AutoMap } from '@automapper/classes';

@ObjectType()
@Entity({ name: 'animeTrendConnections' })
export class AnimeTrendConnection
  extends BaseEntity
  implements IBaseConnection<AnimeTrendEdge, AnimeTrend>
{
  @AutoMap(() => [AnimeTrendEdge])
  @Field(() => [AnimeTrendEdge], { nullable: true })
  @OneToMany(() => AnimeTrendEdge, (edges) => edges.animeTrendConnection)
  edges: AnimeTrendEdge[];

  @AutoMap(() => [AnimeTrend])
  @ManyToMany(() => AnimeTrend)
  @JoinTable()
  @Field(() => [AnimeTrend], { nullable: true })
  nodes: AnimeTrend[];

  @AutoMap(() => PageInfo)
  @Field((type) => PageInfo)
  pageInfo: PageInfo;
}
