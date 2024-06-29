import { PipeTransform } from '@nestjs/common';
import { fieldsMap } from 'graphql-fields-list';
import { QueryCharacterArg } from '~/graphql/types/args/query-character.arg';
import { NotFoundCharacterError } from '~/graphql/types/dtos/characters/not-found-character.error';
import {
  MapResultSelect,
  reverseBooleanValueInObj,
} from '~/utils/tools/object';

export class BuilderSelectCharacterPipe implements PipeTransform {
  transform(value: any): MapResultSelect {
    /*
     * We don't want get fields from Error query and pass to Select TypeORM
     */
    const fieldsToSkip = Object.getOwnPropertyNames(
      new NotFoundCharacterError({
        requestObject: new QueryCharacterArg(),
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
