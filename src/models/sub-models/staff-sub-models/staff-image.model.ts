import { Entity, Column } from 'typeorm';
import { BaseEntity } from '~/models/base-models';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity({ name: 'staffImages' })
@ObjectType()
export class StaffImage extends BaseEntity {
  @Field({ nullable: true })
  @Column({ nullable: true })
  large?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  medium?: string;
}
