import axios from 'axios';
import * as cheerio from 'cheerio';
import {JobInfo} from '../../../client/utils/JobInfo';
import hash from '../hash/HashId';

const tag = 'naver';
/**
 * Fetches and parses job data from the Naver recruitment page.
 * @returns {Promise<JobInfo[]>} A promise that resolves to an array of job objects.
 */
export default async function crawlNaverJobList(): Promise<JobInfo[]> {
  // Naver 채용 페이지 URL
  const link = 'https://recruit.navercorp.com/rcrt/list.do?srchClassCd=1000000';

  try {
    const {data} = await axios.get(link);
    const $ = cheerio.load(data);
    const jobData: JobInfo[] = [];

    $('.card_list > .card_item').each((_, element) => {
      const $element = $(element);
      const title = $element.find('.card_title').text().trim();
      const relativeLink =
        $element.find('.card_link').attr('onclick')?.match(/\d+/) || [];
      const url = `https://recruit.navercorp.com/rcrt/view.do?annoId=${relativeLink}`;
      const details = $element
        .find('.card_info > dd')
        .map((_, dd) => $(dd).text().replace(/\s+/g, ' ').trim())
        .get();

      const jobPositions = details[1];
      const careerRequired = details[2];
      const employmentType = details[3];
      const deadline = details[4];
      const id = hash(title, tag);

      jobData.push({
        id,
        title,
        url,
        jobPositions,
        careerRequired,
        employmentType,
        deadline,
        tag,
      });
    });

    return jobData;
  } catch (error) {
    console.error('Error fetching or parsing data:', error);
    return [];
  }
}

// // 사용 예제
// crawlNaverJobList().then(jobData => {
//   console.log(jobData);
// });
