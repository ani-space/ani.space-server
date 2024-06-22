import { AutoMap } from '@automapper/classes';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseDto } from '../base-dtos/base.dto';
import { StaffDto } from './staff.dto';

@ObjectType()
export class StaffRoleTypeDto extends BaseDto {
  @AutoMap(() => StaffDto)
  @Field((type) => StaffDto, {
    nullable: true,
    description: 'The voice actors of the character',
  })
  voiceActor?: StaffDto;

  @AutoMap()
  @Field({ description: `Notes regarding the VA's role for the character` })
  roleNotes?: string;

  @AutoMap()
  @Field({
    description: `Used for grouping roles where multiple dubs exist for the same language. Either dubbing company name or language variant.`,
  })
  dubGroup?: string;
}
