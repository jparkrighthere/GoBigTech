import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import {JobInfo} from '../../../client/utils/JobInfo';
import hash from '../hash/HashId';

const tag = 'baemin';
/**
 * Fetches and parses job data from the given recruitment page.
 * @returns {Promise<JobInfo[]>} A promise that resolves to an array of job objects.
 */
export default async function crawlBaeminJobList(): Promise<JobInfo[]> {
  const link =
    'https://career.woowahan.com/?jobCodes=&employmentTypeCodes=&serviceSectionCodes=&careerPeriod=&category=#recruit-list';
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(link, {waitUntil: 'networkidle2'});
  const content = await page.content();
  const $ = cheerio.load(content);

  let jobs: JobInfo[] = [];

  $('.recruit-type-list > li').each((_, element) => {
    const $element = $(element);
    const relativeLink = $element.find('a').attr('href');
    const url = `https://career.woowahan.com${relativeLink}`;
    const title = $element.find('.fr-view').text().replace(/\t/g, '').trim();
    const careerRequired = $element.find('.flag-career').text().trim();
    const details = $element
      .find('.flag-type > span')
      .map((_, span) => $(span).text().trim())
      .get();
    const [employmentType, deadline] = details;

    const id = hash(title, tag);
    jobs.push({
      id,
      title,
      url,
      careerRequired,
      employmentType,
      deadline,
      tag,
    });
  });

  jobs = jobs.filter(job => job.title !== '');

  await browser.close();
  return jobs;
}

// // 사용 예제
// crawlBaeminJobList().then(jobData => {
//   console.log(jobData);
// });
