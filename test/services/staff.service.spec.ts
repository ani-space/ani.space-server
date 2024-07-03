import { Test, TestingModule } from '@nestjs/testing';
import { staffConnectionListDto, staffListDto } from '../__mocks__/staff.data';
import { IStaffRepository } from '~/contracts/repositories';
import { IStaffExternalService } from '~/contracts/services';
import { QueryStaffArg } from '~/graphql/types/args/query-staff.arg';
import { NotFoundStaffError } from '~/graphql/types/dtos/staff/not-found-staff.error';
import { StaffService } from '~/services';
import { either } from '~/utils/tools/either';
import { MapResultSelect } from '~/utils/tools/object';
import { QueryStaffConnectionArg } from '~/graphql/types/args/query-staff-connection.arg';

describe('StaffService', () => {
  let service: IStaffExternalService;

  const mockStaffRepo = {
    getStaffByConditions: jest.fn(),
    getEdgesOrNodes: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: IStaffExternalService,
          useClass: StaffService,
        },
        {
          provide: IStaffRepository,
          useValue: mockStaffRepo,
        },
      ],
    })
      .useMocker((token) => {
        return jest.fn();
      })
      .compile();

    service = module.get<IStaffExternalService>(IStaffExternalService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getStaffConnectionPage should return null', async () => {
    // arrange
    const staffConnectionId: string = 'f11b8ea8-ab99-452d-ae8b-3144b4bf1152';
    const queryStaffConnectionArg: QueryStaffConnectionArg = {
      limit: 10,
      page: 1,
    };
    const mapResultSelect: MapResultSelect = {};
    mockStaffRepo.getEdgesOrNodes.mockResolvedValue(null);

    // act
    const result = await service.getStaffConnectionPage(
      staffConnectionId,
      queryStaffConnectionArg,
      mapResultSelect,
    );

    // assert
    expect(result).toEqual(null);
  });

  it('getStaffConnectionPage should return staff connection', async () => {
    // arrange
    const staffConnectionId: string = 'f11b8ea8-ab99-452d-ae8b-3144b4bf1152';
    const queryStaffConnectionArg: QueryStaffConnectionArg = {
      limit: 10,
      page: 1,
    };
    const mapResultSelect: MapResultSelect = {};
    mockStaffRepo.getEdgesOrNodes.mockResolvedValue(staffConnectionListDto[0]);

    // act
    const result = await service.getStaffConnectionPage(
      staffConnectionId,
      queryStaffConnectionArg,
      mapResultSelect,
    );

    // assert
    expect(result).toMatchObject(staffConnectionListDto[0]);
  });

  it('getStaffByConditions should return NotFoundStaffError if not found staff', async () => {
    // arrange
    const mapResultSelect: MapResultSelect = {};
    const queryStaffArg: QueryStaffArg = {
      idAnilist: 111111,
    };
    mockStaffRepo.getStaffByConditions.mockResolvedValue(null);

    // act
    const result = await service.getStaffByConditions(
      mapResultSelect,
      queryStaffArg,
    );

    // assert
    expect(result).toEqual(
      either.error(new NotFoundStaffError({ requestObject: queryStaffArg })),
    );
  });

  it('getStaffByConditions should return Staff if found staff', async () => {
    // arrange
    const mapResultSelect: MapResultSelect = {};
    const queryStaffArg: QueryStaffArg = {
      idAnilist: 111111,
    };
    mockStaffRepo.getStaffByConditions.mockResolvedValue(staffListDto[0]);

    // act
    const result = await service.getStaffByConditions(
      mapResultSelect,
      queryStaffArg,
    );

    // assert
    expect(result).toMatchObject(either.of(staffListDto[0]));
  });
});
