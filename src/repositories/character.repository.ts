import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ICharacterRepository } from '~/contracts/repositories';
import { CharacterSortEnum } from '~/graphql/types/dtos/characters/character-sort.enum';
import { Character } from '~/models';
import { MapResultSelect } from '~/utils/tools/object';
import { QueryCharacterConnectionArg } from '../graphql/types/args/query-character-connection.arg';
import { CharacterConnection } from '../models/sub-models/character-sub-models';
import { paginate } from '../utils/tools/functions';
import { BaseRepository } from './base.repository';
import { alphabetical, sort } from 'radash';
import { QueryBuilderChainer } from './libs/query-builder-chainer';
import { nameof } from 'ts-simple-nameof';
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

  get characterBuilder() {
    return this.dataSource
      .getRepository(CharacterConnection)
      .createQueryBuilder(this.characterConnectionAlias);
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

    const animeConnection = await queryBuilder.getOne();

    if (!animeConnection) {
      return null;
    }

    switch (sortEnum) {
      case CharacterSortEnum.ID:
        animeConnection.edges = alphabetical(
          animeConnection.edges,
          (e) => e.id,
        );
        animeConnection.nodes = alphabetical(
          animeConnection.nodes,
          (e) => e.id,
        );
        break;

      case CharacterSortEnum.ID_DESC:
        animeConnection.edges = alphabetical(
          animeConnection.edges,
          (e) => e.id,
          'desc',
        );
        animeConnection.nodes = alphabetical(
          animeConnection.nodes,
          (e) => e.id,
          'desc',
        );
        break;

      case CharacterSortEnum.NAME:
        if (mapResultSelect['edges']?.name) {
          animeConnection.edges = alphabetical(
            animeConnection.edges,
            (e) => `${e?.name}`,
          );
        }
        if (mapResultSelect['nodes']?.name)
          animeConnection.nodes = alphabetical(
            animeConnection.nodes,
            (e) => `${e?.name?.full}`,
          );
        break;

      case CharacterSortEnum.NAME_DESC:
        if (mapResultSelect['edges']?.name) {
          animeConnection.edges = alphabetical(
            animeConnection.edges,
            (e) => `${e?.name}`,
            'desc',
          );
        }
        if (mapResultSelect['nodes']?.name)
          animeConnection.nodes = alphabetical(
            animeConnection.nodes,
            (e) => `${e?.name?.full}`,
            'desc',
          );
        break;

      case CharacterSortEnum.ROLE:
        if (mapResultSelect['edges']?.role) {
          animeConnection.edges = alphabetical(
            animeConnection.edges,
            (e) => `${e?.role}`,
          );
        }
        break;

      case CharacterSortEnum.ROLE_DESC:
        if (mapResultSelect['edges']?.role) {
          animeConnection.edges = alphabetical(
            animeConnection.edges,
            (e) => `${e?.role}`,
            'desc',
          );
        }
        break;
    }

    const totalPages =
      animeConnection.edges.length || animeConnection.nodes.length;
    const lastPage = Math.ceil(totalPages / limit);
    animeConnection.pageInfo = {
      total: totalPages,
      perPage: limit,
      lastPage,
      currentPage: page,
      hasNextPage: page < lastPage,
    };

    animeConnection.edges = paginate(limit, page, animeConnection.edges);
    animeConnection.nodes = paginate(limit, page, animeConnection.nodes);

    return animeConnection;
  }

  private createQueryBuilder(
    mapResultSelect: Record<string, any>,
    characterConnectionId: string,
  ) {
    return (
      new QueryBuilderChainer(this.characterBuilder)
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
        .getQueryBuilder()
        .where(`${this.characterConnectionAlias}.id=:characterConnectionId`)
        .setParameter('characterConnectionId', characterConnectionId)
    );
  }
}
