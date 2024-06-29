import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { alphabetical } from 'radash';
import { DataSource, Repository } from 'typeorm';
import { ICharacterRepository } from '~/contracts/repositories';
import { QueryCharacterArg } from '~/graphql/types/args/query-character.arg';
import { CharacterSortEnum } from '~/graphql/types/dtos/characters/character-sort.enum';
import { Character } from '~/models';
import { MapResultSelect } from '~/utils/tools/object';
import { QueryCharacterConnectionArg } from '../graphql/types/args/query-character-connection.arg';
import { CharacterConnection } from '../models/sub-models/character-sub-models';
import { paginate } from '../utils/tools/functions';
import { BaseRepository } from './base.repository';
import { QueryBuilderChainer } from './libs/query-builder-chainer';
@Injectable()
export class CharacterRepository
  extends BaseRepository<Character>
  implements ICharacterRepository
{
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,

    @InjectRepository(CharacterConnection)
    private readonly characterConnectionRepo: Repository<CharacterConnection>,

    private dataSource: DataSource,
  ) {
    super(characterRepository);
  }

  get characterConnectionAlias() {
    return 'CharacterConnection';
  }

  get characterAlias() {
    return 'Character';
  }

  get characterConnectionBuilder() {
    return this.dataSource
      .getRepository(CharacterConnection)
      .createQueryBuilder(this.characterConnectionAlias);
  }

  get characterBuilder() {
    return this.dataSource
      .getRepository(Character)
      .createQueryBuilder(this.characterAlias);
  }

  public async getCharacterByConditions(
    queryCharacterArg: QueryCharacterArg,
    mapResultSelectParam: MapResultSelect,
  ) {
    const mapResultSelect = mapResultSelectParam as Record<string, any>;
    const { id, idAnilist, age, fullName, gender } = queryCharacterArg;

    const queryBuilder = this.createSelectCharacterBuilder(
      mapResultSelect,
      fullName,
      id,
      idAnilist,
      age,
      gender,
    );

    const character = await queryBuilder.getOne();

    return character;
  }

  private createSelectCharacterBuilder(
    mapResultSelect: Record<string, any>,
    fullName: string | undefined,
    id: string | undefined,
    idAnilist: number,
    age: number | undefined,
    gender: string | undefined,
  ) {
    const builder = new QueryBuilderChainer(this.characterBuilder)
      // select character scalar fields
      .addSelect(mapResultSelect, this.characterAlias, true)

      // select character.dateOfBirth
      .applyJoinConditionally(
        !!mapResultSelect['dateOfBirth'],
        this.characterAlias,
        'dateOfBirth',
      )
      .addSelect(mapResultSelect['dateOfBirth'], 'dateOfBirth')

      // select character.image
      .applyJoinConditionally(
        !!mapResultSelect['image'],
        this.characterAlias,
        'image',
      )
      .addSelect(mapResultSelect['image'], 'image')

      // select character.name
      .applyJoinConditionally(
        !!mapResultSelect['name'] || !!fullName,
        this.characterAlias,
        'name',
      )
      .addSelect(mapResultSelect['name'], 'name', false, [
        'alternative',
        'alternativeSpoiler',
      ])

      // select character.anime
      .applyJoinConditionally(
        !!mapResultSelect['anime'],
        this.characterAlias,
        'anime',
      )
      .addSelect(mapResultSelect['anime'], 'anime', false, ['edges', 'nodes'])

      // select character.name.alternative
      .applyJoinConditionally(
        !!mapResultSelect['name']?.alternative,
        'name',
        'alternative',
      )
      .addSelect(mapResultSelect['name']?.alternative, 'alternative')

      // select character.name.alternativeSpoiler
      .applyJoinConditionally(
        !!mapResultSelect['name']?.alternativeSpoiler,
        'name',
        'alternativeSpoiler',
      )
      .addSelect(
        mapResultSelect['name']?.alternativeSpoiler,
        'alternativeSpoiler',
      )

      .applyWhereConditionally(this.characterAlias, 'id', id)
      .applyWhereConditionally(this.characterAlias, 'idAnilist', idAnilist)
      .applyWhereConditionally(this.characterAlias, 'age', age)
      .applyWhereConditionally(this.characterAlias, 'gender', gender)
      .applyWhereConditionally('name', 'full', gender);

    return builder.getQueryBuilder();
  }

  public async getEdgesOrNodes(
    characterConnectionId: string,
    queryCharacterConnectionArg: QueryCharacterConnectionArg,
    mapResultSelectParam: MapResultSelect,
  ) {
    const { limit, page, sort: sortEnum } = queryCharacterConnectionArg;
    const mapResultSelect = mapResultSelectParam as Record<string, any>;

    const queryBuilder = this.createQueryBuilder(
      mapResultSelect,
      characterConnectionId,
    );

    const characterConnection = await queryBuilder.getOne();

    if (!characterConnection) {
      return null;
    }

    switch (sortEnum) {
      case CharacterSortEnum.ID:
        characterConnection.edges = alphabetical(
          characterConnection.edges,
          (e) => e.id,
        );
        characterConnection.nodes = alphabetical(
          characterConnection.nodes,
          (e) => e.id,
        );
        break;

      case CharacterSortEnum.ID_DESC:
        characterConnection.edges = alphabetical(
          characterConnection.edges,
          (e) => e.id,
          'desc',
        );
        characterConnection.nodes = alphabetical(
          characterConnection.nodes,
          (e) => e.id,
          'desc',
        );
        break;

      case CharacterSortEnum.NAME:
        if (mapResultSelect['edges']?.name) {
          characterConnection.edges = alphabetical(
            characterConnection.edges,
            (e) => `${e?.name}`,
          );
        }
        if (mapResultSelect['nodes']?.name)
          characterConnection.nodes = alphabetical(
            characterConnection.nodes,
            (e) => `${e?.name?.full}`,
          );
        break;

      case CharacterSortEnum.NAME_DESC:
        if (mapResultSelect['edges']?.name) {
          characterConnection.edges = alphabetical(
            characterConnection.edges,
            (e) => `${e?.name}`,
            'desc',
          );
        }
        if (mapResultSelect['nodes']?.name)
          characterConnection.nodes = alphabetical(
            characterConnection.nodes,
            (e) => `${e?.name?.full}`,
            'desc',
          );
        break;

      case CharacterSortEnum.ROLE:
        if (mapResultSelect['edges']?.role) {
          characterConnection.edges = alphabetical(
            characterConnection.edges,
            (e) => `${e?.role}`,
          );
        }
        break;

      case CharacterSortEnum.ROLE_DESC:
        if (mapResultSelect['edges']?.role) {
          characterConnection.edges = alphabetical(
            characterConnection.edges,
            (e) => `${e?.role}`,
            'desc',
          );
        }
        break;
    }

    const totalPages =
      characterConnection.edges.length || characterConnection.nodes.length;
    const lastPage = Math.ceil(totalPages / limit);
    characterConnection.pageInfo = {
      total: totalPages,
      perPage: limit,
      lastPage,
      currentPage: page,
      hasNextPage: page < lastPage,
    };

    characterConnection.edges = paginate(
      limit,
      page,
      characterConnection.edges,
    );
    characterConnection.nodes = paginate(
      limit,
      page,
      characterConnection.nodes,
    );

    return characterConnection;
  }

  private createQueryBuilder(
    mapResultSelect: Record<string, any>,
    characterConnectionId: string,
  ) {
    return (
      new QueryBuilderChainer(this.characterConnectionBuilder)
        // nodes queries
        .applyJoinConditionally(
          !!mapResultSelect['nodes'],
          this.characterConnectionAlias,
          'nodes',
        )
        .addSelect(mapResultSelect['nodes'], 'nodes')
        .applyJoinConditionally(
          !!mapResultSelect['nodes']?.name,
          'nodes',
          'name',
        )
        .addSelect(mapResultSelect['nodes']?.name, 'name')
        .applyJoinConditionally(
          !!mapResultSelect['nodes']?.image,
          'nodes',
          'image',
        )
        .addSelect(mapResultSelect['nodes']?.image, 'image')
        .applyJoinConditionally(
          !!mapResultSelect['nodes']?.dateOfBirth,
          'nodes',
          'dateOfBirth',
        )
        .addSelect(mapResultSelect['nodes']?.dateOfBirth, 'dateOfBirth')
        .applyJoinConditionally(
          !!mapResultSelect['nodes']?.anime,
          'nodes',
          'anime',
        )
        .addSelect(mapResultSelect['nodes']?.anime, 'anime')
        // edges queries
        .applyJoinConditionally(
          !!mapResultSelect['edges'],
          this.characterConnectionAlias,
          'edges',
        )
        .addSelect(mapResultSelect['edges'], 'edges')
        .applyJoinConditionally(
          !!mapResultSelect['edges']?.voiceActors,
          'edges',
          'voiceActors',
        )
        .addSelect(mapResultSelect['edges']?.voiceActors, 'voiceActors')
        .applyJoinConditionally(
          !!mapResultSelect['edges']?.voiceActorRoles,
          'edges',
          'voiceActorRoles',
        )
        .addSelect(mapResultSelect['edges']?.voiceActorRoles, 'voiceActorRoles')
        .applyJoinConditionally(
          !!mapResultSelect['edges']?.anime,
          'edges',
          'anime',
        )
        .addSelect(mapResultSelect['edges']?.anime, 'anime')
        // edges node queries:
        .applyJoinConditionally(
          !!mapResultSelect['edges']?.node,
          'edges',
          'node',
        )
        .addSelect(mapResultSelect['edges']?.node, 'node')
        .applyJoinConditionally(
          !!mapResultSelect['edges']?.node?.name,
          'node',
          'name',
        )
        .addSelect(mapResultSelect['edges']?.node?.name, 'name')
        .applyJoinConditionally(
          !!mapResultSelect['edges']?.node?.image,
          'node',
          'image',
        )
        .addSelect(mapResultSelect['edges']?.node?.image, 'image')
        .applyJoinConditionally(
          !!mapResultSelect['edges']?.node?.dateOfBirth,
          'node',
          'dateOfBirth',
        )
        .addSelect(mapResultSelect['edges']?.node?.dateOfBirth, 'dateOfBirth')
        .applyJoinConditionally(
          !!mapResultSelect['edges']?.node?.anime,
          'node',
          'anime',
        )
        .addSelect(mapResultSelect['edges']?.node?.anime, 'anime')

        .applyWhereConditionally(
          this.characterConnectionAlias,
          'id',
          characterConnectionId,
        )
        .getQueryBuilder()
    );
  }
}
