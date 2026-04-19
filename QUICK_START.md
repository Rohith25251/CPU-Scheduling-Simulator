# Quick Start Guide - CPU Scheduling Simulator

## 🚀 5-Minute Quick Start

### 1. Start the Application
```bash
npm run dev
```
Open browser to http://localhost:5173/

### 2. Add Your First Jobs
- Click "Load Simple" preset to add sample jobs
- Or manually enter job details:
  - **Name**: Job name (e.g., P1, P2)
  - **Arrival Time**: When job enters the system (e.g., 0, 1, 2)
  - **Burst Time**: CPU time needed (e.g., 5, 8, 10)
  - **Priority**: Priority level (1=highest, lower number=higher priority)

### 3. Run Simulation
- Click "Run Simulation" button
- Results are calculated instantly for all 6 algorithms

### 4. View Results
- Gantt Chart shows job execution timeline
- Metrics Dashboard shows performance statistics
- Comparison Table shows side-by-side algorithm comparison

### 5. Export Results (Optional)
- Click CSV or JSON download buttons in header
- Save results for analysis or sharing

---

## 💡 Quick Tips

### Best Practices

**For Learning:**
1. Start with Simple preset to understand basics
2. Try Complex preset for realistic scenarios
3. Compare algorithms side-by-side
4. Read Scheduling Context panel for explanations

**For Analysis:**
1. Add jobs one by one and observe changes
2. Use Random generator for bulk testing
3. Compare metrics across algorithms
4. Look for starvation alerts (red warnings)

**For Teaching:**
1. Use presets for consistent demonstrations
2. Explain why certain algorithms perform better
3. Show trade-offs (fairness vs efficiency)
4. Export results for student analysis

### Keyboard Shortcuts
- None currently, but consider these workflows:
  - Use Tab to navigate form fields
  - Enter to submit form
  - Space to toggle dark mode

---

## 🎯 Common Scenarios

### Scenario 1: Understanding FCFS vs SJF
```
Jobs:
- P1: Arrival 0, Burst 20, Priority 1
- P2: Arrival 1, Burst 5, Priority 1
- P3: Arrival 2, Burst 5, Priority 1

FCFS: P1 runs 0-20, P2 0-25, P3 0-30 (high avg wait)
SJF: P1 0-20, P2 20-25, P3 25-30 (lower avg wait)
```

### Scenario 2: Starvation in Priority Scheduling
```
Jobs:
- High Priority: Arrival 0, Burst 5
- Low Priority: Arrival 0, Burst 100
- High Priority: Arrival 5, Burst 5 (keeps arriving)

NPP: Low priority job starves
PP: Low priority job completes faster
```

### Scenario 3: Round Robin Fairness
```
Jobs: Same burst time, all arrival 0
All algorithms should show Round Robin provides fairness
(all jobs get equal CPU time)
```

---

## 🎨 UI Guide

### Header Section
- **Title & Logo**: Application branding
- **CSV Export**: Download metrics as CSV
- **JSON Export**: Download as JSON
- **JSON Import**: Load previously saved simulation
- **Dark Mode Toggle**: Switch theme

### Left Panel
- **Job Configuration**: Add/manage jobs
- **Sample Presets**: Load predefined job sets
- **Algorithm Selector**: Choose algorithm to view

### Right Panel
- **Gantt Chart**: Visual timeline of execution
- **Metrics Dashboard**: Numerical performance data
- **Context Panel**: Detailed explanations

### Bottom Section
- **Comparison Table**: All algorithms compared
- **Empty State**: Instructions when no jobs added

---

## 📊 Understanding Metrics

### Waiting Time
- **What**: Time job waits before first execution
- **Lower is**: Better
- **Formula**: StartTime - ArrivalTime

### Turnaround Time  
- **What**: Total time from arrival to completion
- **Lower is**: Better
- **Formula**: CompletionTime - ArrivalTime

### Response Time
- **What**: Time from arrival to first execution
- **Lower is**: Better (especially for interactive systems)
- **Formula**: FirstStartTime - ArrivalTime

### CPU Utilization
- **What**: Percentage of time CPU is busy
- **Higher is**: Better
- **Formula**: (TotalBurstTime / CompletionTime) × 100

### Throughput
- **What**: Number of jobs completed per unit time
- **Higher is**: Better
- **Formula**: NumberOfJobs / CompletionTime

### Standard Deviation
- **What**: Fairness measure of waiting times
- **Lower is**: Better (more fair)
- **Interpretation**: 0 = perfect fairness

### Starvation Detection
- **What**: Alert if max wait > 10× average wait
- **Status**: "Fair" or "Starvation"
- **Action**: Consider preemption or priority changes

---

## 🔧 Advanced Usage

### Customizing Time Quantum (Round Robin)
1. Set "Time Quantum" value in controls (default: 4)
2. Smaller quantum: More context switches, more responsive
3. Larger quantum: Fewer switches, more efficient

### Importing Previous Simulations
1. Export simulation as JSON
2. Load file later using Import button
3. All jobs and settings restored

### Analyzing Algorithm Performance
1. Run simulation with specific job set
2. Compare metrics across algorithms
3. Export results for spreadsheet analysis
4. Identify best algorithm for scenario

---

## 🐛 Troubleshooting

### Problem: Application won't load
**Solution**: 
- Clear browser cache
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Try different browser
- Check console for errors (F12)

### Problem: Dark mode not working
**Solution**:
- Check browser supports CSS custom properties
- Clear localStorage
- Ensure cookies/storage enabled

### Problem: Export button not working
**Solution**:
- Check pop-up blocker settings
- Verify browser allows downloads
- Try different export format
- Check free disk space

### Problem: Algorithm comparison not showing
**Solution**:
- Ensure simulation has run
- Check at least one algorithm has results
- Scroll down to see comparison table
- Refresh page if needed

---

## 📱 Mobile Tips

### Portrait Mode
- Single column layout
- Scroll vertically for all content
- Touch-friendly button sizes
- Readable chart on small screens

### Landscape Mode
- Two-column layout if space allows
- Better for viewing Gantt chart
- Easier to see comparison table

### Best Practices
- Use presets for faster job entry
- Export results for later desktop analysis
- Dark mode reduces eye strain
- Zoom browser if text too small

---

## 🔗 External Resources

### Learning Materials
- [Operating Systems: Three Easy Pieces - CPU Scheduling](https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-sched.pdf)
- [Wikipedia: Scheduling (Computing)](https://en.wikipedia.org/wiki/Scheduling_(computing))
- [Linux Kernel Development](https://www.oreilly.com/library/view/linux-kernel-development/9780134670231/)

### Similar Tools
- [OS Simulator by UMass](https://github.com/remzi-arpaci-dusseau/ostep-projects)
- [CPUSim - CPU Simulation](https://www.cs.wisc.edu/~larus/cpusim.html)
- [SPICE - Scheduling Paradigm for Interactive Computer Environments](https://github.com/remzi-arpaci-dusseau/SPICE)

---

## 🎓 Teaching Assignments

### Assignment 1: Algorithm Comparison
**Objective**: Compare all algorithms with same job set
**Steps**:
1. Load "Complex" preset
2. Run simulation
3. Export comparison table
4. Analyze which algorithm performs best
5. Write summary of findings

### Assignment 2: Fairness Analysis
**Objective**: Identify starvation scenarios
**Steps**:
1. Create job set with priority imbalance
2. Run both NPP and PP
3. Observe starvation alerts
4. Explain why PP prevents starvation
5. Adjust priorities and retry

### Assignment 3: Round Robin Analysis
**Objective**: Understand time quantum impact
**Steps**:
1. Create job set with 3-4 similar burst times
2. Try time quantums: 1, 2, 4, 8
3. Compare context switches
4. Analyze waiting times
5. Find optimal time quantum

---

## 💬 Need Help?

### Documentation
- README.md - Full feature documentation
- PROJECT_SUMMARY.md - Technical details
- This file - Quick reference

### Common Questions

**Q: Which algorithm is best?**
A: Depends on scenario. FCFS is simple but unfair. SJF minimizes wait but can starve. Round Robin is fair. Priority based on job importance.

**Q: What does starvation mean?**
A: Low priority jobs never get to run because high priority jobs keep arriving.

**Q: How is CPU utilization calculated?**
A: Total time jobs spend running / Total time until completion.

**Q: Can I add jobs while simulation is running?**
A: No, add jobs first, then run simulation. Click Reset to start over.

**Q: Why are there 6 algorithms?**
A: Shows different approaches: simple (FCFS), efficient (SJF), fair (RR), priority-based (NPP/PP).

---

## ✨ Features at a Glance

| Feature | Status | Details |
|---------|--------|---------|
| 6 Algorithms | ✅ | FCFS, SJF, SRTF, RR, NPP, PP |
| Gantt Chart | ✅ | Interactive, zoomable, with tooltips |
| Metrics | ✅ | 10+ performance metrics |
| Comparison | ✅ | Side-by-side algorithm comparison |
| Export | ✅ | CSV & JSON formats |
| Import | ✅ | Restore previous simulations |
| Dark Mode | ✅ | Full theme support |
| Mobile | ✅ | Fully responsive design |
| Animations | ✅ | Smooth Framer Motion |
| Offline | ✅ | Works without internet |

---

## 🚀 Next Steps

1. **Explore the UI**: Click around to get familiar with layout
2. **Try a Preset**: Load Simple, Complex, or Competitive
3. **Run Simulation**: Click Run Simulation button
4. **Compare Algorithms**: Check comparison table
5. **Export Results**: Save findings as CSV/JSON
6. **Read Documentation**: Deep dive in README.md

---

**CPU Scheduling Simulator - Get Started Today!**

For detailed information, see:
- README.md (comprehensive guide)
- PROJECT_SUMMARY.md (technical details)
- Source code (well-commented)
