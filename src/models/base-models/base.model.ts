import { AutoMap } from '@automapper/classes';
import { Field, ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
export abstract class BaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @AutoMap()
  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @AutoMap()
  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
