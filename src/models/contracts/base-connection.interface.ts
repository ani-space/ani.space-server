import { IPageInfo } from './page-info.interface';

export interface IBaseConnection<E, N> {
  edges: E[];

  nodes: N[];

  pageInfo: IPageInfo;
}
