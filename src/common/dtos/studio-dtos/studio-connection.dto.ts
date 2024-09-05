import { AutoMap } from '@automapper/classes';
import { Field, ObjectType } from '@nestjs/graphql';
import { PageInfo } from '../../../models/base-models/page-info.model';
import { BaseDto } from '../base-dtos/base.dto';
import { StudioEdgeDto } from './studio-edge.dto';
import { StudioDto } from './studio.dto';

@ObjectType()
export class StudioConnectionDto extends BaseDto {
  @AutoMap(() => [StudioEdgeDto])
  @Field(() => [StudioEdgeDto], { nullable: true })
  edges: StudioEdgeDto[];

  @AutoMap(() => [StudioDto])
  @Field(() => [StudioDto], { nullable: true })
  nodes: StudioDto[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
