import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import {JobInfo} from '../../../client/utils/JobInfo';
import hash from '../hash/HashId';

const tag = 'zigbang';
/**
 * Fetches and parses job data from the given recruitment page.
 * @returns {Promise<JobInfo[]>} A promise that resolves to an array of job objects.
 */
export default async function crawlZigbangJobList(): Promise<JobInfo[]> {
  // URL of the recruitment page
  const link = 'https://career.zigbang.com/open?';
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(link, {waitUntil: 'networkidle2'});
  const content = await page.content();
  const $ = cheerio.load(content);

  // Wait for the dynamic content to load
  await page.waitForSelector('.openlist.css-13tnvj2.er4give3');

  const jobData: JobInfo[] = [];

  $('.openlist.css-13tnvj2.er4give3 > a').each((_, element) => {
    const $element = $(element);
    if (
      !$element.find('em').text().trim().includes('Engineering') &&
      !$element.find('em').text().trim().includes('software')
    ) {
      return;
    }
    const title = $element.find('.font_fontK24B__HzGmy').text().trim();
    const relativeLink = $element.attr('href');
    const url = `https://zigbang.career.greetinghr.com${relativeLink}`;

    const subInfos = $element
      .find('.font_fontK14R__fJXyg.css-1b60yer.e1bmt6x52 > li')
      .map((_, li) => $(li).text().replace(/\s+/g, ' ').trim())
      .get();
    const location = subInfos[1];
    const careerRequired = subInfos[2];
    const employmentType = subInfos[3];
    const id = hash(title, tag);

    jobData.push({
      id,
      title,
      url,
      location,
      careerRequired,
      employmentType,
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
