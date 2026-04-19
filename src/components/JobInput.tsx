import React, { useState } from 'react';
import { Plus, Trash2, Copy } from 'lucide-react';
import useSchedulingStore from '../store';
import type { Job } from '../types';
import { validateJob, generateRandomJobs, SAMPLE_PRESETS } from '../utils';

export const JobInput: React.FC = () => {
  const { jobs, addJob, removeJob, setJobs } = useSchedulingStore();
  const [formData, setFormData] = useState<Partial<Job>>({
    name: '',
    arrivalTime: 0,
    burstTime: 1,
    priority: 1,
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleAddJob = () => {
    const validation = validateJob(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    const newJob: Job = {
      id: `job-${Date.now()}`,
      name: formData.name!,
      arrivalTime: formData.arrivalTime!,
      burstTime: formData.burstTime!,
      priority: formData.priority!,
    };

    addJob(newJob);
    setFormData({ name: '', arrivalTime: 0, burstTime: 1, priority: 1 });
    setErrors([]);
  };

  const handleDuplicateJob = (job: Job) => {
    const newJob: Job = {
      ...job,
      id: `job-${Date.now()}`,
    };
    addJob(newJob);
  };

  const handleLoadPreset = (preset: Job[]) => {
    setJobs(preset);
    setErrors([]);
  };

  const handleGenerateRandom = () => {
    const randomJobs = generateRandomJobs(5);
    setJobs(randomJobs);
  };

  const containerClass = 'bg-white border-gray-200';
  const inputClass = 'bg-white text-black border-gray-300 placeholder-gray-500';

  return (
    <div className={`${containerClass} rounded-lg shadow-md border p-6`}>
      <h2 className="text-2xl font-bold mb-6 text-black">
        Job Configuration
      </h2>

      {/* Preset Scenarios */}
      <div className="mb-6 p-4 rounded-lg border border-gray-300 bg-white">
        <p className="text-sm font-bold mb-3 text-black">Load Example Scenarios</p>
        <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
          {Object.entries(SAMPLE_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => handleLoadPreset(preset)}
              className="btn-secondary text-sm font-medium px-4 py-2 rounded-md whitespace-nowrap"
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
          <button
            onClick={handleGenerateRandom}
            className="btn-accent text-sm font-medium px-4 py-2 rounded-md whitespace-nowrap"
          >
            Random (5 Jobs)
          </button>
        </div>
      </div>

      {/* Input Form */}
      <div className="mb-6 p-4 rounded-lg border border-gray-300 bg-white">
        <p className="text-sm font-bold mb-4 text-black">Add New Job</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-800">
              Job Name
            </label>
            <input
              type="text"
              className={`w-full px-3 py-2 rounded-md border transition-colors input-field ${inputClass}`}
              value={formData.name || ''}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., P1"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-800">
              Arrival Time
            </label>
            <input
              type="number"
              className={`w-full px-3 py-2 rounded-md border transition-colors input-field ${inputClass}`}
              value={formData.arrivalTime || 0}
              onChange={(e) =>
                setFormData({ ...formData, arrivalTime: parseInt(e.target.value) || 0 })
              }
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-800">
              Burst Time
            </label>
            <input
              type="number"
              className={`w-full px-3 py-2 rounded-md border transition-colors input-field ${inputClass}`}
              value={formData.burstTime || 1}
              onChange={(e) =>
                setFormData({ ...formData, burstTime: parseInt(e.target.value) || 1 })
              }
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-800">
              Priority
            </label>
            <input
              type="number"
              className={`w-full px-3 py-2 rounded-md border transition-colors input-field ${inputClass}`}
              value={formData.priority || 1}
              onChange={(e) =>
                setFormData({ ...formData, priority: parseInt(e.target.value) || 1 })
              }
              min="1"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleAddJob}
              className="btn-primary w-full h-10 flex items-center justify-center space-x-2 rounded-md font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mb-4 p-3 bg-red-100 rounded-lg">
          {errors.map((error, idx) => (
            <p key={idx} className="text-sm text-red-800">
              {error}
            </p>
          ))}
        </div>
      )}

      {/* Jobs Table */}
      {jobs.length > 0 && (
        <div className="p-4 rounded-lg border border-gray-300 bg-white overflow-auto">
          <table className="w-full text-sm text-black">
            <thead>
              <tr className="border-b-2 border-gray-400 bg-gray-200">
                <th className="px-4 py-3 text-left font-bold whitespace-nowrap text-black">Name</th>
                <th className="px-4 py-3 text-left font-bold whitespace-nowrap text-black">Arrival</th>
                <th className="px-4 py-3 text-left font-bold whitespace-nowrap text-black">Burst</th>
                <th className="px-4 py-3 text-left font-bold whitespace-nowrap text-black">Priority</th>
                <th className="px-4 py-3 text-center font-bold whitespace-nowrap text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  className="border-b border-gray-300 hover:bg-gray-100 transition-colors"
                >
                  <td className="px-4 py-3 font-semibold text-black">{job.name}</td>
                  <td className="px-4 py-3 text-black">{job.arrivalTime}</td>
                  <td className="px-4 py-3 text-black">{job.burstTime}</td>
                  <td className="px-4 py-3 text-black">{job.priority}</td>
                  <td className="px-4 py-3 flex justify-center space-x-2">
                    <button
                      onClick={() => handleDuplicateJob(job)}
                      className="p-2 hover:bg-blue-200 rounded-md transition-colors"
                      title="Duplicate job"
                    >
                      <Copy className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => removeJob(job.id)}
                      className="p-2 hover:bg-red-200 rounded-md transition-colors"
                      title="Delete job"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs font-bold mt-3 px-2 py-1 inline-block rounded text-white bg-gray-800">
            Total Jobs: {jobs.length}
          </p>
        </div>
      )}

      {jobs.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          <p className="font-medium">No jobs added yet. Create some jobs or load a preset to get started.</p>
        </div>
      )}
    </div>
  );
};
