import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base-models';
import { Staff } from './staff.model';
import { StaffConnection } from './sub-models/staff-sub-models/staff-connection.model';

@ObjectType()
@Entity({ name: 'staffEdges' })
export class StaffEdge extends BaseEntity {
  @Column()
  @Field((type) => Int)
  idAnilist: number;

  @ManyToOne(() => StaffConnection, (staffConnection) => staffConnection.edges)
  staffConnection: StaffConnection;

  @Field((type) => Staff, { nullable: true })
  @ManyToOne(() => Staff)
  node?: Staff;

  @Field({
    nullable: true,
    description: `The role of the staff member in the production of the media`,
  })
  @Column({ nullable: true })
  role?: string;

  @Field((type) => Int, {
    nullable: true,
    description: `The order the staff should be displayed from the users favourites`,
  })
  @Column({ type: 'int', nullable: true })
  favouriteOrder?: number;
}
