import React from 'react';
import { motion } from 'framer-motion';
import useSchedulingStore from '../store';
import type { SchedulingAlgorithm, SchedulingResult } from '../types';
import { getAlgorithmDescription } from '../utils';

export const AlgorithmSelector: React.FC = () => {
  const { selectedAlgorithm, setSelectedAlgorithm, results, darkMode } = useSchedulingStore();

  const algorithms: SchedulingAlgorithm[] = ['FCFS', 'SJF', 'SRTF', 'RR', 'NPP', 'PP'];

  return (
    <div className={`rounded-lg shadow-md border p-6 ${
      darkMode
        ? 'bg-slate-900 border-slate-800'
        : 'bg-white border-gray-200'
    }`}>
      <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
        Select Algorithm
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {algorithms.map((algo) => (
          <motion.button
            key={algo}
            onClick={() => setSelectedAlgorithm(algo)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`py-2 px-3 rounded-lg font-medium transition-all ${
              selectedAlgorithm === algo
                ? 'bg-amber-500 text-white shadow-lg ring-2 ring-amber-300'
                : darkMode
                ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {algo}
          </motion.button>
        ))}
      </div>

      {selectedAlgorithm && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-3 rounded-lg text-sm ${
            darkMode
              ? 'bg-slate-800 text-gray-300 border border-slate-700'
              : 'bg-blue-50 text-blue-900 border border-blue-200'
          }`}
        >
          <p>{getAlgorithmDescription(selectedAlgorithm)}</p>
        </motion.div>
      )}

      {selectedAlgorithm && results.has(selectedAlgorithm) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`mt-3 p-3 rounded-lg text-sm ${
            darkMode
              ? 'bg-green-900 text-green-100 border border-green-700'
              : 'bg-green-50 text-green-900 border border-green-200'
          }`}
        >
          ✓ Results available
        </motion.div>
      )}
    </div>
  );
};

interface AlgorithmComparisonProps {
  results: Record<string, SchedulingResult>;
}

export const AlgorithmComparison: React.FC<AlgorithmComparisonProps> = ({ results }) => {
  const { darkMode } = useSchedulingStore();

  if (Object.keys(results).length === 0) {
    return null;
  }

  const algorithms = Object.keys(results);

  // Prepare comparison data
  const comparisonMetrics = [
    { key: 'averageWaitingTime', label: 'Avg Waiting Time (ms)', lower: true },
    { key: 'averageTurnaroundTime', label: 'Avg Turnaround Time (ms)', lower: true },
    { key: 'averageResponseTime', label: 'Avg Response Time (ms)', lower: true },
    { key: 'cpuUtilization', label: 'CPU Utilization (%)', lower: false },
    { key: 'throughput', label: 'Throughput (jobs/ms)', lower: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg shadow-md border p-6 mt-6 ${
        darkMode
          ? 'bg-slate-900 border-slate-800'
          : 'bg-white border-gray-200'
      }`}
    >
      <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
        Algorithm Comparison
      </h2>

      <div className="overflow-x-auto">
        <table className={`w-full text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          <thead>
            <tr className={`border-b ${
              darkMode
                ? 'border-slate-700 bg-slate-800'
                : 'border-gray-300 bg-gray-100'
            }`}>
              <th className="px-4 py-3 text-left font-semibold">Metric</th>
              {algorithms.map((algo) => (
                <th key={algo} className="px-4 py-3 text-center font-semibold">
                  {algo}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonMetrics.map((metric) => {
              const values = algorithms.map((algo) => {
                const result = results[algo] as any;
                return result[metric.key] || 0;
              });

              const bestIndex = metric.lower
                ? values.indexOf(Math.min(...values))
                : values.indexOf(Math.max(...values));

              return (
                <tr
                  key={metric.key}
                  className={`border-b ${
                    darkMode
                      ? 'border-slate-700 hover:bg-slate-800'
                      : 'border-gray-200 hover:bg-gray-50'
                  } transition-colors`}
                >
                  <td className="px-4 py-3 font-medium">{metric.label}</td>
                  {algorithms.map((algo, idx) => {
                    const result = results[algo] as any;
                    const value = result[metric.key] || 0;
                    const isBest = idx === bestIndex;

                    return (
                      <td
                        key={algo}
                        className={`px-4 py-3 text-center font-semibold ${
                          isBest
                            ? 'bg-amber-100 dark:bg-amber-900 text-amber-900 dark:text-amber-100'
                            : ''
                        }`}
                      >
                        {typeof value === 'number' ? value.toFixed(2) : value}
                        {metric.key === 'cpuUtilization' ? '%' : ''}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
