import { PipeTransform } from '@nestjs/common';
import { fieldsMap } from 'graphql-fields-list';
import {
  MapResultSelect,
  reverseBooleanValueInObj,
} from '../../utils/tools/object';

export class BuilderSelectAnimePipe implements PipeTransform {
  transform(value: any): MapResultSelect {
    const mappedSelect = reverseBooleanValueInObj(fieldsMap(value, {}));

    return mappedSelect;
  }
}
