import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut } from 'lucide-react';
import useSchedulingStore from '../store';
import type { ScheduledJob, TooltipData } from '../types';
import { getJobColor } from '../utils';

interface GanttChartProps {
  jobs: ScheduledJob[];
  completionTime: number;
}

export const GanttChart: React.FC<GanttChartProps> = ({ jobs, completionTime }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { darkMode } = useSchedulingStore();
  
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [tooltip, setTooltip] = useState<TooltipData & { x: number; y: number } | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  const CHART_PADDING = 80;
  const ROW_HEIGHT = 60;
  const MIN_BAR_WIDTH = 30;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = Math.max(rect.height, ROW_HEIGHT * (jobs.length + 1) + CHART_PADDING * 2);

    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set background
    ctx.fillStyle = darkMode ? '#0f172a' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = darkMode ? '#1e3a8a' : '#e5e7eb';
    ctx.lineWidth = 1;

    const timeScale = (canvas.width - CHART_PADDING * 2 - 20) / (completionTime || 1);

    // Draw time axis labels
    ctx.fillStyle = darkMode ? '#d1d5db' : '#374151';
    ctx.font = '12px system-ui';
    ctx.textAlign = 'center';

    for (let i = 0; i <= completionTime; i += Math.ceil(completionTime / 10)) {
      const x = CHART_PADDING + i * timeScale;
      ctx.beginPath();
      ctx.moveTo(x, CHART_PADDING - 5);
      ctx.lineTo(x, canvas.height - CHART_PADDING);
      ctx.stroke();
      ctx.fillText(String(i), x, CHART_PADDING - 15);
    }

    // Draw Y-axis label
    ctx.save();
    ctx.translate(20, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = darkMode ? '#9ca3af' : '#6b7280';
    ctx.font = 'bold 14px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Jobs', 0, 0);
    ctx.restore();

    // Draw Gantt bars
    jobs.forEach((scheduledJob, index) => {
      const y = CHART_PADDING + index * ROW_HEIGHT + 15;
      const startX = CHART_PADDING + scheduledJob.startTime * timeScale;
      const barWidth = Math.max(
        (scheduledJob.endTime - scheduledJob.startTime) * timeScale,
        MIN_BAR_WIDTH
      );

      // Draw bar
      const color = getJobColor(index);
      ctx.fillStyle = color;
      ctx.fillRect(startX, y, barWidth, ROW_HEIGHT - 30);

      // Draw border
      ctx.strokeStyle = darkMode ? '#ffffff' : '#000000';
      ctx.lineWidth = 2;
      ctx.strokeRect(startX, y, barWidth, ROW_HEIGHT - 30);

      // Draw job name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(
        scheduledJob.job.name,
        startX + barWidth / 2,
        y + (ROW_HEIGHT - 30) / 2 + 5
      );

      // Draw job label on Y-axis
      ctx.fillStyle = darkMode ? '#d1d5db' : '#374151';
      ctx.font = 'bold 12px system-ui';
      ctx.textAlign = 'right';
      ctx.fillText(scheduledJob.job.name, CHART_PADDING - 10, y + (ROW_HEIGHT - 30) / 2 + 5);
    });

    // Draw X-axis label
    ctx.fillStyle = darkMode ? '#9ca3af' : '#6b7280';
    ctx.font = 'bold 14px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Time', canvas.width / 2, canvas.height - 20);

  }, [jobs, completionTime, darkMode, zoom, panX, panY]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const timeScale = (canvas.width - CHART_PADDING * 2 - 20) / (completionTime || 1);

    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      const barY = CHART_PADDING + i * ROW_HEIGHT + 15;
      const startX = CHART_PADDING + job.startTime * timeScale;
      const barWidth = Math.max((job.endTime - job.startTime) * timeScale, MIN_BAR_WIDTH);

      if (
        x >= startX &&
        x <= startX + barWidth &&
        y >= barY &&
        y <= barY + ROW_HEIGHT - 30
      ) {
        setTooltip({
          jobName: job.job.name,
          arrivalTime: job.job.arrivalTime,
          burstTime: job.job.burstTime,
          priority: job.job.priority,
          waitingTime: job.waitingTime,
          startTime: job.startTime,
          endTime: job.endTime,
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
        return;
      }
    }

    setTooltip(null);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsPanning(true);
    setStartPan({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleMouseMove2 = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPanning) return;
    setPanX(e.clientX - startPan.x);
    setPanY(e.clientY - startPan.y);
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoom((prev) => {
      if (direction === 'in') return Math.min(prev + 0.2, 3);
      return Math.max(prev - 0.2, 0.5);
    });
  };

  return (
    <div ref={containerRef} className={`rounded-lg shadow-md border p-4 ${
      darkMode
        ? 'bg-slate-900 border-slate-800'
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Gantt Chart
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => handleZoom('out')}
            className="p-2 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className={`px-3 py-2 rounded-lg ${
            darkMode ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-700'
          }`}>
            {(zoom * 100).toFixed(0)}%
          </span>
          <button
            onClick={() => handleZoom('in')}
            className="p-2 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <canvas
          ref={canvasRef}
          className={`w-full border ${
            darkMode ? 'border-slate-700 bg-slate-800' : 'border-gray-300 bg-white'
          } rounded cursor-${isPanning ? 'grabbing' : 'grab'} overflow-auto`}
          style={{ height: '500px' }}
          onMouseMove={(e) => {
            handleMouseMove(e);
            handleMouseMove2(e);
          }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />

        {/* Tooltip */}
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`absolute p-3 rounded-lg shadow-lg text-sm z-10 ${
              darkMode
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'bg-white text-gray-900 border border-gray-300'
            }`}
            style={{
              left: `${tooltip.x + 10}px`,
              top: `${tooltip.y + 10}px`,
              pointerEvents: 'none',
            }}
          >
            <p className="font-bold">{tooltip.jobName}</p>
            <p>Arrival: {tooltip.arrivalTime}ms</p>
            <p>Burst: {tooltip.burstTime}ms</p>
            <p>Priority: {tooltip.priority}</p>
            <p>Waiting: {tooltip.waitingTime.toFixed(2)}ms</p>
            <p>Start: {tooltip.startTime}ms</p>
            <p>End: {tooltip.endTime}ms</p>
          </motion.div>
        )}
      </motion.div>

      <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Drag to pan • Scroll to zoom • Hover over bars for details
      </p>
    </div>
  );
};
