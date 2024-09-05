import { Entity, Column } from 'typeorm';
import { BaseEntity } from '~/models/base-models';
import { Field, ObjectType } from '@nestjs/graphql';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'staffImages' })
@ObjectType()
export class StaffImage extends BaseEntity {
  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  large?: string;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  medium?: string;
}
