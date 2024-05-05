import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseAnilistEntity } from './base-models/base-anilist.model';
import { Studio } from './studio.model';
import { StudioConnection } from './sub-models/studio-sub-models/studio-connection.model';

@Entity({ name: 'studioEdges' })
@ObjectType()
export class StudioEdge extends BaseAnilistEntity {
  @Field((type) => Studio, { nullable: true })
  @ManyToOne(() => Studio)
  node?: Studio;

  @ManyToOne(
    () => StudioConnection,
    (studioConnection) => studioConnection.edges,
  )
  studioConnection: StudioConnection;

  @Field({
    description: 'If the studio is the main animation studio of the anime',
  })
  @Column()
  isMain: boolean;

  @Field((type) => Int, {
    nullable: true,
  })
  @Column({ type: 'int', nullable: true })
  favouriteOrder?: number;
}
