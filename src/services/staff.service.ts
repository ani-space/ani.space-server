import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLoggerDto } from '~/common/dtos';
import { IStaffService } from '~/contracts/services';
import { Staff } from '~/models';
import { LOGGER_CREATED } from '../common/constants/index';
import { StaffName } from '~/models/sub-models/staff-sub-models';
import { StaffAlternative } from '../models/sub-models/staff-sub-models/staff-name-alternative.model';
import {
  StaffImage,
  StaffPrimaryOccupation,
} from '../models/sub-models/staff-sub-models';
import { StaffYearActive } from '../models/sub-models/staff-sub-models/staff-year-active.model';

@Injectable()
export class StaffService implements IStaffService {
  private readonly logger = new Logger(StaffService.name);

  constructor(
    @InjectRepository(Staff) private readonly staffRepo: Repository<Staff>,
    @InjectRepository(StaffName) private readonly staffNameRepo: Repository<StaffName>,
    @InjectRepository(StaffPrimaryOccupation) private readonly staffPrimaryOccupationRepo: Repository<StaffPrimaryOccupation>,
    @InjectRepository(StaffAlternative) private readonly staffAlternativeRepo: Repository<StaffAlternative>,
    @InjectRepository(StaffImage) private readonly staffImageRepo: Repository<StaffImage>,
    @InjectRepository(StaffYearActive) private readonly staffYearActiveRepo: Repository<StaffYearActive>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

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
        tracePath: `StaffService.findStaffByIdAnilist`,
      } as CreateLoggerDto);
    }

    return staff;
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
        tracePath: `StaffService.saveStaff`,
      } as CreateLoggerDto);

      return null;
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
        tracePath: `StaffService.saveManyStaff`,
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
        tracePath: `StaffService.saveStaffName`,
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
        tracePath: `StaffService.saveManyStaffAlternative`,
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
        tracePath: `StaffService.saveStaffImage`,
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
        tracePath: `StaffService.saveStaffYearActive`,
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
