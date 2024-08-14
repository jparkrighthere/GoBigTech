import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import {JobInfo} from '../../../client/utils/JobInfo';
import hash from '../hash/HashId';

const tag = 'sendbird';
/**
 * Fetches and parses job data from the given recruitment page.
 * @returns {Promise<JobInfo[]>} A promise that resolves to an array of job objects.
 */
export default async function crawlSendbirdJobList(): Promise<JobInfo[]> {
  // URL of the recruitment page
  const link = 'https://sendbird.com/ko/careers';
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(link, {waitUntil: 'networkidle2'});
  const content = await page.content();
  const $ = cheerio.load(content);

  // Wait for the dynamic content to load
  await page.waitForSelector('.listing');

  const jobData: JobInfo[] = [];

  $('.job').each((_, element) => {
    const $element = $(element);
    if ($element.find('.department').text().trim() !== 'Engineering') {
      return;
    }
    const title = $element.find('.title').text().trim();
    const location = $element.find('.location').text().trim();
    const url = 'https://sendbird.com/ko/careers?';
    const id = hash(title, tag);

    if (title && location.includes('Korea')) {
      jobData.push({
        id,
        title,
        location,
        url,
        tag,
      });
    }
  });
  // Close the browser
  await browser.close();
  return jobData;
}

// // Usage example
// crawlSendbirdJobList().then(jobData => {
//   console.log(jobData);
// });
