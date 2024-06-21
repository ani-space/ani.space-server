import { AutoMap } from '@automapper/classes';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseDto } from '../base-dtos/base.dto';
import { AnimeTrendDto } from './anime-trend.dto';

@ObjectType()
export class AnimeTrendEdgeDto extends BaseDto {
  @AutoMap(() => AnimeTrendDto)
  @Field((type) => AnimeTrendDto, { nullable: true })
  node?: AnimeTrendDto;
}
