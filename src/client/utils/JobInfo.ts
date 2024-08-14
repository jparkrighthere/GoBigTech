import {Schema, model} from 'mongoose';

export interface JobInfo {
  id: string;
  title: string;
  url: string;
  tag: string;
  jobPositions?: string;
  careerRequired?: string;
  employmentType?: string;
  deadline?: string;
  company?: string;
  location?: string;
}

const jobSchema = new Schema<JobInfo>({
  id: {type: String, required: true, unique: true},
  title: {type: String, required: true},
  url: {type: String, required: true},
  tag: {type: String, required: true},
  jobPositions: String,
  careerRequired: String,
  employmentType: String,
  deadline: String,
  company: String,
  location: String,
});

export const Job = model<JobInfo>('Job', jobSchema);
