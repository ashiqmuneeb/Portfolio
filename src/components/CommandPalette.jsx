import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, Code, Mail, Download, Moon, Sun, Monitor, Cpu } from 'lucide-react';

const CommandPalette = ({ isOpen, setIsOpen, setTheme, theme }) => {
  const [search, setSearch] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    } else {
      setSearch('');
    }
  }, [isOpen]);

  const actions = [
    { id: 'home', title: 'Go to Home', icon: <Monitor size={16} />, action: () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setIsOpen(false); } },
    { id: 'architectures', title: 'View Architectures', icon: <Cpu size={16} />, action: () => { document.getElementById('architectures')?.scrollIntoView({ behavior: 'smooth' }); setIsOpen(false); } },
    { id: 'case-studies', title: 'Read Case Studies', icon: <FileText size={16} />, action: () => { document.getElementById('case-studies')?.scrollIntoView({ behavior: 'smooth' }); setIsOpen(false); } },
    { id: 'contact', title: 'Contact Me', icon: <Mail size={16} />, action: () => { document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); setIsOpen(false); } },
    { id: 'cv', title: 'Download Resume / CV', icon: <Download size={16} />, action: () => { 
        const link = document.createElement('a');
        link.href = '/Ashiq_Muneeb_CV_METI.pdf';
        link.download = 'Ashiq_Muneeb_CV.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsOpen(false);
    } },
    { id: 'theme-cyber', title: 'Switch to Cyber Theme', icon: <Moon size={16} />, action: () => { setTheme('cyber'); setIsOpen(false); } },
    { id: 'theme-light', title: 'Switch to Light Theme', icon: <Sun size={16} />, action: () => { setTheme('light'); setIsOpen(false); } },
  ];

  const filteredActions = actions.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '15vh' }}>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            style={{ 
              position: 'relative', width: '90%', maxWidth: '600px', 
              background: 'rgba(15, 15, 20, 0.95)', border: '1px solid rgba(255,255,255,0.1)', 
              borderRadius: '16px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <Search size={20} color="#888" />
              <input 
                ref={inputRef}
                type="text" 
                placeholder="Type a command or search..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '1.1rem', padding: '0 1rem', outline: 'none' }}
              />
              <div style={{ fontSize: '0.7rem', color: '#666', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontFamily: 'monospace' }}>ESC</div>
            </div>

            <div style={{ maxHeight: '300px', overflowY: 'auto', padding: '0.5rem' }}>
              {filteredActions.length > 0 ? filteredActions.map((action, i) => (
                <button 
                  key={action.id}
                  onClick={action.action}
                  style={{ 
                    width: '100%', display: 'flex', alignItems: 'center', gap: '1rem', 
                    padding: '1rem', color: '#aaa', textAlign: 'left', borderRadius: '8px',
                    transition: 'all 0.2s', background: 'transparent', border: 'none', cursor: 'pointer'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#aaa'; }}
                >
                  <div style={{ color: 'var(--accent-glow-strong)' }}>{action.icon}</div>
                  <span style={{ fontSize: '1rem', fontWeight: 500 }}>{action.title}</span>
                </button>
              )) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No commands found.</div>
              )}
            </div>
            <div style={{ padding: '0.8rem 1.5rem', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.8rem', color: '#666', display: 'flex', justifyContent: 'space-between' }}>
              <span>Search for commands</span>
              <span><strong>↑↓</strong> to navigate (soon), <strong>↵</strong> to select</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
