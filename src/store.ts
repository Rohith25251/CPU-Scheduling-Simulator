import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { SchedulingState, Job, SchedulingAlgorithm, SchedulingResult } from './types';

interface SchedulingStore extends SchedulingState {
  // Job Management
  addJob: (job: Job) => void;
  removeJob: (jobId: string) => void;
  updateJob: (jobId: string, updates: Partial<Job>) => void;
  setJobs: (jobs: Job[]) => void;
  clearJobs: () => void;

  // Algorithm Management
  setSelectedAlgorithm: (algorithm: SchedulingAlgorithm) => void;
  setResults: (algorithm: SchedulingAlgorithm, result: SchedulingResult) => void;

  // Settings
  toggleDarkMode: () => void;
  toggleAnimation: () => void;
  setTimeQuantum: (quantum: number) => void;

  // Utilities
  loadFromLocalStorage: () => void;
  saveToLocalStorage: () => void;
}

const useSchedulingStore = create<SchedulingStore>()(
  devtools(
    (set, get) => ({
      jobs: [],
      selectedAlgorithm: 'FCFS',
      results: new Map(),
      darkMode: localStorage.getItem('darkMode') === 'true' || false,
      animationEnabled: localStorage.getItem('animationEnabled') !== 'false',
      timeQuantum: 4,

      addJob: (job) =>
        set((state) => ({
          jobs: [...state.jobs, job],
        })),

      removeJob: (jobId) =>
        set((state) => ({
          jobs: state.jobs.filter((job) => job.id !== jobId),
        })),

      updateJob: (jobId, updates) =>
        set((state) => ({
          jobs: state.jobs.map((job) =>
            job.id === jobId ? { ...job, ...updates } : job
          ),
        })),

      setJobs: (jobs) =>
        set(() => ({
          jobs,
        })),

      clearJobs: () =>
        set(() => ({
          jobs: [],
          results: new Map(),
        })),

      setSelectedAlgorithm: (algorithm) =>
        set(() => ({
          selectedAlgorithm: algorithm,
        })),

      setResults: (algorithm, result) =>
        set((state) => {
          const newResults = new Map(state.results);
          newResults.set(algorithm, result);
          return { results: newResults };
        }),

      toggleDarkMode: () =>
        set((state) => {
          const newDarkMode = !state.darkMode;
          localStorage.setItem('darkMode', String(newDarkMode));
          return { darkMode: newDarkMode };
        }),

      toggleAnimation: () =>
        set((state) => {
          const newAnimationEnabled = !state.animationEnabled;
          localStorage.setItem('animationEnabled', String(newAnimationEnabled));
          return { animationEnabled: newAnimationEnabled };
        }),

      setTimeQuantum: (quantum) =>
        set(() => ({
          timeQuantum: quantum,
        })),

      loadFromLocalStorage: () => {
        const saved = localStorage.getItem('schedulingState');
        if (saved) {
          const state = JSON.parse(saved);
          set({
            jobs: state.jobs || [],
            timeQuantum: state.timeQuantum || 4,
          });
        }
      },

      saveToLocalStorage: () => {
        const state = get();
        localStorage.setItem(
          'schedulingState',
          JSON.stringify({
            jobs: state.jobs,
            timeQuantum: state.timeQuantum,
          })
        );
      },
    }),
    { name: 'SchedulingStore' }
  )
);

export default useSchedulingStore;
