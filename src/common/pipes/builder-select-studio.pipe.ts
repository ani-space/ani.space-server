import { PipeTransform } from '@nestjs/common';
import { fieldsMap } from 'graphql-fields-list';
import { QueryStudioArg } from '~/graphql/types/args/query-studio.arg';
import { NotFoundStudioError } from '~/graphql/types/dtos/studio/not-found-studio.error';
import {
  MapResultSelect,
  reverseBooleanValueInObj,
} from '~/utils/tools/object';

export class BuilderSelectStudioPipe implements PipeTransform {
  transform(value: any): MapResultSelect {
    /*
     * We don't want get fields from Error query and pass to Select TypeORM
     */
    const fieldsToSkip = Object.getOwnPropertyNames(
      new NotFoundStudioError({
        requestObject: new QueryStudioArg(),
      }),
    );

    const mappedSelect = reverseBooleanValueInObj(
      fieldsMap(value, {
        skip: [...fieldsToSkip, '__typename', 'anime.pageInfo', 'pageInfo'],
      }),
    );

    return mappedSelect;
  }
}
