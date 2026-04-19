import React from 'react';
import { Moon, Sun, FileDown } from 'lucide-react';
import useSchedulingStore from '../store';
import type { SchedulingResult } from '../types';

export const Header: React.FC = () => {
  const { darkMode, toggleDarkMode, jobs } = useSchedulingStore();

  const handleDownloadReport = async () => {
    if (jobs.length === 0) {
      alert('Please add jobs and run a simulation before downloading the report');
      return;
    }

    const results = useSchedulingStore.getState().results;
    if (results.size === 0) {
      alert('Please run a simulation first to generate the report');
      return;
    }

    try {
      const { generatePDFReport } = await import('../pdf-export');
      const resultsObj = Object.fromEntries(results);
      const timeQuantum = useSchedulingStore.getState().timeQuantum;
      generatePDFReport(jobs, resultsObj as Record<string, SchedulingResult>, timeQuantum);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Error generating PDF report. Please try again.');
    }
  };

  return (
    <header
      className={`${
        darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
      } border-b ${darkMode ? 'border-slate-800' : 'border-gray-200'} shadow-md`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">⚙️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">CPU Scheduling Simulator</h1>
              <p
                className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Interactive Scheduling Algorithm Visualization
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownloadReport}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium transition-colors"
              title="Download comprehensive PDF report"
            >
              <FileDown className="w-5 h-5" />
              <span className="hidden sm:inline">Download Report</span>
              <span className="sm:hidden">Report</span>
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors"
              title="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-amber-500" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
