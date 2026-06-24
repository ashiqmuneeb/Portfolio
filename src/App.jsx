import React, { useEffect, useState, useRef, useMemo, Suspense, lazy } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { Globe, Camera, Cpu, Server, MapPin, Mail, Phone, ExternalLink, HardDrive, Network, Workflow, X, Terminal as TerminalIcon, Code, Github, Linkedin, Download, FileText, Send, CheckCircle, GitCommit, GitBranch, Activity, Wifi, Database, Moon, Sun, Volume2, VolumeX, Menu } from 'lucide-react';
import Lenis from '@studio-freight/lenis';
import { ReactFlow, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toPng } from 'html-to-image';

const ThreeDBackground = lazy(() => import('./components/ThreeDBackground'));
const AIChatbot = lazy(() => import('./components/AIChatbot'));
const MarkdownReader = lazy(() => import('./components/MarkdownReader'));
const CommandPalette = lazy(() => import('./components/CommandPalette'));
const CustomCursor = lazy(() => import('./components/CustomCursor'));
const CodingStats = lazy(() => import('./components/CodingStats'));

// --- Sound Utility ---
let globalIsMuted = false;

const playClick = () => {
  if (globalIsMuted) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {}
};

const playType = () => {
  if (globalIsMuted) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.02);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.02);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.02);
  } catch (e) {}
};

const playHover = () => {
  if (globalIsMuted) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.02);
    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.02);
  } catch (e) {}
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const nodeStyles = { background: '#1a1a1a', color: '#fff', border: '1px solid #333', borderRadius: '8px', padding: '10px', fontSize: '12px', fontFamily: 'monospace', width: 140, textAlign: 'center' };

const createFlow = (labels) => {
  return {
    nodes: labels.map((label, i) => ({
      id: `${i + 1}`,
      position: { x: 20 + (i * 180), y: 50 },
      data: { label },
      style: { ...nodeStyles, borderColor: ['#54a0ff', '#ff9ff3', '#4ecdc4', '#ff6b6b'][i % 4] }
    })),
    edges: labels.slice(0, -1).map((_, i) => ({
      id: `e${i + 1}-${i + 2}`,
      source: `${i + 1}`,
      target: `${i + 2}`,
      animated: true,
      style: { stroke: ['#54a0ff', '#ff9ff3', '#4ecdc4', '#ff6b6b'][i % 4] }
    }))
  };
};

const PROJECTS = [
  // Existing ones
  { id: "wizzo", title: "WIZZO CRM & Smart Attendance", desc: "Enterprise CRM backend featuring real-time WebSockets (Socket.io), Google GenAI for email parsing, and complex MySQL 2 triggers for tracking granular IN/OUT metrics.", icon: <Workflow size={28} strokeWidth={2} />, color: "#ff6b6b", category: "Backend", flow: createFlow(["Express 5 API", "Socket.io Streams", "GenAI Parsing", "MySQL 2 DB"]) },
  { id: "mobile", title: "Mobile-to-Web Backend", desc: "Architected a custom, scalable Node.js folder structure hosted on AWS.", icon: <Network size={28} strokeWidth={2} />, color: "#4ecdc4", category: "Backend", flow: createFlow(["Mobile App", "AWS API Gateway", "Microservices", "AWS RDS"]) },
  { id: "edge", title: "Edge AI Processing", desc: "Deployed YOLO pipelines on Raspberry Pi AI HAT+ (26 TOPS).", icon: <Cpu size={28} strokeWidth={2} />, color: "#54a0ff", category: "AI", image: "/images/rpi_ai.png", flow: createFlow(["RPi Camera", "AI HAT+ (YOLO)", "Local Inference", "Cloud Sync"]) },
  { id: "devops", title: "Multi-Cloud DevOps Daemon", desc: "Authored custom daemons tracking AWS-INDIA nodes and automating strict threshold alerts.", icon: <Server size={28} strokeWidth={2} />, color: "#a29bfe", category: "DevOps", flow: createFlow(["AWS Nodes", "Custom Daemon", "Threshold Engine", "Alert System"]) },
  { id: "gesture", title: "Real-Time Gesture Pipeline", desc: "Built a 60FPS WebAssembly MediaPipe tracker mapping 42-coordinate JSON payloads over WebSockets.", icon: <Code size={28} strokeWidth={2} />, color: "#ff9ff3", category: "AI", flow: createFlow(["WebCam Feed", "WASM MediaPipe", "WebSocket Server", "Client UI"]) },
  { id: "aws", title: "AWS Storage Auditing System", desc: "Engineered deep auditing scripts targeting unmounted 'Ghost Drive' EBS volumes.", icon: <HardDrive size={28} strokeWidth={2} />, color: "#ff6b6b", category: "DevOps", flow: createFlow(["Audit Script", "AWS EC2 API", "EBS Volumes", "Report Gen"]) },

  // New/Updated from folders
  { id: "crowd_density", title: "Crowd Density Estimation", desc: "FastAPI backend driving real-time OpenCV heatmaps and YOLO ByteTrack object tracking, streaming metrics via WebSockets.", icon: <Cpu size={28} strokeWidth={2} />, color: "#feca57", category: "AI", image: "/images/esp8266.png", flow: createFlow(["Camera Feed", "YOLO+ByteTrack", "FastAPI + WS", "Heatmap UI"]) },
  { id: "loyalty", title: "Face Recognition Loyalty", desc: "ONNX Runtime for facial embedding extraction and cosine similarity matching.", icon: <Camera size={28} strokeWidth={2} />, color: "#54a0ff", category: "AI", flow: createFlow(["Camera Feed", "ONNX Extraction", "Vector DB", "Loyalty Engine"]) },
  { id: "face_access", title: "Face Rec Access Control", desc: "Integrated biometric face recognition with a 5V relay to trigger electronic door lock mechanisms.", icon: <Cpu size={28} strokeWidth={2} />, color: "#ff9ff3", category: "AI", image: "/images/relay_lock.png", flow: createFlow(["Face Scanner", "Embedding Match", "Relay Module", "Door Lock"]) },
  { id: "speed", title: "CV Speed Tracking (LPR)", desc: "Real-time License Plate Recognition utilizing YOLO, EasyOCR, and OpenCV, powered by a dynamic Streamlit data dashboard.", icon: <Server size={28} strokeWidth={2} />, color: "#a29bfe", category: "AI", flow: createFlow(["Video Feed", "YOLO LPR", "EasyOCR Text", "Streamlit UI"]) },
  { id: "gps", title: "Real-Time GPS Tracker", desc: "Hardware IoT module utilizing NEO-6M GPS wired to a breadboard for high-precision live location tracking.", icon: <MapPin size={28} strokeWidth={2} />, color: "#ff6b6b", category: "Backend", image: "/images/gps_module.png", flow: createFlow(["NEO-6M GPS", "ESP8266", "MQTT Broker", "Live Map"]) },
  { id: "real_estate", title: "Real Estate Portal", desc: "Cross-platform Electron desktop app with a Vite/React frontend, featuring interactive react-leaflet maps for property management.", icon: <Globe size={28} strokeWidth={2} />, color: "#4ecdc4", category: "Frontend", flow: createFlow(["Electron Shell", "React/Vite UI", "Leaflet Maps", "Express 5 API"]) },
  { id: "safiyahealth", title: "Safiya Health Platform", desc: "Responsive React 19 medical portal built with Vite, featuring framer-motion animations and i18next for multi-language support.", icon: <Globe size={28} strokeWidth={2} />, color: "#54a0ff", category: "Frontend", flow: createFlow(["React 19 UI", "Framer Motion", "i18next Locale", "Health API"]) },
  { id: "bakereach", title: "BakeReach Dashboard", desc: "High-performance React 19 SaaS dashboard built with Vite and lucide-react, managing bakery inventory and sales.", icon: <Workflow size={28} strokeWidth={2} />, color: "#feca57", category: "Frontend", flow: createFlow(["React 19 UI", "Vite Build", "GraphQL API", "Metrics Engine"]) }
];

const SOFTWARE_ARSENAL = [
  "Python", "FastAPI", "React", "React Native", "Node.js",
  "AWS EC2", "Docker", "MySQL 9", "PostgreSQL", "PHP", "GitLab"
];

const HARDWARE_TOOLKIT = [
  "Raspberry Pi 4/5", "NVIDIA Jetson Nano", "ESP32 / Arduino",
  "YOLO Edge Models", "MediaPipe", "OpenCV", "LiDAR / Sensors"
];

const EXPERIENCE = [
  { id: 1, role: "Backend & AI Engineer", company: "WIZZO", duration: "2025 - Present", desc: "Architecting MySQL 9 triggers for complex attendance algorithms, deploying edge AI pipelines (YOLOv26) on Raspberry Pi AI HAT+, and managing scalable AWS EC2 instances for multi-tenant SaaS environments." },
  { id: 2, role: "Intern", company: "Infotact Solutions", duration: "2025", desc: "Assisted in software development, debugging, and building core foundational logic for web applications." },
  { id: 3, role: "Full Stack Developer Trainee", company: "CB Tech", duration: "2024", desc: "Trained in full-stack web development, working with modern JavaScript frameworks, responsive design, and backend API integration." },
];

const CASE_STUDIES = [
  { id: 1, title: "Deploying YOLOv26 on Raspberry Pi", readTime: "5 min read", tag: "Edge AI", content: `Deploying deep learning pipelines directly on edge devices eliminates network latency and reduces cloud costs. In this case study, we leveraged the Raspberry Pi AI HAT+ boasting 26 TOPS of compute. By optimizing the YOLOv26 model and using ByteTrack for efficient object association, we achieved 30 FPS inference locally without needing a continuous AWS connection. Telemetry (count and bounding box aggregates) is batched and synced via MQTT to the cloud only when required.

### Implementation

\`\`\`python
import cv2
from ultralytics import YOLO

model = YOLO('yolo26n.pt')
# Utilize 26 TOPS NPU on Raspberry Pi AI HAT+
results = model.track(
  source=0, 
  show=True, 
  tracker='bytetrack.yaml',
  imgsz=960
)
\`\`\`
` },
  { id: 2, title: "Hunting Ghost Drives: AWS EBS Auditing", readTime: "8 min read", tag: "DevOps", content: `Orphaned Elastic Block Store (EBS) volumes—often called 'Ghost Drives'—are a massive source of silent cloud waste. This custom daemon runs on an event-driven schedule using AWS Lambda. It interrogates the EC2 API across all regions, identifies 'available' (unattached) volumes older than 14 days, and automatically triggers slack alerts and snapshot archiving before terminating the volume, saving thousands of dollars monthly in hidden AWS costs.

### AWS Python Script

\`\`\`python
import boto3

ec2 = boto3.client('ec2', region_name='ap-south-1')
volumes = ec2.describe_volumes(
  Filters=[{'Name': 'status', 'Values': ['available']}]
)

for v in volumes['Volumes']:
    print(f"Found Ghost Drive: {v['VolumeId']} ({v['Size']} GB)")
    # Trigger Slack alert & Archive Logic
\`\`\`
` },
  { id: 3, title: "WebSockets for Real-Time CRM Parsing", readTime: "6 min read", tag: "Backend", content: `To build a modern CRM, static REST APIs for document processing are too slow. By integrating Express 5 and Socket.io, we established a persistent, bi-directional tunnel between the client and the Node.js backend. When a user uploads a raw email or document, the backend streams chunks to the Google Generative AI API. As the AI extracts structured fields (like Names, Leads, and Intents), the server emits these events back to the React UI instantly, creating a 'typing' effect that feels incredibly fast and magical to the end-user.

### WebSocket Node.js Server

\`\`\`javascript
const io = require('socket.io')(server);
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

io.on('connection', (socket) => {
  socket.on('parse_doc', async (data) => {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent([
      \`Extract CRM fields from: \${data.text}\`
    ]);
    socket.emit('doc_parsed', { fields: result.response.text() });
  });
});
\`\`\`
` }
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



// --- Animated Circuit Background Component ---
const CircuitBackground = () => {
  return (
    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, opacity: 0.25, pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="circuit-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#eb6434" />
          <stop offset="100%" stopColor="#54a0ff" />
        </linearGradient>
      </defs>

      {/* Circuit Traces */}
      <motion.path
        d="M -100 100 L 150 100 L 200 150 L 500 150 L 550 100 L 1200 100"
        stroke="url(#circuit-glow)" strokeWidth="2" fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />
      <motion.path
        d="M -50 400 L 250 400 L 300 350 L 600 350 L 650 450 L 1200 450"
        stroke="url(#circuit-glow)" strokeWidth="1" fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1 }}
      />
      <motion.path
        d="M 800 800 L 800 600 L 850 550 L 1200 550"
        stroke="url(#circuit-glow)" strokeWidth="2" fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.5 }}
      />

      {/* Circuit Nodes */}
      <circle cx="150" cy="100" r="4" fill="#eb6434" />
      <circle cx="200" cy="150" r="4" fill="#eb6434" />
      <circle cx="500" cy="150" r="4" fill="#54a0ff" />
      <circle cx="550" cy="100" r="4" fill="#54a0ff" />
      <circle cx="250" cy="400" r="3" fill="#eb6434" />
      <circle cx="300" cy="350" r="3" fill="#54a0ff" />
      <circle cx="600" cy="350" r="3" fill="#54a0ff" />
      <circle cx="650" cy="450" r="3" fill="#eb6434" />
      <circle cx="800" cy="600" r="5" fill="#eb6434" />
      <circle cx="850" cy="550" r="5" fill="#54a0ff" />

      {/* Data Packets (Pulsing Dots along paths) */}
      <motion.circle r="3" fill="#fff"
        animate={{
          cx: [-100, 150, 200, 500, 550, 1200],
          cy: [100, 100, 150, 150, 100, 100],
          opacity: [0, 1, 1, 1, 1, 0]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      <motion.circle r="2" fill="#fff"
        animate={{
          cx: [-50, 250, 300, 600, 650, 1200],
          cy: [400, 400, 350, 350, 450, 450],
          opacity: [0, 1, 1, 1, 1, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 2 }}
      />
    </svg>
  );
};

// --- Github Activity Component ---
const GithubActivity = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.github.com/users/ashiqmuneeb/repos?sort=updated&per_page=3')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRepos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: 'rgba(150,150,150,0.03)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(150,150,150,0.08)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem', color: 'var(--accent-glow-strong)' }}>
        <Github size={24} />
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit' }}>Live Commits</h3>
      </div>
      {loading ? (
        <p style={{ color: '#888' }}>Fetching live activity...</p>
      ) : repos.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {repos.map(repo => (
            <a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer" style={{ display: 'block', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.3s' }} className="github-card">
              <div style={{ fontWeight: 700, color: 'inherit', marginBottom: '0.3rem', display: 'flex', justifyContent: 'space-between' }}>
                {repo.name} <ExternalLink size={14} color="#888" />
              </div>
              <div style={{ fontSize: '0.85rem', color: '#888', display: 'flex', gap: '1rem' }}>
                <span><GitCommit size={12} style={{ display: 'inline', marginRight: '4px' }} /> {repo.language || 'Code'}</span>
                <span>Updated: {new Date(repo.updated_at).toLocaleDateString()}</span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p style={{ color: '#888' }}>Could not fetch repositories.</p>
      )}
      <style>{`.github-card:hover { background: rgba(255,255,255,0.08) !important; }`}</style>
    </div>
  );
};

// --- Contact Form Component ---
const ContactForm = () => {
  const [status, setStatus] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    // Simulate network request
    setTimeout(() => setStatus('success'), 1500);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '500px', margin: '0 auto', textAlign: 'left' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#888' }}>Name</label>
        <input type="text" required style={{ width: '100%', padding: '1rem', background: 'transparent', border: '1px solid rgba(150,150,150,0.3)', borderRadius: '12px', color: 'inherit', outline: 'none' }} />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#888' }}>Email</label>
        <input type="email" required style={{ width: '100%', padding: '1rem', background: 'transparent', border: '1px solid rgba(150,150,150,0.3)', borderRadius: '12px', color: 'inherit', outline: 'none' }} />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#888' }}>Message</label>
        <textarea required rows={4} style={{ width: '100%', padding: '1rem', background: 'transparent', border: '1px solid rgba(150,150,150,0.3)', borderRadius: '12px', color: 'inherit', outline: 'none', resize: 'vertical' }}></textarea>
      </div>
      <button type="submit" disabled={status === 'sending' || status === 'success'} className="btn btn-pill" style={{ justifyContent: 'center', background: status === 'success' ? '#2ecc71' : 'var(--accent-glow-strong)', color: '#fff', border: 'none', padding: '1rem' }}>
        {status === 'idle' && <><Send size={18} /> Send Message</>}
        {status === 'sending' && 'Sending...'}
        {status === 'success' && <><CheckCircle size={18} /> Sent Successfully</>}
      </button>
    </form>
  );
};

// --- Circular Project Wheel / Mobile Stack ---
const ProjectWheel = ({ projects, setSelectedId, isMobile }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Reset active index if projects list shrinks (due to filtering)
  useEffect(() => {
    if (activeIndex >= projects.length) setActiveIndex(0);
  }, [projects, activeIndex]);

  if (projects.length === 0) return <div style={{ color: '#888', textAlign: 'center', padding: '4rem' }}>No architectures match this category.</div>;

  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
        <AnimatePresence mode="popLayout">
          {projects.map((p) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', borderRadius: '12px', background: `${p.color}20`, color: p.color, marginBottom: '1.5rem' }}>
                {p.icon}
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', fontFamily: 'Outfit', lineHeight: 1.2 }}>{p.title}</h3>
              <p style={{ color: '#bbb', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>{p.desc}</p>
              <div style={{ color: p.color, fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Tap for Details <ExternalLink size={14} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  }

  // Desktop Circular Wheel
  return (
    <div style={{ position: 'relative', width: '100%', height: '800px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2rem', overflow: 'hidden' }}>
      <AnimatePresence mode="popLayout">
        {projects.map((p, i) => {
          const isActive = i === activeIndex;
          const orbitTotal = Math.max(projects.length - 1, 1);

          let orbitIndex = i;
          if (i > activeIndex) orbitIndex = i - 1;

          // Spread remaining items along an arc if there are multiple, or just place it if there's only one
          const angle = isActive ? 0 : (projects.length === 1 ? 0 : (orbitIndex / orbitTotal) * Math.PI * 2 - (Math.PI / 2));

          const radiusX = 450;
          const radiusY = 320;

          const x = isActive ? 0 : Math.cos(angle) * radiusX;
          const y = isActive ? 0 : Math.sin(angle) * radiusY;

          return (
            <motion.div
              key={p.id}
              layout
              onClick={() => { if (!isActive) setActiveIndex(i); }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                x,
                y,
                scale: isActive ? 1.05 : 0.65,
                opacity: isActive ? 1 : 0.4,
                zIndex: isActive ? 50 : 10,
                filter: isActive ? 'blur(0px)' : 'blur(3px)'
              }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', borderRadius: '12px', background: `${p.color}20`, color: p.color, marginBottom: '1.5rem' }}>
                {p.icon}
              </div>
              <h3 style={{ fontSize: isActive ? '2.2rem' : '1.3rem', fontWeight: 800, marginBottom: '1rem', fontFamily: 'Outfit', lineHeight: 1.2 }}>{p.title}</h3>

              <AnimatePresence mode="wait">
                {isActive && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
                    <p style={{ color: '#bbb', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>{p.desc}</p>
                    <button onClick={() => setSelectedId(p.id)} className="btn btn-pill" style={{ borderColor: p.color, color: p.color, background: 'transparent' }}>
                      View Architecture <ExternalLink size={16} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

// --- Terminal Easter Egg ---
const DevOpsTerminal = ({ isMobile, setIsHackMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState([{ cmd: "", out: "AshiqOS v1.1.0 initialized.\nType 'help' to see commands." }]);
  const [input, setInput] = useState("");

  if (isMobile) return null; // Hide terminal easter egg on mobile

  const handleCommand = (e) => {
    if (e.key === "Enter") {
      const cmd = input.trim().toLowerCase();
      let out = "";
      if (cmd === "help") out = "Available commands:\nwhoami\nls projects\ncat skills.txt\nwizzo.sh\ndownload cv\ncontact\nclear";
      else if (cmd === "whoami") out = "Ashiq Muneeb\nSystem Architect, Edge AI Integrator, AWS Specialist.";
      else if (cmd === "cat skills.txt") out = "[SOFTWARE ARSENAL]\nPython, FastAPI, React, Node.js, AWS EC2, MySQL 9\n\n[HARDWARE TOOLKIT]\nRaspberry Pi 4/5, ESP8266, YOLO Edge Models, 5V Relays, NEO-6M GPS";
      else if (cmd === "ls projects") out = "drwxr-xr-x crowd_density\ndrwxr-xr-x speed_tracking_lpr\ndrwxr-xr-x wizzo_crm\ndrwxr-xr-x real_estate_portal\ndrwxr-xr-x bakereach_dashboard\ndrwxr-xr-x face_recognition_loyalty\ndrwxr-xr-x aws_storage_auditor";
      else if (cmd === "clear") { setHistory([]); setInput(""); return; }
      else if (cmd === "wizzo.sh") out = "Connecting to wizzo_backend...\n[OK] Express 5 API running.\n[OK] WebSockets Bound on Port 8001.\nFetching real-time MySQL 9 triggers...\n[ACCESS GRANTED]";
      else if (cmd === "sudo su" || cmd === "hack") {
        out = "[!] ROOT PRIVILEGES GRANTED. INITIATING PROTOCOL RED.";
        setIsHackMode(true);
      }
      else if (cmd === "contact") {
        out = "Initializing secure communication channel... Scrolling.";
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      }
      else if (cmd === "download cv") {
        out = "Downloading Ashiq_Muneeb_CV.pdf...";
        const link = document.createElement('a');
        link.href = '/Ashiq_Muneeb_CV_METI.pdf';
        link.download = 'Ashiq_Muneeb_CV.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      else if (cmd !== "") out = `Command not found: ${cmd}`;

      playType();
      setHistory(prev => [...prev, { cmd, out }]);
      setInput("");
      setTimeout(() => {
        const body = document.getElementById('terminal-body-scroll');
        if (body) body.scrollTop = body.scrollHeight;
      }, 50);
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
          <div id="terminal-body-scroll" className="terminal-body" onClick={() => document.getElementById('term-input')?.focus()} style={{ overflowY: 'auto' }}>
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
  const [loadingLines, setLoadingLines] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isHackMode, setIsHackMode] = useState(false);
  const [theme, setTheme] = useState('cyber');
  const [isMuted, setIsMuted] = useState(false);
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    globalIsMuted = isMuted;
  }, [isMuted]);
  
  // Live Telemetry
  const [dbQueries, setDbQueries] = useState("1.20");
  const [edgeStatus, setEdgeStatus] = useState("ONLINE");

  const [windowWidth] = useWindowSize();
  const isMobile = windowWidth < 768;

  const { scrollYProgress } = useScroll();
  const backgroundColor = theme === 'cyber' ? "#0a0a0f" : "#f8f9fa";
  const textColor = theme === 'cyber' ? "#f0f0f5" : "#121212";

  useEffect(() => {
    let lenis;
    if (!isMobile) {
      lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), direction: 'vertical', smooth: true });
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
    }

    const bootSequence = [
      "[OK] Booting AshiqOS System Kernel...",
      "[OK] Loading System Architectures...",
      "[OK] Mounting Edge NPU Drivers...",
      "[OK] Establishing WebSocket Tunnel...",
      "[OK] Fetching YOLO Tensor Weights...",
      "[OK] Boot Sequence Complete. Launching UI..."
    ];
    let step = 0;
    const interval = setInterval(() => {
      setLoadingLines(prev => {
        const next = [...prev, bootSequence[step]];
        playType();
        return next;
      });
      step++;
      if (step >= bootSequence.length) {
        clearInterval(interval);
        setTimeout(() => setLoading(false), 800);
      }
    }, 400);

    const telemetryInterval = setInterval(() => {
      setDbQueries((1.15 + Math.random() * 0.1).toFixed(2));
      if (Math.random() > 0.85) {
        setEdgeStatus("SYNCING...");
        setTimeout(() => setEdgeStatus("ONLINE"), 800);
      }
    }, 1500);

    return () => { if (lenis) lenis.destroy(); clearInterval(interval); clearInterval(telemetryInterval); };
  }, [isMobile]);

  useEffect(() => {
    if (isHackMode) {
      document.documentElement.style.setProperty('--accent-glow-strong', '#ff0033');
      document.documentElement.style.setProperty('--accent-glow', 'rgba(255,0,51,0.5)');
    } else {
      document.documentElement.style.setProperty('--accent-glow-strong', '#eb6434');
      document.documentElement.style.setProperty('--accent-glow', 'rgba(235,100,52,0.5)');
    }
  }, [isHackMode]);

  const handleCategoryChange = (cat) => {
    playClick();
    setActiveCategory(cat);
  };

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return PROJECTS;
    return PROJECTS.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <motion.div style={{ backgroundColor, color: textColor, minHeight: '100vh', transition: 'background-color 0.5s ease, color 0.5s ease' }} className="noise-bg">
      <motion.div style={{ scaleX: scrollYProgress, transformOrigin: 'left', position: 'fixed', top: 0, left: 0, right: 0, height: '4px', background: 'var(--accent-glow-strong)', zIndex: 11000 }} />

      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.5 } }} className="preloader" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '2rem', fontFamily: 'monospace', fontSize: '1rem', background: '#0a0a0f', color: 'var(--accent-glow-strong)', justifyContent: 'flex-end', zIndex: 99999 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', maxWidth: '800px' }}>
              {loadingLines.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
              <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} style={{ width: '10px', height: '1.2em', background: 'var(--accent-glow-strong)', display: 'inline-block' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && (
        <>
          <nav style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100, padding: isMobile ? '1rem 1.5rem' : '1.2rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(150,150,150,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontWeight: 800, fontSize: '1.2rem', fontFamily: 'Outfit, sans-serif' }}>
              <motion.div style={{ width: '28px', height: '28px', background: textColor, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div style={{ width: '10px', height: '10px', border: '2px solid', borderColor: backgroundColor, borderTop: 'none', borderRight: 'none', transform: 'rotate(-45deg)', marginTop: '-2px' }}></motion.div>
              </motion.div>
              Ashiq Muneeb
              <motion.div title="Open to Work" animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }} transition={{ repeat: Infinity, duration: 2 }} style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2ecc71', marginLeft: '0.5rem' }} />
            </div>
            {!isMobile ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                <div style={{ display: 'flex', gap: '2rem', fontWeight: 600, fontSize: '0.95rem' }}>
                  <a href="#about" onMouseEnter={playHover}>About</a>
                  <a href="#architectures" onMouseEnter={playHover}>Architectures</a>
                  <a href="#case-studies" onMouseEnter={playHover}>Case Studies</a>
                </div>
                <button onClick={() => setIsMuted(m => !m)} className="btn btn-pill" style={{ padding: '0.5rem', borderRadius: '50%' }} title={isMuted ? "Unmute sounds" : "Mute sounds"}>
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <button onClick={() => setTheme(t => t === 'cyber' ? 'light' : 'cyber')} className="btn btn-pill" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                  {theme === 'cyber' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <motion.a href="#contact" className="btn btn-pill" style={{ fontWeight: 600, fontSize: '0.95rem', background: textColor, color: backgroundColor }}>
                  <Globe size={16} /> Connect
                </motion.a>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button onClick={() => setTheme(t => t === 'cyber' ? 'light' : 'cyber')} className="btn btn-pill" style={{ padding: '0.4rem', borderRadius: '50%' }}>
                  {theme === 'cyber' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="btn btn-pill" style={{ padding: '0.4rem', borderRadius: '50%', background: mobileMenuOpen ? 'var(--accent-glow-strong)' : 'transparent', color: mobileMenuOpen ? '#fff' : textColor }}>
                  {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            )}
          </nav>

          <AnimatePresence>
            {isMobile && mobileMenuOpen && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ position: 'fixed', top: '70px', left: 0, width: '100%', background: theme === 'cyber' ? 'rgba(15, 15, 20, 0.98)' : 'rgba(248, 249, 250, 0.98)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(150,150,150,0.1)', zIndex: 99, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                <a href="#about" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.2rem', fontWeight: 600 }}>About</a>
                <a href="#architectures" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.2rem', fontWeight: 600 }}>Architectures</a>
                <a href="#case-studies" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.2rem', fontWeight: 600 }}>Case Studies</a>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(150,150,150,0.1)', width: '100%', justifyContent: 'center' }}>
                  <span style={{ color: '#888' }}>Sound Effects:</span>
                  <button onClick={() => setIsMuted(m => !m)} className="btn btn-pill" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                </div>
                <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="btn btn-pill" style={{ fontWeight: 600, fontSize: '1.1rem', background: 'var(--accent-glow-strong)', color: '#fff', width: '100%', justifyContent: 'center' }}>
                  <Globe size={16} /> Connect
                </a>
              </motion.div>
            )}
          </AnimatePresence>

          <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '100px', paddingBottom: '60px', overflow: 'hidden' }}>
            {/* 3D Background Injection */}
            <Suspense fallback={null}>
              <ThreeDBackground isHackMode={isHackMode} />
            </Suspense>
            <CircuitBackground />

            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4rem', flexWrap: 'wrap-reverse', zIndex: 10, position: 'relative' }}>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ flex: '1 1 400px', textAlign: isMobile ? 'center' : 'left' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(235, 100, 52, 0.1)', color: 'var(--accent-glow-strong)', padding: '0.5rem 1.2rem', borderRadius: '50px', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.5rem', border: '1px solid rgba(235, 100, 52, 0.2)' }}>
                  <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} style={{ width: '8px', height: '8px', background: 'var(--accent-glow-strong)', borderRadius: '50%' }} />
                  Currently shipping at WIZZO
                </div>

                <h1 style={{ fontSize: 'clamp(3rem, 10vw, 5rem)', fontWeight: 900, lineHeight: 1.1, fontFamily: 'Outfit', letterSpacing: '-1px', marginBottom: '1.5rem' }}>
                  Engineering <br /> <span style={{ color: 'var(--accent-glow-strong)' }}>Scalable Systems.</span>
                </h1>
                <p style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)', lineHeight: 1.6, color: '#666', maxWidth: '500px', marginBottom: '3rem', fontWeight: 500, margin: isMobile ? '0 auto 3rem' : '0 0 3rem' }}>
                  I'm Ashiq Muneeb. I architect and own complex, multi-layered systems—bridging the gap from physical hardware integration to deep edge AI models and scalable AWS cloud infrastructures.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start', marginBottom: '2rem' }}>
                  <motion.a href="#architectures" className="btn btn-pill" style={{ background: textColor, color: backgroundColor, padding: '1rem 2rem', fontSize: '1.1rem', width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}>
                    View Architectures
                  </motion.a>
                  <motion.a href="/Ashiq_Muneeb_CV_METI.pdf" download="Ashiq_Muneeb_CV.pdf" className="btn btn-pill" style={{ padding: '1rem 2rem', fontSize: '1.1rem', border: '1px solid', borderColor: textColor, color: textColor, width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}>
                    Download CV <Download size={18} />
                  </motion.a>
                </div>

                {/* IoT Telemetry Widgets */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(15,15,20,0.6)', padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid rgba(84,160,255,0.4)', backdropFilter: 'blur(10px)' }}>
                    <div style={{ color: '#54a0ff' }}><Wifi size={20} /></div>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Edge Node</div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', fontFamily: 'monospace' }}>{edgeStatus}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(15,15,20,0.6)', padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid rgba(255,107,107,0.4)', backdropFilter: 'blur(10px)' }}>
                    <div style={{ color: '#ff6b6b' }}><Database size={20} /></div>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>DB Queries</div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', fontFamily: 'monospace' }}>{dbQueries}M/s</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(15,15,20,0.6)', padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid rgba(78,205,196,0.4)', backdropFilter: 'blur(10px)' }}>
                    <div style={{ color: '#4ecdc4' }}><Activity size={20} /></div>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>YOLO Inference</div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', fontFamily: 'monospace' }}>26 TOPS</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }} style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'linear-gradient(45deg, var(--accent-glow-strong) 0%, transparent 60%)', borderRadius: '32px', filter: 'blur(60px)', opacity: 0.3, zIndex: 0 }}></div>
                <img src="/images/profile_final.png" alt="Ashiq Muneeb" style={{ width: '100%', maxWidth: '450px', aspectRatio: '4/5', objectFit: 'cover', borderRadius: '32px', zIndex: 5, position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
              </motion.div>
            </div>
          </section>

          <section id="about" style={{ padding: '80px 0', borderTop: '1px solid rgba(150,150,150,0.1)' }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="container">

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
                {/* Stats & Skills Left Side */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                  <motion.div variants={fadeInUp} style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <StatCounter value="2" label="Years Experience" />
                    <StatCounter value="9" label="Architectures Shipped" />
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <h2 style={{ fontSize: 'clamp(1.5rem, 2vw, 2rem)', fontWeight: 800, fontFamily: 'Outfit', marginBottom: '1rem' }}>Software Arsenal</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '2rem' }}>
                      {SOFTWARE_ARSENAL.map((skill, index) => (
                        <motion.span whileHover={{ scale: 1.05 }} key={`soft-${index}`} style={{ background: 'rgba(150,150,150,0.1)', border: '1px solid rgba(150,150,150,0.2)', padding: '0.6rem 1.2rem', borderRadius: '50px', fontWeight: 600, fontSize: '0.9rem', cursor: 'text' }}>
                          {skill}
                        </motion.span>
                      ))}
                    </div>

                    <h2 style={{ fontSize: 'clamp(1.5rem, 2vw, 2rem)', fontWeight: 800, fontFamily: 'Outfit', marginBottom: '1rem', color: 'var(--accent-glow-strong)' }}>Hardware Toolkit</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                      {HARDWARE_TOOLKIT.map((skill, index) => (
                        <motion.span whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(235, 100, 52, 0.4)' }} key={`hard-${index}`} style={{ background: 'rgba(235, 100, 52, 0.1)', border: '1px solid rgba(235, 100, 52, 0.3)', padding: '0.6rem 1.2rem', borderRadius: '50px', fontWeight: 600, fontSize: '0.9rem', color: 'var(--accent-glow-strong)', cursor: 'crosshair' }}>
                          <Cpu size={14} style={{ display: 'inline', marginRight: '6px', marginBottom: '-2px' }} />
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Experience Timeline Right Side */}
                <motion.div variants={fadeInUp} style={{ position: 'relative' }}>
                  <h2 style={{ fontSize: 'clamp(2rem, 3vw, 2.5rem)', fontWeight: 800, fontFamily: 'Outfit', marginBottom: '2rem' }}>Experience Journey</h2>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {EXPERIENCE.map((exp, index) => (
                      <div key={exp.id} style={{ position: 'relative', display: 'flex', gap: '1.5rem', minHeight: '120px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'transparent', border: '3px solid var(--accent-glow-strong)', zIndex: 2 }}></div>
                          {index !== EXPERIENCE.length - 1 && <div style={{ width: '2px', flex: 1, background: 'rgba(150,150,150,0.2)', margin: '4px 0' }}></div>}
                        </div>
                        <div style={{ paddingBottom: index === EXPERIENCE.length - 1 ? '0' : '2.5rem', marginTop: '-4px' }}>
                          <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{exp.role}</h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.4rem', marginBottom: '1rem' }}>
                            <span style={{ color: 'var(--accent-glow-strong)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem' }}>
                              <GitBranch size={14} /> {exp.company}
                            </span>
                            <span style={{ color: '#888', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <GitCommit size={14} /> {exp.duration}
                            </span>
                          </div>
                          <p style={{ color: '#666', lineHeight: 1.6 }}>{exp.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '4rem' }}>
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

          {/* Project Architectures */}
          <section id="architectures" style={{ padding: '80px 0', background: 'rgba(150,150,150,0.02)' }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="container">
              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'flex-end', marginBottom: '3rem', color: '#fff' }}>
                <motion.div variants={fadeInUp} style={{ textAlign: 'left', marginBottom: isMobile ? '1.5rem' : '0' }}>
                  <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', fontWeight: 800, fontFamily: 'Outfit' }}>System Architectures</h2>
                  <p style={{ color: '#aaa', fontSize: '1.1rem', marginTop: '1rem', maxWidth: '600px' }}>
                    {isMobile ? "Tap any card below to read the deep-dive." : "Click any card in the orbital wheel to focus on the architecture details."}
                  </p>
                </motion.div>

                {/* Filter Buttons */}
                <motion.div variants={fadeInUp} style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.4rem', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap' }}>
                  {['All', 'Backend', 'AI', 'DevOps', 'Frontend'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      style={{ padding: '0.6rem 1.2rem', borderRadius: '50px', fontWeight: 600, fontSize: '0.9rem', color: activeCategory === cat ? '#fff' : '#888', background: activeCategory === cat ? 'var(--accent-glow-strong)' : 'transparent', transition: 'all 0.3s' }}
                    >
                      {cat}
                    </button>
                  ))}
                </motion.div>
              </div>

              <motion.div variants={fadeInUp}>
                <ProjectWheel projects={filteredProjects} setSelectedId={setSelectedId} isMobile={isMobile} />
              </motion.div>
            </motion.div>
          </section>

          {/* New Sections: GitHub Activity & Case Studies */}
          <section id="case-studies" style={{ padding: '80px 0', borderTop: '1px solid rgba(150,150,150,0.1)' }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
              <motion.div variants={fadeInUp} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <GithubActivity />
                <Suspense fallback={null}>
                  <CodingStats />
                </Suspense>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem', color: 'var(--accent-glow-strong)' }}>
                  <FileText size={24} />
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit' }}>Technical Case Studies</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {CASE_STUDIES.map(cs => (
                    <div key={cs.id} onClick={() => setSelectedCaseStudy(cs.id)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(150,150,150,0.03)', border: '1px solid rgba(150,150,150,0.08)', borderRadius: '16px', transition: 'transform 0.3s', cursor: 'pointer' }} className="cs-card">
                      <div>
                        <div style={{ display: 'inline-block', padding: '0.3rem 0.8rem', background: 'rgba(235, 100, 52, 0.1)', color: 'var(--accent-glow-strong)', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.8rem' }}>{cs.tag}</div>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'inherit', marginBottom: '0.3rem' }}>{cs.title}</h4>
                        <span style={{ color: '#888', fontSize: '0.9rem' }}>{cs.readTime}</span>
                      </div>
                      <button className="btn btn-pill" style={{ borderColor: 'rgba(150,150,150,0.4)', color: 'inherit' }}>Read <ExternalLink size={14} /></button>
                    </div>
                  ))}
                  <style>{`.cs-card:hover { transform: translateX(10px); background: rgba(150,150,150,0.06) !important; border-color: rgba(150,150,150,0.2) !important; }`}</style>
                </div>
              </motion.div>
            </motion.div>
          </section>

          {/* Case Study Modal (Projects) */}
          <AnimatePresence>
            {selectedId && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overlay-backdrop" onClick={() => setSelectedId(null)} style={{ padding: isMobile ? '1rem' : '0' }}>
                {PROJECTS.map(p => p.id === selectedId && (
                  <motion.div layoutId={`card-${p.id}`} key={p.id} className="project-modal" onClick={(e) => e.stopPropagation()} style={{ width: '100%', padding: isMobile ? '2rem 1.5rem' : '4rem', maxHeight: '90vh' }}>
                    <button className="project-modal-close" onClick={() => setSelectedId(null)} style={{ top: isMobile ? '1rem' : '2rem', right: isMobile ? '1rem' : '2rem' }}><X size={20} /></button>
                    <div style={{ width: isMobile ? '60px' : '80px', height: isMobile ? '60px' : '80px', borderRadius: '20px', background: `${p.color}15`, color: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                      {p.icon}
                    </div>
                    <h3 style={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: 900, fontFamily: 'Outfit', lineHeight: 1.1, marginBottom: '1rem' }}>{p.title}</h3>
                    <p style={{ color: '#aaa', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>{p.desc}</p>

                    {p.image && (
                      <div style={{ marginBottom: '2rem', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <img src={p.image} alt={p.title} style={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: '400px' }} />
                      </div>
                    )}

                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: isMobile ? '1.5rem' : '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: p.color }}>Architecture Schematic</h4>

                      {/* React Flow Interactive Diagram */}
                      <div id={`flow-${p.id}`} style={{ height: '200px', width: '100%', marginBottom: '2rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }} onWheel={(e) => e.stopPropagation()}>
                        <ReactFlow nodes={p.flow.nodes} edges={p.flow.edges} fitView attributionPosition="bottom-right">
                          <Background color="#111216" gap={16} />
                        </ReactFlow>
                      </div>

                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <a href="https://github.com/ashiqmuneeb" target="_blank" rel="noreferrer" className="btn btn-pill" style={{ border: `1px solid ${p.color}`, color: p.color, width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}>
                          View Repository <ExternalLink size={16} />
                        </a>
                        <button className="btn btn-pill" style={{ border: `1px solid ${p.color}`, color: p.color, width: isMobile ? '100%' : 'auto', justifyContent: 'center' }} onClick={() => {
                          const node = document.getElementById(`flow-${p.id}`);
                          toPng(node, { backgroundColor: '#111216' }).then(url => {
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${p.id}_architecture.png`;
                            a.click();
                          });
                        }}>
                          Export Architecture <Download size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {selectedCaseStudy && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overlay-backdrop" onClick={() => setSelectedCaseStudy(null)} style={{ padding: isMobile ? '1rem' : '2rem', zIndex: 100000 }}>
                {CASE_STUDIES.map(cs => cs.id === selectedCaseStudy && (
                  <motion.div layoutId={`cs-${cs.id}`} key={cs.id} className="project-modal" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '1000px', padding: isMobile ? '2rem' : '4rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
                    <button className="project-modal-close" onClick={() => setSelectedCaseStudy(null)} style={{ top: '1.5rem', right: '1.5rem', position: 'absolute', zIndex: 10, background: 'rgba(0,0,0,0.5)' }}><X size={20} /></button>
                    <div style={{ display: 'inline-block', padding: '0.4rem 1rem', background: 'rgba(235, 100, 52, 0.1)', color: 'var(--accent-glow-strong)', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 700, marginBottom: '1.5rem', width: 'fit-content' }}>{cs.tag}</div>
                    
                    <Suspense fallback={<div>Loading Case Study...</div>}>
                      <MarkdownReader content={cs.content} />
                    </Suspense>

                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Contact Section */}
          <section id="contact" style={{ padding: '100px 0', textAlign: 'center', background: 'rgba(150,150,150,0.02)', borderTop: '1px solid rgba(150,150,150,0.1)' }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="container" style={{ maxWidth: '800px' }}>
              <motion.h2 variants={fadeInUp} style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: 900, marginBottom: '1.5rem', fontFamily: 'Outfit', lineHeight: 1.1, color: 'inherit' }}>
                Let's build something <br /> <span style={{ color: 'var(--accent-glow-strong)' }}>extraordinary.</span>
              </motion.h2>
              <motion.p variants={fadeInUp} style={{ fontSize: '1.1rem', color: '#888', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
                Whether you need to architect a new cloud infrastructure, integrate a custom AI model, or build hardware systems—I'm ready to help.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <ContactForm />
              </motion.div>

              <motion.div variants={fadeInUp} style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '3rem' }}>
                <motion.a href="mailto:Ashiqam75@gmail.com" className="btn btn-pill" style={{ fontSize: '1.1rem', padding: '1rem 2rem', background: textColor, color: backgroundColor, width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}>
                  <Mail size={20} /> Ashiqam75@gmail.com
                </motion.a>
                <motion.a href="tel:+917994910491" className="btn btn-pill" style={{ fontSize: '1.1rem', padding: '1rem 2rem', border: '1px solid', borderColor: textColor, color: textColor, width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}>
                  <Phone size={20} /> +91 7994910491
                </motion.a>
              </motion.div>
            </motion.div>
          </section>

          <footer style={{ padding: '3rem 0', textAlign: 'center', borderTop: '1px solid rgba(150,150,150,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
              <a href="https://github.com/ashiqmuneeb" target="_blank" rel="noreferrer" style={{ color: '#888', transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = '#888'}>
                <Github size={24} />
              </a>
              <a href="https://www.linkedin.com/in/ashiq-muneeb/" target="_blank" rel="noreferrer" style={{ color: '#888', transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color = '#0077b5'} onMouseOut={e => e.currentTarget.style.color = '#888'}>
                <Linkedin size={24} />
              </a>
            </div>
            <p style={{ color: '#888', fontWeight: 500 }}>&copy; {new Date().getFullYear()} Ashiq Muneeb. Crafted with precision.</p>
          </footer>

          <Suspense fallback={null}>
            <AIChatbot isMobile={isMobile} />
          </Suspense>
          <DevOpsTerminal isMobile={isMobile} setIsHackMode={setIsHackMode} />
        </>
      )}

      <Suspense fallback={null}>
        {!isMobile && <CustomCursor />}
        <CommandPalette isOpen={cmdPaletteOpen} setIsOpen={setCmdPaletteOpen} setTheme={setTheme} theme={theme} />
      </Suspense>
    </motion.div>
  );
};

export default App;
