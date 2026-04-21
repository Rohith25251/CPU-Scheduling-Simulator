import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Settings } from 'lucide-react';
import useSchedulingStore from '../store';
import { executeAllAlgorithms } from '../algorithms';
import { Header } from './Header';
import { JobInput } from './JobInput';
import { GanttChart } from './GanttChart';
import { MetricsDashboard } from './MetricsDashboard';
import { AnalysisChart } from './AnalysisChart';
import { AlgorithmSelector, AlgorithmComparison } from './AlgorithmSelector';
import { ContextPanel } from './ContextPanel';

export const App: React.FC = () => {
  const {
    jobs,
    selectedAlgorithm,
    results,
    darkMode,
    timeQuantum,
    setResults,
    clearJobs,
    loadFromLocalStorage,
    saveToLocalStorage,
    setTimeQuantum,
  } = useSchedulingStore();

  // Load from localStorage on mount
  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  // Save to localStorage when jobs change
  useEffect(() => {
    saveToLocalStorage();
  }, [jobs, saveToLocalStorage]);

  const handleRunSimulation = () => {
    if (jobs.length === 0) {
      alert('Please add at least one job before running simulation');
      return;
    }

    const allResults = executeAllAlgorithms(jobs, timeQuantum);
    Object.entries(allResults).forEach(([algo, result]) => {
      setResults(algo as any, result);
    });
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to clear all jobs and results?')) {
      clearJobs();
    }
  };

  const currentResult = selectedAlgorithm ? results.get(selectedAlgorithm) : undefined;
  const resultsObj = Object.fromEntries(results);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <style>{`
        body {
          background-color: ${darkMode ? '#0f172a' : '#f9fafb'};
          color: ${darkMode ? '#e5e7eb' : '#111827'};
        }
      `}</style>

      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <AnimatePresence>
          {/* Control Panel */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg shadow-md border p-6 mb-8 bg-white border-gray-200"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-3 text-black">
                  Simulation Controls
                </h3>
                <div className="flex items-center space-x-3">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-800">
                      Time Quantum (for RR)
                    </label>
                    <input
                      type="number"
                      className="input-field w-24"
                      value={timeQuantum}
                      onChange={(e) => setTimeQuantum(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleRunSimulation}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Run Simulation</span>
                </button>
                <button
                  onClick={handleReset}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Job Configuration Section - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <JobInput />
          </motion.div>

          {/* Algorithm Selection Section - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <AlgorithmSelector />
          </motion.div>

          {/* Metrics Dashboard Section - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <MetricsDashboard result={currentResult} />
          </motion.div>

          {/* Analysis Chart Section */}
          {currentResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <AnalysisChart result={currentResult} />
            </motion.div>
          )}

          {/* Context Panel Section - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <ContextPanel result={currentResult} algorithm={selectedAlgorithm} />
          </motion.div>

          {/* Gantt Chart Section */}
          {currentResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <GanttChart
                jobs={currentResult.jobs}
                completionTime={currentResult.completionTime}
              />
            </motion.div>
          )}

          {/* Algorithm Comparison */}
          {Object.keys(resultsObj).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <AlgorithmComparison results={resultsObj} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {jobs.length === 0 && Object.keys(resultsObj).length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center py-16 rounded-lg border-2 border-dashed ${
              darkMode
                ? 'border-slate-700 text-gray-400'
                : 'border-gray-300 text-gray-500'
            }`}
          >
            <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Get Started</h3>
            <p>
              Add some jobs to the left panel and click "Run Simulation" to begin
            </p>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className={`border-t ${
        darkMode
          ? 'border-slate-800 bg-slate-900 text-gray-400'
          : 'border-gray-200 bg-gray-100 text-gray-600'
      } mt-12`}>
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-center text-sm">
          <p>
            CPU Scheduling Simulator v1.0 • Built with React 18, Vite & Tailwind CSS
          </p>
          <p className="mt-2 opacity-75">
            Educational tool for understanding CPU scheduling algorithms
          </p>
        </div>
      </footer>
    </div>
  );
};
