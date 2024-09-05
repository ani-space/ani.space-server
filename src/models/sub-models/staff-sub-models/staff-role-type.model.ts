import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Staff } from '~/models/staff.model';
import { AnimeEdge } from '../../anime-edge.model';
import { BaseEntity } from '~/models/base-models';
import { CharacterEdge } from '~/models/character-edge.model';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'staffRoleTypes' })
@ObjectType()
export class StaffRoleType extends BaseEntity {
  @ManyToOne((type) => AnimeEdge, (animeEdge) => animeEdge.voiceActorRoles)
  animeEdge: AnimeEdge;

  @ManyToOne(
    (type) => CharacterEdge,
    (characterEdge) => characterEdge.voiceActorRoles,
  )
  characterEdge: CharacterEdge;

  @AutoMap(() => Staff)
  @Field((type) => Staff, {
    nullable: true,
    description: 'The voice actors of the character',
  })
  @ManyToOne(() => Staff)
  voiceActor?: Staff;

  @AutoMap()
  @Field({ description: `Notes regarding the VA's role for the character` })
  @Column({ nullable: true })
  roleNotes?: string;

  @AutoMap()
  @Field({
    description: `Used for grouping roles where multiple dubs exist for the same language. Either dubbing company name or language variant.`,
  })
  @Column({ nullable: true })
  dubGroup?: string;
}
