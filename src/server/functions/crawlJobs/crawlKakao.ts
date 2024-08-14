import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import {JobInfo} from '../../../client/utils/JobInfo';
import hash from '../hash/HashId';

const tag = 'kakao';
const BASE_URL =
  'https://careers.kakao.com/jobs?skillSet=&part=TECHNOLOGY&company=ALL&keyword=&employeeType=&page=';

/**
 * Fetches and parses job data from the given recruitment page.
 * @returns {Promise<JobInfo[]>} A promise that resolves to an array of job objects.
 */
async function crawlJobList(pageNumber: number): Promise<JobInfo[]> {
  const link = `${BASE_URL}${pageNumber}`;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(link, {waitUntil: 'networkidle2'});
  const content = await page.content();
  const $ = cheerio.load(content);

  const jobs: JobInfo[] = [];

  $('.list_jobs > a').each((_, element) => {
    const $element = $(element);
    const relativeLink = $element.attr('href');
    const url = `https://careers.kakao.com${relativeLink}`;
    const title = $element.find('.tit_jobs').text().trim();

    const details = $element
      .find('.list_info > dd')
      .map((_, dd) => $(dd).text().trim())
      .get();
    const [deadline] = details;

    const subInfos = $element
      .find('.item_subinfo > dd')
      .map((_, dd) => $(dd).text().trim())
      .get();
    const [company, employmentType] = subInfos;
    const id = hash(title, tag);

    jobs.push({
      id,
      title,
      url,
      employmentType,
      deadline,
      company,
      tag: 'kakao',
    });
  });

  await browser.close();
  return jobs;
}

export default async function crawlKakaoJobList(): Promise<JobInfo[]> {
  const allJobs: JobInfo[] = [];
  let page = 1;
  let hasData = true;

  while (hasData) {
    const jobs = await crawlJobList(page);
    if (jobs.length === 0) {
      hasData = false;
    } else {
      allJobs.push(...jobs);
      page++;
    }
  }

  return allJobs;
}

// // 사용 예제
// crawlAllPages().then(jobData => {
//   console.log(jobData);
// });
