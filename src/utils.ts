import type { Job, SchedulingResult } from './types';
import Papa from 'papaparse';

// Generate random jobs
export function generateRandomJobs(count: number = 5): Job[] {
  const jobs: Job[] = [];
  for (let i = 0; i < count; i++) {
    jobs.push({
      id: `job-${i}-${Date.now()}`,
      name: `P${i + 1}`,
      arrivalTime: Math.floor(Math.random() * 20),
      burstTime: Math.floor(Math.random() * 20) + 1,
      priority: Math.floor(Math.random() * 5) + 1,
    });
  }
  return jobs;
}

// Sample presets
export const SAMPLE_PRESETS = {
  simple: [
    {
      id: 'simple-1',
      name: 'P1',
      arrivalTime: 0,
      burstTime: 8,
      priority: 1,
    },
    {
      id: 'simple-2',
      name: 'P2',
      arrivalTime: 1,
      burstTime: 4,
      priority: 2,
    },
    {
      id: 'simple-3',
      name: 'P3',
      arrivalTime: 2,
      burstTime: 2,
      priority: 3,
    },
  ] as Job[],
  complex: [
    {
      id: 'complex-1',
      name: 'P1',
      arrivalTime: 0,
      burstTime: 6,
      priority: 2,
    },
    {
      id: 'complex-2',
      name: 'P2',
      arrivalTime: 1,
      burstTime: 3,
      priority: 1,
    },
    {
      id: 'complex-3',
      name: 'P3',
      arrivalTime: 2,
      burstTime: 7,
      priority: 3,
    },
    {
      id: 'complex-4',
      name: 'P4',
      arrivalTime: 3,
      burstTime: 2,
      priority: 2,
    },
    {
      id: 'complex-5',
      name: 'P5',
      arrivalTime: 4,
      burstTime: 4,
      priority: 1,
    },
  ] as Job[],
  competitive: [
    {
      id: 'comp-1',
      name: 'P1',
      arrivalTime: 0,
      burstTime: 5,
      priority: 2,
    },
    {
      id: 'comp-2',
      name: 'P2',
      arrivalTime: 1,
      burstTime: 2,
      priority: 1,
    },
    {
      id: 'comp-3',
      name: 'P3',
      arrivalTime: 3,
      burstTime: 8,
      priority: 3,
    },
    {
      id: 'comp-4',
      name: 'P4',
      arrivalTime: 4,
      burstTime: 3,
      priority: 2,
    },
  ] as Job[],
};

// Export to CSV
export function exportToCSV(
  jobs: Job[],
  results: Record<string, SchedulingResult>
): void {
  const data: any[] = [];

  // Add jobs section
  data.push(['--- JOBS ---']);
  data.push(['Job Name', 'Arrival Time', 'Burst Time', 'Priority']);
  jobs.forEach((job) => {
    data.push([job.name, job.arrivalTime, job.burstTime, job.priority]);
  });

  data.push(['']);
  data.push(['--- SCHEDULING RESULTS ---']);

  // Add results for each algorithm
  Object.entries(results).forEach(([algorithm, result]) => {
    data.push([algorithm]);
    data.push([
      'Average Waiting Time',
      result.averageWaitingTime.toFixed(2),
    ]);
    data.push([
      'Average Turnaround Time',
      result.averageTurnaroundTime.toFixed(2),
    ]);
    data.push([
      'Average Response Time',
      result.averageResponseTime.toFixed(2),
    ]);
    data.push(['CPU Utilization', (result.cpuUtilization.toFixed(2) + '%')]);
    data.push(['Throughput', result.throughput.toFixed(4)]);
    data.push(['Context Switches', result.contextSwitches]);
    data.push([
      'Standard Deviation',
      result.fairnessIndicators.standardDeviation.toFixed(2),
    ]);
    data.push(['Starvation Detected', result.fairnessIndicators.starvationDetected ? 'Yes' : 'No']);
    data.push(['']);
  });

  const csv = Papa.unparse(data);
  downloadFile(csv, 'cpu-scheduling-results.csv', 'text/csv');
}

// Export to JSON
export function exportToJSON(
  jobs: Job[],
  results: Record<string, SchedulingResult>
): void {
  const exportData = {
    timestamp: new Date().toISOString(),
    jobs,
    results: results,
  };

  const json = JSON.stringify(exportData, null, 2);
  downloadFile(json, 'cpu-scheduling-results.json', 'application/json');
}

// Helper function to download files
function downloadFile(content: string, filename: string, mimeType: string): void {
  const element = document.createElement('a');
  element.setAttribute('href', `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

// Validate job input
export function validateJob(job: Partial<Job>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!job.name || job.name.trim() === '') {
    errors.push('Job name is required');
  }

  if (job.arrivalTime === undefined || job.arrivalTime < 0) {
    errors.push('Arrival time must be non-negative');
  }

  if (job.burstTime === undefined || job.burstTime <= 0) {
    errors.push('Burst time must be positive');
  }

  if (job.priority === undefined || job.priority < 1) {
    errors.push('Priority must be at least 1');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Format time for display
export function formatTime(ms: number): string {
  return `${ms.toFixed(2)}ms`;
}

// Format percentage
export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

// Get algorithm description
export function getAlgorithmDescription(algorithm: string): string {
  const descriptions: Record<string, string> = {
    FCFS: 'First Come First Served - Non-preemptive algorithm that executes jobs in order of arrival',
    SJF: 'Shortest Job First - Non-preemptive algorithm that prioritizes shorter jobs',
    SRTF: 'Shortest Remaining Time First - Preemptive version of SJF',
    RR: 'Round Robin - Preemptive algorithm with fixed time quantum',
    NPP: 'Priority Non-preemptive - Schedules by priority without interruption',
    PP: 'Priority Preemptive - Schedules by priority with preemption capability',
  };
  return descriptions[algorithm] || '';
}

// Get algorithm color for visualization
export function getAlgorithmColor(algorithm: string): string {
  const colors: Record<string, string> = {
    FCFS: '#3b82f6',
    SJF: '#ef4444',
    SRTF: '#f59e0b',
    RR: '#8b5cf6',
    NPP: '#10b981',
    PP: '#06b6d4',
  };
  return colors[algorithm] || '#6b7280';
}

// Get job color
export function getJobColor(jobIndex: number): string {
  const colors = [
    '#1e40af', // navy
    '#dc2626', // red
    '#ea580c', // orange
    '#7c3aed', // purple
    '#059669', // green
    '#0891b2', // cyan
    '#d97706', // amber
    '#be185d', // pink
  ];
  return colors[jobIndex % colors.length];
}
