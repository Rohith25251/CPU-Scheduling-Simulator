import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import useSchedulingStore from '../store';
import type { SchedulingResult } from '../types';

interface AnalysisChartProps {
  result?: SchedulingResult;
}

export const AnalysisChart: React.FC<AnalysisChartProps> = ({ result }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { darkMode } = useSchedulingStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set internal resolution higher for better quality
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = canvas.clientWidth || 800;
    const displayHeight = canvas.clientHeight || 400;
    
    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    
    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);
    
    const width = displayWidth;
    const height = displayHeight;
    
    // Clear
    ctx.clearRect(0, 0, width, height);
    
    // Background
    ctx.fillStyle = darkMode ? '#0f172a' : '#ffffff';
    ctx.fillRect(0, 0, width, height);

    if (!result || result.jobs.length === 0) {
      ctx.fillStyle = darkMode ? '#475569' : '#94a3b8';
      ctx.font = '16px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No simulation data available', width / 2, height / 2);
      return;
    }

    const padding = 60;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const jobs = result.jobs;

    // Find max value for scaling
    const maxVal = Math.max(...jobs.map(j => Math.max(j.waitingTime, j.turnaroundTime))) || 1;
    const yScale = chartHeight / (maxVal * 1.2);
    const xScale = chartWidth / jobs.length;
    const barWidth = Math.min(xScale * 0.35, 40);

    // Draw Grid Lines & Axes
    ctx.strokeStyle = darkMode ? '#1e293b' : '#f1f5f9';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
        const val = (maxVal * 1.2 * i) / 5;
        const y = height - padding - val * yScale;
        
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();

        ctx.fillStyle = darkMode ? '#94a3b8' : '#64748b';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(val.toFixed(0), padding - 10, y + 4);
    }

    // Draw Bars
    jobs.forEach((job, i) => {
      const x = padding + i * xScale + xScale / 2;
      
      // Waiting Time Bar
      const wtHeight = job.waitingTime * yScale;
      const wtY = height - padding - wtHeight;
      
      const wtGradient = ctx.createLinearGradient(0, wtY, 0, height - padding);
      wtGradient.addColorStop(0, '#3b82f6');
      wtGradient.addColorStop(1, '#2563eb');
      
      ctx.fillStyle = wtGradient;
      // Rounded rect implementation for bars
      drawRoundedRect(ctx, x - barWidth - 2, wtY, barWidth, wtHeight, 4);
      ctx.fill();
      
      // Turnaround Time Bar
      const tatHeight = job.turnaroundTime * yScale;
      const tatY = height - padding - tatHeight;

      const tatGradient = ctx.createLinearGradient(0, tatY, 0, height - padding);
      tatGradient.addColorStop(0, '#a855f7');
      tatGradient.addColorStop(1, '#7c3aed');

      ctx.fillStyle = tatGradient;
      drawRoundedRect(ctx, x + 2, tatY, barWidth, tatHeight, 4);
      ctx.fill();

      // Job Label (X-axis)
      ctx.fillStyle = darkMode ? '#cbd5e1' : '#334155';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(job.job.name, x, height - padding + 25);
      
      // Values on top
      ctx.font = '10px Inter, sans-serif';
      ctx.fillStyle = darkMode ? '#94a3b8' : '#64748b';
      if (wtHeight > 15) ctx.fillText(job.waitingTime.toFixed(0), x - barWidth/2 - 2, wtY - 5);
      if (tatHeight > 15) ctx.fillText(job.turnaroundTime.toFixed(0), x + barWidth/2 + 2, tatY - 5);
    });

    // Legend
    const legendY = 25;
    ctx.textAlign = 'left';
    
    // WT Legend
    ctx.fillStyle = '#3b82f6';
    drawRoundedRect(ctx, padding, legendY, 12, 12, 2);
    ctx.fill();
    ctx.fillStyle = darkMode ? '#e2e8f0' : '#1e293b';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('Waiting Time (ms)', padding + 20, legendY + 10);

    // TAT Legend
    ctx.fillStyle = '#a855f7';
    drawRoundedRect(ctx, padding + 150, legendY, 12, 12, 2);
    ctx.fill();
    ctx.fillStyle = darkMode ? '#e2e8f0' : '#1e293b';
    ctx.fillText('Turnaround Time (ms)', padding + 170, legendY + 10);

  }, [result, darkMode]);

  // Helper for rounded rectangles
  function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mt-6 rounded-xl border-2 shadow-lg overflow-hidden ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'
      }`}
    >
      <div className={`px-6 py-4 border-b ${darkMode ? 'border-slate-800 bg-slate-800/50' : 'border-gray-100 bg-gray-50'}`}>
        <h3 className={`text-lg font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          <span className="text-xl">📊</span> Performance Analysis
        </h3>
        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Comparison of Waiting Time and Turnaround Time for each job
        </p>
      </div>
      <div className="p-4">
        <canvas 
          id="analysis-chart-canvas"
          ref={canvasRef} 
          style={{ width: '100%', height: '350px' }}
          className="rounded-lg"
        />
      </div>
    </motion.div>
  );
};
