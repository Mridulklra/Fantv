// ============================================
// IMPORTS & SETUP
// ============================================

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Express app
const app = express();
const server = http.createServer(app);

// WebSocket server for real-time updates
const wss = new WebSocket.Server({ server });

// ============================================
// MIDDLEWARE
// ============================================

app.use(cors()); // allow frontend requests
app.use(express.json()); // parse JSON body

// ============================================
// TEMP DATABASE (DEMO PURPOSE)
// ============================================

// Using in-memory data for demo
let videosDatabase = [
  {
    id: 1,
    title: 'Tech Talk 2024',
    viewers: 1234,
    peakViewers: 2500,
    watchTime: 145,
    retention: 78,
    startedAt: new Date(),
    streamKey: 'stream_tech_2024'
  },
  {
    id: 2,
    title: 'Music Festival Live',
    viewers: 3421,
    peakViewers: 5600,
    watchTime: 320,
    retention: 85,
    startedAt: new Date(),
    streamKey: 'stream_music_fest'
  },
  {
    id: 3,
    title: 'Gaming Stream',
    viewers: 892,
    peakViewers: 1200,
    watchTime: 89,
    retention: 72,
    startedAt: new Date(),
    streamKey: 'stream_gaming_01'
  }
];

// ============================================
// CACHE (REDIS SIMULATION)
// ============================================

// Simple cache using Map
const cache = new Map();

function getCached(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < 300000) {
    return cached.data;
  }
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

// ============================================
// REST API ROUTES
// ============================================

// Get all videos
app.get('/api/videos', (req, res) => {
  const cached = getCached('all_videos');
  if (cached) {
    return res.json(cached);
  }

  // simulate DB delay
  setTimeout(() => {
    setCache('all_videos', videosDatabase);
    res.json(videosDatabase);
  }, 100);
});

// Get single video by id
app.get('/api/videos/:id', (req, res) => {
  const videoId = parseInt(req.params.id);
  const video = videosDatabase.find(v => v.id === videoId);

  if (!video) {
    return res.status(404).json({ error: 'Video not found' });
  }

  res.json(video);
});

// Create new stream (protected route)
app.post('/api/videos', authenticateToken, (req, res) => {
  const { title, streamKey } = req.body;

  const newVideo = {
    id: videosDatabase.length + 1,
    title,
    streamKey,
    viewers: 0,
    peakViewers: 0,
    watchTime: 0,
    retention: 0,
    startedAt: new Date()
  };

  videosDatabase.push(newVideo);

  // clear cache after update
  cache.delete('all_videos');

  // notify clients
  broadcastToClients({ type: 'NEW_STREAM', video: newVideo });

  res.status(201).json(newVideo);
});

// Login route (JWT)
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  // dummy auth check
  if (username === 'admin' && password === 'admin123') {
    const token = jwt.sign(
      { username, role: 'admin' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({ token, username });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Get overall stats
app.get('/api/stats', (req, res) => {
  const stats = {
    totalViewers: videosDatabase.reduce((sum, v) => sum + v.viewers, 0),
    activeStreams: videosDatabase.length,
    totalWatchTime: videosDatabase.reduce((sum, v) => sum + v.watchTime, 0),
    avgRetention:
      videosDatabase.reduce((sum, v) => sum + v.retention, 0) /
      videosDatabase.length
  };

  res.json(stats);
});

// ============================================
// AUTH MIDDLEWARE
// ============================================

// JWT verification
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || 'your-secret-key',
    (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid token' });
      }
      req.user = user;
      next();
    }
  );
}

// ============================================
// WEBSOCKET HANDLING
// ============================================

wss.on('connection', (ws) => {
  console.log('Client connected');

  // send initial data
  ws.send(
    JSON.stringify({
      type: 'INITIAL_DATA',
      videos: videosDatabase
    })
  );

  ws.on('message', (message) => {
    console.log('Message received:', message.toString());
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Send data to all clients
function broadcastToClients(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// ============================================
// FAKE REAL-TIME UPDATES
// ============================================

// Simulate viewer changes
setInterval(() => {
  videosDatabase = videosDatabase.map((video) => {
    const change = Math.floor(Math.random() * 200 - 100);
    const newViewers = Math.max(50, video.viewers + change);

    return {
      ...video,
      viewers: newViewers,
      peakViewers: Math.max(video.peakViewers, newViewers),
      watchTime: video.watchTime + Math.floor(Math.random() * 5)
    };
  });

  // clear cache after update
  cache.delete('all_videos');

  // push updates to clients
  broadcastToClients({
    type: 'VIEWER_UPDATE',
    videos: videosDatabase
  });
}, 3000);

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
