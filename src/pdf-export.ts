import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import type { Job, SchedulingResult } from './types';

const pdfMakeInstance = (pdfMake as any).default || pdfMake;
const globalFonts = (pdfFonts as any).default || pdfFonts;

// Initialize VFS
if (globalFonts.pdfMake?.vfs) {
  pdfMakeInstance.vfs = globalFonts.pdfMake.vfs;
} else if (globalFonts.vfs) {
  pdfMakeInstance.vfs = globalFonts.vfs;
} else if (pdfMakeInstance.vfs) {
  // Already set or default
}

export function generatePDFReport(
  jobs: Job[],
  results: Record<string, SchedulingResult>,
  timeQuantum: number = 4
): void {
  try {
    // Prepare document content
    const docContent: any[] = [];

    // Header
    docContent.push({
      text: 'CPU Scheduling Simulator Report',
      fontSize: 24,
      bold: true,
      color: '#1e3a8a',
      margin: [0, 0, 0, 10],
    });

    docContent.push({
      text: `Generated on ${new Date().toLocaleString()}`,
      fontSize: 10,
      color: '#666666',
      margin: [0, 0, 0, 20],
    });

    // ... (rest of the report content generation - same as before) ...
    // Note: I will include the full content to ensure it's correct.
    
    // Jobs Section
    docContent.push({
      text: 'Input Jobs',
      fontSize: 16,
      bold: true,
      color: '#1e3a8a',
      margin: [0, 20, 0, 10],
    });

    if (jobs.length > 0) {
      const jobsTable = [
        [
          { text: 'Job Name', bold: true, color: 'white', fillColor: '#1e3a8a' },
          { text: 'Arrival Time', bold: true, color: 'white', fillColor: '#1e3a8a' },
          { text: 'Burst Time', bold: true, color: 'white', fillColor: '#1e3a8a' },
          { text: 'Priority', bold: true, color: 'white', fillColor: '#1e3a8a' },
        ],
        ...jobs.map((job) => [
          job.name,
          job.arrivalTime.toString(),
          job.burstTime.toString(),
          job.priority.toString(),
        ]),
      ];

      docContent.push({
        table: {
          headerRows: 1,
          widths: ['25%', '25%', '25%', '25%'],
          body: jobsTable,
        },
        margin: [0, 0, 0, 20],
      });
    }

    // Algorithm Results Section
    docContent.push({
      text: 'Scheduling Results',
      fontSize: 16,
      bold: true,
      color: '#1e3a8a',
      margin: [0, 20, 0, 10],
    });

    if (Object.keys(results).length > 0) {
      Object.entries(results).forEach(([algorithm, result]) => {
        // Algorithm heading
        docContent.push({
          text: algorithm,
          fontSize: 13,
          bold: true,
          color: '#059669',
          margin: [0, 15, 0, 8],
        });

        // Metrics table
        const metricsTable = [
          [
            { text: 'Metric', bold: true, fillColor: '#f0fdf4' },
            { text: 'Value', bold: true, fillColor: '#f0fdf4' },
          ],
          ['Average Waiting Time', `${result.averageWaitingTime.toFixed(2)} ms`],
          ['Average Turnaround Time', `${result.averageTurnaroundTime.toFixed(2)} ms`],
          ['Average Response Time', `${result.averageResponseTime.toFixed(2)} ms`],
          ['CPU Utilization', `${result.cpuUtilization.toFixed(2)}%`],
          ['Throughput', `${result.throughput.toFixed(4)} jobs/ms`],
          ['Context Switches', result.contextSwitches.toString()],
          ['Completion Time', `${result.completionTime} ms`],
          ['Standard Deviation', result.fairnessIndicators.standardDeviation.toFixed(2)],
          [
            'Starvation Detected',
            result.fairnessIndicators.starvationDetected ? 'Yes (⚠️)' : 'No ✓',
          ],
        ];

        docContent.push({
          table: {
            headerRows: 1,
            widths: ['50%', '50%'],
            body: metricsTable,
          },
          margin: [0, 0, 0, 15],
        });

        // Job Details
        if (result.jobs.length > 0) {
          docContent.push({
            text: 'Job Execution Details',
            fontSize: 11,
            bold: true,
            color: '#1e3a8a',
            margin: [0, 10, 0, 5],
          });

          const jobDetails = [
            [
              { text: 'Job', bold: true, fillColor: '#dbeafe' },
              { text: 'Start', bold: true, fillColor: '#dbeafe' },
              { text: 'End', bold: true, fillColor: '#dbeafe' },
              { text: 'Wait', bold: true, fillColor: '#dbeafe' },
              { text: 'Turnaround', bold: true, fillColor: '#dbeafe' },
            ],
            ...result.jobs.map((job) => [
              job.job.name,
              job.startTime.toString(),
              job.endTime.toString(),
              job.waitingTime.toFixed(2),
              job.turnaroundTime.toFixed(2),
            ]),
          ];

          docContent.push({
            table: {
              headerRows: 1,
              widths: ['20%', '20%', '20%', '20%', '20%'],
              body: jobDetails,
            },
            margin: [0, 0, 0, 20],
            fontSize: 9,
          });
        }
      });
    }

    // Configuration Section
    docContent.push({
      text: 'Configuration',
      fontSize: 14,
      bold: true,
      color: '#1e3a8a',
      margin: [0, 20, 0, 10],
    });

    docContent.push({
      table: {
        body: [
          ['Total Jobs', jobs.length.toString()],
          ['Time Quantum (RR)', `${timeQuantum} ms`],
          ['Report Date', new Date().toLocaleDateString()],
        ],
        widths: ['50%', '50%'],
      },
      margin: [0, 0, 0, 20],
    });

    // Footer
    docContent.push({
      text: '© 2026 CPU Scheduling Simulator - Educational Tool',
      fontSize: 9,
      color: '#999999',
      alignment: 'center',
      margin: [0, 20, 0, 0],
    });

    // Create PDF
    const docDefinition = {
      content: docContent,
      defaultStyle: {
        font: 'Roboto',
        fontSize: 11,
        color: '#333333',
      },
    };

    pdfMakeInstance.createPdf(docDefinition).download('cpu-scheduling-report.pdf');
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF report. Please try again.');
  }
}
