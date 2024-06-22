import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '~/models/base-models';
import { AnimeTrendConnection } from './anime-trend-connection.model';
import { AnimeTrend } from './anime-trend.model';
import { AutoMap } from '@automapper/classes';

@ObjectType()
@Entity({ name: 'animeTrendEdges' })
export class AnimeTrendEdge extends BaseEntity {
  @AutoMap(() => AnimeTrend)
  @Field((type) => AnimeTrend, { nullable: true })
  @ManyToOne(() => AnimeTrend)
  node?: AnimeTrend;

  @ManyToOne(
    () => AnimeTrendConnection,
    (animeTrendConnection) => animeTrendConnection.edges,
  )
  animeTrendConnection: AnimeTrendConnection;
}
