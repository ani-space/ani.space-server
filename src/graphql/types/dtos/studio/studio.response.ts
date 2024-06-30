import { createUnionType } from '@nestjs/graphql';
import { StudioDto } from '~/common/dtos/studio-dtos/studio.dto';
import { NotFoundStudioError } from './not-found-studio.error';

export const StudioResultUnion = createUnionType({
  name: 'StudioResult',
  types: () => [StudioDto, NotFoundStudioError],
});
