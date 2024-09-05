import { AutoMap } from '@automapper/classes';
import { Field, ObjectType } from '@nestjs/graphql';
import { PageInfo } from '../../../models/base-models/page-info.model';
import { BaseDto } from '../base-dtos/base.dto';
import { StaffEdgeDto } from './staff-edge.dto';
import { StaffDto } from './staff.dto';

@ObjectType()
export class StaffConnectionDto extends BaseDto {
  @AutoMap(() => [StaffEdgeDto])
  @Field((type) => [StaffEdgeDto], { nullable: true })
  edges: StaffEdgeDto[];

  @AutoMap(() => [StaffDto])
  @Field((type) => [StaffDto], { nullable: true })
  nodes: StaffDto[];

  @AutoMap(() => PageInfo)
  @Field((type) => PageInfo)
  pageInfo: PageInfo;
}
