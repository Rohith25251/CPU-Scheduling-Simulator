import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Clock, TrendingDown, AlertCircle } from 'lucide-react';
import type { SchedulingResult, ScheduledJob } from '../types';
import useSchedulingStore from '../store';

interface ContextPanelProps {
  result?: SchedulingResult;
  algorithm?: string;
}

export const ContextPanel: React.FC<ContextPanelProps> = ({ result, algorithm }) => {
  const { darkMode } = useSchedulingStore();
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  if (!result || !algorithm) {
    return (
      <div className={`rounded-lg shadow-md border-2 p-8 ${
        darkMode
          ? 'bg-slate-900 border-slate-700'
          : 'bg-white border-gray-300'
      }`}>
        <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Scheduling Context
        </h2>
        <div className={`text-center py-12 rounded-lg border-2 border-dashed ${
          darkMode
            ? 'border-slate-700 bg-slate-800'
            : 'border-gray-300 bg-gray-50'
        }`}>
          <div className={`text-5xl mb-4 ${darkMode ? 'text-slate-600' : 'text-gray-400'}`}>
            📋
          </div>
          <p className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            No simulation results yet
          </p>
          <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Run a simulation to view detailed explanations and job execution context
          </p>
        </div>
      </div>
    );
  }

  const getAlgorithmExplanation = (algo: string): string => {
    const explanations: Record<string, string> = {
      FCFS: 'First Come First Served executes jobs in the order they arrive. This is the simplest algorithm but can suffer from the convoy effect where short jobs wait behind long ones.',
      SJF: 'Shortest Job First minimizes average waiting time by always selecting the shortest available job. However, it may cause longer jobs to starve indefinitely.',
      SRTF: 'Shortest Remaining Time First is the preemptive version of SJF. If a shorter job arrives while another is executing, the new job preempts the current one.',
      RR: 'Round Robin assigns each job a fixed time quantum. Jobs are cycled through the queue repeatedly until completion, ensuring fairness and responsiveness.',
      NPP: 'Priority Non-preemptive selects jobs based on priority level. Once a job starts executing, it runs to completion even if a higher priority job arrives.',
      PP: 'Priority Preemptive will interrupt a currently running job if a higher priority job becomes available, ensuring high priority work is completed faster.',
    };
    return explanations[algo] || '';
  };

  const getJobDecisionReason = (job: ScheduledJob): string => {
    const reasons: string[] = [];

    if (job.waitingTime > result.averageWaitingTime) {
      reasons.push('⚠️ Above average waiting time');
    }

    if (job.turnaroundTime > result.averageTurnaroundTime) {
      reasons.push('⚠️ Above average turnaround time');
    }

    if (job.responseTime === 0) {
      reasons.push('✓ Immediate execution');
    }

    return reasons.length > 0 ? reasons.join('; ') : '✓ Normal execution';
  };

  return (
    <div className={`rounded-lg shadow-md border p-6 ${
      darkMode
        ? 'bg-slate-900 border-slate-800'
        : 'bg-white border-gray-200'
    }`}>
      <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
        Scheduling Context & Explanations
      </h2>

      {/* Algorithm Overview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`p-4 rounded-lg mb-6 ${
          darkMode
            ? 'bg-slate-800 border border-slate-700'
            : 'bg-blue-50 border border-blue-200'
        }`}
      >
        <h3 className={`font-semibold mb-2 ${
          darkMode ? 'text-blue-300' : 'text-blue-900'
        }`}>
          {algorithm} Overview
        </h3>
        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {getAlgorithmExplanation(algorithm)}
        </p>
      </motion.div>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className={`p-3 rounded-lg ${
          darkMode ? 'bg-slate-800' : 'bg-gray-100'
        }`}>
          <div className="flex items-center space-x-2 mb-1">
            <Clock className="w-4 h-4 text-blue-500" />
            <p className={`text-xs font-medium ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Avg Wait
            </p>
          </div>
          <p className="text-lg font-bold text-blue-500">
            {result.averageWaitingTime.toFixed(1)}ms
          </p>
        </div>

        <div className={`p-3 rounded-lg ${
          darkMode ? 'bg-slate-800' : 'bg-gray-100'
        }`}>
          <div className="flex items-center space-x-2 mb-1">
            <TrendingDown className="w-4 h-4 text-green-500" />
            <p className={`text-xs font-medium ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Avg Turnaround
            </p>
          </div>
          <p className="text-lg font-bold text-green-500">
            {result.averageTurnaroundTime.toFixed(1)}ms
          </p>
        </div>

        <div className={`p-3 rounded-lg ${
          darkMode ? 'bg-slate-800' : 'bg-gray-100'
        }`}>
          <div className="flex items-center space-x-2 mb-1">
            <AlertCircle className="w-4 h-4 text-purple-500" />
            <p className={`text-xs font-medium ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Context Switches
            </p>
          </div>
          <p className="text-lg font-bold text-purple-500">
            {result.contextSwitches}
          </p>
        </div>
      </div>

      {/* Job Details */}
      <div>
        <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Job Execution Details
        </h3>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {result.jobs.map((job, index) => (
              <motion.div
                key={job.job.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  onClick={() =>
                    setExpandedJob(expandedJob === job.job.id ? null : job.job.id)
                  }
                  className={`w-full p-3 rounded-lg transition-colors ${
                    darkMode
                      ? 'bg-slate-800 hover:bg-slate-700 border border-slate-700'
                      : 'bg-gray-100 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <span className={`font-bold ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                        {job.job.name}
                      </span>
                      <span className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {getJobDecisionReason(job)}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        expandedJob === job.job.id ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                <AnimatePresence>
                  {expandedJob === job.job.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`overflow-hidden p-3 text-sm ${
                        darkMode
                          ? 'bg-slate-900 border-b border-slate-700'
                          : 'bg-gray-50 border-b border-gray-200'
                      }`}
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className={`text-xs font-medium ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Arrival Time
                          </p>
                          <p className="font-bold">{job.job.arrivalTime}ms</p>
                        </div>
                        <div>
                          <p className={`text-xs font-medium ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Burst Time
                          </p>
                          <p className="font-bold">{job.job.burstTime}ms</p>
                        </div>
                        <div>
                          <p className={`text-xs font-medium ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Start Time
                          </p>
                          <p className="font-bold text-blue-500">{job.startTime}ms</p>
                        </div>
                        <div>
                          <p className={`text-xs font-medium ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            End Time
                          </p>
                          <p className="font-bold text-green-500">{job.endTime}ms</p>
                        </div>
                        <div>
                          <p className={`text-xs font-medium ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Waiting Time
                          </p>
                          <p className="font-bold text-orange-500">
                            {job.waitingTime.toFixed(2)}ms
                          </p>
                        </div>
                        <div>
                          <p className={`text-xs font-medium ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Turnaround Time
                          </p>
                          <p className="font-bold text-purple-500">
                            {job.turnaroundTime.toFixed(2)}ms
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
