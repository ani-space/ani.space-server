import { PartialType } from '@nestjs/swagger';
import { AniSpaceLog } from '~/models';

export class CreateLoggerDto extends PartialType(AniSpaceLog) {}
