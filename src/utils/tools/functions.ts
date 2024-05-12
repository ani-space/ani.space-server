import Fuse, { IFuseOptions } from 'fuse.js';

export function getMethodName() {
  const err = new Error();
  // @ts-ignore: we want the 2nd method in the call stack
  return /at \w+\.(\w+)/.exec(err.stack.split('\n')[2])[1];
}

export function fuzzySearch(
  keyword: string,
  list: Array<any>,
  options?: IFuseOptions<any>,
) {
  const fuse = new Fuse(list, options);

  return fuse.search(keyword);
}
