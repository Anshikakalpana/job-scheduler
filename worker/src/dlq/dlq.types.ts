export  type dlq = {
  jobId: string,

  createdAt: number,
  updatedAt?: number,

  jobData: object,

  queueName: string,

  status: 'dead',
failureType?: 'TEMPORARY' | 'PERMANENT' | 'POISON';

  maxTries: number,
  actualTries: number,
  
  lastError: JobError,
  deadReason?: string,

  type?: string,
  priority?: number,
  runAt?: number
};




export type JobError = {
  message: string;
  stack?: string;
  failedAt: number;
};
