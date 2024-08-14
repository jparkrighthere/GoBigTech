import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import {JobInfo} from '../../../client/utils/JobInfo';
import hash from '../hash/HashId';

const tag = 'toss';
/**
 * Fetches and parses job data from the given recruitment page.
 * @returns {Promise<JobInfo[]>} A promise that resolves to an array of job objects.
 */
export default async function crawlTossJobList(): Promise<JobInfo[]> {
  const link =
    'https://toss.im/career/jobs?category=engineering-product&category=engineering-platform&category=engineering-product-platform&category=qa&category=engineering';
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(link, {waitUntil: 'networkidle2'});
  const content = await page.content();
  const $ = cheerio.load(content);
  let jobs: JobInfo[] = [];

  $('.css-16ht878 > a').each((_, element) => {
    const $element = $(element);
    const relativeLink = $element.attr('href');
    const url = `https://toss.im${relativeLink}`;
    const title = $element.find('span.typography--bold').first().text().trim();
    const id = hash(title, tag);

    jobs.push({
      id,
      title,
      url,
      tag,
    });
  });

  await browser.close();
  return jobs;
}

// // 사용 예제
// crawlTossJobList().then(jobData => {
//   console.log(jobData);
// });
