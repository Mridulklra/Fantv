# ============================================
# IMPORTS & BASIC SETUP
# ============================================

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import pandas as pd
import numpy as np
from datetime import datetime
import asyncio

# Creating FastAPI app
app = FastAPI(title="FanTV Analytics Engine")

# Allow frontend to access backend (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# DATA MODELS
# ============================================

# Model for analytics response
class VideoAnalytics(BaseModel):
    video_id: int
    title: str
    avg_watch_time: float
    retention_rate: float
    engagement_score: float
    viewer_demographics: dict
    peak_hour: str

# Model for viewer events
class ViewerEvent(BaseModel):
    video_id: int
    user_id: str
    action: str  # join / leave / interact
    timestamp: datetime

# ============================================
# TEMP DATA STORAGE
# ============================================

# Store analytics results temporarily
analytics_cache = {}

# Store all viewer events
viewer_events = []

# ============================================
# API ROUTES
# ============================================

@app.get("/")
def root():
    return {
        "service": "FanTV Analytics Engine",
        "version": "1.0",
        "status": "running"
    }

# Get analytics for a specific video
@app.get("/analytics/video/{video_id}")
async def get_video_analytics(video_id: int):

    # Filter events related to this video
    video_events = [e for e in viewer_events if e.video_id == video_id]

    # If no data exists, return empty analytics
    if not video_events:
        return VideoAnalytics(
            video_id=video_id,
            title=f"Video {video_id}",
            avg_watch_time=0.0,
            retention_rate=0.0,
            engagement_score=0.0,
            viewer_demographics={},
            peak_hour="N/A"
        )

    # Convert events to DataFrame
    df = pd.DataFrame([e.dict() for e in video_events])

    # Calculate metrics
    avg_watch_time = calculate_avg_watch_time(df)
    retention_rate = calculate_retention(df)
    engagement_score = calculate_engagement(df)

    # Find peak viewing hour
    df['hour'] = pd.to_datetime(df['timestamp']).dt.hour
    peak_hour = df.groupby('hour').size().idxmax()

    # Dummy demographics data
    demographics = {
        "age_18_24": 25,
        "age_25_34": 40,
        "age_35_44": 20,
        "age_45_plus": 15
    }

    result = VideoAnalytics(
        video_id=video_id,
        title=f"Video {video_id}",
        avg_watch_time=avg_watch_time,
        retention_rate=retention_rate,
        engagement_score=engagement_score,
        viewer_demographics=demographics,
        peak_hour=f"{peak_hour}:00"
    )

    # Cache the result
    analytics_cache[video_id] = result

    return result

# ============================================
# EVENT TRACKING
# ============================================

@app.post("/events/track")
async def track_viewer_event(event: ViewerEvent, background_tasks: BackgroundTasks):

    # Save event
    viewer_events.append(event)

    # Process event in background
    background_tasks.add_task(process_event, event)

    return {"status": "event saved", "event_id": len(viewer_events)}

async def process_event(event: ViewerEvent):
    # Simulate background processing
    print(f"Processing {event.action} for video {event.video_id}")
    await asyncio.sleep(0.1)
    print("Event processed")

# ============================================
# BATCH PROCESSING
# ============================================

@app.post("/analytics/batch/process")
async def run_batch_analytics():

    print("Starting batch analytics job")

    total_videos = 100
    for _ in range(total_videos):
        await asyncio.sleep(0.01)

    print("Batch analytics completed")

    return {
        "status": "completed",
        "videos_processed": total_videos,
        "timestamp": datetime.now()
    }

# ============================================
# HELPER FUNCTIONS
# ============================================

def calculate_avg_watch_time(df: pd.DataFrame) -> float:
    # Return random value for demo
    return float(np.random.uniform(120, 300))

def calculate_retention(df: pd.DataFrame) -> float:
    # Return random retention %
    return float(np.random.uniform(60, 90))

def calculate_engagement(df: pd.DataFrame) -> float:
    # Return random engagement score
    return float(np.random.uniform(70, 95))

# ============================================
# STARTUP & SHUTDOWN
# ============================================

@app.on_event("startup")
async def startup_event():
    print("Server started")

@app.on_event("shutdown")
async def shutdown_event():
    print("Server stopped")

# ============================================
# RUN SERVER
# ============================================

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
