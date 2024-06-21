import { AutoMap } from '@automapper/classes';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseAnilistDto } from '../base-dtos/base-anilist.dto';
import { AiringScheduleDto } from './airing-schedule.dto';

@ObjectType()
export class AiringScheduleEdgeDto extends BaseAnilistDto {
  @AutoMap(() => AiringScheduleDto)
  @Field((type) => AiringScheduleDto, { nullable: true })
  node?: AiringScheduleDto;
}
