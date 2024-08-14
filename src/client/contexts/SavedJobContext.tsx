import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import {JobInfo} from '../utils/JobInfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SavedJobsContextType {
  savedJobs: JobInfo[];
  saveJob: (job: JobInfo) => void;
  removeJob: (job: JobInfo) => void;
}

const SavedJobsContext = createContext<SavedJobsContextType | undefined>(
  undefined,
);

export const SavedJobsProvider: React.FC<{children: ReactNode}> = ({
  children,
}) => {
  const [email, setEmail] = useState<string | null>(null);
  const [savedJobs, setSavedJobs] = useState<JobInfo[]>([]);

  useEffect(() => {
    const fetchEmailAndJobs = async () => {
      const storedEmail = await AsyncStorage.getItem('email');
      setEmail(storedEmail);
      if (storedEmail) {
        fetchSavedJobs(storedEmail);
      }
    };
    fetchEmailAndJobs();
  }, []);

  const fetchSavedJobs = async (userEmail: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/jobs/${userEmail}`,
        {
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
        },
      );
      if (response.ok) {
        console.log('Successfully loaded saved jobs');
      }
      const data = await response.json();
      setSavedJobs(data || []);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    }
  };

  const saveJob = async (job: JobInfo) => {
    if (!email) {
      return;
    }
    if (savedJobs.some(j => j.id === job.id)) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/api/jobs/${email}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({jobId: job.id}),
      });
      if (response.ok) {
        console.log('Successfully saved job');
      }
      setSavedJobs(prevJobs => [...prevJobs, job]);
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  const removeJob = async (job: JobInfo) => {
    if (!email) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/api/jobs/${email}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({jobId: job.id}),
      });
      if (response.ok) {
        console.log('Successfully removed saved job');
      }
      setSavedJobs(prevJobs => prevJobs.filter(j => j.id !== job.id));
    } catch (error) {
      console.error('Error removing job:', error);
    }
  };

  return (
    <SavedJobsContext.Provider value={{savedJobs, saveJob, removeJob}}>
      {children}
    </SavedJobsContext.Provider>
  );
};

export const useSavedJobs = () => {
  const context = useContext(SavedJobsContext);
  if (!context) {
    throw new Error('useSavedJobs must be used within a SavedJobsProvider');
  }
  return context;
};
