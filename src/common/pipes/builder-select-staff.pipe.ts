import { PipeTransform } from '@nestjs/common';
import { fieldsMap } from 'graphql-fields-list';
import { QueryStaffArg } from '~/graphql/types/args/query-staff.arg';
import { NotFoundStaffError } from '~/graphql/types/dtos/staff/not-found-staff.error';
import {
  MapResultSelect,
  reverseBooleanValueInObj,
} from '~/utils/tools/object';

export class BuilderSelectStaffPipe implements PipeTransform {
  transform(value: any): MapResultSelect {
    /*
     * We don't want get fields from Error query and pass to Select TypeORM
     */
    const fieldsToSkip = Object.getOwnPropertyNames(
      new NotFoundStaffError({
        requestObject: new QueryStaffArg(),
      }),
    );

    const mappedSelect = reverseBooleanValueInObj(
      fieldsMap(value, {
        skip: [
          ...fieldsToSkip,
          '__typename',
          'characters.pageInfo',
          'staffAnime.pageInfo',
          'pageInfo',
        ],
      }),
    );

    return mappedSelect;
  }
}
