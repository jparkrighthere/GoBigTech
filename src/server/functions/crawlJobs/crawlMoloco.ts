import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import {JobInfo} from '../../../client/utils/JobInfo';
import hash from '../hash/HashId';

const tag = 'moloco';
/**
 * Fetches and parses job data from the Naver recruitment page.
 * @returns {Promise<JobInfo[]>} A promise that resolves to an array of job objects.
 */
export default async function crawlMolocoJobList(): Promise<JobInfo[]> {
  const link = 'https://www.moloco.com/ko/open-positions';
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(link, {waitUntil: 'networkidle2'});
  const content = await page.content();
  const $ = cheerio.load(content);

  const jobData: JobInfo[] = [];

  const engineeringSection = $('.job-departments-section').filter(
    (_, element) => {
      return $(element)
        .find('.job-department-name > .heading-h4-size')
        .text()
        .includes('Engineering');
    },
  );

  engineeringSection
    .find('.job-department-openings > .opening')
    .each((_, element) => {
      const location = $(element).find('.opening-location').text().trim();
      if (!location.includes('Korea')) {
        return;
      }
      const title = $(element).find('.list-group-item-text').text().trim();
      const url = $(element).find('a').attr('href') || '';
      const id = hash(title, tag);

      jobData.push({
        id,
        title,
        location,
        url,
        tag,
      });
    });
  await browser.close();
  return jobData;
}

// // 사용 예제
// crawlMolocoJobList().then(jobData => {
//   console.log(jobData);
// });
