// import * as cheerio from 'cheerio';
// import puppeteer from 'puppeteer';
// import {JobInfo} from '../../../components/JobInfo';
// import hash from '../hash/HashId';

// const baseURL = 'https://www.coupang.jobs/kr/jobs/?page=';

// export default async function crawlCoupangJobList(): Promise<JobInfo[]> {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   const jobs: JobInfo[] = [];

//   let currentPage = 1;
//   let hasNextPage = true;

//   try {
//     while (hasNextPage) {
//       const link = `${baseURL}${currentPage}#results`;
//       await page.goto(link, {waitUntil: 'networkidle2'});
//       const content = await page.content();
//       const $ = cheerio.load(content);

//       $('.grid.job-listing > .card.card-job').each((_, element) => {
//         const $element = $(element);
//         const title = $element.find('.card-title > a').text().trim();
//         const relativeLink = $element.find('.card-title > a').attr('href');
//         const url = `https://www.coupang.jobs${relativeLink}`;
//         const location = $element.find('.list-inline-item').text().trim();

//         jobs.push({
//           title,
//           url,
//           location,
//           tag: 'coupang',
//         });
//       });

//       hasNextPage = $('.pagination-next').length > 0;
//       currentPage++;
//     }
//   } catch (error) {
//     console.error('Error occurred while crawling job listings:', error);
//   } finally {
//     await browser.close();
//   }

//   return jobs;
// }

// // // Usage example
// // crawlJobList().then(jobData => {
// //   console.log(jobData);
// // });
