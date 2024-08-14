import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import {JobInfo} from '../../../client/utils/JobInfo';
import hash from '../hash/HashId';

const tag = 'dunamu';
/**
 * Fetches and parses job data from the given recruitment page.
 * @returns {Promise<JobInfo[]>} A promise that resolves to an array of job objects.
 */
export default async function crawlDunamuJobList(): Promise<JobInfo[]> {
  const link = 'https://www.dunamu.com/careers/jobs?category=engineering';
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(link, {waitUntil: 'networkidle2'});
  const content = await page.content();
  const $ = cheerio.load(content);

  // Wait for the dynamic content to load
  await page.waitForSelector('.board_list');

  const jobData: JobInfo[] = [];

  $('.board_list li a').each((_, element) => {
    const $element = $(element);
    if ($element.find('em').text().trim() !== 'Engineering') {
      return;
    }
    const title = $element.find('p').text().trim();
    const relativeLink = $element.attr('href');
    const url = `https://www.dunamu.com${relativeLink}`;

    const id = hash(title, tag);
    jobData.push({
      id,
      title,
      url,
      tag,
    });
  });

  await browser.close();
  return jobData;
}

// // Usage example
// crawlJobList().then(jobData => {
//   console.log(jobData);
// });
