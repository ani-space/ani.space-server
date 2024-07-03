import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { Staff } from '~/models';
import { IStaffRepository } from '~/contracts/repositories';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ObjectLiteral, Repository } from 'typeorm';
import { MapResultSelect } from '~/utils/tools/object';
import { QueryStaffArg } from '~/graphql/types/args/query-staff.arg';
import { QueryBuilderChainer } from './libs/query-builder-chainer';
import { nameof } from 'ts-simple-nameof';
import { QueryStaffConnectionArg } from '~/graphql/types/args/query-staff-connection.arg';
import { StaffConnection } from '~/models/sub-models/staff-sub-models/staff-connection.model';
import { paginate } from '~/utils/tools/functions';
import { StaffSortEnum } from '~/graphql/types/dtos/staff/staff-sort.enum';
import { alphabetical, sort } from 'radash';

@Injectable()
export class StaffRepository
  extends BaseRepository<Staff>
  implements IStaffRepository
{
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,

    private dataSource: DataSource,
  ) {
    super(staffRepository);
  }

  get staffAlias() {
    return 'Staff';
  }

  get staffConnectionAlias() {
    return 'StaffConnection';
  }

  get staffBuilder() {
    return this.dataSource
      .getRepository(Staff)
      .createQueryBuilder(this.staffAlias);
  }

  get staffConnectionQueryBuilder() {
    return this.dataSource
      .getRepository(StaffConnection)
      .createQueryBuilder(this.staffConnectionAlias);
  }

  public async getEdgesOrNodes(
    staffConnectionId: string,
    queryStaffConnectionArg: QueryStaffConnectionArg,
    mapResultSelectParam: MapResultSelect,
  ) {
    const { limit, page, sort: sortQuery } = queryStaffConnectionArg;
    const mapResultSelect = mapResultSelectParam as Record<string, any>;

    const queryBuilder = this.createQueryStaffConnectionBuilder(
      mapResultSelect,
      staffConnectionId,
    );

    const staffConnection = await queryBuilder.getOne();

    if (!staffConnection) {
      return null;
    }

    // pagination on application layer:
    this.handlePaginationStaffConnection(
      sortQuery,
      staffConnection,
      limit,
      page,
    );

    return staffConnection;
  }

  public async getStaffByConditions(
    mapResultSelectParam: MapResultSelect,
    queryStaffArg: QueryStaffArg,
  ) {
    const mapResultSelect = mapResultSelectParam as Record<string, any>;

    const queryBuilder = this.createQueryStaffByConditions(
      mapResultSelect,
      queryStaffArg,
    );

    const staff = await queryBuilder.getOne();

    return staff;
  }

  // public common query builder for other relation
  public static createBuilderSelectStaff<Entity extends ObjectLiteral>(
    builderChainer: QueryBuilderChainer<Entity>,
    rootAlias: string,
    mapResultSelect: Record<string, any>,
  ) {
    if (!mapResultSelect || !Object.keys(mapResultSelect).length) {
      return builderChainer;
    }

    return (
      builderChainer
        .addSelect(mapResultSelect, rootAlias, false, ['primaryOccupations'])

        // query staff.characters
        .applyJoinConditionally(
          !!mapResultSelect['characters'],
          rootAlias,
          'characters',
        )
        .addSelect(mapResultSelect['characters'], 'characters', false, [
          'edges',
          'nodes',
        ])

        // query staff.staffAnime
        .applyJoinConditionally(
          !!mapResultSelect['staffAnime'],
          rootAlias,
          'staffAnime',
        )
        .addSelect(mapResultSelect['staffAnime'], 'staffAnime', false, [
          'edges',
          'nodes',
        ])

        // query staff.name
        .applyJoinConditionally(!!mapResultSelect['name'], rootAlias, 'name')
        .addSelect(mapResultSelect['name'], 'name', false, ['alternative'])

        // query staff.image
        .applyJoinConditionally(!!mapResultSelect['image'], rootAlias, 'image')
        .addSelect(mapResultSelect['image'], 'image')

        // query staff.dateOfBirth
        .applyJoinConditionally(
          !!mapResultSelect['dateOfBirth'],
          rootAlias,
          'dateOfBirth',
        )
        .addSelect(mapResultSelect['dateOfBirth'], 'dateOfBirth')

        // query staff.dateOfDeath
        .applyJoinConditionally(
          !!mapResultSelect['dateOfDeath'],
          rootAlias,
          'dateOfDeath',
        )
        .addSelect(mapResultSelect['dateOfDeath'], 'dateOfDeath')

        // query staff.primaryOccupations
        .applyJoinConditionally(
          !!mapResultSelect['primaryOccupations'],
          rootAlias,
          'primaryOccupations',
        )
        .addSelect(mapResultSelect['primaryOccupations'], 'primaryOccupations')

        // query staff.yearsActive
        .applyJoinConditionally(
          !!mapResultSelect['yearsActive'],
          rootAlias,
          'yearsActive',
        )
        .addSelect(mapResultSelect['yearsActive'], 'yearsActive')

        // query staff.name.alternative
        .applyJoinConditionally(
          !!mapResultSelect['name']?.alternative,
          'name',
          'alternative',
        )
        .addSelect(mapResultSelect['name']?.alternative, 'alternative')
    );
  }

  private createQueryStaffByConditions(
    mapResultSelect: Record<string, any>,
    queryStaffArg: QueryStaffArg,
  ) {
    const { idAnilist, id, name } = queryStaffArg;

    return (
      new QueryBuilderChainer(this.staffBuilder)
        // query staff scalar fields
        .addSelect(mapResultSelect, this.staffAlias, true, [
          'primaryOccupations',
        ])

        // query staff.characters
        .applyJoinConditionally(
          !!mapResultSelect['characters'],
          this.staffAlias,
          'characters',
        )
        .addSelect(mapResultSelect['characters'], 'characters', false, [
          'edges',
          'nodes',
        ])

        // query staff.staffAnime
        .applyJoinConditionally(
          !!mapResultSelect['staffAnime'],
          this.staffAlias,
          'staffAnime',
        )
        .addSelect(mapResultSelect['staffAnime'], 'staffAnime', false, [
          'edges',
          'nodes',
        ])

        // query staff.name
        .applyJoinConditionally(
          !!mapResultSelect['name'] || !!name,
          this.staffAlias,
          'name',
        )
        .addSelect(mapResultSelect['name'], 'name', false, ['alternative'])

        // query staff.image
        .applyJoinConditionally(
          !!mapResultSelect['image'],
          this.staffAlias,
          'image',
        )
        .addSelect(mapResultSelect['image'], 'image')

        // query staff.dateOfBirth
        .applyJoinConditionally(
          !!mapResultSelect['dateOfBirth'],
          this.staffAlias,
          'dateOfBirth',
        )
        .addSelect(mapResultSelect['dateOfBirth'], 'dateOfBirth')

        // query staff.dateOfDeath
        .applyJoinConditionally(
          !!mapResultSelect['dateOfDeath'],
          this.staffAlias,
          'dateOfDeath',
        )
        .addSelect(mapResultSelect['dateOfDeath'], 'dateOfDeath')

        // query staff.primaryOccupations
        .applyJoinConditionally(
          !!mapResultSelect['primaryOccupations'],
          this.staffAlias,
          'primaryOccupations',
        )
        .addSelect(mapResultSelect['primaryOccupations'], 'primaryOccupations')

        // query staff.yearsActive
        .applyJoinConditionally(
          !!mapResultSelect['yearsActive'],
          this.staffAlias,
          'yearsActive',
        )
        .addSelect(mapResultSelect['yearsActive'], 'yearsActive')

        // query staff.name.alternative
        .applyJoinConditionally(
          !!mapResultSelect['name']?.alternative,
          'name',
          'alternative',
        )
        .addSelect(mapResultSelect['name']?.alternative, 'alternative')

        // where filters
        .applyWhereConditionally(
          this.staffAlias,
          nameof<Staff>((s) => s.idAnilist),
          idAnilist,
        )
        .applyWhereConditionally(
          this.staffAlias,
          nameof<Staff>((s) => s.id),
          id,
        )
        .applyOrWhereConditionally('name', 'first', name)
        .applyOrWhereConditionally('name', 'middle', name)
        .applyOrWhereConditionally('name', 'last', name)
        .applyOrWhereConditionally('name', 'full', name)
        .applyOrWhereConditionally('name', 'native', name)
        .applyOrWhereConditionally('name', 'userPreferred', name)
        .getQueryBuilder()
    );
  }

  private handlePaginationStaffConnection(
    sortQuery: StaffSortEnum | undefined,
    staffConnection: StaffConnection,
    limit: number,
    page: number,
  ) {
    if (!staffConnection?.edges && !staffConnection.nodes) {
      return staffConnection;
    }

    switch (sortQuery) {
      case StaffSortEnum.ID:
        staffConnection.edges = sort(staffConnection.edges, (e) =>
          Number(e?.node?.idAnilist),
        );
        staffConnection.nodes = sort(
          staffConnection.nodes,
          (n) => n?.idAnilist,
        );
        break;
      case StaffSortEnum.ID_DESC:
        staffConnection.edges = sort(
          staffConnection.edges,
          (e) => Number(e?.node?.idAnilist),
          true,
        );
        staffConnection.nodes = sort(
          staffConnection.nodes,
          (n) => n?.idAnilist,
          true,
        );
        break;
      case StaffSortEnum.LANGUAGE:
        staffConnection.edges = alphabetical(
          staffConnection.edges,
          (e) => `${e?.node?.languageV2}`,
          'asc',
        );
        staffConnection.nodes = alphabetical(
          staffConnection.nodes,
          (n) => `${n?.languageV2}`,
          'asc',
        );
        break;
      case StaffSortEnum.LANGUAGE_DESC:
        staffConnection.edges = alphabetical(
          staffConnection.edges,
          (e) => `${e?.node?.languageV2}`,
          'desc',
        );
        staffConnection.nodes = alphabetical(
          staffConnection.nodes,
          (n) => `${n?.languageV2}`,
          'desc',
        );
        break;
      case StaffSortEnum.ROLE:
        staffConnection.edges = alphabetical(
          staffConnection.edges,
          (e) => `${e?.role}`,
          'asc',
        );
        break;
      case StaffSortEnum.ROLE_DESC:
        staffConnection.edges = alphabetical(
          staffConnection.edges,
          (e) => `${e?.role}`,
          'desc',
        );
        break;
    }

    const totalPages =
      staffConnection.edges.length || staffConnection.nodes.length;
    const lastPage = Math.ceil(totalPages / limit);
    staffConnection.pageInfo = {
      total: totalPages,
      perPage: limit,
      lastPage,
      currentPage: page,
      hasNextPage: page < lastPage,
    };

    staffConnection.edges = paginate(limit, page, staffConnection.edges);
    staffConnection.nodes = paginate(limit, page, staffConnection.nodes);

    return staffConnection;
  }

  private createQueryStaffConnectionBuilder(
    mapResultSelect: Record<string, any>,
    staffConnectionId: string,
  ) {
    const queryBuilder = new QueryBuilderChainer(
      this.staffConnectionQueryBuilder,
    )
      // nodes queries
      .applyJoinConditionally(
        !!mapResultSelect['nodes'],
        this.staffConnectionAlias,
        'nodes',
      )
      .addSelect(mapResultSelect['nodes'], 'nodes', false, [
        'primaryOccupations',
      ])

      // edges queries
      .applyJoinConditionally(
        !!mapResultSelect['edges'],
        this.staffConnectionAlias,
        'edges',
      )
      .addSelect(mapResultSelect['edges'], 'edges')

      // edges.node queries
      .applyJoinConditionally(!!mapResultSelect['edges']?.node, 'edges', 'node')
      .addSelect(mapResultSelect['edges']?.node, 'node')

      .applyOrWhereConditionally(
        this.staffConnectionAlias,
        'id',
        staffConnectionId,
      );

    StaffRepository.createBuilderSelectStaff(
      queryBuilder,
      'nodes',
      mapResultSelect['nodes'],
    );

    StaffRepository.createBuilderSelectStaff(
      queryBuilder,
      'node',
      mapResultSelect['edges']?.node,
    );
    return queryBuilder.getQueryBuilder();
  }
}
