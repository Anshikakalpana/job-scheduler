import { dlq } from "./dlq.types.js";
const dlqProducer = async (data: dlq): Promise<dlq> => {
  if (!data) {
    throw new Error("No data provided to DLQ producer");
  }

  if (data.actualTries >= data.maxTries) {
    data.failureType = 'POISON';
  } else {
    data.failureType = 'TEMPORARY';
  }

  data.updatedAt = Date.now();
  data.status = 'dead';

  return data;
};
