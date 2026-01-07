# 🎬 FanTV – Streaming Analytics Platform

FanTV is a full-stack streaming analytics platform that provides real-time viewer insights,
video statistics, and engagement analytics for live streams.

The system uses a React frontend, a Node.js real-time backend, and a Python (FastAPI)
analytics engine.

---

## 🧩 Architecture

React Frontend  
↓  
Node.js API + WebSockets (Real-time updates)  
↓  
Python FastAPI Analytics Engine

---

## 📁 Project Structure

Fantv/
├── frontend/                     # React application  
├── streaming-analytics/  
│   ├── backend-nodejs/           # Node.js + WebSocket server  
│   └── analytics-python/         # FastAPI analytics service  

---

## 🚀 Features

- Real-time viewer updates using WebSockets  
- Video and stream statistics APIs  
- JWT-based authentication  
- In-memory caching (Redis-like)  
- Viewer engagement & retention analytics  
- Background and batch analytics processing  

---

## 🛠 Tech Stack

Frontend:
- React
- JavaScript

Backend:
- Node.js
- Express
- WebSocket
- JWT

Analytics:
- Python
- FastAPI
- Pandas
- NumPy

---

## ▶️ Running the Project

### Frontend
```bash
cd frontend
npm install
npm start
