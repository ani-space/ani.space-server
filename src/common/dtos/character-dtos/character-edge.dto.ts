import { AutoMap } from '@automapper/classes';
import { Field, ObjectType } from '@nestjs/graphql';
import { CharacterRole } from '../../../models/sub-models/character-sub-models';
import { AnimeDto } from '../anime-dtos/anime.dto';
import { BaseAnilistDto } from '../base-dtos/base-anilist.dto';
import { StaffRoleTypeDto } from '../staff-dtos/staff-role-type.dto';
import { StaffDto } from '../staff-dtos/staff.dto';
import { CharacterDto } from './character.dto';

@ObjectType()
export class CharacterEdgeDto extends BaseAnilistDto {
  @AutoMap(() => CharacterDto)
  @Field((type) => CharacterDto, { nullable: true })
  node?: CharacterDto;

  @AutoMap()
  @Field((type) => CharacterRole, { nullable: true })
  role?: string;

  @AutoMap()
  @Field({ nullable: true })
  name?: string;

  @AutoMap(() => [StaffDto])
  @Field(() => [StaffDto], {
    nullable: true,
    description: `The voice actors of the character`,
  })
  voiceActors?: StaffDto[];

  @AutoMap(() => [StaffRoleTypeDto])
  @Field((type) => [StaffRoleTypeDto], {
    nullable: true,
    description: 'The voice actors of the character with role date',
  })
  voiceActorRoles?: StaffRoleTypeDto[];

  @AutoMap(() => [AnimeDto])
  @Field(() => [AnimeDto], { nullable: true })
  anime?: AnimeDto[];
}
