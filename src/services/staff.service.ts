import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLoggerDto } from '~/common/dtos';
import { IStaffService } from '~/contracts/services';
import { Staff, StaffEdge } from '~/models';
import { StaffName } from '~/models/sub-models/staff-sub-models';
import { StaffConnection } from '~/models/sub-models/staff-sub-models/staff-connection.model';
import { LOGGER_CREATED } from '../common/constants/index';
import { IPaginateResult } from '../contracts/dtos/paginate-result.interface';
import {
  StaffImage,
  StaffPrimaryOccupation,
} from '../models/sub-models/staff-sub-models';
import { StaffAlternative } from '../models/sub-models/staff-sub-models/staff-name-alternative.model';
import { StaffRoleType } from '../models/sub-models/staff-sub-models/staff-role-type.model';
import { StaffYearActive } from '../models/sub-models/staff-sub-models/staff-year-active.model';
import { getMethodName } from '~/utils/tools/functions';

@Injectable()
export class StaffService implements IStaffService {
  private readonly logger = new Logger(StaffService.name);

  constructor(
    @InjectRepository(Staff) private readonly staffRepo: Repository<Staff>,
    @InjectRepository(StaffConnection)
    private readonly staffConnectionRepo: Repository<StaffConnection>,
    @InjectRepository(StaffEdge)
    private readonly staffEdgeRepo: Repository<StaffEdge>,
    @InjectRepository(StaffName)
    private readonly staffNameRepo: Repository<StaffName>,
    @InjectRepository(StaffRoleType)
    private readonly staffRoleTypeRepo: Repository<StaffRoleType>,
    @InjectRepository(StaffPrimaryOccupation)
    private readonly staffPrimaryOccupationRepo: Repository<StaffPrimaryOccupation>,
    @InjectRepository(StaffAlternative)
    private readonly staffAlternativeRepo: Repository<StaffAlternative>,
    @InjectRepository(StaffImage)
    private readonly staffImageRepo: Repository<StaffImage>,
    @InjectRepository(StaffYearActive)
    private readonly staffYearActiveRepo: Repository<StaffYearActive>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async getStaffListV1(page: number = 1, limit: number = 10) {
    const [result, count] = await this.staffRepo.findAndCount({
      relations: {
        staffAnime: {
          nodes: true,
        },
        characters: {
          nodes: true,
        },
      },
      take: limit,
      skip: (page - 1) * limit,
      order: {
        idAnilist: 'ASC',
      },
    });

    const lastPage = Math.ceil(count / limit);
    const staffPage: IPaginateResult<Staff> = {
      pageInfo: {
        total: count,
        perPage: limit,
        currentPage: page,
        lastPage,
        hasNextPage: page < lastPage,
      },
      docs: result,
    };

    return staffPage;
  }

  public async findStaffByIdAnilist(
    idAnilist: number,
    saveErrorNotFound?: boolean,
  ) {
    const staff = await this.staffRepo.findOne({
      where: {
        idAnilist,
      },
    });

    if (!staff && saveErrorNotFound) {
      this.eventEmitter.emit(LOGGER_CREATED, {
        requestObject: JSON.stringify(idAnilist),
        notes: `Can't not found staff with id ${idAnilist}`,
        tracePath: `${StaffService.name}.${getMethodName()}`,
      } as CreateLoggerDto);
    }

    return staff;
  }

  public async saveStaffConnection(staffConnection: Partial<StaffConnection>) {
    try {
      return this.staffConnectionRepo.save(staffConnection);
    } catch (error) {
      return this.handleServiceErrors(
        error,
        staffConnection,
        'StaffService.saveStaffConnection',
      );
    }
  }

  public async saveStaff(
    staff: Partial<Staff>,
  ): Promise<(Partial<Staff> & Staff) | null> {
    try {
      return await this.staffRepo.save(staff);
    } catch (error) {
      this.logger.error(error?.message);

      this.eventEmitter.emit(LOGGER_CREATED, {
        requestObject: JSON.stringify(staff),
        errorMessage: JSON.stringify(error),
        tracePath: `${StaffService.name}.${getMethodName()}`,
      } as CreateLoggerDto);

      return null;
    }
  }

  public async saveManyStaffEdge(staffEdges: Partial<StaffEdge>[]) {
    try {
      return this.staffEdgeRepo.save(staffEdges);
    } catch (error) {
      return this.handleServiceErrors(
        error,
        staffEdges,
        'StaffService.saveManyStaffEdge',
      );
    }
  }

  public async saveStaffEdge(staffEdge: Partial<StaffEdge>) {
    try {
      return this.staffEdgeRepo.save(staffEdge);
    } catch (error) {
      return this.handleServiceErrors(
        error,
        staffEdge,
        'StaffService.saveStaffEdge',
      );
    }
  }

  public async saveStaffRoleType(staffRoleTypeParam: Partial<StaffRoleType>) {
    try {
      return this.staffRoleTypeRepo.save(staffRoleTypeParam);
    } catch (error) {
      return this.handleServiceErrors(
        error,
        staffRoleTypeParam,
        'StaffService.saveStaffRoleType',
      );
    }
  }

  public async findOrCreateStaff(staffParam: Partial<Staff>) {
    const staff = await this.staffRepo.findOne({
      where: [{ idAnilist: staffParam.idAnilist }, { id: staffParam.id }],
    });

    if (staff) {
      return staff;
    }

    return await this.staffRepo.save(staffParam);
  }

  public async saveManyStaff(staffs: Partial<Staff>[]) {
    try {
      return await this.staffRepo.save(staffs);
    } catch (error) {
      this.logger.error(error?.message);

      this.eventEmitter.emit(LOGGER_CREATED, {
        requestObject: JSON.stringify(staffs),
        errorMessage: JSON.stringify(error),
        tracePath: `${StaffService.name}.${getMethodName()}`,
      } as CreateLoggerDto);

      return null;
    }
  }

  public async saveStaffName(
    staffName: Partial<StaffName>,
  ): Promise<(Partial<StaffName> & StaffName) | null> {
    try {
      return await this.staffNameRepo.save(staffName);
    } catch (error) {
      this.logger.error(error?.message);

      this.eventEmitter.emit(LOGGER_CREATED, {
        requestObject: JSON.stringify(staffName),
        errorMessage: JSON.stringify(error),
        tracePath: `${StaffService.name}.${getMethodName()}`,
      } as CreateLoggerDto);

      return null;
    }
  }

  public async saveManyStaffPrimaryOccupation(
    staffPrimaryOccupationList: Partial<StaffPrimaryOccupation>[],
  ) {
    try {
      return this.staffPrimaryOccupationRepo.save(staffPrimaryOccupationList);
    } catch (error) {
      return this.handleServiceErrors(
        error,
        staffPrimaryOccupationList,
        'StaffService.saveManyStaffPrimaryOccupation',
      );
    }
  }

  public async saveManyStaffAlternative(
    staffAlternative: Partial<StaffAlternative>[],
  ): Promise<(Partial<StaffAlternative> & StaffAlternative)[] | null> {
    try {
      return await this.staffAlternativeRepo.save(staffAlternative);
    } catch (error) {
      this.logger.error(error?.message);

      this.eventEmitter.emit(LOGGER_CREATED, {
        requestObject: JSON.stringify(staffAlternative),
        errorMessage: JSON.stringify(error),
        tracePath: `${StaffService.name}.${getMethodName()}`,
      } as CreateLoggerDto);

      return null;
    }
  }

  public async saveStaffImage(
    staffImage: Partial<StaffImage>,
  ): Promise<(Partial<StaffImage> & StaffImage) | null> {
    try {
      return await this.staffImageRepo.save(staffImage);
    } catch (error) {
      this.logger.error(error?.message);

      this.eventEmitter.emit(LOGGER_CREATED, {
        requestObject: JSON.stringify(staffImage),
        errorMessage: JSON.stringify(error),
        tracePath: `${StaffService.name}.${getMethodName()}`,
      } as CreateLoggerDto);

      return null;
    }
  }

  public async saveStaffYearActive(
    staffYearActive: Partial<StaffYearActive>,
  ): Promise<(Partial<StaffYearActive> & StaffYearActive) | null> {
    try {
      return await this.staffYearActiveRepo.save(staffYearActive);
    } catch (error) {
      this.logger.error(error?.message);

      this.eventEmitter.emit(LOGGER_CREATED, {
        requestObject: JSON.stringify(staffYearActive),
        errorMessage: JSON.stringify(error),
        tracePath: `${StaffService.name}.${getMethodName()}`,
      } as CreateLoggerDto);

      return null;
    }
  }

  private handleServiceErrors(
    error: any,
    obj: any,
    tracePath: string,
    notes?: string,
  ) {
    this.logger.error(error?.message);

    this.eventEmitter.emit(LOGGER_CREATED, {
      requestObject: JSON.stringify(obj),
      errorMessage: JSON.stringify(error),
      notes,
      tracePath: tracePath,
    } as CreateLoggerDto);

    return null;
  }
}
