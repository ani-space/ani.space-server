import { AutoMap } from '@automapper/classes';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseDto } from '../base-dtos/base.dto';
import { AnimeEdgeDto } from './anime-edge.dto';
import { AnimeDto } from './anime.dto';
import { PageInfo } from '../../../models/base-models/page-info.model';

@ObjectType()
export class AnimeConnectionDto extends BaseDto {
  @AutoMap(() => [AnimeEdgeDto])
  @Field((type) => [AnimeEdgeDto], { nullable: true })
  edges: AnimeEdgeDto[];

  @AutoMap(() => [AnimeDto])
  @Field((type) => [AnimeDto], { nullable: true })
  nodes: AnimeDto[];

  @Field((type) => PageInfo)
  pageInfo: PageInfo;
}
