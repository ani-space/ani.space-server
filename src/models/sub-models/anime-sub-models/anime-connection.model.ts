import { Field, ObjectType } from '@nestjs/graphql';
import { AnimeEdge } from '~/models/anime-edge.model';
import { Anime } from '~/models/anime.model';
import { PageInfo } from '../../base-models/page-info.model';
import { IBaseConnection } from '~/models/contracts/base-connection.interface';
import { Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '~/models/base-models';

@ObjectType()
@Entity({ name: 'animeConnections' })
export class AnimeConnection
  extends BaseEntity
  implements IBaseConnection<AnimeEdge, Anime>
{
  @OneToMany(() => AnimeEdge, (edges) => edges.animeConnection)
  @Field((type) => [AnimeEdge], { nullable: true })
  edges: AnimeEdge[];

  @OneToMany(() => Anime, (nodes) => nodes.relations)
  @Field((type) => [Anime], { nullable: true })
  nodes: Anime[];

  @Field((type) => PageInfo)
  pageInfo: PageInfo;
}
