import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import {JobInfo} from '../../../client/utils/JobInfo';
import hash from '../hash/HashId';

const tag = 'daangn';
// Software Engineer, Backend
const links: string[] = [
  'https://about.daangn.com/jobs/software-engineer-backend/#_filter',
  'https://about.daangn.com/jobs/software-engineer-frontend/#_filter',
  'https://about.daangn.com/jobs/software-engineer-ios/#_filter',
  'https://about.daangn.com/jobs/software-engineer-machine-learning/#_filter',
  'https://about.daangn.com/jobs/software-engineer-android/#_filter',
  'https://about.daangn.com/jobs/software-engineer-gis/#_filter',
];

/**
 * Fetches and parses job data from the given recruitment page.
 * @returns {Promise<JobInfo[]>} A promise that resolves to an array of job objects.
 */
export default async function crawlDaangnJobList(): Promise<JobInfo[]> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const jobData: JobInfo[] = [];

  for (const link of links) {
    await page.goto(link, {waitUntil: 'networkidle2'});
    const content = await page.content();
    const $ = cheerio.load(content);

    $('.c-jpGEAj > div').each((_, element) => {
      const $element = $(element);
      const title = $element.find('.c-boyXyq').text().trim();
      const relativeLink = $element.find('a').attr('href');
      const url = `https://about.daangn.com${relativeLink}`;
      const details = $element
        .find('.c-kolfYf')
        .map((_, x) => $(x).text().trim())
        .get();
      const company = details[0];
      const employmentType = details[1];
      const id = hash(title, tag);

      jobData.push({
        id,
        title,
        url,
        employmentType,
        company,
        tag: 'daangn',
      });
    });
  }
  await browser.close();
  return jobData;
}

// // 사용 예제
// crawlDaangnJobList().then(jobData => {
//   console.log(jobData.length);
// });
