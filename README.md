🎬 FanTV – Streaming Analytics Platform

FanTV is a full-stack streaming analytics platform that provides real-time viewer insights, video statistics, and engagement analytics for live streams.

The system is built using a React frontend, a Node.js real-time backend, and a Python (FastAPI) analytics engine.

🧩 Architecture Overview
React Frontend
      ↓
Node.js API + WebSocket (Real-time stats)
      ↓
Python FastAPI Analytics Engine

📁 Project Structure
Fantv/
├── frontend/                     # React application
├── streaming-analytics/
│   ├── backend-nodejs/           # Node.js + WebSocket server
│   └── analytics-python/         # FastAPI analytics service

🚀 Features

📊 Real-time viewer updates via WebSockets

🎥 Video & stream statistics API

🔐 JWT-based authentication (Node.js backend)

⚡ Caching layer (in-memory, Redis-like)

📈 Advanced analytics (retention, engagement, peak hours)

🔄 Background & batch processing (FastAPI)

🛠 Tech Stack

Frontend

React

REST + WebSocket integration

Backend

Node.js

Express

WebSocket

JWT Authentication

Analytics

Python

FastAPI

Pandas & NumPy

Background tasks & batch jobs

▶️ Running the Project
1️⃣ Frontend
cd frontend
npm install
npm start

2️⃣ Node.js Backend (Real-time API)
cd streaming-analytics/backend-nodejs
npm install
npm run dev


Runs on: http://localhost:5000

3️⃣ Python Analytics Engine
cd streaming-analytics/analytics-python
python -m venv venv
pip install -r requirements.txt
python main.py


Runs on: http://localhost:8000

📡 API Overview

Node.js

GET /api/videos

POST /api/videos (JWT protected)

POST /api/auth/login

GET /api/stats

WebSocket real-time viewer updates

FastAPI

GET /analytics/video/{id}

POST /events/track

POST /analytics/batch/process
