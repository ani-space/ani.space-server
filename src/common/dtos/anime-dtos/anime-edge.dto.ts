import { AutoMap } from '@automapper/classes';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { AnimeRelation } from '../../../models/sub-models/anime-sub-models';
import { AnimeDto } from './anime.dto';
import { Character } from '../../../models/character.model';
import { CharacterRole } from '../../../models/sub-models/character-sub-models';
import { Staff } from '../../../models/staff.model';
import { StaffRoleType } from '../../../models/sub-models/staff-sub-models/staff-role-type.model';

@ObjectType()
export class AnimeEdgeDto {
  @AutoMap()
  @Field((type) => Int)
  idAnilist: number;

  @AutoMap(() => AnimeDto)
  @Field((type) => AnimeDto, { nullable: true })
  node?: AnimeDto;

  @AutoMap()
  @Field((type) => AnimeRelation, {
    nullable: true,
    description: 'The type of relation to the parent model',
  })
  relationType?: string;

  @AutoMap()
  @Field({
    description:
      'If the studio is the main animation studio of the media (For Studio->MediaConnection field only)',
  })
  isMainStudio: boolean;

  //TODO: Define characters: CharacterDto[];

  @AutoMap()
  @Field((type) => CharacterRole, {
    nullable: true,
    description: 'The characters role in the media',
  })
  characterRole?: string;

  @AutoMap()
  @Field({ nullable: true, description: 'Media specific character name' })
  characterName?: string;

  @AutoMap()
  @Field({
    nullable: true,
    description: `Notes regarding the VA's role for the character`,
  })
  roleNotes?: string;

  @AutoMap()
  @Field({
    nullable: true,
    description: `Used for grouping roles where multiple dubs exist for the same language. Either dubbing company name or language variant.`,
  })
  dubGroup?: string;

  @AutoMap()
  @Field({
    nullable: true,
    description: `The role of the staff member in the production of the media`,
  })
  staffRole?: string;

  // TODO: define voiceActors: StaffDto[];

  // TODO: define  voiceActorRoles?: StaffRoleTypeDto[];

  @AutoMap()
  @Field((type) => Int, {
    nullable: true,
    description:
      'The order the media should be displayed from the users favourites',
  })
  favouriteOrder?: number;
}
