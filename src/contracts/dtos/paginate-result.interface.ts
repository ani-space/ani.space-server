import { PageInfo } from '~/models/base-models/page-info.model';

export interface IPaginateResult<T> {
  pageInfo: PageInfo;

  docs: T[];
}
