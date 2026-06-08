import { Queue, Worker } from "bullmq";
import { spatialGenerationService } from "@/services/spatial-generation.service";

const QUEUE_NAME = "worldlabs-jobs";

function getConnection() {
  const url = process.env.REDIS_URL;
  if (!url) return null;
  return { url, maxRetriesPerRequest: null as null };
}

export function getWorldLabsQueue() {
  const connection = getConnection();
  if (!connection) return null;
  return new Queue(QUEUE_NAME, { connection });
}

export async function enqueueWorldLabsJob(jobId: string) {
  const queue = getWorldLabsQueue();
  if (queue) {
    await queue.add("process", { jobId }, { attempts: 3, backoff: { type: "exponential", delay: 30000 } });
    return "bullmq";
  }
  spatialGenerationService.processWorldLabsJob(jobId).catch(console.error);
  return "inline";
}

export function startWorldLabsWorker() {
  const connection = getConnection();
  if (!connection || process.env.NODE_ENV === "production" && !process.env.ENABLE_INLINE_WORKER) {
    if (typeof window === "undefined" && connection) {
      new Worker(QUEUE_NAME, async (job) => {
        await spatialGenerationService.processWorldLabsJob(job.data.jobId);
      }, { connection });
    }
    return;
  }
}
