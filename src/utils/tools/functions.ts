import Fuse, { IFuseOptions } from 'fuse.js';
import { parse } from 'node-html-parser';
import puppeteer, { HTTPRequest } from 'puppeteer';

export function splitDateStringHelper(params?: string | number) {
  const dateString = `${params}`;
  let year: string = '';
  let month: string = '';
  let day: string = '';

  if (!params) return { year, month, day };

  if (dateString.length >= 1) {
    year = dateString.substring(0, 4);
  }
  if (dateString.length >= 5) {
    month = dateString.substring(4, 6);
  }
  if (dateString.length >= 7) {
    day = dateString.substring(6, 8);
  }

  return { year, month, day };
}

export function getOrderHelper(value: any): 'DESC' | 'ASC' {
  if (`${value}`.includes('DESC')) return 'DESC';

  return 'ASC';
}

export function paginate(
  page_size: number,
  page_number: number,
  array?: Array<any>,
) {
  if (!Array.isArray(array)) return [];

  return array.slice((page_number - 1) * page_size, page_number * page_size);
}

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

export async function generateDocumentFromBrowser(url: string) {
  const browserURL = 'http://127.0.0.1:9222';
  /*
    Use existing browser on OS (Chrome, Edge, Opera, CocCoc, Brave,...)
    and add to "target" in shortcut arg '--remote-debugging-port=9222'
    For example: "C:\Program Files\CocCoc\Browser\Application\browser.exe" --remote-debugging-port=9222
  */
  const browser = await puppeteer.connect({ browserURL });

  // And we will control the real browser from here:
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'load', timeout: 0 });

  // @ts-ignore
  const data = await page.evaluate(
    // @ts-ignore
    () => document.documentElement.outerHTML,
  );
  // @ts-ignore
  const document = parse(data);

  await page.close();
  return document;
}

/*
  Always close the page when finished using it to avoid memory leaks and browser crashes
*/
export async function getPageFromBrowser(url: string) {
  const browserURL = 'http://127.0.0.1:9222';
  /*
    Use existing browser on OS (Chrome, Edge, Opera, CocCoc, Brave,...)
    and add to "target" in shortcut arg '--remote-debugging-port=9222'
    For example: "C:\Program Files\CocCoc\Browser\Application\browser.exe" --remote-debugging-port=9222
  */
  const browser = await puppeteer.connect({ browserURL });

  // And we will control the real browser from here:
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'load', timeout: 0 });

  return page;
}
