import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import type { SchedulingResult } from '../types';
import useSchedulingStore from '../store';

interface MetricsDashboardProps {
  result?: SchedulingResult;
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({ result }) => {
  const { darkMode } = useSchedulingStore();

  if (!result) {
    return (
      <div className={`rounded-lg shadow-md border-2 p-8 ${
        darkMode
          ? 'bg-slate-900 border-slate-700'
          : 'bg-white border-gray-300'
      }`}>
        <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Performance Metrics
        </h2>
        <div className={`text-center py-12 rounded-lg border-2 border-dashed ${
          darkMode
            ? 'border-slate-700 bg-slate-800'
            : 'border-gray-300 bg-gray-50'
        }`}>
          <div className={`text-5xl mb-4 ${darkMode ? 'text-slate-600' : 'text-gray-400'}`}>
            📊
          </div>
          <p className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            No simulation results yet
          </p>
          <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Add jobs on the left, select an algorithm, and click "Run Simulation" to view performance metrics
          </p>
        </div>
      </div>
    );
  }

  const metrics = [
    {
      label: 'Average Waiting Time',
      value: result.averageWaitingTime.toFixed(2),
      unit: 'ms',
      color: 'blue',
    },
    {
      label: 'Average Turnaround Time',
      value: result.averageTurnaroundTime.toFixed(2),
      unit: 'ms',
      color: 'purple',
    },
    {
      label: 'Average Response Time',
      value: result.averageResponseTime.toFixed(2),
      unit: 'ms',
      color: 'pink',
    },
    {
      label: 'CPU Utilization',
      value: result.cpuUtilization.toFixed(2),
      unit: '%',
      color: 'green',
    },
    {
      label: 'Throughput',
      value: result.throughput.toFixed(4),
      unit: 'jobs/ms',
      color: 'indigo',
    },
    {
      label: 'Context Switches',
      value: result.contextSwitches.toString(),
      unit: '',
      color: 'orange',
    },
  ];

  const fairness = result.fairnessIndicators;

  const colorMap: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700',
    purple: 'from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700',
    pink: 'from-pink-500 to-pink-600 dark:from-pink-600 dark:to-pink-700',
    green: 'from-green-500 to-green-600 dark:from-green-600 dark:to-green-700',
    indigo: 'from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700',
    orange: 'from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700',
  };

  return (
    <div className={`rounded-lg shadow-md border p-6 ${
      darkMode
        ? 'bg-slate-900 border-slate-800'
        : 'bg-white border-gray-200'
    }`}>
      <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
        Performance Metrics
      </h2>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`rounded-lg p-4 ${
              darkMode ? 'bg-slate-800' : 'bg-gray-50'
            } border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}
          >
            <p className={`text-sm font-medium ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {metric.label}
            </p>
            <div className="mt-2 flex items-baseline space-x-1">
              <span className={`text-2xl font-bold bg-gradient-to-r ${colorMap[metric.color]} bg-clip-text text-transparent`}>
                {metric.value}
              </span>
              <span className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {metric.unit}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Fairness Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`rounded-lg p-4 border ${
          darkMode
            ? 'bg-slate-800 border-slate-700'
            : 'bg-gray-50 border-gray-200'
        }`}
      >
        <div className="flex items-center space-x-2 mb-4">
          <h3 className={`text-lg font-semibold ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Fairness Indicators
          </h3>
          {fairness.starvationDetected && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-red-100 dark:bg-red-900 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span className="text-xs font-medium text-red-800 dark:text-red-300">
                Starvation Alert
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-3 rounded ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Standard Deviation
            </p>
            <p className="text-xl font-bold text-amber-500 mt-1">
              {fairness.standardDeviation.toFixed(2)}
            </p>
          </div>

          <div className={`p-3 rounded ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Min Waiting Time
            </p>
            <p className="text-xl font-bold text-green-500 mt-1">
              {fairness.minWaitingTime.toFixed(2)}ms
            </p>
          </div>

          <div className={`p-3 rounded ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Max Waiting Time
            </p>
            <p className={`text-xl font-bold mt-1 ${
              fairness.starvationDetected ? 'text-red-500' : 'text-orange-500'
            }`}>
              {fairness.maxWaitingTime.toFixed(2)}ms
            </p>
          </div>

          <div className={`p-3 rounded ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Status
            </p>
            <p className={`text-xl font-bold mt-1 ${
              fairness.starvationDetected ? 'text-red-500' : 'text-green-500'
            }`}>
              {fairness.starvationDetected ? 'Starvation' : 'Fair'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Additional Info */}
      <div className={`mt-4 p-3 rounded-lg text-sm ${
        darkMode
          ? 'bg-slate-800 text-gray-300'
          : 'bg-blue-50 text-blue-800'
      }`}>
        <p>
          <strong>Completion Time:</strong> {result.completionTime}ms
        </p>
        <p className="mt-1">
          <strong>Total Jobs Scheduled:</strong> {result.jobs.length}
        </p>
      </div>
    </div>
  );
};
