import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal as TerminalIcon, X } from 'lucide-react';

export default function DevOpsTerminal({ isMobile, setIsHackMode, playType = () => {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState([
    { cmd: "", out: "AshiqOS v1.2.0 initialized.\nType 'help' to see commands." }
  ]);
  const [input, setInput] = useState("");

  if (isMobile) return null; // Hide terminal easter egg on mobile

  const handleCommand = (e) => {
    if (e.key === "Enter") {
      const cmd = input.trim().toLowerCase();
      let out = "";
      if (cmd === "help") {
        out = "Available commands:\nwhoami\nls projects\ncat skills.txt\ncat learning.txt\nwizzo.sh\ndownload cv\ncontact\nclear";
      } else if (cmd === "whoami") {
        out = "Ashiq Muneeb\nSystem Architect, AI & Autonomous Agents Integrator, Edge & Cloud Specialist.";
      } else if (cmd === "cat skills.txt") {
        out = "[SOFTWARE & AI ARSENAL]\nPython (FastAPI, Django), LangChain, LangGraph, PyTorch, QLoRA, GGUF, FAISS, Chroma, Whisper, Ollama, React 19, Node.js, SQLite WAL, MySQL 9, AWS EC2\n\n[HARDWARE & EDGE TOOLKIT]\nRaspberry Pi AI HAT+ (26 TOPS NPU), ESP32, YOLOv26, ByteTrack, MediaPipe WASM, Optical LPR / OCR";
      } else if (cmd === "cat learning.txt" || cmd === "study") {
        out = "[THEORETICAL & APPLIED FOUNDATIONS]\n• Multivariable Calculus: Gradients, Hessians, Chain Rule Backprop, Loss Convexity\n• Probability & Stats: Bayesian Inference, MLE/MAP, Gaussian/Bernoulli, KL-Divergence\n• Deep Learning: Transformer Self-Attention, ViT from scratch, 4-bit NF4 QLoRA, GGUF\n• Systems: Asyncio event loops, SQLite WAL concurrency, WebSockets & SSE streaming";
      } else if (cmd === "ls projects") {
        out = "drwxr-xr-x autonomous_hr_agent\ndrwxr-xr-x synapse_ops_copilot\ndrwxr-xr-x llm_finetuning_quantization\ndrwxr-xr-x vidmind_video_ai\ndrwxr-xr-x manhwa_comic_engine\ndrwxr-xr-x genai_rag_suite\ndrwxr-xr-x mockdesk_simulator\ndrwxr-xr-x wizzo_crm\ndrwxr-xr-x gesture_recognition_wasm\ndrwxr-xr-x cv_speed_lpr\ndrwxr-xr-x edge_pi_26tops";
      } else if (cmd === "clear") {
        setHistory([]);
        setInput("");
        return;
      } else if (cmd === "wizzo.sh") {
        out = "Connecting to wizzo_backend...\n[OK] Express 5 API running.\n[OK] WebSockets Bound on Port 8001.\nFetching real-time MySQL 9 triggers...\n[ACCESS GRANTED]";
      } else if (cmd === "sudo su" || cmd === "hack") {
        out = "[!] ROOT PRIVILEGES GRANTED. INITIATING PROTOCOL RED.";
        setIsHackMode(true);
      } else if (cmd === "contact") {
        out = "Initializing secure communication channel... Scrolling.";
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      } else if (cmd === "download cv") {
        out = "Downloading Ashiq_Muneeb_CV.pdf...";
        const link = document.createElement('a');
        link.href = '/Ashiq_Muneeb_CV_METI.pdf';
        link.download = 'Ashiq_Muneeb_CV.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (cmd !== "") {
        out = `Command not found: ${cmd}`;
      }

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
        <button
          className="btn btn-pill"
          style={{ background: '#0a0a0f', color: '#0f0', border: '1px solid #0f0' }}
          onClick={() => setIsOpen(true)}
        >
          <TerminalIcon size={16} /> Open Terminal
        </button>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="terminal-window">
          <div className="terminal-header">
            <span style={{ color: '#0f0' }}>root@ashiq-os:~</span>
            <X size={16} style={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)} />
          </div>
          <div
            id="terminal-body-scroll"
            className="terminal-body"
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            onClick={() => document.getElementById('term-input')?.focus()}
            style={{ overflowY: 'auto', overscrollBehavior: 'contain' }}
          >
            {history.map((h, i) => (
              <div key={i}>
                {h.cmd && <div style={{ color: '#0f0' }}>$ {h.cmd}</div>}
                <div style={{ whiteSpace: 'pre-line', marginBottom: '0.5rem' }}>{h.out}</div>
              </div>
            ))}
            <div style={{ display: 'flex', color: '#0f0' }}>
              <span>$</span>
              <input
                id="term-input"
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleCommand}
                style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', marginLeft: '0.5rem', width: '100%', fontFamily: 'monospace' }}
                autoFocus
                autoComplete="off"
                spellCheck="false"
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
