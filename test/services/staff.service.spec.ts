import { Test, TestingModule } from '@nestjs/testing';
import { staffListDto } from '../__mocks__/staff.data';
import { IStaffRepository } from '~/contracts/repositories';
import { IStaffExternalService } from '~/contracts/services';
import { QueryStaffArg } from '~/graphql/types/args/query-staff.arg';
import { NotFoundStaffError } from '~/graphql/types/dtos/staff/not-found-staff.error';
import { StaffService } from '~/services';
import { either } from '~/utils/tools/either';
import { MapResultSelect } from '~/utils/tools/object';

describe('StaffService', () => {
  let service: IStaffExternalService;

  const mockStaffRepo = {
    getStaffByConditions: jest.fn(),
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
