import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Code, Database, Globe } from 'lucide-react';

const CodingStats = () => {
  // Simulating WakaTime / GitHub language distribution stats
  const [stats, setStats] = useState([
    { name: 'Python', percent: 45, color: '#3776AB', icon: <Terminal size={14} /> },
    { name: 'JavaScript/React', percent: 30, color: '#F7DF1E', icon: <Globe size={14} /> },
    { name: 'Node.js', percent: 15, color: '#339933', icon: <Code size={14} /> },
    { name: 'SQL/DB', percent: 10, color: '#4479A1', icon: <Database size={14} /> },
  ]);

  // Simulate slight live fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => {
        let newStats = [...prev];
        const indexToChange = Math.floor(Math.random() * newStats.length);
        const shift = (Math.random() > 0.5 ? 1 : -1) * 0.5;
        
        newStats[indexToChange].percent = Math.max(0, newStats[indexToChange].percent + shift);
        
        // Normalize
        const total = newStats.reduce((sum, s) => sum + s.percent, 0);
        newStats = newStats.map(s => ({ ...s, percent: Number(((s.percent / total) * 100).toFixed(1)) }));
        return newStats;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ background: 'rgba(150,150,150,0.03)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(150,150,150,0.08)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem', color: 'var(--accent-glow-strong)' }}>
        <Code size={24} />
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit' }}>Weekly Language Stats</h3>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        {stats.map(stat => (
          <div key={stat.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#ccc', fontWeight: 600 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>{stat.icon} {stat.name}</span>
              <span>{stat.percent}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${stat.percent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{ height: '100%', background: stat.color, borderRadius: '4px' }}
              />
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: '#666', textAlign: 'right', fontStyle: 'italic' }}>
        Live data sync (Simulated)
      </div>
    </div>
  );
};

export default CodingStats;
