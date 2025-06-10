# 🌍 Live Linux System & Environmental Impact Monitor

This open-source project lets you monitor **real-time system resource usage** along with the **environmental footprint** of each running process on a Linux machine.

It tracks not only CPU, memory, and runtime — but also estimates:
- ⚡ **Power consumption (W)**
- 🌫️ **CO₂ emissions (kg)**
- 💧 **Water usage (liters)**

## 🎯 Purpose

Modern software is fast, efficient — but rarely *aware* of its **environmental cost**. This project aims to help developers, researchers, and sustainability advocates **visualize** the climate impact of software processes.

## 🧰 Tech Stack

| Layer      | Tool           |
|------------|----------------|
| Backend    | Python, Flask, psutil |
| Frontend   | React.js       |
| Data flow  | Server-Sent Events (SSE) |
| Estimations | Custom emission calculations (based on power use) |

## 🚀 Features

- Per-process live monitoring: PID, user, command, CPU %, memory usage
- Estimated power draw (W)
- Real-time CO₂ and water emission metrics
- Process runtime (seconds)
- Clean and responsive web UI
- Open-source and easily extensible

## ⚙️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/system-monitor-co2.git
cd system-monitor-co2
