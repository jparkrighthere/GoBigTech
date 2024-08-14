import {Schema, model} from 'mongoose';

interface UserInfo {
  email: string;
  name: string;
  savedJobs: string[];
}

const UserSchema = new Schema<UserInfo>({
  email: {type: String, required: true, unique: true},
  name: {type: String, required: true},
  savedJobs: {type: [String], required: true},
});

export const User = model<UserInfo>('User', UserSchema);
