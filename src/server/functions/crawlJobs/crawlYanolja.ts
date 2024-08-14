import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import {JobInfo} from '../../../client/utils/JobInfo';
import hash from '../hash/HashId';

const tag = 'yanolja';
/**
 * Fetches and parses job data from the Naver recruitment page.
 * @returns {Promise<JobInfo[]>} A promise that resolves to an array of job objects.
 */
export default async function crawlYanoljaJobList(): Promise<JobInfo[]> {
  const link =
    'https://careers.yanolja.co/home#5933f3c4-5c42-424f-b93b-73a675dcf0b7';
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(link, {waitUntil: 'networkidle2'});
  const content = await page.content();
  const $ = cheerio.load(content);

  const jobData: JobInfo[] = [];

  $('.sc-9b56f69e-0.ffGmZN > a').each((_, element) => {
    const $element = $(element);
    const relativeLink = $element.attr('href');
    const url = `https://careers.yanolja.co${relativeLink}`;
    const title = $element.find('.sc-86b147bc-0.dpSTzy').text().trim();

    const details = $element
      .find('.sc-86b147bc-0.bugutw')
      .map((_, span) => $(span).text().trim())
      .get();
    const field = details[1];
    if (field !== 'R&D') {
      return;
    }
    const company = details[0];
    const careerRequired = details[2];
    const employmentType = details[3];
    const id = hash(title, tag);

    jobData.push({
      id,
      title,
      url,
      company,
      careerRequired,
      employmentType,
      tag,
    });
  });
  await browser.close();
  return jobData;
}

// // 사용 예제
// crawlYanoljaJobList().then(jobData => {
//   console.log(jobData);
// });
