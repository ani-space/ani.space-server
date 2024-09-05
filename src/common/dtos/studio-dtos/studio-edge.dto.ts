import { AutoMap } from '@automapper/classes';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseAnilistDto } from '../base-dtos/base-anilist.dto';
import { StudioDto } from './studio.dto';

@ObjectType()
export class StudioEdgeDto extends BaseAnilistDto {
  @AutoMap(() => StudioDto)
  @Field((type) => StudioDto, { nullable: true })
  node?: StudioDto;

  @AutoMap()
  @Field({
    description: 'If the studio is the main animation studio of the anime',
  })
  isMain: boolean;

  @AutoMap()
  @Field((type) => Int, {
    nullable: true,
  })
  favouriteOrder?: number;
}
