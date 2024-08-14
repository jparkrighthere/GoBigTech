import {JobInfo} from './JobInfo';
import {parseRangeDate, parseSpecialDate} from './dateUtils';

export const handleSaveJob = (
  job: any,
  savedJobs: any[],
  setSavedJobs: React.Dispatch<React.SetStateAction<any[]>>,
) => {
  setSavedJobs(prevSavedJobs => {
    if (prevSavedJobs.some(savedJob => savedJob.id === job.id)) {
      return prevSavedJobs.filter(savedJob => savedJob.id !== job.id);
    } else {
      return [...prevSavedJobs, job];
    }
  });
};

export const sortJobsByDeadline = (jobs: JobInfo[]): JobInfo[] => {
  return jobs.slice().sort((a, b) => {
    const rangeA = parseRangeDate(a.deadline || '');
    const rangeB = parseRangeDate(b.deadline || '');

    const specialA = parseSpecialDate(a.deadline || '');
    const specialB = parseSpecialDate(b.deadline || '');

    // Define Priority
    const priorityA = rangeA.endDate ? 1 : rangeA.startDate ? 2 : 3;
    const priorityB = rangeB.endDate ? 1 : rangeB.startDate ? 2 : 3;

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    // Priority 1: endDate가 있는 경우
    if (priorityA === 1) {
      return rangeA.endDate!.getTime() - rangeB.endDate!.getTime();
    }

    // Priority 2: startDate만 있는 경우
    if (priorityA === 2) {
      return rangeB.startDate!.getTime() - rangeA.startDate!.getTime();
    }

    // Priority 3: No Date
    if (specialA !== specialB) {
      return specialA - specialB;
    }

    return a.title.localeCompare(b.title);
  });
};
