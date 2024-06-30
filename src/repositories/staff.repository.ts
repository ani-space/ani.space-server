import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { Staff } from '~/models';
import { IStaffRepository } from '~/contracts/repositories';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { MapResultSelect } from '~/utils/tools/object';
import { QueryStaffArg } from '~/graphql/types/args/query-staff.arg';
import { QueryBuilderChainer } from './libs/query-builder-chainer';
import { nameof } from 'ts-simple-nameof';

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

  get staffBuilder() {
    return this.dataSource
      .getRepository(Staff)
      .createQueryBuilder(this.staffAlias);
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
}
