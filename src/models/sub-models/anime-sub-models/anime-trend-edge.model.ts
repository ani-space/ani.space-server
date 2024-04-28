import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '~/models/base-models';
import { AnimeTrend } from './anime-trend.model';
import { AnimeTrendConnection } from './anime-trend-connection.model';

@ObjectType()
@Entity({ name: 'animeTrendEdges' })
export class AnimeTrendEdge extends BaseEntity {
  @Field((type) => AnimeTrend, { nullable: true })
  @OneToOne(() => AnimeTrend, { nullable: true })
  @JoinColumn()
  node?: AnimeTrend;

  @ManyToOne(
    () => AnimeTrendConnection,
    (animeTrendConnection) => animeTrendConnection.edges,
  )
  animeTrendConnection: AnimeTrendConnection;
}
