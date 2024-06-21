import { AutoMap } from '@automapper/classes';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseDto } from '../base-dtos/base.dto';
import { AiringScheduleEdgeDto } from './airing-schedule-edge.dto';
import { AiringScheduleDto } from './airing-schedule.dto';
import { PageInfo } from '~/models/base-models/page-info.model';

@ObjectType()
export class AiringScheduleConnectionDto extends BaseDto {
  @AutoMap(() => [AiringScheduleEdgeDto])
  @Field(() => [AiringScheduleEdgeDto], { nullable: true })
  edges: AiringScheduleEdgeDto[];

  @AutoMap(() => [AiringScheduleDto])
  @Field(() => [AiringScheduleDto], { nullable: true })
  nodes: AiringScheduleDto[];

  @Field((type) => PageInfo)
  pageInfo: PageInfo;
}
