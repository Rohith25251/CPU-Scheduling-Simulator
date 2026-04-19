// Scheduling Types and Interfaces

export interface Job {
  id: string;
  name: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
}

export interface ScheduledJob {
  job: Job;
  startTime: number;
  endTime: number;
  responseTime: number;
  waitingTime: number;
  turnaroundTime: number;
}

export interface SchedulingResult {
  jobs: ScheduledJob[];
  completionTime: number;
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  averageResponseTime: number;
  cpuUtilization: number;
  throughput: number;
  contextSwitches: number;
  fairnessIndicators: {
    standardDeviation: number;
    minWaitingTime: number;
    maxWaitingTime: number;
    starvationDetected: boolean;
  };
}

export interface SchedulingState {
  jobs: Job[];
  selectedAlgorithm: SchedulingAlgorithm;
  results: Map<SchedulingAlgorithm, SchedulingResult>;
  darkMode: boolean;
  animationEnabled: boolean;
  timeQuantum: number;
}

export type SchedulingAlgorithm = 'FCFS' | 'SJF' | 'SRTF' | 'RR' | 'NPP' | 'PP';

export interface TooltipData {
  jobName: string;
  arrivalTime: number;
  burstTime: number;
  priority?: number;
  waitingTime: number;
  startTime: number;
  endTime: number;
}

export interface GanttChartDimensions {
  width: number;
  height: number;
  scale: number;
  offsetX: number;
  offsetY: number;
}

export interface SimulationContext {
  currentTime: number;
  readyQueue: Job[];
  completedJobs: Job[];
  decisions: string[];
}
