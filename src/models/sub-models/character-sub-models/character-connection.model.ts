import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from '~/models/base-models';
import { CharacterEdge } from '~/models/character-edge.model';
import { Character } from '~/models/character.model';
import { IBaseConnection } from '~/models/contracts/base-connection.interface';
import { PageInfo } from '../../base-models/page-info.model';

@ObjectType()
@Entity({ name: 'characterConnections' })
export class CharacterConnection
  extends BaseEntity
  implements IBaseConnection<CharacterEdge, Character>
{
  @OneToMany(() => CharacterEdge, (edges) => edges.characterConnection)
  @Field((type) => [CharacterEdge], { nullable: true })
  edges: CharacterEdge[];

  @ManyToMany(() => Character)
  @JoinTable()
  @Field((type) => [Character], { nullable: true })
  nodes: Character[];

  @Field((type) => PageInfo)
  pageInfo: PageInfo;
}
