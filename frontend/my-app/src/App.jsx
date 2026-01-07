import React, { useState, useEffect } from 'react';

const StreamingAnalytics = () => {
  const [videos, setVideos] = useState([
    { id: 1, title: 'Tech Talk 2024', viewers: 1234, peakViewers: 2500, watchTime: 145, retention: 78 },
    { id: 2, title: 'Music Festival Live', viewers: 3421, peakViewers: 5600, watchTime: 320, retention: 85 },
    { id: 3, title: 'Gaming Stream', viewers: 892, peakViewers: 1200, watchTime: 89, retention: 72 },
  ]);
  
  const [systemStats, setSystemStats] = useState({
    totalViewers: 5547,
    activeStreams: 3,
    totalWatchTime: 554,
    avgRetention: 78.3
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setVideos(prev => prev.map(video => ({
        ...video,
        viewers: Math.max(100, video.viewers + Math.floor(Math.random() * 200 - 100)),
        watchTime: video.watchTime + Math.floor(Math.random() * 5)
      })));

      setSystemStats(prev => ({
        ...prev,
        totalViewers: Math.floor(Math.random() * 10000 + 5000),
        totalWatchTime: prev.totalWatchTime + Math.floor(Math.random() * 10)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      height: '100vh',
      background: '#0a0e27',
      color: '#fff',
      fontFamily: 'Arial, sans-serif',
      padding: 0,
      margin: 0,
      overflow: 'auto',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      {/* Top Navigation Bar */}
      <div style={{
        background: '#13172b',
        borderBottom: '1px solid #1e2338',
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            background: '#00ff88',
            borderRadius: '50%',
            boxShadow: '0 0 10px #00ff88'
          }}/>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'normal' }}>
            Stream Analytics v2.1
          </h1>
        </div>
        <div style={{ fontSize: '13px', color: '#6b7280' }}>
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '25px 30px' }}>
        
        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '18px',
          marginBottom: '25px'
        }}>
          <StatCard 
            value={systemStats.totalViewers.toLocaleString()} 
            label="TOTAL VIEWERS"
            color="#00ff88"
          />
          <StatCard 
            value={systemStats.activeStreams} 
            label="ACTIVE STREAMS"
            color="#ff6b9d"
          />
          <StatCard 
            value={systemStats.totalWatchTime} 
            label="TOTAL HOURS"
            color="#ffd93d"
          />
          <StatCard 
            value={`${systemStats.avgRetention}%`} 
            label="AVG RETENTION"
            color="#6c5ce7"
          />
        </div>

        {/* Streams Table */}
        <div style={{
          background: '#13172b',
          border: '1px solid #1e2338',
          borderRadius: '4px'
        }}>
          <div style={{
            padding: '18px 20px',
            borderBottom: '1px solid #1e2338',
            fontSize: '14px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ color: '#ff4444' }}>●</span>
            LIVE STREAMS
          </div>
          
          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr',
            padding: '12px 20px',
            fontSize: '11px',
            color: '#6b7280',
            borderBottom: '1px solid #1e2338',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            <div>Stream Name</div>
            <div>Live</div>
            <div>Peak</div>
            <div>Watch Time</div>
            <div>Retention</div>
            <div>Status</div>
          </div>

          {/* Table Rows */}
          {videos.map((video, idx) => (
            <div key={video.id} style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr',
              padding: '16px 20px',
              fontSize: '13px',
              borderBottom: idx < videos.length - 1 ? '1px solid #1e2338' : 'none',
              alignItems: 'center',
              transition: 'background 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#1a1f3a'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ fontWeight: '500' }}>{video.title}</div>
              <div style={{ color: '#00ff88' }}>{video.viewers.toLocaleString()}</div>
              <div style={{ color: '#8b92a8' }}>{video.peakViewers.toLocaleString()}</div>
              <div style={{ color: '#8b92a8' }}>{video.watchTime}m</div>
              <div>
                <span style={{
                  color: video.retention > 80 ? '#00ff88' : video.retention > 70 ? '#ffd93d' : '#ff6b9d'
                }}>
                  {video.retention}%
                </span>
              </div>
              <div>
                <span style={{
                  background: video.retention > 80 ? '#00ff8822' : video.retention > 70 ? '#ffd93d22' : '#ff6b9d22',
                  color: video.retention > 80 ? '#00ff88' : video.retention > 70 ? '#ffd93d' : '#ff6b9d',
                  padding: '4px 10px',
                  borderRadius: '3px',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  {video.retention > 80 ? 'EXCELLENT' : video.retention > 70 ? 'GOOD' : 'AVERAGE'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div style={{
          marginTop: '25px',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '18px'
        }}>
          {/* Viewer Activity Graph Placeholder */}
          <div style={{
            background: '#13172b',
            border: '1px solid #1e2338',
            borderRadius: '4px',
            padding: '20px'
          }}>
            <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '15px', color: '#8b92a8' }}>
              VIEWER ACTIVITY (LAST 24H)
            </div>
            <div style={{
              height: '120px',
              display: 'flex',
              alignItems: 'flex-end',
              gap: '8px',
              paddingTop: '10px'
            }}>
              {[45, 62, 38, 75, 52, 88, 95, 72, 58, 82, 68, 91, 76, 84, 69, 77].map((height, i) => (
                <div key={i} style={{
                  flex: 1,
                  background: 'linear-gradient(to top, #6c5ce7, #a29bfe)',
                  height: `${height}%`,
                  borderRadius: '2px 2px 0 0',
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(to top, #00ff88, #00ff88)'}
                onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(to top, #6c5ce7, #a29bfe)'}
                />
              ))}
            </div>
          </div>

          {/* System Info */}
          <div style={{
            background: '#13172b',
            border: '1px solid #1e2338',
            borderRadius: '4px',
            padding: '20px'
          }}>
            <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '15px', color: '#8b92a8' }}>
              SYSTEM STATUS
            </div>
            <div style={{ fontSize: '12px', lineHeight: '2.2', color: '#6b7280' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>API Server</span>
                <span style={{ color: '#00ff88' }}>● Online</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>WebSocket</span>
                <span style={{ color: '#00ff88' }}>● Connected</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Database</span>
                <span style={{ color: '#00ff88' }}>● Healthy</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Cache</span>
                <span style={{ color: '#00ff88' }}>● Active</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #1e2338', marginTop: '10px' }}>
                <span>Uptime</span>
                <span style={{ color: '#fff' }}>47d 12h 34m</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack Footer */}
        <div style={{
          marginTop: '25px',
          padding: '18px 20px',
          background: '#13172b',
          border: '1px solid #1e2338',
          borderRadius: '4px',
          fontSize: '11px',
          color: '#6b7280',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            Stack: Node.js • Python • WebSocket • PostgreSQL • Redis • Docker
          </div>
          <div>
            Built for FanTV Analytics Platform
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ value, label, color }) => (
  <div style={{
    background: '#13172b',
    border: '1px solid #1e2338',
    borderRadius: '4px',
    padding: '20px',
    transition: 'border-color 0.2s'
  }}
  onMouseEnter={e => e.currentTarget.style.borderColor = color}
  onMouseLeave={e => e.currentTarget.style.borderColor = '#1e2338'}
  >
    <div style={{
      fontSize: '28px',
      fontWeight: 'bold',
      color: color,
      marginBottom: '8px',
      fontFamily: 'monospace'
    }}>
      {value}
    </div>
    <div style={{
      fontSize: '11px',
      color: '#6b7280',
      letterSpacing: '0.5px'
    }}>
      {label}
    </div>
  </div>
);

export default StreamingAnalytics;