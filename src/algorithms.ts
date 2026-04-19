import type { Job, ScheduledJob, SchedulingResult } from './types';

// Helper function to calculate fairness indicators
function calculateFairnessIndicators(waitingTimes: number[]) {
  if (waitingTimes.length === 0) {
    return {
      standardDeviation: 0,
      minWaitingTime: 0,
      maxWaitingTime: 0,
      starvationDetected: false,
    };
  }

  const mean = waitingTimes.reduce((a, b) => a + b, 0) / waitingTimes.length;
  const variance =
    waitingTimes.reduce((sum, time) => sum + Math.pow(time - mean, 2), 0) /
    waitingTimes.length;
  const standardDeviation = Math.sqrt(variance);
  const minWaitingTime = Math.min(...waitingTimes);
  const maxWaitingTime = Math.max(...waitingTimes);
  
  // Starvation detected if any job waits more than 10x the average
  const starvationDetected = maxWaitingTime > mean * 10 && mean > 0;

  return {
    standardDeviation,
    minWaitingTime,
    maxWaitingTime,
    starvationDetected,
  };
}

// Helper function to build scheduling result
function buildResult(
  scheduledJobs: ScheduledJob[],
  completionTime: number
): SchedulingResult {
  const waitingTimes = scheduledJobs.map((job) => job.waitingTime);
  const turnaroundTimes = scheduledJobs.map((job) => job.turnaroundTime);
  const responseTimes = scheduledJobs.map((job) => job.responseTime);

  const averageWaitingTime =
    waitingTimes.reduce((a, b) => a + b, 0) / waitingTimes.length;
  const averageTurnaroundTime =
    turnaroundTimes.reduce((a, b) => a + b, 0) / turnaroundTimes.length;
  const averageResponseTime =
    responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;

  const totalBurstTime = scheduledJobs.reduce(
    (sum, job) => sum + job.job.burstTime,
    0
  );
  const cpuUtilization = (totalBurstTime / completionTime) * 100;

  return {
    jobs: scheduledJobs,
    completionTime,
    averageWaitingTime,
    averageTurnaroundTime,
    averageResponseTime,
    cpuUtilization,
    throughput: scheduledJobs.length / (completionTime || 1),
    contextSwitches: scheduledJobs.length - 1,
    fairnessIndicators: calculateFairnessIndicators(waitingTimes),
  };
}

// FCFS - First Come First Served
export function fcfs(jobs: Job[]): SchedulingResult {
  if (jobs.length === 0) return buildResult([], 0);

  const sorted = [...jobs].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const scheduledJobs: ScheduledJob[] = [];
  let currentTime = 0;

  for (const job of sorted) {
    const startTime = Math.max(currentTime, job.arrivalTime);
    const endTime = startTime + job.burstTime;

    scheduledJobs.push({
      job,
      startTime,
      endTime,
      responseTime: startTime - job.arrivalTime,
      waitingTime: startTime - job.arrivalTime,
      turnaroundTime: endTime - job.arrivalTime,
    });

    currentTime = endTime;
  }

  return buildResult(scheduledJobs, currentTime);
}

// SJF - Shortest Job First (Non-preemptive)
export function sjf(jobs: Job[]): SchedulingResult {
  if (jobs.length === 0) return buildResult([], 0);

  const remaining = [...jobs];
  const scheduledJobs: ScheduledJob[] = [];
  let currentTime = 0;

  while (remaining.length > 0) {
    // Get available jobs at current time
    const available = remaining.filter((job) => job.arrivalTime <= currentTime);

    if (available.length === 0) {
      // No jobs available, jump to next arrival
      currentTime = remaining[0].arrivalTime;
      continue;
    }

    // Select shortest job
    const shortest = available.reduce((min, job) =>
      job.burstTime < min.burstTime ? job : min
    );

    const startTime = Math.max(currentTime, shortest.arrivalTime);
    const endTime = startTime + shortest.burstTime;

    scheduledJobs.push({
      job: shortest,
      startTime,
      endTime,
      responseTime: startTime - shortest.arrivalTime,
      waitingTime: startTime - shortest.arrivalTime,
      turnaroundTime: endTime - shortest.arrivalTime,
    });

    remaining.splice(remaining.indexOf(shortest), 1);
    currentTime = endTime;
  }

  return buildResult(scheduledJobs, currentTime);
}

// SRTF - Shortest Remaining Time First (Preemptive SJF)
export function srtf(jobs: Job[]): SchedulingResult {
  if (jobs.length === 0) return buildResult([], 0);

  interface JobState {
    job: Job;
    remainingTime: number;
    startTime?: number;
    responseTime?: number;
  }

  const jobStates: JobState[] = jobs.map((job) => ({
    job,
    remainingTime: job.burstTime,
  }));

  const scheduledJobs: ScheduledJob[] = [];
  let currentTime = 0;

  while (jobStates.some((state) => state.remainingTime > 0)) {
    // Get available jobs
    const available = jobStates.filter(
      (state) => state.job.arrivalTime <= currentTime && state.remainingTime > 0
    );

    if (available.length === 0) {
      // Jump to next arrival
      const nextArrival = jobStates
        .filter((state) => state.remainingTime > 0)
        .map((state) => state.job.arrivalTime)
        .sort((a, b) => a - b)[0];
      currentTime = nextArrival;
      continue;
    }

    // Select job with shortest remaining time
    const selected = available.reduce((min, state) =>
      state.remainingTime < min.remainingTime ? state : min
    );

    if (selected.startTime === undefined) {
      selected.startTime = currentTime;
      selected.responseTime = currentTime - selected.job.arrivalTime;
    }

    selected.remainingTime--;
    currentTime++;

    // Check if job completed
    if (selected.remainingTime === 0) {
      scheduledJobs.push({
        job: selected.job,
        startTime: selected.startTime!,
        endTime: currentTime,
        responseTime: selected.responseTime!,
        waitingTime: currentTime - selected.job.arrivalTime - selected.job.burstTime,
        turnaroundTime: currentTime - selected.job.arrivalTime,
      });
    }
  }

  return buildResult(scheduledJobs, currentTime);
}

// Round Robin
export function roundRobin(jobs: Job[], timeQuantum: number = 4): SchedulingResult {
  if (jobs.length === 0) return buildResult([], 0);

  interface QueueJob {
    job: Job;
    remainingTime: number;
    startTime?: number;
    responseTime?: number;
    lastStartTime?: number;
  }

  const queue: QueueJob[] = [];
  const scheduledJobs: ScheduledJob[] = [];
  let currentTime = 0;

  // Sort by arrival time and create queue items
  const sorted = [...jobs].sort((a, b) => a.arrivalTime - b.arrivalTime);

  while (
    queue.length > 0 ||
    sorted.some((job) => !queue.find((q) => q.job === job))
  ) {
    // Add newly arrived jobs to queue
    const arriving = sorted.filter(
      (job) =>
        job.arrivalTime <= currentTime &&
        !queue.find((q) => q.job === job) &&
        !scheduledJobs.find((sj) => sj.job === job)
    );

    for (const job of arriving) {
      queue.push({
        job,
        remainingTime: job.burstTime,
      });
    }

    if (queue.length === 0) {
      // Jump to next arrival
      const nextArrival = sorted
        .filter((job) => job.arrivalTime > currentTime)
        .sort((a, b) => a.arrivalTime - b.arrivalTime)[0];
      if (nextArrival) {
        currentTime = nextArrival.arrivalTime;
      } else {
        break;
      }
      continue;
    }

    const jobItem = queue.shift()!;

    if (jobItem.startTime === undefined) {
      jobItem.startTime = Math.max(currentTime, jobItem.job.arrivalTime);
      jobItem.responseTime =
        jobItem.startTime - jobItem.job.arrivalTime;
    }

    jobItem.lastStartTime = currentTime;
    const timeSlice = Math.min(jobItem.remainingTime, timeQuantum);
    jobItem.remainingTime -= timeSlice;
    currentTime += timeSlice;

    if (jobItem.remainingTime > 0) {
      queue.push(jobItem);
    } else {
      scheduledJobs.push({
        job: jobItem.job,
        startTime: jobItem.startTime!,
        endTime: currentTime,
        responseTime: jobItem.responseTime!,
        waitingTime: currentTime - jobItem.job.arrivalTime - jobItem.job.burstTime,
        turnaroundTime: currentTime - jobItem.job.arrivalTime,
      });
    }
  }

  return buildResult(scheduledJobs, currentTime);
}

// Priority Non-preemptive
export function priorityNonPreemptive(jobs: Job[]): SchedulingResult {
  if (jobs.length === 0) return buildResult([], 0);

  const remaining = [...jobs];
  const scheduledJobs: ScheduledJob[] = [];
  let currentTime = 0;

  while (remaining.length > 0) {
    // Get available jobs at current time
    const available = remaining.filter((job) => job.arrivalTime <= currentTime);

    if (available.length === 0) {
      // No jobs available, jump to next arrival
      currentTime = remaining[0].arrivalTime;
      continue;
    }

    // Select highest priority (lower number = higher priority)
    const selected = available.reduce((min, job) =>
      job.priority < min.priority ? job : min
    );

    const startTime = Math.max(currentTime, selected.arrivalTime);
    const endTime = startTime + selected.burstTime;

    scheduledJobs.push({
      job: selected,
      startTime,
      endTime,
      responseTime: startTime - selected.arrivalTime,
      waitingTime: startTime - selected.arrivalTime,
      turnaroundTime: endTime - selected.arrivalTime,
    });

    remaining.splice(remaining.indexOf(selected), 1);
    currentTime = endTime;
  }

  return buildResult(scheduledJobs, currentTime);
}

// Priority Preemptive
export function priorityPreemptive(jobs: Job[]): SchedulingResult {
  if (jobs.length === 0) return buildResult([], 0);

  interface JobState {
    job: Job;
    remainingTime: number;
    startTime?: number;
    responseTime?: number;
  }

  const jobStates: JobState[] = jobs.map((job) => ({
    job,
    remainingTime: job.burstTime,
  }));

  const scheduledJobs: ScheduledJob[] = [];
  let currentTime = 0;

  while (jobStates.some((state) => state.remainingTime > 0)) {
    // Get available jobs
    const available = jobStates.filter(
      (state) => state.job.arrivalTime <= currentTime && state.remainingTime > 0
    );

    if (available.length === 0) {
      // Jump to next arrival
      const nextArrival = jobStates
        .filter((state) => state.remainingTime > 0)
        .map((state) => state.job.arrivalTime)
        .sort((a, b) => a - b)[0];
      currentTime = nextArrival;
      continue;
    }

    // Select job with highest priority (lower number)
    const selected = available.reduce((min, state) =>
      state.job.priority < min.job.priority ? state : min
    );

    if (selected.startTime === undefined) {
      selected.startTime = currentTime;
      selected.responseTime = currentTime - selected.job.arrivalTime;
    }

    selected.remainingTime--;
    currentTime++;

    // Check if job completed
    if (selected.remainingTime === 0) {
      scheduledJobs.push({
        job: selected.job,
        startTime: selected.startTime!,
        endTime: currentTime,
        responseTime: selected.responseTime!,
        waitingTime: currentTime - selected.job.arrivalTime - selected.job.burstTime,
        turnaroundTime: currentTime - selected.job.arrivalTime,
      });
    }
  }

  return buildResult(scheduledJobs, currentTime);
}

// Execute all algorithms
export function executeAllAlgorithms(
  jobs: Job[],
  timeQuantum: number = 4
): Record<string, SchedulingResult> {
  return {
    FCFS: fcfs(jobs),
    SJF: sjf(jobs),
    SRTF: srtf(jobs),
    RR: roundRobin(jobs, timeQuantum),
    NPP: priorityNonPreemptive(jobs),
    PP: priorityPreemptive(jobs),
  };
}
