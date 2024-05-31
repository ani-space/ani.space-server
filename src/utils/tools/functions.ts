import Fuse, { IFuseOptions } from 'fuse.js';
import { parse } from 'node-html-parser';
import puppeteer from 'puppeteer';

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
