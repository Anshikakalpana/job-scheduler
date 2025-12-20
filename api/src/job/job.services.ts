import redis from '../utils/redis';

import { job ,JobError ,JobResult} from './job';

export const createJob = async (jobData: job): Promise<JobResult> => {
  const newJobResult: JobResult = {
    success: false,
    error: undefined,
    finishedAt: Date.now(),
  };

  try {
    const newJob: job = {
      jobId: jobData.jobId,
      createdAt: Date.now(),
      jobData: jobData.jobData,
      queueName: jobData.queueName,
      status: 'pending',
      tries: 0,
      maxTries: jobData.maxTries,
      type: jobData.type,
      priority: jobData.priority ?? 0,
      runAt: jobData.runAt,
    };

   
    if (!newJob.jobData.email || !newJob.jobData.message) {
      newJobResult.error = {
        message: 'Invalid job data: email and message are required',
        failedAt: Date.now(),
      };
     
      return newJobResult;
    }

    await redis.rPush(newJob.queueName, JSON.stringify(newJob));
    newJobResult.success = true;
    return newJobResult;

  } catch (err: any) {
    newJobResult.error = {
      message: err.message,
      stack: err.stack,
      failedAt: Date.now(),
    };
    return newJobResult;
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


