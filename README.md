# CPU Scheduling Simulator

A production-ready, interactive web application for visualizing and analyzing CPU scheduling algorithms. Built with React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, and Zustand.

## 🎯 Features

### Core Functionality
- **6 Scheduling Algorithms**
  - FCFS (First Come First Served)
  - SJF (Shortest Job First)
  - SRTF (Shortest Remaining Time First)
  - Round Robin with configurable time quantum
  - NPP (Priority Non-preemptive)
  - PP (Priority Preemptive)

### Visualization
- **Interactive Gantt Chart** with HTML5 Canvas
  - Hover tooltips showing job details
  - Zoom and pan capabilities
  - Smooth animations with Framer Motion
  - Color-coded job bars
  - Timeline with time markers

### Metrics & Analysis
- **Comprehensive Performance Dashboard**
  - Average Waiting Time
  - Average Turnaround Time
  - Average Response Time
  - CPU Utilization (%)
  - Throughput (jobs/ms)
  - Context Switches Count

- **Fairness Indicators**
  - Standard Deviation of waiting times
  - Min/Max Waiting Times
  - Starvation Detection
  - Alerts for fairness issues

### Comparison & Analysis
- **Algorithm Comparison View** showing side-by-side metrics for all algorithms
- **Scheduling Context Panel** with detailed explanations of scheduling decisions
- **Step-by-step job execution details** with arrival, burst, waiting, and turnaround times

### Data Management
- **Job Configuration**
  - Dynamic job input table with add/remove/duplicate functionality
  - Input validation with error messages
  - Sample presets (Simple, Complex, Competitive)
  - Random data generator

- **Import/Export**
  - Export results to CSV for spreadsheet analysis
  - Export results to JSON for sharing and storage
  - Import previously saved simulations
  - LocalStorage persistence

### User Experience
- **Dark Mode Toggle** with automatic persistence
- **Fully Responsive Design** optimized for mobile devices
- **University Theme** with blue and amber colors
- **Smooth Animations** powered by Framer Motion
- **Professional UI** with Lucide React icons

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development
The application runs on `http://localhost:5173` by default. Changes to source files will hot-reload automatically.

## 📊 How to Use

### 1. Add Jobs
- Enter job details (Name, Arrival Time, Burst Time, Priority)
- Click "Add Job" or load a preset (Simple, Complex, Competitive)
- Or generate random jobs
- View jobs in the table below

### 2. Configure Settings
- Adjust "Time Quantum" for Round Robin algorithm (if needed)
- Time quantum controls the time slice each job gets per turn

### 3. Run Simulation
- Click "Run Simulation" to execute all algorithms
- Results are computed instantly

### 4. Analyze Results
- View Gantt Chart for the selected algorithm
- Inspect detailed metrics in the Performance Metrics panel
- Read explanations in the Scheduling Context panel
- Compare algorithms in the comparison table

### 5. Export/Save
- Export to CSV for further analysis
- Export to JSON for sharing simulations
- Import previously saved simulations
- All jobs are auto-saved to browser storage

## 🏗️ Project Structure

```
src/
├── components/
│   ├── App.tsx                 # Main application component
│   ├── Header.tsx              # Header with theme toggle & export
│   ├── JobInput.tsx            # Job configuration interface
│   ├── GanttChart.tsx          # Canvas-based Gantt chart
│   ├── MetricsDashboard.tsx    # Performance metrics display
│   ├── AlgorithmSelector.tsx   # Algorithm selection & comparison
│   ├── ContextPanel.tsx        # Detailed explanations & job details
│   └── index.ts                # Component exports
├── algorithms.ts               # All 6 scheduling algorithm implementations
├── store.ts                    # Zustand store for state management
├── types.ts                    # TypeScript interfaces & types
├── utils.ts                    # Utility functions & helpers
├── main.tsx                    # React entry point
├── index.css                   # Tailwind CSS & custom styles
└── vite-env.d.ts              # Vite environment types

public/
└── index.html                  # HTML template

tailwind.config.js              # Tailwind CSS configuration
postcss.config.js               # PostCSS configuration
tsconfig.json                   # TypeScript configuration
vite.config.ts                  # Vite configuration
package.json                    # Dependencies & scripts
```

## 💻 Tech Stack

- **React 18.x** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS 4.x** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons
- **PapaParse** - CSV parsing & export
- **date-fns** - Date utilities

## 🎨 Styling & Theme

The application features a professional university-inspired theme with:
- **Primary Color**: Slate Blue (professional, neutral)
- **Accent Color**: Amber (warm, attention-grabbing)
- **Dark Mode**: Full support with CSS variables
- **Responsive Grid**: Mobile-first design approach

## 📈 Algorithm Explanations

### FCFS (First Come First Served)
Non-preemptive algorithm that executes jobs in arrival order. Simple but can suffer from the convoy effect.

### SJF (Shortest Job First)
Non-preemptive algorithm that always executes the shortest available job. Minimizes average waiting time but may cause starvation.

### SRTF (Shortest Remaining Time First)
Preemptive version of SJF. If a shorter job arrives, it preempts the current longer job.

### Round Robin (RR)
Preemptive algorithm with fixed time quantum. Each job gets a time slice and returns to queue if not finished.

### NPP (Priority Non-preemptive)
Schedules jobs by priority level. Once started, a job runs to completion regardless of priority changes.

### PP (Priority Preemptive)
Preemptive priority scheduling. Higher priority jobs interrupt lower priority ones immediately.

## 🔧 State Management

The application uses Zustand for state management:

```typescript
// Available state & actions
{
  // State
  jobs: Job[]
  selectedAlgorithm: SchedulingAlgorithm
  results: Map<SchedulingAlgorithm, SchedulingResult>
  darkMode: boolean
  animationEnabled: boolean
  timeQuantum: number
  
  // Actions
  addJob()
  removeJob()
  setJobs()
  clearJobs()
  setSelectedAlgorithm()
  setResults()
  toggleDarkMode()
  toggleAnimation()
  setTimeQuantum()
  loadFromLocalStorage()
  saveToLocalStorage()
}
```

## 📊 Data Structures

### Job
```typescript
interface Job {
  id: string
  name: string
  arrivalTime: number
  burstTime: number
  priority: number
}
```

### ScheduledJob
```typescript
interface ScheduledJob {
  job: Job
  startTime: number
  endTime: number
  responseTime: number
  waitingTime: number
  turnaroundTime: number
}
```

### SchedulingResult
```typescript
interface SchedulingResult {
  jobs: ScheduledJob[]
  completionTime: number
  averageWaitingTime: number
  averageTurnaroundTime: number
  averageResponseTime: number
  cpuUtilization: number
  throughput: number
  contextSwitches: number
  fairnessIndicators: {
    standardDeviation: number
    minWaitingTime: number
    maxWaitingTime: number
    starvationDetected: boolean
  }
}
```

## 🔒 LocalStorage

The application automatically persists:
- All added jobs
- User preference (dark mode, animation state)
- Time quantum setting
- Simulation results (in session)

## 📱 Responsive Design

The application is fully responsive and optimized for:
- 📱 Mobile phones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1280px+)

## 🎓 Educational Value

This simulator is perfect for:
- Computer Science Students learning OS scheduling
- Educators demonstrating scheduling concepts
- Researchers comparing algorithm performance
- Developers understanding CPU scheduling internals

## 🐛 Error Handling

The application includes:
- Input validation for all job parameters
- User-friendly error messages
- Graceful handling of edge cases
- Type-safe error boundaries

## ⚡ Performance Optimizations

- Canvas-based Gantt chart for efficient rendering
- Memoized components with React.FC
- Efficient Zustand selectors
- Lazy evaluation of algorithm results
- Optimized animations with Framer Motion

## 📄 Browser Support

- Chrome/Chromium (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## 📝 License

Educational software - Free to use for learning and teaching purposes.

---

**CPU Scheduling Simulator v1.0**  
Built with ❤️ for Computer Science Education

import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
