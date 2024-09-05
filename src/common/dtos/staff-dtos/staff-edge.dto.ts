import { AutoMap } from '@automapper/classes';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseDto } from '../base-dtos/base.dto';
import { StaffDto } from './staff.dto';

@ObjectType()
export class StaffEdgeDto extends BaseDto {
  @AutoMap()
  @Field((type) => Int)
  idAnilist: number;

  @AutoMap(() => StaffDto)
  @Field((type) => StaffDto, { nullable: true })
  node?: StaffDto;

  @AutoMap()
  @Field({
    nullable: true,
    description: `The role of the staff member in the production of the media`,
  })
  role?: string;

  @AutoMap()
  @Field((type) => Int, {
    nullable: true,
    description: `The order the staff should be displayed from the users favourites`,
  })
  favouriteOrder?: number;
}
