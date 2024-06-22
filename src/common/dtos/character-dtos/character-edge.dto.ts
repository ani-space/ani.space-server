import { AutoMap } from '@automapper/classes';
import { Field, ObjectType } from '@nestjs/graphql';
import { CharacterRole } from '../../../models/sub-models/character-sub-models';
import { AnimeDto } from '../anime-dtos/anime.dto';
import { BaseAnilistDto } from '../base-dtos/base-anilist.dto';
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

  // TODO: define voiceActors?: Staff[];

  // TODO: voiceActorRoles?: StaffRoleType[];

  @AutoMap(() => [AnimeDto])
  @Field(() => [AnimeDto], { nullable: true })
  anime?: AnimeDto[];
}
