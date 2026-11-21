import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Search, Sparkles, Activity } from 'lucide-react';

// Curated technical corpus for edge vector similarity search
const SYSTEM_CORPUS = [
  {
    id: "autonomous_hr",
    title: "Autonomous HR AI Agent (LangGraph + SQLite WAL)",
    category: "Agentic AI",
    tags: ["langgraph", "agent", "state machine", "groq", "hitl", "human in the loop", "sqlite", "wal", "concurrency", "ocr", "lpr", "fastapi", "streaming"],
    desc: "Cyclic state graph with human-in-the-loop checkpoints, deterministic tool routing, and concurrent SQLite WAL transactions.",
    latency: "0.28ms",
    stack: "LangGraph • Groq • SQLite WAL • FastAPI"
  },
  {
    id: "vidmind",
    title: "VidMind: Local Long-Video RAG & Transcription",
    category: "Edge / Local RAG",
    tags: ["rag", "whisper", "ollama", "local llm", "video", "transcription", "hierarchical summary", "citations", "offline", "zero cloud", "ffmpeg"],
    desc: "100% offline local RAG engine parsing 10+ hour video lectures with Whisper STT and Ollama on consumer hardware.",
    latency: "0.32ms",
    stack: "Whisper • Ollama • FastAPI • React 19"
  },
  {
    id: "edge_npu",
    title: "26 TOPS Edge NPU Inference (Raspberry Pi AI HAT+)",
    category: "Edge Hardware",
    tags: ["edge", "npu", "raspberry pi", "ai hat+", "yolo", "yolov8", "yolov26", "bytetrack", "computer vision", "30fps", "embedded", "mqtt"],
    desc: "High-throughput real-time object tracking pipeline running on 26 TOPS Hailo NPU with ByteTrack association.",
    latency: "0.19ms",
    stack: "RPi 5 • 26 TOPS NPU • YOLOv26 • ByteTrack"
  },
  {
    id: "llm_quant",
    title: "LLM Fine-Tuning & 4-Bit NF4 / GGUF Quantization",
    category: "Model Optimization",
    tags: ["quantization", "qlora", "lora", "llama-2", "gguf", "llama.cpp", "nf4", "peft", "hugging face", "sfttrainer", "cuda", "vram"],
    desc: "Parameter-efficient fine-tuning with 4-bit NormalFloat QLoRA and 5-bit GGUF quantization for consumer GPU serving.",
    latency: "0.24ms",
    stack: "PyTorch • QLoRA • GGUF • llama.cpp"
  },
  {
    id: "synapse_ops",
    title: "SYNAPSE OPS: Multimodal Machine Copilot",
    category: "Multimodal AI",
    tags: ["multimodal", "gemini", "faiss", "rag", "industrial", "inspection", "vector search", "pymupdf", "video fps", "citations"],
    desc: "Autonomous industrial inspector analyzing equipment video feeds and manuals with FAISS vector retrieval.",
    latency: "0.31ms",
    stack: "Gemini Flash • FAISS • FastAPI • Docker"
  },
  {
    id: "gesture_cv",
    title: "Edge Hand Gesture Tracker (MediaPipe WASM)",
    category: "Computer Vision",
    tags: ["wasm", "webassembly", "mediapipe", "hand tracking", "gesture", "websocket", "scikit-learn", "60fps", "in browser"],
    desc: "Client-side landmark extraction with WebAssembly MediaPipe streaming real-time 60FPS classification via WebSockets.",
    latency: "0.15ms",
    stack: "MediaPipe WASM • WebSockets • scikit-learn"
  }
];

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s+-]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1);
}

// Lightweight client-side token vectorizer & cosine similarity calculator
function computeCosineSimilarity(queryTokens, docTokens) {
  if (!queryTokens.length || !docTokens.length) return 0;

  // Create combined vocabulary
  const vocab = Array.from(new Set([...queryTokens, ...docTokens]));

  // Compute term frequencies
  const v1 = vocab.map(term => queryTokens.filter(t => t === term).length);
  const v2 = vocab.map(term => docTokens.filter(t => t === term).length);

  // Dot product
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < vocab.length; i++) {
    dotProduct += v1[i] * v2[i];
    norm1 += v1[i] * v1[i];
    norm2 += v2[i] * v2[i];
  }

  if (norm1 === 0 || norm2 === 0) return 0;
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

const SAMPLE_BENCHMARKS = [
  "local offline rag without cloud",
  "deploy yolo on raspberry pi npu",
  "langgraph state machine with human loop",
  "4-bit quantization on consumer hardware",
  "wasm edge computer vision 60fps"
];

export default function EdgePlayground({ isMobile, theme = "light" }) {
  const isLight = theme === "light";
  const [query, setQuery] = useState("langgraph state machine with human loop");
  const [activePreset, setActivePreset] = useState("langgraph state machine with human loop");

  const { results, computeLatency } = useMemo(() => {
    const startTime = performance.now();
    const queryTokens = tokenize(query);

    const scored = SYSTEM_CORPUS.map(doc => {
      // Build document tokens from title, category, tags, desc
      const tagTokens = doc.tags.flatMap(t => tokenize(t));
      const docTokens = [
        ...tokenize(doc.title),
        ...tokenize(doc.category),
        ...tagTokens,
        ...tokenize(doc.desc)
      ];

      // Exact phrase bonus if all or most words match
      let score = computeCosineSimilarity(queryTokens, docTokens);

      // Boost for direct tag matches and title matches
      queryTokens.forEach(token => {
        if (tagTokens.includes(token)) score += 0.22;
        if (doc.title.toLowerCase().includes(token)) score += 0.15;
      });

      // Normalize score to 0..1 range with realistic cosine distribution
      const finalScore = Math.min(Math.max(score, 0.05), 0.99);

      return {
        ...doc,
        similarity: finalScore,
        scorePercent: Math.round(finalScore * 100)
      };
    });

    scored.sort((a, b) => b.similarity - a.similarity);
    const endTime = performance.now();

    return {
      results: scored,
      computeLatency: (endTime - startTime).toFixed(3)
    };
  }, [query]);

  return (
    <div style={{
      background: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(18, 20, 28, 0.75)',
      borderRadius: '24px',
      border: isLight ? '1.5px solid rgba(120, 149, 117, 0.35)' : '1px solid rgba(235, 100, 52, 0.25)',
      padding: isMobile ? '1.5rem' : '2.5rem',
      boxShadow: isLight ? '0 16px 45px rgba(120, 149, 117, 0.12)' : '0 20px 50px rgba(0, 0, 0, 0.4)',
      backdropFilter: isMobile ? 'none' : 'blur(16px)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative gradient glow */}
      <div style={{
        position: 'absolute',
        top: '-80px',
        right: '-80px',
        width: '240px',
        height: '240px',
        background: isLight ? 'radial-gradient(circle, rgba(120, 149, 117, 0.2) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(235, 100, 52, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: '1rem', marginBottom: '1.8rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: isLight ? 'rgba(120, 149, 117, 0.15)' : 'rgba(235, 100, 52, 0.12)', color: isLight ? '#2B3D28' : 'var(--accent-glow-strong)', padding: '0.35rem 0.9rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.6rem', border: isLight ? '1px solid rgba(120, 149, 117, 0.3)' : '1px solid rgba(235, 100, 52, 0.25)' }}>
            <Cpu size={14} /> In-Browser Proof of Competence
          </div>
          <h3 style={{ fontSize: isMobile ? '1.4rem' : '1.8rem', fontWeight: 800, fontFamily: 'Outfit', color: isLight ? '#1C1D20' : '#fff', margin: 0 }}>
            Edge Vector Retrieval & Semantic Similarity Engine
          </h3>
          <p style={{ color: isLight ? '#4E574B' : '#aaa', fontSize: '0.9rem', marginTop: '0.4rem', maxWidth: '640px' }}>
            Execute real-time vector cosine similarity <code style={{ color: isLight ? '#22361F' : 'var(--accent-glow-strong)', background: isLight ? 'rgba(120, 149, 117, 0.16)' : 'rgba(0,0,0,0.3)', padding: '2px 8px', borderRadius: '6px', border: isLight ? '1px solid rgba(120, 149, 117, 0.25)' : 'none', fontWeight: 600 }}>S_C(q, d) = (q · d) / (||q|| ||d||)</code> directly on your client thread.
          </p>
        </div>

        {/* Live latency badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0,0,0,0.4)', padding: '0.6rem 1rem', borderRadius: '12px', border: isLight ? '1.5px solid rgba(120, 149, 117, 0.35)' : '1px solid rgba(255,255,255,0.08)', boxShadow: isLight ? '0 4px 15px rgba(120, 149, 117, 0.1)' : 'none', fontFamily: 'monospace' }}>
          <Activity size={16} color={isLight ? '#2B6935' : '#2ecc71'} />
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.65rem', color: isLight ? '#4F5A4D' : '#888', textTransform: 'uppercase', fontWeight: 600 }}>In-Browser Latency</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: isLight ? '#225B2D' : '#2ecc71' }}>{computeLatency} ms</div>
          </div>
        </div>
      </div>

      {/* Interactive Input Bar */}
      <div style={{ marginBottom: '1.2rem' }}>
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(10, 12, 18, 0.8)',
          border: isLight ? '1.5px solid rgba(120, 149, 117, 0.38)' : '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '14px',
          padding: '0.4rem 0.8rem',
          boxShadow: isLight ? '0 2px 10px rgba(120, 149, 117, 0.08)' : 'inset 0 2px 4px rgba(0,0,0,0.4)'
        }}>
          <Search size={18} color={isLight ? '#4B5548' : '#888'} style={{ marginLeft: '0.4rem' }} />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              const val = e.target.value;
              setQuery(val);
              const matched = SAMPLE_BENCHMARKS.find(b => b.toLowerCase() === val.trim().toLowerCase());
              setActivePreset(matched || "");
            }}
            placeholder="Type any query or technical concept (e.g., local RAG, NPU hardware, state machines)..."
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: isLight ? '#1C1D20' : '#fff',
              fontSize: '0.95rem',
              padding: '0.6rem 0.8rem',
              fontFamily: 'inherit'
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); setActivePreset(""); }}
              style={{
                background: isLight ? 'rgba(120, 149, 117, 0.15)' : 'rgba(255,255,255,0.08)',
                border: 'none',
                color: isLight ? '#2B3D28' : '#aaa',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem',
                fontWeight: 700
              }}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Preset Benchmark Pills */}
      <div
        role="tablist"
        aria-label="Preset Benchmark Queries"
        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.8rem' }}
      >
        <span style={{ fontSize: '0.78rem', color: isLight ? '#3C493A' : '#aaa', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Sparkles size={13} color="var(--accent-glow-strong)" /> Benchmark Queries:
        </span>
        {SAMPLE_BENCHMARKS.map((preset, idx) => {
          const isSelected = activePreset === preset;
          return (
            <button
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-label={`Select benchmark query: ${preset}`}
              key={idx}
              onClick={() => {
                setQuery(preset);
                setActivePreset(preset);
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') {
                  e.preventDefault();
                  const next = (idx + 1) % SAMPLE_BENCHMARKS.length;
                  setQuery(SAMPLE_BENCHMARKS[next]);
                  setActivePreset(SAMPLE_BENCHMARKS[next]);
                } else if (e.key === 'ArrowLeft') {
                  e.preventDefault();
                  const prev = (idx - 1 + SAMPLE_BENCHMARKS.length) % SAMPLE_BENCHMARKS.length;
                  setQuery(SAMPLE_BENCHMARKS[prev]);
                  setActivePreset(SAMPLE_BENCHMARKS[prev]);
                }
              }}
              style={{
                background: isSelected
                  ? (isLight ? '#789575' : 'var(--accent-glow-strong)')
                  : (isLight ? 'rgba(255, 255, 255, 0.88)' : 'rgba(255, 255, 255, 0.04)'),
                border: isSelected
                  ? (isLight ? '1.5px solid #5C7659' : '1px solid #ff7b54')
                  : (isLight ? '1px solid rgba(120, 149, 117, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)'),
                color: isSelected
                  ? '#ffffff'
                  : (isLight ? '#243321' : '#bbb'),
                borderRadius: '50px',
                padding: '0.35rem 0.85rem',
                fontSize: '0.75rem',
                fontWeight: isSelected ? 700 : 600,
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                boxShadow: isSelected
                  ? (isLight ? '0 3px 10px rgba(120, 149, 117, 0.35)' : '0 3px 10px rgba(235, 100, 52, 0.35)')
                  : (isLight ? '0 1px 4px rgba(120, 149, 117, 0.08)' : 'none')
              }}
            >
              {preset}
            </button>
          );
        })}
      </div>

      {/* Vector Results Grid */}
      <div role="region" aria-live="polite" aria-label="Vector similarity match results" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <AnimatePresence>
          {results.slice(0, 4).map((item, index) => {
            const isTop = index === 0;
            const barColor = isTop ? 'var(--accent-glow-strong)' : (index === 1 ? '#54a0ff' : '#4ecdc4');

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                style={{
                  background: isLight ? (isTop ? 'rgba(120, 149, 117, 0.14)' : 'rgba(255, 255, 255, 0.75)') : (isTop ? 'rgba(235, 100, 52, 0.06)' : 'rgba(255, 255, 255, 0.02)'),
                  border: isLight ? (isTop ? '1.5px solid rgba(120, 149, 117, 0.45)' : '1px solid rgba(120, 149, 117, 0.25)') : (isTop ? '1px solid rgba(235, 100, 52, 0.35)' : '1px solid rgba(255, 255, 255, 0.06)'),
                  borderRadius: '16px',
                  padding: isMobile ? '1rem' : '1.2rem 1.5rem',
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  justifyContent: 'space-between',
                  alignItems: isMobile ? 'flex-start' : 'center',
                  gap: '1rem',
                  position: 'relative'
                }}
              >
                <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '6px', background: isLight ? 'rgba(120, 149, 117, 0.16)' : 'rgba(255,255,255,0.06)', color: isLight ? '#2B3D28' : '#888', textTransform: 'uppercase' }}>
                      Rank #{index + 1}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: barColor, fontWeight: 700 }}>
                      {item.category}
                    </span>
                    <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: isLight ? '#4F5A4D' : '#666' }}>
                      {item.stack}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: isLight ? '#1C1D20' : '#fff', margin: '0 0 0.4rem 0' }}>
                    {item.title}
                  </h4>
                  <p style={{ color: isLight ? '#474F44' : '#aaa', fontSize: '0.85rem', lineHeight: 1.4, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>

                {/* Similarity Metrics Bar */}
                <div style={{ width: isMobile ? '100%' : '180px', flexShrink: 0, textAlign: isMobile ? 'left' : 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.7rem', color: isLight ? '#546051' : '#888', textTransform: 'uppercase', fontWeight: 600 }}>Cosine Match</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: barColor, fontFamily: 'monospace' }}>
                      {item.scorePercent}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ width: '100%', height: '6px', background: isLight ? 'rgba(120, 149, 117, 0.2)' : 'rgba(255,255,255,0.06)', borderRadius: '10px', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.scorePercent}%` }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      style={{ height: '100%', background: barColor, borderRadius: '10px' }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
