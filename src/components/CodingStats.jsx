import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Code, Database, Globe, CheckCircle2 } from 'lucide-react';

const CodingStats = () => {
  const [stats, setStats] = useState([
    { name: 'Python (FastAPI, PyTorch, YOLO)', percent: 42, color: '#3776AB', icon: <Terminal size={14} /> },
    { name: 'JavaScript / React 19 & Node', percent: 28, color: '#F7DF1E', icon: <Globe size={14} /> },
    { name: 'AI Agents & LangGraph', percent: 18, color: '#FF6B6B', icon: <Code size={14} /> },
    { name: 'SQL & Systems (WAL Mode)', percent: 12, color: '#4479A1', icon: <Database size={14} /> },
  ]);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    fetch('https://api.github.com/users/ashiqmuneeb/repos?per_page=100')
      .then(res => res.json())
      .then(repos => {
        if (!Array.isArray(repos) || repos.length === 0) return;

        let pythonBytes = 0;
        let jsBytes = 0;
        let agentBytes = 0;
        let dbBytes = 0;

        repos.forEach(repo => {
          const lang = repo.language || '';
          const size = repo.size || 10;
          const name = (repo.name || '').toLowerCase();

          if (name.includes('agent') || name.includes('rag') || name.includes('finetuning') || name.includes('vidmind') || lang === 'Jupyter Notebook') {
            agentBytes += size * 1.5;
          } else if (lang === 'Python') {
            pythonBytes += size;
          } else if (lang === 'JavaScript' || lang === 'TypeScript' || lang === 'HTML') {
            jsBytes += size;
          } else {
            dbBytes += size;
          }
        });

        const total = pythonBytes + jsBytes + agentBytes + (dbBytes || 100);
        if (total > 0) {
          setStats([
            { name: 'Python (FastAPI, PyTorch, YOLO)', percent: Number(((pythonBytes / total) * 100).toFixed(1)), color: '#3776AB', icon: <Terminal size={14} /> },
            { name: 'JavaScript / React 19 & Node', percent: Number(((jsBytes / total) * 100).toFixed(1)), color: '#F7DF1E', icon: <Globe size={14} /> },
            { name: 'AI Agents & LangGraph', percent: Number(((agentBytes / total) * 100).toFixed(1)), color: '#FF6B6B', icon: <Code size={14} /> },
            { name: 'SQL & Systems (WAL Mode)', percent: Number((((dbBytes || 100) / total) * 100).toFixed(1)), color: '#4479A1', icon: <Database size={14} /> },
          ]);
          setIsLive(true);
        }
      })
      .catch(() => {
        // Fallback maintained
      });
  }, []);

  return (
    <div style={{ background: 'var(--card-bg, rgba(255, 255, 255, 0.75))', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(120, 149, 117, 0.3)', boxShadow: '0 8px 30px rgba(120, 149, 117, 0.08)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--accent-glow-strong)' }}>
          <Code size={24} />
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit' }}>Language Distribution</h3>
        </div>
        {isLive && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: '#2ecc71', background: 'rgba(46,204,113,0.1)', padding: '0.2rem 0.6rem', borderRadius: '50px', border: '1px solid rgba(46,204,113,0.2)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2ecc71' }}></span>
            Live GitHub
          </span>
        )}
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        {stats.map(stat => (
          <div key={stat.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-color, #1C1D20)', fontWeight: 600 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>{stat.icon} {stat.name}</span>
              <span>{stat.percent}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(120, 149, 117, 0.18)', borderRadius: '4px', overflow: 'hidden' }}>
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
      <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: '#888', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Source: <code>@ashiqmuneeb</code> public repositories</span>
        <span style={{ color: '#2ecc71', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <CheckCircle2 size={12} /> Real-time sync
        </span>
      </div>
    </div>
  );
};

export default CodingStats;
