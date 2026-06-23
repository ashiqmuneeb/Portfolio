import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { Globe, Camera, Cpu, Server, MapPin, Mail, Phone, ExternalLink, HardDrive, Network, Workflow, X, Terminal as TerminalIcon, Code, Github, Linkedin, Download } from 'lucide-react';
import Lenis from '@studio-freight/lenis';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const PROJECTS = [
  { id: "wizzo", title: "WIZZO Smart Attendance & Geofencing", desc: "Managed under wizzopython multi-remote setup. Engineered MySQL 9 to log complex IN/OUT triggers and granular break-time metrics.", icon: <Camera size={28} strokeWidth={2} />, color: "#ff6b6b", span: "col-span-2 row-span-2" },
  { id: "mobile", title: "Mobile-to-Web Backend Design", desc: "Architected a custom, scalable Node.js folder structure hosted on AWS. Syncs React Native with complex web interfaces.", icon: <Network size={28} strokeWidth={2} />, color: "#4ecdc4", span: "col-span-2 row-span-1" },
  { id: "edge", title: "Edge AI & Hardware Processing", desc: "Deployed YOLO pipelines on Raspberry Pi AI HAT+ (26 TOPS). Engineered live RTSP ingestion protocols.", icon: <Cpu size={28} strokeWidth={2} />, color: "#54a0ff", span: "col-span-1 row-span-1" },
  { id: "devops", title: "Multi-Cloud DevOps Daemon", desc: "Authored custom daemons tracking AWS-INDIA nodes and automating strict threshold alerts.", icon: <Server size={28} strokeWidth={2} />, color: "#a29bfe", span: "col-span-1 row-span-1" },
  { id: "gesture", title: "Real-Time Gesture Pipeline", desc: "Built a 60FPS WebAssembly MediaPipe tracker mapping 42-coordinate JSON payloads over WebSockets.", icon: <Code size={28} strokeWidth={2} />, color: "#ff9ff3", span: "col-span-2 row-span-1" },
  { id: "crm", title: "Aiyri CRM Sandbox AI", desc: "Enterprise CRM featuring an integrated AI document parsing system extracting requirement architectures.", icon: <Workflow size={28} strokeWidth={2} />, color: "#feca57", span: "col-span-1 row-span-2" },
  { id: "aws", title: "AWS Storage Auditing System", desc: "Engineered deep auditing scripts targeting unmounted 'Ghost Drive' EBS volumes.", icon: <HardDrive size={28} strokeWidth={2} />, color: "#ff6b6b", span: "col-span-1 row-span-1" },
  { id: "loyalty", title: "Face Recognition Loyalty", desc: "ONNX Runtime for facial embedding extraction and cosine similarity matching.", icon: <Camera size={28} strokeWidth={2} />, color: "#54a0ff", span: "col-span-1 row-span-1" },
  { id: "speed", title: "Computer Vision Speed Tracking", desc: "Real-time vehicle speed tracking integrating deeply with LPR pipelines.", icon: <Server size={28} strokeWidth={2} />, color: "#a29bfe", span: "col-span-1 row-span-1" }
];

const SKILLS = [
  "Python", "FastAPI", "Django", "React", "React Native", "Node.js", 
  "AWS EC2", "Docker", "YOLOv26", "OpenCV", "MediaPipe", "MySQL 9", "PostgreSQL", "PHP", "GitLab"
];

// Custom Hook for Window Resize
const useWindowSize = () => {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  useEffect(() => {
    const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return size;
};

// --- Animated Stat Counter ---
const StatCounter = ({ value, label, suffix = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(value);
      if (start === end) return;
      const duration = 2000;
      const incrementTime = Math.abs(Math.floor(duration / end));
      
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) clearInterval(timer);
      }, incrementTime);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <div ref={ref} style={{ flex: 1, minWidth: '150px', textAlign: 'center', padding: '2rem', background: 'rgba(150,150,150,0.03)', borderRadius: '24px', border: '1px solid rgba(150,150,150,0.08)' }}>
      <div style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, color: 'var(--accent-glow-strong)', fontFamily: 'Outfit', lineHeight: 1 }}>
        {count}{suffix}
      </div>
      <div style={{ color: '#888', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.8rem' }}>
        {label}
      </div>
    </div>
  );
};

// --- Circular Project Wheel / Mobile Stack ---
const ProjectWheel = ({ projects, setSelectedId, isMobile }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
        {projects.map((p) => (
          <motion.div
            key={p.id}
            layoutId={`card-${p.id}`}
            onClick={() => setSelectedId(p.id)}
            style={{
              width: '100%',
              padding: '2rem',
              cursor: 'pointer',
              background: 'rgba(25,25,30,0.95)',
              border: `1px solid ${p.color}`,
              color: '#fff',
              borderRadius: '24px',
              boxShadow: `0 10px 30px rgba(0,0,0,0.2)`
            }}
          >
            <motion.div layoutId={`icon-${p.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', borderRadius: '12px', background: `${p.color}20`, color: p.color, marginBottom: '1.5rem' }}>
              {p.icon}
            </motion.div>
            <motion.h3 layoutId={`title-${p.id}`} style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', fontFamily: 'Outfit', lineHeight: 1.2 }}>{p.title}</motion.h3>
            <motion.p layoutId={`desc-${p.id}`} style={{ color: '#bbb', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>{p.desc}</motion.p>
            <div style={{ color: p.color, fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Tap for Details <ExternalLink size={14}/>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Desktop Circular Wheel
  return (
    <div style={{ position: 'relative', width: '100%', height: '800px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2rem' }}>
      {projects.map((p, i) => {
        const isActive = i === activeIndex;
        const orbitTotal = projects.length - 1;
        
        let orbitIndex = i;
        if (i > activeIndex) orbitIndex = i - 1;

        const angle = isActive ? 0 : (orbitIndex / orbitTotal) * Math.PI * 2 - (Math.PI / 2);
        
        const radiusX = 450;
        const radiusY = 320;

        const x = isActive ? 0 : Math.cos(angle) * radiusX;
        const y = isActive ? 0 : Math.sin(angle) * radiusY;

        return (
          <motion.div
            key={p.id}
            layoutId={`card-${p.id}`}
            onClick={() => { if (!isActive) setActiveIndex(i); }}
            initial={false}
            animate={{
              x,
              y,
              scale: isActive ? 1.05 : 0.65,
              opacity: isActive ? 1 : 0.4,
              zIndex: isActive ? 50 : 10,
              filter: isActive ? 'blur(0px)' : 'blur(3px)'
            }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
            style={{
              position: 'absolute',
              width: isActive ? '500px' : '280px',
              padding: isActive ? '3rem' : '2rem',
              cursor: isActive ? 'default' : 'pointer',
              background: isActive ? 'rgba(25,25,30,0.95)' : 'rgba(255,255,255,0.02)',
              border: isActive ? `1px solid ${p.color}` : '1px solid rgba(150,150,150,0.1)',
              color: isActive ? '#fff' : 'inherit',
              borderRadius: '24px',
              boxShadow: isActive ? `0 30px 60px rgba(0,0,0,0.5)` : 'none'
            }}
          >
            <motion.div layoutId={`icon-${p.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', borderRadius: '12px', background: `${p.color}20`, color: p.color, marginBottom: '1.5rem' }}>
              {p.icon}
            </motion.div>
            <motion.h3 layoutId={`title-${p.id}`} style={{ fontSize: isActive ? '2.2rem' : '1.3rem', fontWeight: 800, marginBottom: '1rem', fontFamily: 'Outfit', lineHeight: 1.2 }}>{p.title}</motion.h3>
            
            <AnimatePresence mode="wait">
              {isActive && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
                  <motion.p layoutId={`desc-${p.id}`} style={{ color: '#bbb', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>{p.desc}</motion.p>
                  <button onClick={() => setSelectedId(p.id)} className="btn btn-pill" style={{ borderColor: p.color, color: p.color, background: 'transparent' }}>
                    View Architecture <ExternalLink size={16}/>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};

// --- Terminal Easter Egg ---
const DevOpsTerminal = ({ isMobile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState([{ cmd: "", out: "AshiqOS v1.0.0 initialized.\nType 'help' to see commands." }]);
  const [input, setInput] = useState("");

  if (isMobile) return null; // Hide terminal easter egg on mobile to save screen space

  const handleCommand = (e) => {
    if (e.key === "Enter") {
      const cmd = input.trim().toLowerCase();
      let out = "";
      if (cmd === "help") out = "Available commands:\nwhoami\nskills\nwizzo.sh\nclear";
      else if (cmd === "whoami") out = "Ashiq Muneeb\nSoftware Developer, Edge AI Integrator, AWS Architect.";
      else if (cmd === "skills") out = "[PYTHON] FastAPI, Django\n[NODE] Express, React\n[AI] YOLOv26, OpenCV\n[DEVOPS] AWS EC2, Utho, Docker";
      else if (cmd === "clear") { setHistory([]); setInput(""); return; }
      else if (cmd === "wizzo.sh") out = "Connecting to geo.wizzo.in...\n[OK] 200\nFetching LPR telemetry...\n[OK] ACCESS GRANTED.";
      else if (cmd !== "") out = `Command not found: ${cmd}`;

      setHistory(prev => [...prev, { cmd, out }]);
      setInput("");
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 10000 }}>
      {!isOpen ? (
        <button className="btn btn-pill" style={{ background: '#0a0a0f', color: '#0f0', border: '1px solid #0f0' }} onClick={() => setIsOpen(true)}>
          <TerminalIcon size={16} /> Open Terminal
        </button>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="terminal-window">
          <div className="terminal-header">
            <span style={{ color: '#0f0' }}>root@ashiq-os:~</span>
            <X size={16} style={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)} />
          </div>
          <div className="terminal-body" onClick={() => document.getElementById('term-input')?.focus()}>
            {history.map((h, i) => (
              <div key={i}>
                {h.cmd && <div style={{ color: '#0f0' }}>$ {h.cmd}</div>}
                <div style={{ whiteSpace: 'pre-line', marginBottom: '0.5rem' }}>{h.out}</div>
              </div>
            ))}
            <div style={{ display: 'flex', color: '#0f0' }}>
              <span>$</span>
              <input id="term-input" type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleCommand} style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', marginLeft: '0.5rem', width: '100%', fontFamily: 'monospace' }} autoFocus autoComplete="off" spellCheck="false" />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  
  const [windowWidth] = useWindowSize();
  const isMobile = windowWidth < 768;

  const { scrollYProgress } = useScroll();
  const backgroundColor = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.75, 0.85], ["#f8f9fa", "#f8f9fa", "#0a0a0f", "#0a0a0f", "#f8f9fa"]);
  const textColor = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.75, 0.85], ["#121212", "#121212", "#f0f0f5", "#f0f0f5", "#121212"]);

  useEffect(() => {
    // Only init smooth scrolling if not on mobile for better touch experience
    let lenis;
    if (!isMobile) {
      lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), direction: 'vertical', smooth: true });
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
    }

    let interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) { clearInterval(interval); setTimeout(() => setLoading(false), 500); return 100; }
        return prev + 10;
      });
    }, 50);

    return () => { if(lenis) lenis.destroy(); clearInterval(interval); };
  }, [isMobile]);

  return (
    <motion.div style={{ backgroundColor, color: textColor, minHeight: '100vh', transition: 'background-color 0.5s ease, color 0.5s ease' }} className="noise-bg">
      {/* Scroll Progress Bar */}
      <motion.div style={{ scaleX: scrollYProgress, transformOrigin: 'left', position: 'fixed', top: 0, left: 0, right: 0, height: '4px', background: 'var(--accent-glow-strong)', zIndex: 11000 }} />

      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.5 } }} className="preloader">
            <div style={{ fontSize: 'clamp(3rem, 10vw, 5rem)', fontWeight: 900 }}>{loadingProgress}%</div>
            <div style={{ marginTop: '1rem', fontSize: 'clamp(0.8rem, 3vw, 1rem)', color: '#888' }}>INITIALIZING ENVIRONMENT...</div>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && (
        <>
          {/* Navigation */}
          <nav style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100, padding: isMobile ? '1rem 1.5rem' : '1.2rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(150,150,150,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontWeight: 800, fontSize: '1.2rem', fontFamily: 'Outfit, sans-serif' }}>
              <div style={{ width: '28px', height: '28px', background: 'currentColor', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '10px', height: '10px', border: `2px solid ${backgroundColor.get() === '#0a0a0f' ? '#000' : '#fff'}`, borderTop: 'none', borderRight: 'none', transform: 'rotate(-45deg)', marginTop: '-2px' }}></div>
              </div>
              Ashiq Muneeb
            </div>
            {!isMobile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                <div style={{ display: 'flex', gap: '2rem', fontWeight: 600, fontSize: '0.95rem' }}>
                  <a href="#about">About</a>
                  <a href="#architectures">Architectures</a>
                  <a href="#contact">Contact</a>
                </div>
                <a href="mailto:Ashiqam75@gmail.com" className="btn btn-pill" style={{ fontWeight: 600, fontSize: '0.95rem', background: 'currentColor', color: 'var(--bg-main)' }}>
                  <Globe size={16} /> Connect
                </a>
              </div>
            )}
          </nav>

          {/* Hero Section */}
          <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '100px', paddingBottom: '60px' }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4rem', flexWrap: 'wrap-reverse' }}>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ flex: '1 1 400px', zIndex: 10, textAlign: isMobile ? 'center' : 'left' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(235, 100, 52, 0.1)', color: 'var(--accent-glow-strong)', padding: '0.5rem 1.2rem', borderRadius: '50px', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.5rem', border: '1px solid rgba(235, 100, 52, 0.2)' }}>
                  <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} style={{ width: '8px', height: '8px', background: 'var(--accent-glow-strong)', borderRadius: '50%' }} />
                  Currently shipping at WIZZO
                </div>
                
                <h1 style={{ fontSize: 'clamp(3rem, 10vw, 5rem)', fontWeight: 900, lineHeight: 1.1, fontFamily: 'Outfit', letterSpacing: '-1px', marginBottom: '1.5rem' }}>
                  Engineering <br/> <span style={{ color: 'var(--accent-glow-strong)' }}>Scalable Systems.</span>
                </h1>
                <p style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)', lineHeight: 1.6, color: '#666', maxWidth: '500px', marginBottom: '3rem', fontWeight: 500, margin: isMobile ? '0 auto 3rem' : '0 0 3rem' }}>
                  I'm Ashiq Muneeb. I architect and own complex, multi-layered systems—bridging the gap from physical hardware integration to deep edge AI models and scalable AWS cloud infrastructures.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start' }}>
                  <a href="#architectures" className="btn btn-pill" style={{ background: 'currentColor', color: '#fff', padding: '1rem 2rem', fontSize: '1.1rem', width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}>
                    View Architectures
                  </a>
                  <a href="/Ashiq_Muneeb_CV_METI.pdf" download="Ashiq_Muneeb_CV.pdf" className="btn btn-pill" style={{ padding: '1rem 2rem', fontSize: '1.1rem', border: '1px solid currentColor', width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}>
                    Download CV <Download size={18} />
                  </a>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }} style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'linear-gradient(45deg, var(--accent-glow-strong) 0%, transparent 60%)', borderRadius: '32px', filter: 'blur(60px)', opacity: 0.3, zIndex: 0 }}></div>
                <img src="/images/profile.jpg" alt="Ashiq Muneeb" style={{ width: '100%', maxWidth: '450px', aspectRatio: '4/5', objectFit: 'cover', borderRadius: '32px', zIndex: 5, position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
              </motion.div>
            </div>
          </section>

          {/* About / Toolkit / Stats */}
          <section id="about" style={{ padding: '80px 0', borderTop: '1px solid rgba(150,150,150,0.1)' }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="container">
              
              <motion.div variants={fadeInUp} style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '4rem' }}>
                <StatCounter value="3" label="Years Experience" suffix="+" />
                <StatCounter value="9" label="Architectures Shipped" />
                <StatCounter value="2" label="Core Companies" />
              </motion.div>

              <motion.div variants={fadeInUp} style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, fontFamily: 'Outfit' }}>Core Technical Stack</h2>
              </motion.div>
              
              <motion.div variants={fadeInUp} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '3rem' }}>
                {SKILLS.map((skill, index) => (
                  <span key={index} style={{ background: 'rgba(150,150,150,0.1)', border: '1px solid rgba(150,150,150,0.2)', padding: '0.6rem 1.2rem', borderRadius: '50px', fontWeight: 600, fontSize: '0.9rem' }}>
                    {skill}
                  </span>
                ))}
              </motion.div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {[
                  { title: 'Languages & Backend', desc: 'Python (FastAPI, Django), PHP, scalable Node.js architectures, React Native.' },
                  { title: 'Edge AI & Hardware', desc: 'Raspberry Pi AI HAT+ (26 TOPS), YOLOv26, OpenCV, live RTSP on HIKVISION.' },
                  { title: 'Cloud DevOps', desc: 'AWS EC2 orchestration, EBS storage audits, Docker, n8n, Utho server daemons.' },
                  { title: 'Database Logic', desc: 'MySQL 9 & PostgreSQL engineering, complex IN/OUT tracking and triggers.' }
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeInUp} style={{ background: 'rgba(150,150,150,0.05)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(150,150,150,0.1)' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.8rem', fontFamily: 'Outfit' }}>{item.title}</h3>
                    <p style={{ color: '#777', fontWeight: 500, lineHeight: 1.6 }}>{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>

          {/* Testimonial Placeholder */}
          <section style={{ padding: '80px 0', background: 'rgba(150,150,150,0.03)', borderTop: '1px solid rgba(150,150,150,0.1)' }}>
            <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--accent-glow-strong)" style={{ marginBottom: '1.5rem', opacity: 0.5 }}>
                <path d="M14.017 21L16.44 14.976C16.892 13.885 17.155 12.87 17.228 11.931C17.302 10.992 17.067 10.027 16.523 9.036L14.017 4H21L19.463 11.218C19.261 12.158 18.895 13.067 18.365 13.945C17.835 14.823 17.165 15.65 16.355 16.425C15.545 17.2 14.766 18.725 14.017 21ZM4.01697 21L6.43997 14.976C6.89197 13.885 7.15497 12.87 7.22797 11.931C7.30097 10.992 7.06697 10.027 6.52297 9.036L4.01697 4H11L9.46297 11.218C9.26097 12.158 8.89497 13.067 8.36497 13.945C7.83497 14.823 7.16497 15.65 6.35497 16.425C5.54497 17.2 4.76597 18.725 4.01697 21Z" />
              </svg>
              <h3 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', fontWeight: 600, fontStyle: 'italic', lineHeight: 1.6, marginBottom: '2rem' }}>
                "Ashiq seamlessly bridges the gap between complex hardware architectures, deep edge AI models, and scalable cloud deployments. He owns the system from top to bottom."
              </h3>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', fontFamily: 'Outfit' }}>Engineering Leadership</div>
              <div style={{ color: '#888', fontWeight: 500 }}>WIZZO</div>
            </div>
          </section>

          {/* Project Architectures */}
          <section id="architectures" style={{ padding: '80px 0' }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="container">
              <motion.div variants={fadeInUp} style={{ display: 'flex', flexDirection: 'column', marginBottom: '3rem', color: '#fff', textAlign: isMobile ? 'center' : 'left' }}>
                <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', fontWeight: 800, fontFamily: 'Outfit' }}>System Architectures</h2>
                <p style={{ color: '#aaa', fontSize: '1.1rem', marginTop: '1rem', maxWidth: '600px', margin: isMobile ? '1rem auto 0' : '1rem 0 0' }}>
                  {isMobile ? "Tap any card below to read the deep-dive." : "Click any card in the orbital wheel to focus on the architecture details."}
                </p>
              </motion.div>
              
              <motion.div variants={fadeInUp}>
                <ProjectWheel projects={PROJECTS} setSelectedId={setSelectedId} isMobile={isMobile} />
              </motion.div>
            </motion.div>
          </section>

          {/* Case Study Modal */}
          <AnimatePresence>
            {selectedId && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overlay-backdrop" onClick={() => setSelectedId(null)} style={{ padding: isMobile ? '1rem' : '0' }}>
                {PROJECTS.map(p => p.id === selectedId && (
                  <motion.div layoutId={`card-${p.id}`} key={p.id} className="project-modal" onClick={(e) => e.stopPropagation()} style={{ width: '100%', padding: isMobile ? '2rem 1.5rem' : '4rem', maxHeight: '90vh' }}>
                    <button className="project-modal-close" onClick={() => setSelectedId(null)} style={{ top: isMobile ? '1rem' : '2rem', right: isMobile ? '1rem' : '2rem' }}><X size={20}/></button>
                    <motion.div layoutId={`icon-${p.id}`} style={{ width: isMobile ? '60px' : '80px', height: isMobile ? '60px' : '80px', borderRadius: '20px', background: `${p.color}15`, color: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                      {p.icon}
                    </motion.div>
                    <motion.h3 layoutId={`title-${p.id}`} style={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: 900, fontFamily: 'Outfit', lineHeight: 1.1, marginBottom: '1rem' }}>{p.title}</motion.h3>
                    <motion.p layoutId={`desc-${p.id}`} style={{ color: '#aaa', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>{p.desc}</motion.p>
                    
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: isMobile ? '1.5rem' : '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: p.color }}>Architecture Overview</h4>
                      <ul style={{ paddingLeft: '1.5rem', color: '#ccc', lineHeight: 1.6, marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.95rem' }}>
                        <li>Designed for high-throughput, low-latency data processing pipelines.</li>
                        <li>Seamless integration with multi-cloud (AWS) API endpoints and microservices.</li>
                        <li>Robust fallback mechanisms and logging for critical path monitoring.</li>
                      </ul>
                      <a href="https://github.com/ashiqmuneeb" target="_blank" rel="noreferrer" className="btn btn-pill" style={{ border: `1px solid ${p.color}`, color: p.color, width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}>
                        View Repository <ExternalLink size={16}/>
                      </a>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Contact Section */}
          <section id="contact" style={{ padding: '100px 0', textAlign: 'center' }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="container" style={{ maxWidth: '800px' }}>
              <motion.h2 variants={fadeInUp} style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: 900, marginBottom: '1.5rem', fontFamily: 'Outfit', lineHeight: 1.1 }}>
                Let's build something <br/> <span style={{ color: 'var(--accent-glow-strong)' }}>extraordinary.</span>
              </motion.h2>
              <motion.p variants={fadeInUp} style={{ fontSize: '1.1rem', color: '#555', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
                Whether you need to architect a new cloud infrastructure, integrate a custom AI model, or build hardware systems—I'm ready to help.
              </motion.p>
              <motion.div variants={fadeInUp} style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <a href="mailto:Ashiqam75@gmail.com" className="btn btn-pill" style={{ fontSize: '1.1rem', padding: '1rem 2rem', background: '#121212', color: '#fff', width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}>
                  <Mail size={20} /> Ashiqam75@gmail.com
                </a>
                <a href="tel:+917994910491" className="btn btn-pill" style={{ fontSize: '1.1rem', padding: '1rem 2rem', border: '1px solid #121212', color: '#121212', width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}>
                  <Phone size={20} /> +91 7994910491
                </a>
              </motion.div>
            </motion.div>
          </section>
          
          <footer style={{ padding: '3rem 0', textAlign: 'center', borderTop: '1px solid rgba(150,150,150,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
              <a href="https://github.com/ashiqmuneeb" target="_blank" rel="noreferrer" style={{ color: '#888', transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = '#121212'} onMouseOut={e => e.currentTarget.style.color = '#888'}>
                <Github size={24} />
              </a>
              <a href="https://www.linkedin.com/in/ashiq-muneeb/" target="_blank" rel="noreferrer" style={{ color: '#888', transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = '#0077b5'} onMouseOut={e => e.currentTarget.style.color = '#888'}>
                <Linkedin size={24} />
              </a>
            </div>
            <p style={{ color: '#888', fontWeight: 500 }}>&copy; {new Date().getFullYear()} Ashiq Muneeb. Crafted with precision.</p>
          </footer>

          <DevOpsTerminal isMobile={isMobile} />
        </>
      )}
    </motion.div>
  );
};

export default App;
