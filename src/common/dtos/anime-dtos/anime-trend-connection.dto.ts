import { AutoMap } from '@automapper/classes';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseDto } from '../base-dtos/base.dto';
import { AnimeTrendEdgeDto } from './anime-trend-edge.dto';
import { AnimeTrendDto } from './anime-trend.dto';
import { PageInfo } from '~/models/base-models/page-info.model';

@ObjectType()
export class AnimeTrendConnectionDto extends BaseDto {
  @AutoMap(() => [AnimeTrendEdgeDto])
  @Field(() => [AnimeTrendEdgeDto], { nullable: true })
  edges: AnimeTrendEdgeDto[];

  @AutoMap(() => [AnimeTrendDto])
  @Field(() => [AnimeTrendDto], { nullable: true })
  nodes: AnimeTrendDto[];

  @Field((type) => PageInfo)
  pageInfo: PageInfo;
}
