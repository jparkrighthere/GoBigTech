import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import {JobInfo} from '../../../client/utils/JobInfo';
import hash from '../hash/HashId';
const tag = 'line';
/**
 * Fetches and parses job data from the Naver recruitment page.
 * @returns {Promise<JobInfo[]>} A promise that resolves to an array of job objects.
 */
export default async function crawlLineJobList(): Promise<JobInfo[]> {
  const link =
    'https://careers.linecorp.com/ko/jobs?ca=Engineering&ci=Seoul,Bundang,Gwacheon&co=East%20Asia';
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(link, {waitUntil: 'networkidle2'});
  const content = await page.content();
  const $ = cheerio.load(content);

  const jobData: JobInfo[] = [];

  $('.job_list > li').each((_, element) => {
    const $element = $(element);

    const title = $element.find('.title').text().trim();
    const relativeLink = $element.find('a').attr('href');
    const url = `https://careers.linecorp.com${relativeLink}`;

    const details = $element
      .find('.text_filter > span')
      .map((_, span) => $(span).text().replace(/\s+/g, ' ').trim())
      .get();

    const location = details[0];
    const company = details[1];
    const employmentType = details[3];
    const deadline = $element.find('.date').text().trim();
    // divide the deadline into from and to dates by the character '-' or '~'
    // const deadlineArray = deadline.split(/[-~]/);
    // const deadlineFrom = deadlineArray[0];
    // const deadlineTo = deadlineArray[1];
    const id = hash(title, tag);

    jobData.push({
      id,
      title,
      url,
      employmentType,
      deadline,
      location,
      company,
      tag,
    });
  });

  await browser.close();
  return jobData;
}

// // 사용 예제
// crawlJobList().then(jobData => {
//   console.log(jobData);
// });
