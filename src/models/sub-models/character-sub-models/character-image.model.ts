import { AutoMap } from '@automapper/classes';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '~/models/base-models/base.model';

@Entity({ name: 'characterImages' })
@ObjectType()
export class CharacterImage extends BaseEntity {
  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  large?: string;

  @AutoMap()
  @Field({ nullable: true })
  @Column({ nullable: true })
  medium?: string;
}
