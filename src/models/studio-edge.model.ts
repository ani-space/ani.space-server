import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base-models';
import { Studio } from './studio.model';
import { StudioConnection } from './sub-models/studio-sub-models/studio-connection.model';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'studioEdges' })
@ObjectType()
export class StudioEdge extends BaseEntity {
  @AutoMap()
  @Column()
  @Field((type) => Int)
  idAnilist: number;

  @AutoMap(() => Studio)
  @Field((type) => Studio, { nullable: true })
  @ManyToOne(() => Studio)
  node?: Studio;

  @ManyToOne(
    () => StudioConnection,
    (studioConnection) => studioConnection.edges,
  )
  studioConnection: StudioConnection;

  @AutoMap()
  @Field({
    description: 'If the studio is the main animation studio of the anime',
  })
  @Column()
  isMain: boolean;

  @AutoMap()
  @Field((type) => Int, {
    nullable: true,
  })
  @Column({ type: 'int', nullable: true })
  favouriteOrder?: number;
}
