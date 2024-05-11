import { Field, ObjectType, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Anime } from './anime.model';
import { BaseEntity } from './base-models';
import { Character } from './character.model';
import { Staff } from './staff.model';
import { CharacterRole } from './sub-models/character-sub-models';
import { CharacterConnection } from './sub-models/character-sub-models/character-connection.model';
import { StaffRoleType } from './sub-models/staff-sub-models/staff-role-type.model';

@ObjectType()
@Entity({ name: 'characterEdges' })
export class CharacterEdge extends BaseEntity {
  @Column()
  @Field((type) => Int)
  idAnilist: number;

  @ManyToOne(
    () => CharacterConnection,
    (characterConnection) => characterConnection.edges,
  )
  characterConnection: CharacterConnection;

  @Field((type) => Character, { nullable: true })
  @ManyToOne(() => Character)
  node?: Character;

  @Field((type) => CharacterRole, { nullable: true })
  @Column({
    type: 'enum',
    enum: CharacterRole,
    nullable: true,
  })
  role?: CharacterRole;

  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field(() => [Staff], {
    nullable: true,
    description: `The voice actors of the character`,
  })
  @ManyToMany(() => Staff)
  @JoinTable()
  voiceActors?: Staff[];

  @Field((type) => [StaffRoleType], {
    nullable: true,
    description: 'The voice actors of the character with role date',
  })
  @OneToMany(
    () => StaffRoleType,
    (voiceActorRoles) => voiceActorRoles.characterEdge,
  )
  voiceActorRoles?: StaffRoleType[];

  @Field(() => [Anime], { nullable: true })
  @ManyToMany(() => Anime)
  @JoinTable()
  anime?: Anime[];
}
