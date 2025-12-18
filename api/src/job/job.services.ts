import redis from '../utils/redis';
import { job } from './job';

export const createJob = async (
  jobData: job
) => {
  try {
    const newJob: job = {
      jobId: jobData.jobId,

      createdAt: Date.now(),
      updatedAt: Date.now(),

      jobData: jobData.jobData,

      queueName: jobData.queueName,

      status: 'pending',

      tries: 0,
      maxTries: jobData.maxTries,

      type: jobData.type,
      priority: jobData.priority ?? 0,
      runAt: jobData.runAt
    };

    await redis.rPush(newJob.queueName, JSON.stringify(newJob));

  } catch (err) {
    console.error('Error adding job to queue:', err);
    throw err;
  }
};



const fetchNextJob = async (queueName: string): Promise<job | null> => {
  try {
    const result = await redis.lPop(queueName);
    if (result) {
      return JSON.parse(result) as job;
    }
    return null;
  } catch (err) {
    console.error('Error fetching job from queue:', err);
    throw err;
  }
};


const retryJob = async (jobData: job): Promise<void> => {
  try {
    jobData.tries += 1;
    jobData.updatedAt = Date.now();
    jobData.status = 'pending';
    await redis.rPush(jobData.queueName, JSON.stringify(jobData));
  } catch (err) {
    console.error('Error retrying job:', err);
    throw err;
  }
};

const getJobStatus= async (jobId: string) => {
  try{
    if(!jobId){
      throw new Error('Invalid jobId');
    }

  }catch(err){
    console.error('Error getting job status:', err);
    throw err;
  }

};