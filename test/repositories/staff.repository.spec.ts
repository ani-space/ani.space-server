import { Test, TestingModule } from '@nestjs/testing';
import { mockDataSource } from '../__mocks__/data-source';
import { DataSource } from 'typeorm';
import { IStaffRepository } from '~/contracts/repositories';
import { StaffRepository } from '~/repositories/staff.repository';
import { MapResultSelect } from '~/utils/tools/object';
import { QueryStaffArg } from '~/graphql/types/args/query-staff.arg';
import { staffListDto } from '../__mocks__/staff.data';

describe('StaffRepository', () => {
  let staffRepository: IStaffRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: IStaffRepository,
          useClass: StaffRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    })
      .useMocker((token) => {
        return jest.fn();
      })
      .compile();

    staffRepository = module.get<IStaffRepository>(IStaffRepository);
    mockDataSource.getRepository.mockReturnValue(mockDataSource);
    mockDataSource.createQueryBuilder.mockReturnValue(mockDataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getStaffByConditions should return null', async () => {
    // arrange
    const mapResultSelectParam: MapResultSelect = {};
    const queryStaffArg: QueryStaffArg = {
      idAnilist: 111111,
    };
    mockDataSource.getOne.mockResolvedValue(null);

    // act
    const result = await staffRepository.getStaffByConditions(
      mapResultSelectParam,
      queryStaffArg,
    );

    // assert
    expect(result).toEqual(null);
  });

  it('getStaffByConditions should return staff', async () => {
    // arrange
    const mapResultSelectParam: MapResultSelect = {};
    const queryStaffArg: QueryStaffArg = {
      idAnilist: 111111,
    };
    mockDataSource.getOne.mockResolvedValue(staffListDto[0]);

    // act
    const result = await staffRepository.getStaffByConditions(
      mapResultSelectParam,
      queryStaffArg,
    );

    // assert
    expect(result).toMatchObject(staffListDto[0]);
  });
});
