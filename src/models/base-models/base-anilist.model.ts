import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Index } from 'typeorm';
import { IBaseAnilist } from '../contracts';
import { BaseEntity } from './base.model';
import { AutoMap } from '@automapper/classes';

@ObjectType()
export abstract class BaseAnilistEntity
  extends BaseEntity
  implements IBaseAnilist
{
  @AutoMap()
  @Index({ unique: true })
  @Column()
  @Field((type) => Int)
  idAnilist: number;
}
