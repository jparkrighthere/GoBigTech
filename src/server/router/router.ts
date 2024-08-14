import express from 'express';
import {Job} from '../../client/utils/JobInfo';
import {User} from '../../client/utils/UserInfo';
import crawlNaverJobList from '../functions/crawlJobs/crawlNaver';
import crawlDaangnJobList from '../functions/crawlJobs/crawlDaangn';
import crawlBaeminJobList from '../functions/crawlJobs/crawlBaemin';
// import crawlCoupangJobList from '../functions/crawlCoupang';
import crawlKakaoJobList from '../functions/crawlJobs/crawlKakao';
import crawlLineJobList from '../functions/crawlJobs/crawlLine';
import crawlTossJobList from '../functions/crawlJobs/crawlToss';
import crawlZigbangJobList from '../functions/crawlJobs/crawlZigbang';
import crawlYanoljaJobList from '../functions/crawlJobs/crawlYanolja';
import crawlMolocoJobList from '../functions/crawlJobs/crawlMoloco';
import crawlDunamuJobList from '../functions/crawlJobs/crawlDunamu';
import crawlSendbirdJobList from '../functions/crawlJobs/crawlSendbird';
import cron from 'node-cron';
const router = express.Router();

// Schedule the task to run every day at 12 PM
cron.schedule('0 12 * * *', async () => {
  console.log('Running job crawling task...');
  await crawlAllJobs();
});

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function crawlAllJobs() {
  try {
    await Job.deleteMany({});

    const delayTime = 5000;
    await delay(delayTime);
    const naverJobs = await crawlNaverJobList();
    await delay(delayTime);
    const lineJobs = await crawlKakaoJobList();
    await delay(delayTime);
    const kakaoJobs = await crawlLineJobList();
    await delay(delayTime);
    const tossJobs = await crawlTossJobList();
    await delay(delayTime);
    const zigbangJobs = await crawlZigbangJobList();
    await delay(delayTime);
    const yanoljaJobs = await crawlYanoljaJobList();
    await delay(delayTime);
    const molocoJobs = await crawlMolocoJobList();
    await delay(delayTime);
    const dunamuJobs = await crawlDunamuJobList();
    await delay(delayTime);
    const sendbirdJobs = await crawlSendbirdJobList();
    await delay(delayTime);
    const baeminJobs = await crawlBaeminJobList();
    await delay(delayTime);
    const daangnJobs = await crawlDaangnJobList();
    const jobs = [
      ...naverJobs,
      ...lineJobs,
      ...kakaoJobs,
      ...tossJobs,
      ...zigbangJobs,
      ...yanoljaJobs,
      ...molocoJobs,
      ...dunamuJobs,
      ...sendbirdJobs,
      ...baeminJobs,
      ...daangnJobs,
    ];
    // Save the jobs to the database
    await Job.create(jobs);
  } catch (error) {
    console.error(error);
  }
}

// router.post('/jobs', async (req, res) => {
//   try {
//     crawlAllJobs();
//     res.status(200).json({message: 'Job crawling task scheduled'});
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({error: 'Internal Server Error'});
//   }
// });

router.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find({});
    if (!jobs) {
      return res.status(404).json({error: 'Jobs not found'});
    }
    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
  }
});

router.post('/login', async (req, res) => {
  const {email, name, expireDate} = req.body;

  try {
    let user = await User.findOne({email});

    if (user) {
      return res.status(200).json(user);
    } else {
      user = new User({
        email,
        name,
        expireDate,
        savedJobs: [],
      });

      await User.create(user);
    }

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

router.delete('/unlink', async (req, res) => {
  const {email} = req.body;

  try {
    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).json({error: 'User not found'});
    }
    await User.deleteOne({email});
    res.status(200).json({message: 'User account deleted successfully'});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

router.get('/jobs/:email', async (req, res) => {
  try {
    const {email} = req.params;
    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).json({error: 'User not found'});
    }
    const jobs = await Job.find({id: {$in: user.savedJobs}});
    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

router.post('/jobs/:email', async (req, res) => {
  try {
    const {email} = req.params;
    const {jobId} = req.body;

    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).json({error: 'User not found'});
    }

    if (user.savedJobs.includes(jobId)) {
      return res.status(409).json({error: 'Job already saved'});
    }

    user.savedJobs.push(jobId);
    await user.save();

    res.status(200).json({message: 'Job saved successfully'});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

router.delete('/jobs/:email', async (req, res) => {
  try {
    const {email} = req.params;
    const {jobId} = req.body;

    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).json({error: 'User not found'});
    }

    await User.updateOne({email}, {$pull: {savedJobs: jobId}});

    res.status(200).json({message: 'Saved job removed'});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

export default router;
