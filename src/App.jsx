import React, { useEffect, useState, useRef, useMemo, Suspense, lazy } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { Globe, Camera, Cpu, Server, MapPin, Mail, Phone, ExternalLink, HardDrive, Network, Workflow, X, Terminal as TerminalIcon, Code, Github, Linkedin, Download, FileText, Send, CheckCircle, GitCommit, GitBranch, Activity, Wifi, Database, Moon, Sun, Volume2, VolumeX, Menu, Brain, Calculator, Sparkles, Layers, BookOpen, Bot, Zap } from 'lucide-react';
import Lenis from '@studio-freight/lenis';
import { ReactFlow, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  revealLeft,
  revealRight,
  revealUp,
  viewportOnce,
  liftHover,
  tapPress,
  singleHeroPulse,
  modalFade
} from './utils/animations';
import FlipCard from './components/FlipCard';
import { toPng } from 'html-to-image';

const ThreeDBackground = lazy(() => import('./components/ThreeDBackground'));
const AIChatbot = lazy(() => import('./components/AIChatbot'));
const MarkdownReader = lazy(() => import('./components/MarkdownReader'));
const CommandPalette = lazy(() => import('./components/CommandPalette'));
const CustomCursor = lazy(() => import('./components/CustomCursor'));
const CodingStats = lazy(() => import('./components/CodingStats'));
const EdgePlayground = lazy(() => import('./components/EdgePlayground'));

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

const fadeInUp = revealUp;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
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


const NODE_DETAILS = {
  "Perimeter LPR / GPS": {
    role: "Perimeter Optical Ingestion & Fleet Telemetry",
    tradeoff: "Decoupled RTSP frames into a memory ring-buffer queue to prevent network backpressure during peak gate shifts.",
    snippet: `# RTSP stream non-blocking capture\ncap = cv2.VideoCapture(rtsp_stream)\ncap.set(cv2.CAP_PROP_BUFFERSIZE, 1)\nret, frame = cap.read()`
  },
  "LangGraph Graph": {
    role: "Cyclic State Machine & Conditional Router",
    tradeoff: "LangGraph state graphs chosen over linear chains to permit cyclical self-reflection, deterministic rollbacks, and Human-in-the-Loop interrupts.",
    snippet: `workflow = StateGraph(AgentState)\nworkflow.add_node("anomaly_audit", audit_step)\nworkflow.add_conditional_edges("audit", route_resolution)\napp = workflow.compile(checkpointer=MemorySaver())`
  },
  "Groq Reasoning": {
    role: "Sub-Second LPU Inference & JSON Tool Synthesizer",
    tradeoff: "Utilizes Groq Llama-3 70B for sub-300ms time-to-first-token inference with strict Pydantic JSON schema constraints.",
    snippet: `completion = client.chat.completions.create(\n    model="llama-3.3-70b-versatile",\n    response_format={"type": "json_object"},\n    messages=[{"role": "system", "content": SYSTEM_PROMPT}]\n)`
  },
  "HITL / SQLite WAL": {
    role: "Persistent Audit Trail & Supervisor Approval Checkpoint",
    tradeoff: "Enabled SQLite Write-Ahead Logging (WAL) and 5000ms busy_timeout for concurrent non-blocking reads during continuous gate writes.",
    snippet: `PRAGMA journal_mode = WAL;\nPRAGMA synchronous = NORMAL;\nPRAGMA busy_timeout = 5000;\n-- High write concurrency with zero table locks`
  },
  "RPi Camera": {
    role: "Embedded V4L2 Raw Optical Feed",
    tradeoff: "Streams 1080p YUV frames directly into Hailo NPU DMA buffers, bypassing CPU memory copies.",
    snippet: `libcamerasrc ! video/x-raw,width=1920,height=1080 ! appsink`
  },
  "AI HAT+ (YOLO)": {
    role: "26 TOPS NPU Tensor Accelerator",
    tradeoff: "Quantized 8-bit integer weights run at 30 FPS under 5W thermal budget instead of paying continuous cloud inference latency.",
    snippet: `runner = hailo_platform.VDevice()\nconfigured_model = runner.configure(hef_path="yolov26_npu.hef")`
  },
  "Local Inference": {
    role: "ByteTrack Multi-Object Association",
    tradeoff: "Maintains unique vehicle track IDs across occlusions with Kalman filters in O(N) complexity.",
    snippet: `tracker = ByteTrack(track_thresh=0.45, match_thresh=0.8)`
  },
  "Cloud Sync": {
    role: "Low-Bandwidth Telemetry Dispatcher",
    tradeoff: "Transmits compressed JSON metadata over MQTT every 5 seconds; zero raw video egress reduces bandwidth costs by 99%.",
    snippet: `mqtt_client.publish("telemetry/gate_01", json.dumps(batch_metrics), qos=1)`
  },
  "FFmpeg Demuxing": {
    role: "Memory-Bounded Stream Splitter",
    tradeoff: "Pipes audio stream directly to 16kHz mono WAV chunks via stdout without saving multi-gigabyte files to disk.",
    snippet: `ffmpeg -i input.mp4 -vn -acodec pcm_s16le -ar 16000 -ac 1 -f wav pipe:1`
  },
  "Whisper STT": {
    role: "Local Speech-to-Text Transcription",
    tradeoff: "Executes Whisper medium.en locally with dynamic silence VAD filtering to maximize throughput.",
    snippet: `segments, _ = whisper_model.transcribe(audio_chunk, vad_filter=True)`
  },
  "Chunk & Chapter": {
    role: "Hierarchical Document Synthesizer",
    tradeoff: "Sliding window of 1000 tokens with 200 token overlap ensures semantic continuity across video chapter boundaries.",
    snippet: `splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)`
  },
  "Ollama Local RAG": {
    role: "Air-Gapped Vector Retrieval & Q&A Assistant",
    tradeoff: "Zero proprietary data leaves user device; FAISS index queried in-memory with local Ollama Llama 3 embeddings.",
    snippet: `docs = vectorstore.similarity_search(query, k=4)\nresponse = ollama.generate(model="llama3:8b", prompt=build_rag_prompt(query, docs))`
  },
  "Dialogue Corpora": {
    role: "Dataset Tokenization & Cleaning",
    tradeoff: "Processed SAMSum dialogue tokens with dynamic padding to maximum sequence length of 1024.",
    snippet: `dataset = load_dataset("samsum")\ntokenized = dataset.map(preprocess_dialogue, batched=True)`
  },
  "NF4 4-Bit LoRA": {
    role: "4-bit NormalFloat QLoRA Fine-Tuning",
    tradeoff: "Freezes 16-bit base weights and trains rank-16 adapters; reduces VRAM from 28GB to 6GB with zero perplexity loss.",
    snippet: `bnb_config = BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_quant_type="nf4")\npeft_config = LoraConfig(r=16, lora_alpha=32, target_modules=["q_proj", "v_proj"])`
  },
  "Adapter Merge": {
    role: "LoRA Weight Fusion",
    tradeoff: "Fused LoRA weights back into base model parameters for zero-overhead inference serving.",
    snippet: `model = peft_model.merge_and_unload()`
  },
  "GGUF llama.cpp": {
    role: "5-Bit GGUF Quantization & Serving",
    tradeoff: "Quantizes fp16 model to Q5_K_M for deployment on CPU/Metal/CUDA with AVX-512 acceleration.",
    snippet: `./llama-quantize ./models/merged-model.bin ./models/model-q5_k_m.gguf q5_k_m`
  }
};

const PROJECTS = [
  {
    id: "autonomous_hr",
    title: "Autonomous HR AI Agent",
    desc: "Enterprise autonomous workforce intelligence agent powered by LangGraph cyclic state graphs, Groq LLM reasoning, optical License Plate Recognition (LPR) perimeter gate vision, and GPS logs, recording deterministic resolutions into SQLite (WAL mode) with Human-in-the-Loop review.",
    techStack: ["LangGraph", "Groq LLM", "FastAPI / Node", "LPR / OCR", "SQLite (WAL)", "SSE Streaming"],
    repoUrl: "https://github.com/ashiqmuneeb/Autonomous-HR-AI-Agent",
    icon: <Bot size={28} strokeWidth={2} />,
    color: "#4ecdc4",
    category: "AI",
    flow: createFlow(["Perimeter LPR / GPS", "LangGraph Graph", "Groq Reasoning", "HITL / SQLite WAL"])
  },
  {
    id: "synapse_ops",
    title: "SYNAPSE OPS: Multimodal AI Copilot",
    desc: "Autonomous industrial machine inspection copilot that analyzes equipment photos, videos, and technical manuals. Generates evidence-grounded inspection reports with page citations using Gemini Flash, FAISS vector RAG, video FPS downsampling, and blur filtering.",
    techStack: ["Python 3.11", "FastAPI", "Gemini Flash", "FAISS Vector RAG", "PyMuPDF", "Docker"],
    repoUrl: "https://github.com/ashiqmuneeb/Multimodal_AI_Operations_Copilot",
    icon: <Workflow size={28} strokeWidth={2} />,
    color: "#54a0ff",
    category: "AI",
    flow: createFlow(["Video / Manuals", "FPS & Text Chunks", "FAISS Vector Store", "Gemini Multi-Tool"])
  },
  {
    id: "llm_finetuning",
    title: "LLM Fine-Tuning & Quantization",
    desc: "Adapting and serving large language models on constrained consumer hardware. Implements Pegasus dialogue summarization on SAMSum with Seq2SeqTrainer, 4-bit NF4 QLoRA on Llama-2 with SFTTrainer, and 5-bit GGUF quantization using llama-cpp-python.",
    techStack: ["PyTorch", "Hugging Face", "QLoRA", "Llama-2", "GGUF Quantization", "CUDA"],
    repoUrl: "https://github.com/ashiqmuneeb/llm-finetuning-and-quantization",
    colabUrl: "https://colab.research.google.com/github/ashiqmuneeb/llm-finetuning-and-quantization/blob/main",

    icon: <Zap size={28} strokeWidth={2} />,
    color: "#a29bfe",
    category: "AI",
    flow: createFlow(["Dialogue Corpora", "NF4 4-Bit LoRA", "Adapter Merge", "GGUF llama.cpp"])
  },
  {
    id: "vidmind",
    title: "VidMind: Local Long-Video AI Engine",
    desc: "AI platform transforming 10+ hour video lectures into timestamped transcripts, hierarchical summaries, topic chapters, and an interactive Q&A assistant with clickable citations. Runs zero-cloud locally using Whisper STT and Ollama.",
    techStack: ["Python", "FastAPI", "OpenAI Whisper", "Ollama (Local LLM)", "React 19", "FFmpeg"],
    repoUrl: "https://github.com/ashiqmuneeb/Vidmind",
    icon: <Camera size={28} strokeWidth={2} />,
    color: "#feca57",
    category: "AI",
    flow: createFlow(["FFmpeg Demuxing", "Whisper STT", "Chunk & Chapter", "Ollama Local RAG"])
  },
  {
    id: "manhwa_ai",
    title: "ManhwaAI: Novel-to-Webtoon Engine",
    desc: "Generative comic pipeline converting novels and manuscripts into vertical-scrolling webtoon strips. Uses Google Gemini for scene decomposition and dialogue extraction, backed by an async Redis task queue for diffusion rendering.",
    techStack: ["FastAPI", "Google Gemini", "React 18", "Redis / Upstash", "Diffusion Models"],
    repoUrl: "https://github.com/ashiqmuneeb/Manhwa-AI",
    icon: <Sparkles size={28} strokeWidth={2} />,
    color: "#ff9ff3",
    category: "AI",
    flow: createFlow(["Manuscript Ingest", "Gemini Scene Split", "Async Redis Queue", "Webtoon Reader UI"])
  },
  {
    id: "genai_rag",
    title: "Production GenAI RAG Suite",
    desc: "Four modular Retrieval-Augmented Generation architectures with LangChain, Groq, and local Sentence-Transformers embeddings over Chroma and FAISS, featuring dynamic URL sitemap crawlers and PDF source attribution.",
    techStack: ["LangChain", "Groq LLM", "Chroma DB", "FAISS", "Sentence-Transformers", "Streamlit"],
    repoUrl: "https://github.com/ashiqmuneeb/genai-rag-projects",
    colabUrl: "https://colab.research.google.com/github/ashiqmuneeb/genai-rag-projects/blob/main",

    icon: <Layers size={28} strokeWidth={2} />,
    color: "#4ecdc4",
    category: "AI",
    flow: createFlow(["Web / PDF Ingest", "Chunk & Embed", "Chroma / FAISS Store", "Grounded Groq LLM"])
  },
  {
    id: "mockdesk",
    title: "MockDesk: AI Exam & Interview Prep",
    desc: "Local-first exam and interview preparation platform parsing technical books and PDFs into timed mock trials with real-time rubric evaluation, voice dictation, and printable worksheets.",
    techStack: ["Python", "FastAPI", "React 19", "SQLite (WAL)", "FAISS", "Voice Dictation"],
    repoUrl: "https://github.com/ashiqmuneeb/MoskDesk",
    icon: <BookOpen size={28} strokeWidth={2} />,
    color: "#54a0ff",
    category: "AI",
    flow: createFlow(["PDF Parser", "FAISS Vector Index", "FastAPI Evaluator", "React 19 Workspace"])
  },
  {
    id: "wizzo",
    title: "WIZZO CRM & Smart Attendance",
    desc: "Enterprise CRM backend featuring real-time WebSockets (Socket.io), Google GenAI for email parsing, and complex MySQL 9 triggers for tracking granular IN/OUT metrics.",
    techStack: ["Express 5 API", "Socket.io", "Google GenAI", "MySQL 9 Triggers", "AWS EC2"],
    repoUrl: "https://github.com/ashiqmuneeb",
    icon: <Workflow size={28} strokeWidth={2} />,
    color: "#ff6b6b",
    category: "Backend",
    flow: createFlow(["Express 5 API", "Socket.io Streams", "GenAI Parsing", "MySQL 9 DB"])
  },
  {
    id: "gesture",
    title: "Edge Hand Gesture Recognition",
    desc: "Real-time hand gesture tracker in browser using WebAssembly MediaPipe landmark extraction, custom gesture classification via scikit-learn, and 60FPS WebSocket payloads with FastAPI.",
    techStack: ["JavaScript", "MediaPipe WASM", "FastAPI", "WebSockets", "scikit-learn"],
    repoUrl: "https://github.com/ashiqmuneeb/gesture_recognition",
    icon: <Code size={28} strokeWidth={2} />,
    color: "#ff9ff3",
    category: "AI",
    flow: createFlow(["Camera Feed", "MediaPipe WASM", "WebSocket Tunnel", "scikit-learn Model"])
  },
  {
    id: "speed",
    title: "CV Speed Tracking & LPR",
    desc: "Real-time License Plate Recognition and vehicle speed estimation utilizing YOLOv8, EasyOCR, and OpenCV, streaming live metrics to a dynamic Streamlit data dashboard.",
    techStack: ["Python", "OpenCV", "YOLOv8", "EasyOCR", "Streamlit", "SQLite"],
    repoUrl: "https://github.com/ashiqmuneeb/License_plate_detection",
    icon: <Server size={28} strokeWidth={2} />,
    color: "#a29bfe",
    category: "AI",
    flow: createFlow(["RTSP Feed", "YOLOv8 Detection", "EasyOCR Extraction", "Streamlit UI"])
  },
  {
    id: "edge",
    title: "Edge AI Processing (26 TOPS)",
    desc: "Deployed high-speed YOLO pipelines on Raspberry Pi AI HAT+ with 26 TOPS NPU compute, achieving 30FPS inference with ByteTrack object association.",
    techStack: ["Raspberry Pi 5", "AI HAT+ (26 TOPS)", "YOLO", "ByteTrack", "MQTT"],
    repoUrl: "https://github.com/ashiqmuneeb",
    icon: <Cpu size={28} strokeWidth={2} />,
    color: "#54a0ff",
    category: "AI",
    image: "/images/rpi_ai.png",
    flow: createFlow(["RPi Camera", "AI HAT+ (YOLO)", "Local Inference", "Cloud Sync"])
  },
  {
    id: "hotel_django",
    title: "Hotel Management Enterprise System",
    desc: "Full-stack management system built with Python, Django, and SQLite, featuring tiered user role authentication, room booking workflows, inventory tracking, and dynamic billing generation.",
    techStack: ["Python", "Django", "SQLite", "HTML5 / CSS3", "JavaScript"],
    repoUrl: "https://github.com/ashiqmuneeb/hotel-management-system-django",
    icon: <Network size={28} strokeWidth={2} />,
    color: "#4ecdc4",
    category: "Backend",
    flow: createFlow(["Client Request", "Django MVC Router", "ORM Query Engine", "SQLite Transaction"])
  },
  {
    id: "devops",
    title: "Multi-Cloud DevOps & EBS Auditor",
    desc: "Authored custom daemons tracking AWS-INDIA nodes, automating strict threshold alerts, and hunting unmounted 'Ghost Drive' EBS volumes for automated cost reduction.",
    techStack: ["AWS EC2", "EBS API", "Python Boto3", "Docker", "Lambda Daemons"],
    repoUrl: "https://github.com/ashiqmuneeb",
    icon: <HardDrive size={28} strokeWidth={2} />,
    color: "#ff6b6b",
    category: "DevOps",
    flow: createFlow(["Audit Script", "AWS EC2 API", "EBS Volumes", "Report Gen"])
  },
  {
    id: "safiyahealth",
    title: "Safiya Health Medical Portal",
    desc: "Responsive React 19 medical portal built with Vite, featuring framer-motion animations and i18next for multi-language healthcare support.",
    techStack: ["React 19", "Vite", "Framer Motion", "i18next", "Health API"],
    repoUrl: "https://github.com/ashiqmuneeb",
    icon: <Globe size={28} strokeWidth={2} />,
    color: "#54a0ff",
    category: "Frontend",
    flow: createFlow(["React 19 UI", "Framer Motion", "i18next Locale", "Health API"])
  }
];

const FOUNDATIONS_AND_STUDIES = [
  {
    category: "Mathematical Foundations",
    icon: <Calculator size={22} />,
    color: "#eb6434",
    tag: "Applied Mathematics",
    summary: "Rigorous mathematical tooling underlying modern deep neural networks and machine learning.",
    concepts: [
      { name: "Multivariable Calculus", details: "Partial derivatives, gradients, Jacobians, and Hessians; chain rule propagation for multi-layer backpropagation; gradient descent dynamics & loss convexity.", formula: "∇_W L = (∂L/∂ŷ) · (∂ŷ/∂z) · (∂z/∂W)" },
      { name: "Probability & Statistics", details: "Bayesian probability, prior/posterior updates, Maximum Likelihood Estimation (MLE), Maximum A Posteriori (MAP), Gaussian & Bernoulli distributions.", formula: "P(θ|D) = [P(D|θ) · P(θ)] / P(D)" },
      { name: "Linear Algebra & Tensors", details: "Vector spaces, dot products & cosine similarity metrics, matrix decompositions (SVD, Eigendecomposition), high-dimensional tensor transformations.", formula: "cos(u, v) = (u · v) / (||u|| ||v||)" },
      { name: "Information Theory", details: "Shannon entropy, cross-entropy loss functions, Kullback-Leibler (KL) divergence for distribution alignment and model evaluation.", formula: "D_KL(P || Q) = ∑ P(x) log(P(x) / Q(x))" }
    ]
  },
  {
    category: "Deep Learning & GenAI Architectures",
    icon: <Brain size={22} />,
    color: "#54a0ff",
    tag: "Generative AI",
    summary: "Transformer mechanics, adaptation techniques, local inference, and autonomous cognitive loops.",
    concepts: [
      { name: "Transformer Mechanisms", details: "Scaled dot-product self-attention, multi-head attention heads, positional encodings, and Vision Transformers (ViT) implemented from scratch.", formula: "Attention(Q,K,V) = softmax(QK^T / √d_k) · V" },
      { name: "Fine-Tuning & PEFT", details: "Parameter-Efficient Fine-Tuning with LoRA and QLoRA; 4-bit NormalFloat (NF4) quantization; adapter merging with Hugging Face SFTTrainer.", formula: "W = W_0 + ΔW = W_0 + B · A (rank r << d)" },
      { name: "Quantization & Edge Serving", details: "GGUF and AWQ quantization formats; running 7B/13B models locally via llama.cpp, Ollama, and CUDA acceleration on consumer compute.", formula: "W_q = round(W / scale) + zero_point (k-bit)" },
      { name: "Autonomous Agentic Graphs", details: "LangGraph cyclic state machines, tool-use routing, human-in-the-loop (HITL) checkpoints, and Server-Sent Events (SSE) streaming.", formula: "StateGraph(S) → Nodes(f) + ConditionalEdges" },
      { name: "Retrieval-Augmented Generation", details: "Dense vector embeddings, chunking algorithms (recursive character, PyMuPDF page bounds), hybrid keyword + semantic search (FAISS, Chroma, Pinecone)." }
    ]
  },
  {
    category: "Backend & Systems Optimization",
    icon: <Server size={22} />,
    color: "#4ecdc4",
    tag: "Systems Engineering",
    summary: "High-throughput asynchronous runtimes, streaming architectures, and storage engine tuning.",
    concepts: [
      { name: "Asynchronous High Concurrency", details: "Python asyncio event loops, uvloop, non-blocking I/O in FastAPI; Node.js event-driven microservices with low-latency WebSockets.", formula: "async/await + non-blocking socket poll" },
      { name: "Database Concurrency & WAL", details: "SQLite Write-Ahead Logging (WAL) concurrency, foreign key integrity, MySQL 9 transactional triggers for complex real-time attendance.", formula: "PRAGMA journal_mode = WAL;" },
      { name: "Streaming Data Pipelines", details: "Bidirectional WebSockets, Server-Sent Events (SSE) token streaming, async worker queues with Redis/Upstash." },
      { name: "Bounded Memory Media Ingestion", details: "Chunked generators and memory-capped streaming for processing 10+ hour video transcripts and audio extraction via FFmpeg without RAM spikes." }
    ]
  },
  {
    category: "Computer Vision & Edge Hardware",
    icon: <Cpu size={22} />,
    color: "#ff9ff3",
    tag: "Edge Computing",
    summary: "Hardware-accelerated neural inference, model simplification, and embedded perception.",
    concepts: [
      { name: "Edge NPU Acceleration", details: "Deploying quantized YOLO pipelines on the Raspberry Pi AI HAT+ with 26 TOPS NPU compute at steady 30 FPS inference.", formula: "Hailo-8 / Raspberry Pi AI HAT+ (26 TOPS)" },
      { name: "ONNX Runtime Simplification", details: "Graph optimization, operator simplification, and zero-dependency cross-platform deployment for FaceNet and visual embeddings." },
      { name: "Object Association & Tracking", details: "ByteTrack and Kalman filter multi-object tracking for accurate crowd density estimation and ANPR speed tracking." },
      { name: "Embedded Hardware & Sensors", details: "NEO-6M GPS modules, ESP32/ESP8266 microcontrollers, 5V relay circuits for biometric door strikes, RTSP camera streams." }
    ]
  }
];

const SOFTWARE_ARSENAL = [
  "Python (FastAPI, Django)", "LangChain / LangGraph", "PyTorch & Transformers", 
  "PEFT / QLoRA", "Vector DBs (FAISS, Chroma)", "Whisper & Ollama", 
  "React 19 & Vite", "Node.js (Express 5)", "AWS EC2 / EBS", 
  "Docker", "SQLite (WAL Mode)", "MySQL 9 Triggers", "WebSockets / SSE"
];

const HARDWARE_TOOLKIT = [
  "Raspberry Pi 5 / 4", "AI HAT+ (26 TOPS NPU)", "NVIDIA Jetson Nano", 
  "ESP32 / ESP8266", "YOLOv8 & YOLOv26", "MediaPipe WASM", 
  "ByteTrack Multi-Object", "Optical LPR / OCR", "RTSP Camera Streams", "Relay Door Strikes"
];

const EXPERIENCE = [
  { id: 1, role: "Backend & AI Engineer", company: "WIZZO", duration: "2025 - Present", desc: "Architecting MySQL 9 triggers for complex attendance algorithms, deploying edge AI pipelines (YOLOv26) on Raspberry Pi AI HAT+, engineering autonomous HR workforce agent prototypes with LangGraph, and managing scalable AWS EC2 instances for multi-tenant SaaS environments." },
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
` },
  { id: 4, title: "Autonomous HR Agent with LangGraph & SQLite WAL", readTime: "7 min read", tag: "AI Systems", content: `Enterprise attendance auditing is riddled with edge-case discrepancies—from missing punch-ins to network drops. In this architecture, we engineered an autonomous HR agent powered by LangGraph, Groq LLM, and SQLite configured with Write-Ahead Logging (WAL).

Rather than simple static rules, the agent executes dynamic tool calls: it inspects optical perimeter gate camera LPR OCR timestamps, audits raw GPS telemetry logs, queries corporate HR policy vectors, and automatically computes reconciliation. High-confidence discrepancies are auto-resolved with transactional database overrides, while borderline anomalies trigger an asynchronous Human-in-the-Loop (HITL) review state stream over Server-Sent Events (SSE).

### LangGraph Agent Node Definition

\`\`\`python
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated

class AgentState(TypedDict):
    employee_id: str
    anomaly_date: str
    lpr_verified: bool
    gps_verified: bool
    final_status: str

workflow = StateGraph(AgentState)
workflow.add_node("check_lpr_camera", audit_gate_camera)
workflow.add_node("check_gps_logs", audit_gps_telemetry)
workflow.add_node("reasoning_llm", groq_reasoning_evaluator)
workflow.add_node("execute_wal_override", commit_sqlite_override)

workflow.set_entry_point("check_lpr_camera")
workflow.add_edge("check_lpr_camera", "check_gps_logs")
workflow.add_edge("check_gps_logs", "reasoning_llm")
workflow.add_conditional_edges(
    "reasoning_llm",
    should_escalate_to_human,
    {"resolve": "execute_wal_override", "escalate": "hitl_manager_queue"}
)
app = workflow.compile()
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

// --- Animated Stat Counter (Viewport Count-Up via RAF) ---
const StatCounter = ({ value, label, suffix = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const target = parseInt(value, 10);
    if (isNaN(target)) return;

    let startTime = null;
    const duration = 800; // Fast punchy 800ms count-up

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(easeProgress * target));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    const rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
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
    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, opacity: 0.16, pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="circuit-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#eb6434" />
          <stop offset="100%" stopColor="#54a0ff" />
        </linearGradient>
      </defs>

      {/* Static Crisp Circuit Traces (No infinite animation loops) */}
      <path
        d="M -100 100 L 150 100 L 200 150 L 500 150 L 550 100 L 1200 100"
        stroke="url(#circuit-glow)" strokeWidth="1.5" fill="none"
      />
      <path
        d="M -50 400 L 250 400 L 300 350 L 600 350 L 650 450 L 1200 450"
        stroke="url(#circuit-glow)" strokeWidth="1" fill="none"
      />
      <path
        d="M 800 800 L 800 600 L 850 550 L 1200 550"
        stroke="url(#circuit-glow)" strokeWidth="1.5" fill="none"
      />

      {/* Circuit Nodes */}
      <circle cx="150" cy="100" r="3" fill="#eb6434" />
      <circle cx="200" cy="150" r="3" fill="#eb6434" />
      <circle cx="500" cy="150" r="3" fill="#54a0ff" />
      <circle cx="550" cy="100" r="3" fill="#54a0ff" />
      <circle cx="250" cy="400" r="2.5" fill="#eb6434" />
      <circle cx="300" cy="350" r="2.5" fill="#54a0ff" />
      <circle cx="600" cy="350" r="2.5" fill="#54a0ff" />
      <circle cx="650" cy="450" r="2.5" fill="#eb6434" />
      <circle cx="800" cy="600" r="3.5" fill="#eb6434" />
      <circle cx="850" cy="550" r="3.5" fill="#54a0ff" />
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
    <div style={{ background: 'var(--card-bg, rgba(255, 255, 255, 0.75))', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(120, 149, 117, 0.3)', boxShadow: '0 8px 30px rgba(120, 149, 117, 0.08)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem', color: 'var(--accent-glow-strong)' }}>
        <Github size={24} />
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit' }}>Live Commits</h3>
      </div>
      {loading ? (
        <p style={{ color: '#888' }}>Fetching live activity...</p>
      ) : repos.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {repos.map(repo => (
            <a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer" style={{ display: 'block', padding: '1rem', background: 'rgba(120, 149, 117, 0.08)', borderRadius: '12px', border: '1px solid rgba(120, 149, 117, 0.2)', transition: 'background 0.3s' }} className="github-card">
              <div style={{ fontWeight: 700, color: 'inherit', marginBottom: '0.3rem', display: 'flex', justifyContent: 'space-between' }}>
                {repo.name} <ExternalLink size={14} color="#888" />
              </div>
              <div style={{ fontSize: '0.85rem', color: '#586354', display: 'flex', gap: '1rem' }}>
                <span><GitCommit size={12} style={{ display: 'inline', marginRight: '4px' }} /> {repo.language || 'Code'}</span>
                <span>Updated: {new Date(repo.updated_at).toLocaleDateString()}</span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p style={{ color: '#888' }}>Could not fetch repositories.</p>
      )}
      <style>{`.github-card:hover { background: rgba(120, 149, 117, 0.16) !important; }`}</style>
    </div>
  );
};

// --- Contact Form Component ---
const ContactForm = () => {
  const [status, setStatus] = useState('idle');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "651631e2-b062-4364-a745-925a58a74bdf",
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `Portfolio Contact from ${formData.name}`
        })
      });

      const result = await res.json();
      if (result.success) {
        setStatus('success');
      } else {
        window.location.href = `mailto:Ashiqam75@gmail.com?subject=Portfolio%20Inquiry%20from%20${encodeURIComponent(formData.name)}&body=${encodeURIComponent(formData.message + '\n\nFrom: ' + formData.email)}`;
        setStatus('success');
      }
    } catch (err) {
      window.location.href = `mailto:Ashiqam75@gmail.com?subject=Portfolio%20Inquiry%20from%20${encodeURIComponent(formData.name)}&body=${encodeURIComponent(formData.message + '\n\nFrom: ' + formData.email)}`;
      setStatus('success');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '500px', margin: '0 auto', textAlign: 'left' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#888' }}>Name</label>
        <input 
          type="text" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          required 
          placeholder="Your Name" 
          style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(120, 149, 117, 0.35)', borderRadius: '12px', color: '#1C1D20', outline: 'none' }} 
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#888' }}>Email</label>
        <input 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          required 
          placeholder="your.email@example.com" 
          style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(120, 149, 117, 0.35)', borderRadius: '12px', color: '#1C1D20', outline: 'none' }} 
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#888' }}>Message</label>
        <textarea 
          name="message" 
          value={formData.message} 
          onChange={handleChange} 
          required 
          rows={4} 
          placeholder="How can we collaborate on AI models, edge systems, or backend architectures?" 
          style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(120, 149, 117, 0.35)', borderRadius: '12px', color: '#1C1D20', outline: 'none', resize: 'vertical' }}
        ></textarea>
      </div>
      <button type="submit" disabled={status === 'sending' || status === 'success'} className="btn btn-pill" style={{ justifyContent: 'center', background: status === 'success' ? '#2ecc71' : 'var(--accent-glow-strong)', color: '#fff', border: 'none', padding: '1rem' }}>
        {status === 'idle' && <><Send size={18} /> Send Message Directly</>}
        {status === 'sending' && 'Sending message...'}
        {status === 'success' && <><CheckCircle size={18} /> Message Dispatched</>}
      </button>
    </form>
  );
};

// --- Circular Project Wheel / Mobile Stack ---
const ProjectWheel = ({ projects, setSelectedId, isMobile, theme = 'light' }) => {
  const isLight = theme === 'light';
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
              layoutId={`card-${p.id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              style={{
                width: '100%',
                padding: '2rem',
                background: isLight ? 'rgba(255, 255, 255, 0.92)' : 'rgba(25,25,30,0.95)',
                border: isLight ? '1.5px solid rgba(120, 149, 117, 0.35)' : `1px solid ${p.color}`,
                color: isLight ? '#1C1D20' : '#fff',
                borderRadius: '24px',
                boxShadow: isLight ? '0 10px 30px rgba(120, 149, 117, 0.12)' : '0 10px 30px rgba(0,0,0,0.2)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', borderRadius: '12px', background: `${p.color}20`, color: p.color }}>
                  {p.icon}
                </div>
                <span style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem', borderRadius: '50px', background: `${p.color}15`, color: p.color, border: `1px solid ${p.color}35`, fontWeight: 700 }}>
                  {p.category}
                </span>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', fontFamily: 'Outfit', lineHeight: 1.2 }}>{p.title}</h3>
              <p style={{ color: isLight ? '#444C41' : '#bbb', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.2rem' }}>{p.desc}</p>
              
              {p.techStack && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                  {p.techStack.map((t, idx) => (
                    <span key={idx} style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '50px', background: isLight ? 'rgba(120, 149, 117, 0.12)' : 'rgba(255,255,255,0.06)', color: isLight ? '#283625' : '#ccc', border: isLight ? '1px solid rgba(120, 149, 117, 0.25)' : '1px solid rgba(255,255,255,0.1)' }}>
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                <button onClick={() => setSelectedId(p.id)} className="btn btn-pill" style={{ borderColor: p.color, color: p.color, background: 'transparent', fontSize: '0.85rem', padding: '0.6rem 1.2rem' }}>
                  Architecture <ExternalLink size={14} />
                </button>
                {p.repoUrl && (
                  <a href={p.repoUrl} target="_blank" rel="noreferrer" className="btn btn-pill" style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff', background: 'rgba(255,255,255,0.05)', fontSize: '0.85rem', padding: '0.6rem 1.2rem' }}>
                    <Github size={14} /> Code
                  </a>
                )}
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
                width: isActive ? '520px' : '280px',
                padding: isActive ? '3rem' : '2rem',
                cursor: isActive ? 'default' : 'pointer',
                background: isActive ? (isLight ? 'rgba(255, 255, 255, 0.94)' : 'rgba(25,25,30,0.95)') : (isLight ? 'rgba(255, 255, 255, 0.55)' : 'rgba(255,255,255,0.02)'),
                border: isActive ? (isLight ? '1.5px solid rgba(120, 149, 117, 0.45)' : `1px solid ${p.color}`) : '1px solid rgba(150,150,150,0.15)',
                color: isActive ? (isLight ? '#1C1D20' : '#fff') : 'inherit',
                borderRadius: '24px',
                boxShadow: isActive ? (isLight ? '0 25px 60px rgba(120, 149, 117, 0.18)' : '0 30px 60px rgba(0,0,0,0.5)') : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', borderRadius: '12px', background: `${p.color}20`, color: p.color }}>
                  {p.icon}
                </div>
                {isActive && (
                  <span style={{ fontSize: '0.85rem', padding: '0.4rem 1rem', borderRadius: '50px', background: `${p.color}15`, color: p.color, border: `1px solid ${p.color}35`, fontWeight: 700 }}>
                    {p.category}
                  </span>
                )}
              </div>
              <h3 style={{ fontSize: isActive ? '2rem' : '1.3rem', fontWeight: 800, marginBottom: '1rem', fontFamily: 'Outfit', lineHeight: 1.2 }}>{p.title}</h3>

              <AnimatePresence mode="wait">
                {isActive && (
                  <motion.div initial={{ opacity: 0, scaleY: 0.95 }} animate={{ opacity: 1, scaleY: 1 }} exit={{ opacity: 0, scaleY: 0.95 }} transition={{ duration: 0.25 }} style={{ transformOrigin: 'top' }}>
                    <p style={{ color: isLight ? '#444C41' : '#bbb', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.2rem' }}>{p.desc}</p>
                    
                    {p.techStack && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.8rem' }}>
                        {p.techStack.map((t, idx) => (
                          <span key={idx} style={{ fontSize: '0.8rem', padding: '0.3rem 0.7rem', borderRadius: '50px', background: `${p.color}15`, color: p.color, border: `1px solid ${p.color}35`, fontWeight: 600 }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                      <button onClick={() => setSelectedId(p.id)} className="btn btn-pill" style={{ borderColor: p.color, color: p.color, background: 'transparent' }}>
                        View Architecture <ExternalLink size={16} />
                      </button>
                      {p.repoUrl && (
                        <a href={p.repoUrl} target="_blank" rel="noreferrer" className="btn btn-pill" style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff', background: 'rgba(255,255,255,0.05)' }}>
                          <Github size={16} /> GitHub
                        </a>
                      )}
                    </div>
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
  const [history, setHistory] = useState([{ cmd: "", out: "AshiqOS v1.2.0 initialized.\nType 'help' to see commands." }]);
  const [input, setInput] = useState("");

  if (isMobile) return null; // Hide terminal easter egg on mobile

  const handleCommand = (e) => {
    if (e.key === "Enter") {
      const cmd = input.trim().toLowerCase();
      let out = "";
      if (cmd === "help") out = "Available commands:\nwhoami\nls projects\ncat skills.txt\ncat learning.txt\nwizzo.sh\ndownload cv\ncontact\nclear";
      else if (cmd === "whoami") out = "Ashiq Muneeb\nSystem Architect, AI & Autonomous Agents Integrator, Edge & Cloud Specialist.";
      else if (cmd === "cat skills.txt") out = "[SOFTWARE & AI ARSENAL]\nPython (FastAPI, Django), LangChain, LangGraph, PyTorch, QLoRA, GGUF, FAISS, Chroma, Whisper, Ollama, React 19, Node.js, SQLite WAL, MySQL 9, AWS EC2\n\n[HARDWARE & EDGE TOOLKIT]\nRaspberry Pi AI HAT+ (26 TOPS NPU), ESP32, YOLOv26, ByteTrack, MediaPipe WASM, Optical LPR / OCR";
      else if (cmd === "cat learning.txt" || cmd === "study") out = "[THEORETICAL & APPLIED FOUNDATIONS]\n• Multivariable Calculus: Gradients, Hessians, Chain Rule Backprop, Loss Convexity\n• Probability & Stats: Bayesian Inference, MLE/MAP, Gaussian/Bernoulli, KL-Divergence\n• Deep Learning: Transformer Self-Attention, ViT from scratch, 4-bit NF4 QLoRA, GGUF\n• Systems: Asyncio event loops, SQLite WAL concurrency, WebSockets & SSE streaming";
      else if (cmd === "ls projects") out = "drwxr-xr-x autonomous_hr_agent\ndrwxr-xr-x synapse_ops_copilot\ndrwxr-xr-x llm_finetuning_quantization\ndrwxr-xr-x vidmind_video_ai\ndrwxr-xr-x manhwa_comic_engine\ndrwxr-xr-x genai_rag_suite\ndrwxr-xr-x mockdesk_simulator\ndrwxr-xr-x wizzo_crm\ndrwxr-xr-x gesture_recognition_wasm\ndrwxr-xr-x cv_speed_lpr\ndrwxr-xr-x edge_pi_26tops";
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
          <div id="terminal-body-scroll" className="terminal-body" data-lenis-prevent="true" onWheel={(e) => e.stopPropagation()} onClick={() => document.getElementById('term-input')?.focus()} style={{ overflowY: 'auto', overscrollBehavior: 'contain' }}>
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
  const [theme, setTheme] = useState('light');
  const [isMuted, setIsMuted] = useState(false);
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    globalIsMuted = isMuted;
  }, [isMuted]);
  
  // Live Telemetry
  const [dbQueries, setDbQueries] = useState("1.20");
  const [edgeStatus, setEdgeStatus] = useState("ONLINE");
  const [liveLatency, setLiveLatency] = useState(38);
  const [consoleFeedback, setConsoleFeedback] = useState("");
  const [inspectedNode, setInspectedNode] = useState(null);
  const [activeFoundationCategory, setActiveFoundationCategory] = useState("All");

  // Interactive Terminal State
  const [terminalLogs, setTerminalLogs] = useState([
    { time: "10:14:02", text: "ashiq-kernel v2.4 initialized. Ready." },
    { time: "10:14:03", text: "Active NPU Hat+: 26 TOPS tensor unit online." },
    { time: "10:14:04", text: "LangGraph state engine: standby mode." }
  ]);
  const [terminalCmd, setTerminalCmd] = useState("");
  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setLoading(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const executeTerminalCommand = (cmdText) => {
    playType();
    const clean = cmdText.trim().toLowerCase();
    const time = new Date().toTimeString().split(' ')[0];
    if (!clean) return;

    if (clean === 'clear') {
      setTerminalLogs([]);
      return;
    }

    let response = "";
    if (clean === 'help') {
      response = "Available: test agent | ping npu | check wal | whoami | projects | status | clear";
    } else if (clean === 'test agent' || clean === 'agent') {
      response = "LangGraph: StateGraph cycle -> Ingest GPS/OCR -> Decision node -> HITL review -> Verified.";
    } else if (clean === 'ping npu' || clean === 'npu') {
      response = "Hailo-8 AI HAT+ (26 TOPS): 30.2 FPS inference active @ 4.1W power draw.";
    } else if (clean === 'check wal' || clean === 'wal') {
      response = "SQLite: PRAGMA journal_mode = WAL; busy_timeout = 5000ms. Concurrency lock: OK.";
    } else if (clean === 'whoami') {
      response = "Ashiq Muneeb - AI Systems Engineer, Edge Architect & High-Throughput Developer.";
    } else if (clean === 'projects') {
      response = "Online repos: Autonomous-HR, SYNAPSE OPS, VidMind, LLM-Quantization, MoskDesk, Edge-CV...";
    } else if (clean === 'status') {
      response = `Gateway: 200 OK | Latency: ${liveLatency}ms | NPU: 26 TOPS | DB: SQLite WAL / MySQL 9`;
    } else {
      response = `Command '${clean}' not recognized. Type 'help' for diagnostics.`;
    }

    setTerminalLogs(prev => [
      ...prev.slice(-6),
      { time, text: `$ ${clean}`, isInput: true },
      { time, text: response, isInput: false }
    ]);
  };

  const triggerLog = (msg) => {
    playType();
    executeTerminalCommand(msg);
  };

  useEffect(() => {
    const measure = async () => {
      const t0 = performance.now();
      try {
        await fetch('https://api.github.com', { method: 'HEAD', mode: 'no-cors' });
        const ms = Math.round(performance.now() - t0);
        setLiveLatency(Math.max(14, Math.min(ms, 300)));
      } catch (e) {
        setLiveLatency(38);
      }
    };
    measure();
    const interval = setInterval(measure, 12000);
    return () => clearInterval(interval);
  }, []);

  const [windowWidth] = useWindowSize();
  const isMobile = windowWidth < 768;

  const { scrollYProgress } = useScroll();
  const heroParallax = useTransform(scrollYProgress, [0, 0.25], [0, isMobile ? 0 : -35]);
  const backgroundColor = theme === 'cyber' ? "#0a0a0f" : "#E5E8CE";
  const textColor = theme === 'cyber' ? "#f0f0f5" : "#1C1D20";

  const lenisRef = useRef(null);

  useEffect(() => {
    if (!isMobile) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true,
        prevent: (node) => node.hasAttribute('data-lenis-prevent') || Boolean(node.closest?.('[data-lenis-prevent]'))
      });
      lenisRef.current = lenis;

      let rafId;
      function raf(time) {
        if (lenisRef.current) {
          lenisRef.current.raf(time);
        }
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);

      return () => {
        cancelAnimationFrame(rafId);
        if (lenisRef.current) {
          lenisRef.current.destroy();
          lenisRef.current = null;
        }
      };
    }
  }, [isMobile]);

  // Lock background scroll & stop Lenis whenever any modal or overlay is open
  useEffect(() => {
    const isModalOpen = Boolean(selectedId || selectedCaseStudy || cmdPaletteOpen);
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      if (lenisRef.current) {
        lenisRef.current.stop();
      }
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (lenisRef.current) {
        lenisRef.current.start();
      }
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (lenisRef.current) {
        lenisRef.current.start();
      }
    };
  }, [selectedId, selectedCaseStudy, cmdPaletteOpen]);

  useEffect(() => {
    const bootSequence = [
      "[OK] Booting AshiqOS System Kernel...",
      "[OK] Mounting Edge NPU & Tensor Weights...",
      "[OK] Initializing System Architectures...",
      "[OK] Launching Portfolio UI..."
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
        setTimeout(() => setLoading(false), 300);
      }
    }, 200);

    const telemetryInterval = setInterval(() => {
      setDbQueries((1.15 + Math.random() * 0.1).toFixed(2));
      if (Math.random() > 0.85) {
        setEdgeStatus("SYNCING...");
        setTimeout(() => setEdgeStatus("ONLINE"), 800);
      }
    }, 1500);

    return () => {
      clearInterval(interval);
      clearInterval(telemetryInterval);
    };
  }, []);

  useEffect(() => {
    if (isHackMode) {
      document.documentElement.style.setProperty('--accent-glow-strong', '#ff0033');
      document.documentElement.style.setProperty('--accent-glow', 'rgba(255,0,51,0.5)');
      document.documentElement.setAttribute('data-theme', 'cyber');
    } else if (theme === 'light') {
      document.documentElement.style.setProperty('--accent-glow-strong', '#789575');
      document.documentElement.style.setProperty('--accent-glow', 'rgba(120, 149, 117, 0.4)');
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.style.setProperty('--accent-glow-strong', '#eb6434');
      document.documentElement.style.setProperty('--accent-glow', 'rgba(235,100,52,0.5)');
      document.documentElement.setAttribute('data-theme', 'cyber');
    }
  }, [isHackMode, theme]);

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
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="preloader"
            onClick={() => setLoading(false)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '2rem', fontFamily: 'monospace', fontSize: '1rem', background: '#0a0a0f', color: 'var(--accent-glow-strong)', justifyContent: 'flex-end', zIndex: 99999, cursor: 'pointer' }}
          >
            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.08)', color: '#aaa', padding: '0.35rem 0.8rem', borderRadius: '50px', fontSize: '0.75rem', border: '1px solid rgba(255,255,255,0.1)' }}>
              Click to skip ✕
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', maxWidth: '800px' }}>
              {loadingLines.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && (
        <>
          <nav style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100, padding: isMobile ? '1rem 1.5rem' : '1.2rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: isMobile ? 'none' : 'blur(16px)', background: theme === 'light' ? 'rgba(229, 232, 206, 0.88)' : (isMobile ? 'rgba(10,10,15,0.95)' : 'rgba(10,10,15,0.8)'), borderBottom: theme === 'light' ? '1px solid rgba(120, 149, 117, 0.25)' : '1px solid rgba(150,150,150,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontWeight: 800, fontSize: '1.2rem', fontFamily: 'Outfit, sans-serif' }}>
              <div style={{ width: '28px', height: '28px', background: textColor, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '10px', height: '10px', border: '2px solid', borderColor: backgroundColor, borderTop: 'none', borderRight: 'none', transform: 'rotate(-45deg)', marginTop: '-2px' }}></div>
              </div>
              Ashiq Muneeb
              <span title="Open to Work" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2ecc71', marginLeft: '0.5rem', display: 'inline-block' }} />
            </div>
            {!isMobile ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
                <div style={{ display: 'flex', gap: '1.8rem', fontWeight: 600, fontSize: '0.95rem' }}>
                  {[
                    { id: 'about', label: 'About' },
                    { id: 'foundations', label: 'Foundations' },
                    { id: 'playground', label: 'Edge AI Demo' },
                    { id: 'architectures', label: 'Architectures' },
                    { id: 'case-studies', label: 'Case Studies' },
                  ].map(link => (
                    <a
                      key={link.id}
                      href={`#${link.id}`}
                      onClick={() => setActiveSection(link.id)}
                      style={{ position: 'relative', padding: '0.4rem 0', color: activeSection === link.id ? 'var(--accent-glow-strong)' : '#aaa', transition: 'color 0.2s ease' }}
                    >
                      {link.label}
                      {activeSection === link.id && (
                        <motion.div
                          layoutId="active-nav-indicator"
                          style={{
                            position: 'absolute',
                            bottom: '-2px',
                            left: 0,
                            right: 0,
                            height: '2px',
                            background: 'var(--accent-glow-strong)',
                            borderRadius: '2px',
                          }}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        />
                      )}
                    </a>
                  ))}
                </div>
                <button onClick={() => setIsMuted(m => !m)} className="btn btn-pill" style={{ padding: '0.5rem', borderRadius: '50%' }} title={isMuted ? "Unmute sounds" : "Mute sounds"}>
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <button onClick={() => setTheme(t => t === 'cyber' ? 'light' : 'cyber')} className="btn btn-pill" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                  {theme === 'cyber' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <motion.a href="#contact" whileHover={liftHover} whileTap={tapPress} className="btn btn-pill" style={{ fontWeight: 600, fontSize: '0.95rem', background: textColor, color: backgroundColor }}>
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
                <a href="#foundations" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.2rem', fontWeight: 600 }}>Foundations</a>
                <a href="#playground" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.2rem', fontWeight: 600 }}>Edge AI Demo</a>
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

            <motion.div className="container" style={{ y: heroParallax, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '3rem', flexWrap: 'wrap', zIndex: 10, position: 'relative', width: '100%' }}>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ flex: '1 1 500px', maxWidth: '680px', textAlign: isMobile ? 'center' : 'left' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(235, 100, 52, 0.1)', color: 'var(--accent-glow-strong)', padding: '0.5rem 1.2rem', borderRadius: '50px', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.5rem', border: '1px solid rgba(235, 100, 52, 0.2)' }}>
                  <motion.div animate={singleHeroPulse} style={{ width: '8px', height: '8px', background: 'var(--accent-glow-strong)', borderRadius: '50%' }} />
                  Currently shipping at WIZZO
                </div>

                <h1 style={{ fontSize: 'clamp(2.8rem, 8vw, 4.8rem)', fontWeight: 900, lineHeight: 1.1, fontFamily: 'Outfit', letterSpacing: '-1px', marginBottom: '1.5rem' }}>
                  Engineering <br /> <span style={{ color: 'var(--accent-glow-strong)' }}>Scalable Systems.</span>
                </h1>
                <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', lineHeight: 1.6, color: '#888', maxWidth: '580px', marginBottom: '2.5rem', fontWeight: 500, margin: isMobile ? '0 auto 2.5rem' : '0 0 2.5rem' }}>
                  I'm Ashiq Muneeb. I architect and own complex, multi-layered systems—bridging the gap from physical hardware integration to deep edge AI models, autonomous LangGraph agents, and scalable cloud infrastructures.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start', marginBottom: '2.5rem' }}>
                  <motion.a href="#architectures" whileHover={isMobile ? {} : liftHover} whileTap={tapPress} className="btn btn-pill" style={{ background: textColor, color: backgroundColor, padding: '1rem 2rem', fontSize: '1.05rem', width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}>
                    View Architectures
                  </motion.a>
                  <motion.a href="/Ashiq_Muneeb_CV_METI.pdf" download="Ashiq_Muneeb_CV.pdf" whileHover={isMobile ? {} : liftHover} whileTap={tapPress} className="btn btn-pill" style={{ padding: '1rem 2rem', fontSize: '1.05rem', border: '1px solid', borderColor: textColor, color: textColor, width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}>
                    Download CV <Download size={18} />
                  </motion.a>
                </div>

                {/* IoT Telemetry Widgets */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: theme === 'light' ? 'rgba(255, 255, 255, 0.75)' : 'rgba(15,15,20,0.6)', padding: '0.8rem 1.2rem', borderRadius: '12px', border: theme === 'light' ? '1px solid rgba(120, 149, 117, 0.35)' : '1px solid rgba(84,160,255,0.4)', backdropFilter: isMobile ? 'none' : 'blur(10px)', boxShadow: theme === 'light' ? '0 4px 15px rgba(120, 149, 117, 0.08)' : 'none' }}>
                    <div style={{ color: '#54a0ff' }}><Wifi size={20} /></div>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: theme === 'light' ? '#5A6556' : '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Edge Node Ping</div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: textColor, fontFamily: 'monospace' }}>{liveLatency}ms</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: theme === 'light' ? 'rgba(255, 255, 255, 0.75)' : 'rgba(15,15,20,0.6)', padding: '0.8rem 1.2rem', borderRadius: '12px', border: theme === 'light' ? '1px solid rgba(120, 149, 117, 0.35)' : '1px solid rgba(255,107,107,0.4)', backdropFilter: isMobile ? 'none' : 'blur(10px)', boxShadow: theme === 'light' ? '0 4px 15px rgba(120, 149, 117, 0.08)' : 'none' }}>
                    <div style={{ color: '#ff6b6b' }}><Database size={20} /></div>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: theme === 'light' ? '#5A6556' : '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>DB Engine</div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: textColor, fontFamily: 'monospace' }}>MySQL 9 / WAL</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: theme === 'light' ? 'rgba(255, 255, 255, 0.75)' : 'rgba(15,15,20,0.6)', padding: '0.8rem 1.2rem', borderRadius: '12px', border: theme === 'light' ? '1px solid rgba(120, 149, 117, 0.35)' : '1px solid rgba(78,205,196,0.4)', backdropFilter: isMobile ? 'none' : 'blur(10px)', boxShadow: theme === 'light' ? '0 4px 15px rgba(120, 149, 117, 0.08)' : 'none' }}>
                    <div style={{ color: '#4ecdc4' }}><Activity size={20} /></div>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: theme === 'light' ? '#5A6556' : '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Edge AI Compute</div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: textColor, fontFamily: 'monospace' }}>26 TOPS NPU</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Engineering Command Center (Interactive Terminal Preview) */}
              {!isMobile && (
                <motion.div 
                  initial={{ opacity: 0, x: 30 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ duration: 0.8, delay: 0.2 }}
                  style={{ 
                    flex: '1 1 380px', 
                    maxWidth: '520px', 
                    background: theme === 'light' ? 'rgba(248, 250, 242, 0.95)' : 'rgba(12, 14, 20, 0.88)', 
                    border: theme === 'light' ? '1.5px solid rgba(120, 149, 117, 0.35)' : '1px solid rgba(255, 255, 255, 0.14)', 
                    borderRadius: '20px', 
                    overflow: 'hidden', 
                    boxShadow: theme === 'light' ? '0 20px 50px rgba(120, 149, 117, 0.15)' : '0 25px 60px rgba(0,0,0,0.55)', 
                    backdropFilter: isMobile ? 'none' : 'blur(20px)',
                    fontFamily: 'monospace',
                    color: textColor
                  }}
                >
                  <div style={{ background: theme === 'light' ? 'rgba(120, 149, 117, 0.12)' : 'rgba(255,255,255,0.04)', padding: '0.8rem 1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: theme === 'light' ? '1px solid rgba(120, 149, 117, 0.2)' : '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }} />
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#888', letterSpacing: '0.5px' }}>ashiq-kernel@v2.4 ~ edge-mesh</span>
                    <span style={{ fontSize: '0.7rem', color: '#2ecc71', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2ecc71' }}></span> Live
                    </span>
                  </div>

                  <div style={{ padding: '1.2rem', fontSize: '0.85rem', lineHeight: 1.6, color: '#bbb' }}>
                    <div style={{ color: '#888', marginBottom: '0.6rem', fontSize: '0.75rem' }}># Active Subsystem Telemetry</div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ color: '#54a0ff' }}>[26 TOPS NPU]</span>
                      <span>YOLOv26 edge pipeline: 30 FPS</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ color: '#4ecdc4' }}>[LangGraph]</span>
                      <span>Autonomous HR agent graph ready</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ color: '#feca57' }}>[VidMind]</span>
                      <span>Local Whisper + Ollama pipeline</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.8rem' }}>
                      <span style={{ color: '#ff9ff3' }}>[FastAPI uvloop]</span>
                      <span>Gateway round-trip: {liveLatency}ms</span>
                    </div>

                    {/* Interactive Log Console */}
                    <div style={{
                      background: theme === 'light' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0,0,0,0.55)',
                      borderRadius: '10px',
                      padding: '0.8rem',
                      border: '1px solid rgba(255,255,255,0.06)',
                      maxHeight: '140px',
                      overflowY: 'auto',
                      marginBottom: '0.8rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.3rem'
                    }}>
                      {terminalLogs.map((log, lIdx) => (
                        <div key={lIdx} style={{ fontSize: '0.75rem', lineHeight: 1.4, color: theme === 'light' ? (log.isInput ? '#3A5237' : '#1C1D20') : (log.isInput ? '#ffbd2e' : '#2ecc71') }}>
                          <span style={{ color: '#666', marginRight: '6px' }}>[{log.time}]</span>
                          <span>{log.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Interactive Command Input */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        executeTerminalCommand(terminalCmd);
                        setTerminalCmd("");
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}
                    >
                      <span style={{ color: 'var(--accent-glow-strong)', fontSize: '0.8rem' }}>&gt;</span>
                      <input
                        type="text"
                        value={terminalCmd}
                        onChange={(e) => setTerminalCmd(e.target.value)}
                        placeholder="type command (help, ping npu, test agent)..."
                        style={{
                          flex: 1,
                          background: theme === 'light' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.04)',
                          border: theme === 'light' ? '1px solid rgba(120, 149, 117, 0.3)' : '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '6px',
                          color: textColor,
                          padding: '0.4rem 0.6rem',
                          fontSize: '0.8rem',
                          fontFamily: 'monospace',
                          outline: 'none'
                        }}
                      />
                      <button
                        type="submit"
                        style={{
                          background: 'rgba(235, 100, 52, 0.2)',
                          color: 'var(--accent-glow-strong)',
                          border: '1px solid rgba(235, 100, 52, 0.4)',
                          borderRadius: '6px',
                          padding: '0.4rem 0.8rem',
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        Run
                      </button>
                    </form>

                    {/* Quick Diagnostic Triggers */}
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.4rem' }}>Quick Diagnostic Triggers:</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        <button onClick={() => executeTerminalCommand("test agent")} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '6px', background: 'rgba(78,205,196,0.15)', color: '#4ecdc4', border: '1px solid rgba(78,205,196,0.3)', cursor: 'pointer' }}>
                          $ test agent
                        </button>
                        <button onClick={() => executeTerminalCommand("ping npu")} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '6px', background: 'rgba(84,160,255,0.15)', color: '#54a0ff', border: '1px solid rgba(84,160,255,0.3)', cursor: 'pointer' }}>
                          $ ping npu
                        </button>
                        <button onClick={() => executeTerminalCommand("check wal")} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '6px', background: 'rgba(255,107,107,0.15)', color: '#ff6b6b', border: '1px solid rgba(255,107,107,0.3)', cursor: 'pointer' }}>
                          $ check wal
                        </button>
                        <button onClick={() => executeTerminalCommand("help")} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', color: '#aaa', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer' }}>
                          $ help
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </section>

          <section id="about" style={{ padding: '80px 0', borderTop: '1px solid rgba(150,150,150,0.1)' }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="container">

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
                {/* Stats & Skills Left Side */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                  <motion.div variants={fadeInUp} style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <StatCounter value="2" label="Years Experience" />
                    <StatCounter value="14" label="Architectures Shipped" />
                    <StatCounter value="26" label="TOPS NPU Compute" />
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <h2 style={{ fontSize: 'clamp(1.5rem, 2vw, 2rem)', fontWeight: 800, fontFamily: 'Outfit', marginBottom: '1rem' }}>Software Arsenal</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '2rem' }}>
                      {SOFTWARE_ARSENAL.map((skill, index) => (
                        <span key={`soft-${index}`} style={{ background: 'rgba(150,150,150,0.1)', border: '1px solid rgba(150,150,150,0.2)', padding: '0.6rem 1.2rem', borderRadius: '50px', fontWeight: 600, fontSize: '0.9rem' }}>
                          {skill}
                        </span>
                      ))}
                    </div>

                    <h2 style={{ fontSize: 'clamp(1.5rem, 2vw, 2rem)', fontWeight: 800, fontFamily: 'Outfit', marginBottom: '1rem', color: 'var(--accent-glow-strong)' }}>Hardware Toolkit</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                      {HARDWARE_TOOLKIT.map((skill, index) => (
                        <span key={`hard-${index}`} style={{ background: 'rgba(235, 100, 52, 0.1)', border: '1px solid rgba(235, 100, 52, 0.3)', padding: '0.6rem 1.2rem', borderRadius: '50px', fontWeight: 600, fontSize: '0.9rem', color: 'var(--accent-glow-strong)' }}>
                          <Cpu size={14} style={{ display: 'inline', marginRight: '6px', marginBottom: '-2px' }} />
                          {skill}
                        </span>
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
                  { title: 'AI Engineering & Agents', desc: 'LangGraph multi-step cyclic agents, Groq LLM reasoning, PEFT/QLoRA fine-tuning, GGUF local quantization, and RAG architectures.' },
                  { title: 'Edge AI & Perception', desc: 'Raspberry Pi AI HAT+ (26 TOPS compute), YOLOv26, ByteTrack association, MediaPipe WASM, and live RTSP optical OCR.' },
                  { title: 'High-Concurrency Backend', desc: 'FastAPI async event loops, Express 5 WebSockets, SQLite WAL concurrent access, MySQL 9 triggers, and bounded memory stream processors.' },
                  { title: 'Cloud & DevOps Tooling', desc: 'AWS EC2 orchestration, EBS ghost drive auditing daemons, Docker containerization, and automated threshold alerts.' }
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeInUp} style={{ background: theme === 'light' ? 'rgba(255, 255, 255, 0.75)' : 'rgba(150,150,150,0.05)', padding: '2rem', borderRadius: '24px', border: theme === 'light' ? '1.5px solid rgba(120, 149, 117, 0.3)' : '1px solid rgba(150,150,150,0.1)', boxShadow: theme === 'light' ? '0 8px 25px rgba(120, 149, 117, 0.08)' : 'none' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.8rem', fontFamily: 'Outfit', color: textColor }}>{item.title}</h3>
                    <p style={{ color: theme === 'light' ? '#474F44' : '#777', fontWeight: 500, lineHeight: 1.6 }}>{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>

          {/* Theoretical Foundations & Areas of Study */}
          <section id="foundations" style={{ padding: '80px 0', borderTop: '1px solid rgba(150,150,150,0.1)' }}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="container">
              <div style={{ textAlign: 'left', marginBottom: '3.5rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(84, 160, 255, 0.1)', color: '#54a0ff', padding: '0.4rem 1rem', borderRadius: '50px', fontWeight: 700, fontSize: '0.85rem', marginBottom: '1rem', border: '1px solid rgba(84, 160, 255, 0.2)' }}>
                  <Brain size={16} /> Knowledge & Deep Understanding
                </div>
                <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', fontWeight: 800, fontFamily: 'Outfit' }}>
                  Theoretical Foundations & <span style={{ color: 'var(--accent-glow-strong)' }}>Areas of Study</span>
                </h2>
                <p style={{ color: '#aaa', fontSize: '1.1rem', marginTop: '1rem', maxWidth: '750px', lineHeight: 1.6 }}>
                  Underpinning my software and AI architectures is continuous, rigorous study spanning multivariable calculus, probability theory, transformer mechanics, and high-concurrency systems optimization.
                </p>
              </div>

              {/* Category Filter Tabs */}
              <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.4rem', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap', marginBottom: '2.5rem', width: 'fit-content' }}>
                {['All', 'Applied Mathematics', 'Generative AI', 'Systems Engineering', 'Edge Computing'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => { playClick(); setActiveFoundationCategory(cat); }}
                    style={{
                      padding: '0.5rem 1.1rem',
                      borderRadius: '50px',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      color: activeFoundationCategory === cat ? '#fff' : '#888',
                      background: activeFoundationCategory === cat ? 'var(--accent-glow-strong)' : 'transparent',
                      transition: 'all 0.3s',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '2rem' }}>
                {FOUNDATIONS_AND_STUDIES
                  .filter(d => activeFoundationCategory === 'All' || d.tag === activeFoundationCategory)
                  .map((domain, i) => (
                  <motion.div
                    key={domain.category}
                    variants={i % 2 === 0 ? revealLeft : revealRight}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                  >
                    <FlipCard domain={domain} isMobile={isMobile} theme={theme} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>

          {/* Edge AI Proof of Competence: In-Browser Semantic Vector Engine */}
          <section id="playground" style={{ padding: '80px 0', borderTop: '1px solid rgba(150,150,150,0.1)' }}>
            <div className="container">
              <Suspense fallback={<div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>Initializing In-Browser Vector Engine...</div>}>
                <EdgePlayground isMobile={isMobile} theme={theme} />
              </Suspense>
            </div>
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
                <ProjectWheel projects={filteredProjects} setSelectedId={setSelectedId} isMobile={isMobile} theme={theme} />
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
                    <motion.div
                      key={cs.id}
                      layoutId={`cs-${cs.id}`}
                      whileHover={isMobile ? {} : liftHover}
                      whileTap={tapPress}
                      onClick={() => setSelectedCaseStudy(cs.id)}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: theme === 'light' ? 'rgba(255, 255, 255, 0.75)' : 'rgba(150,150,150,0.03)', border: theme === 'light' ? '1.5px solid rgba(120, 149, 117, 0.3)' : '1px solid rgba(150,150,150,0.08)', borderRadius: '16px', cursor: 'pointer', boxShadow: theme === 'light' ? '0 4px 20px rgba(120, 149, 117, 0.08)' : 'none' }}
                      className="cs-card"
                    >
                      <div>
                        <div style={{ display: 'inline-block', padding: '0.3rem 0.8rem', background: theme === 'light' ? 'rgba(120, 149, 117, 0.15)' : 'rgba(235, 100, 52, 0.1)', color: 'var(--accent-glow-strong)', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.8rem', border: theme === 'light' ? '1px solid rgba(120, 149, 117, 0.25)' : 'none' }}>{cs.tag}</div>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'inherit', marginBottom: '0.3rem' }}>{cs.title}</h4>
                        <span style={{ color: theme === 'light' ? '#586354' : '#888', fontSize: '0.9rem' }}>{cs.readTime}</span>
                      </div>
                      <button className="btn btn-pill" style={{ borderColor: theme === 'light' ? 'rgba(120, 149, 117, 0.4)' : 'rgba(150,150,150,0.4)', color: 'inherit' }}>Read <ExternalLink size={14} /></button>
                    </motion.div>
                  ))}
                  <style>{`.cs-card:hover { transform: translateX(8px); background: ${theme === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(150,150,150,0.06)'} !important; border-color: ${theme === 'light' ? 'rgba(120, 149, 117, 0.5)' : 'rgba(150,150,150,0.2)'} !important; }`}</style>
                </div>
              </motion.div>
            </motion.div>
          </section>

          {/* Case Study Modal (Projects) */}
          <AnimatePresence>
            {selectedId && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overlay-backdrop" onClick={() => setSelectedId(null)} data-lenis-prevent="true" onWheel={(e) => e.stopPropagation()} style={{ padding: isMobile ? '1rem' : '0' }}>
                {PROJECTS.map(p => p.id === selectedId && (
                  <motion.div layoutId={`card-${p.id}`} key={p.id} className="project-modal" data-lenis-prevent="true" onWheel={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()} style={{ width: '100%', padding: isMobile ? '2rem 1.5rem' : '4rem', maxHeight: '90vh', overflowY: 'auto', overscrollBehavior: 'contain' }}>
                    <button className="project-modal-close" onClick={() => setSelectedId(null)} style={{ top: isMobile ? '1rem' : '2rem', right: isMobile ? '1rem' : '2rem' }}><X size={20} /></button>
                    <div style={{ width: isMobile ? '60px' : '80px', height: isMobile ? '60px' : '80px', borderRadius: '20px', background: `${p.color}15`, color: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                      {p.icon}
                    </div>
                    <h3 style={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: 900, fontFamily: 'Outfit', lineHeight: 1.1, marginBottom: '1rem' }}>{p.title}</h3>
                    {p.techStack && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        {p.techStack.map((t, idx) => (
                          <span key={idx} style={{ fontSize: '0.85rem', padding: '0.3rem 0.8rem', borderRadius: '50px', background: `${p.color}15`, color: p.color, border: `1px solid ${p.color}40`, fontWeight: 600 }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    <p style={{ color: '#aaa', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>{p.desc}</p>

                    {p.image && (
                      <div style={{ marginBottom: '2rem', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <img src={p.image} alt={p.title} style={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: '400px' }} />
                      </div>
                    )}

                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: isMobile ? '1.5rem' : '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: p.color }}>Architecture Schematic</h4>

                      {/* React Flow Interactive Diagram with Click Inspector */}
                      <div id={`flow-${p.id}`} style={{ height: '200px', width: '100%', marginBottom: '1.5rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }} onWheel={(e) => e.stopPropagation()}>
                        <ReactFlow 
                          nodes={p.flow.nodes.map(n => {
                            const isSelected = (inspectedNode || p.flow.nodes[0]?.data?.label) === n.data.label;
                            return {
                              ...n,
                              style: {
                                ...n.style,
                                borderColor: isSelected ? p.color : n.style.borderColor,
                                boxShadow: isSelected ? `0 0 16px ${p.color}80` : 'none',
                                transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }
                            };
                          })} 
                          edges={p.flow.edges} 
                          fitView 
                          attributionPosition="bottom-right"
                          onNodeClick={(_, node) => {
                            playClick();
                            setInspectedNode(node.data.label);
                          }}
                        >
                          <Background color="#111216" gap={16} />
                        </ReactFlow>
                      </div>

                      {/* Interactive Node Inspector Drawer */}
                      {(() => {
                        const currentLabel = inspectedNode || p.flow.nodes[0]?.data?.label;
                        const info = (NODE_DETAILS && NODE_DETAILS[currentLabel]) || {
                          role: `Core architectural pipeline component for ${currentLabel}`,
                          tradeoff: "Optimized for latency bounding and deterministic execution under high concurrency.",
                          snippet: `# Pipeline Node: ${currentLabel}\nasync def execute_step(payload):\n    return await pipeline.dispatch(payload)`
                        };
                        return (
                          <motion.div
                            key={currentLabel}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            style={{
                              background: 'rgba(10, 12, 18, 0.95)',
                              border: `1px solid ${p.color}45`,
                              borderRadius: '14px',
                              padding: '1.2rem 1.5rem',
                              marginBottom: '1.5rem',
                              boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.color }} />
                                <span style={{ fontWeight: 800, color: '#fff', fontSize: '1rem', fontFamily: 'Outfit, sans-serif' }}>{currentLabel}</span>
                                <span style={{ fontSize: '0.75rem', color: p.color, background: `${p.color}15`, padding: '0.2rem 0.6rem', borderRadius: '50px', border: `1px solid ${p.color}35`, fontWeight: 600 }}>Active Node</span>
                              </div>
                              <span style={{ fontSize: '0.7rem', color: '#888', fontFamily: 'monospace' }}>Click nodes above to inspect</span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem', marginBottom: '0.8rem' }}>
                              <div>
                                <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', marginBottom: '0.2rem', letterSpacing: '0.5px' }}>Responsibility & Scope</div>
                                <div style={{ fontSize: '0.85rem', color: '#ddd', lineHeight: 1.5 }}>{info.role}</div>
                              </div>
                              <div>
                                <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', marginBottom: '0.2rem', letterSpacing: '0.5px' }}>Architectural Trade-Off</div>
                                <div style={{ fontSize: '0.85rem', color: '#bbb', lineHeight: 1.5 }}>{info.tradeoff}</div>
                              </div>
                            </div>

                            <div>
                              <div style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', marginBottom: '0.4rem', fontFamily: 'monospace' }}>Production Configuration / Implementation</div>
                              <div style={{ background: '#06070a', borderRadius: '8px', padding: '0.8rem 1rem', fontSize: '0.75rem', color: '#54a0ff', border: '1px solid rgba(255,255,255,0.06)', overflowX: 'auto', whiteSpace: 'pre', fontFamily: 'Fira Code, monospace', lineHeight: 1.5 }}>
                                {info.snippet}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })()}

                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <a href={p.repoUrl || "https://github.com/ashiqmuneeb"} target="_blank" rel="noreferrer" className="btn btn-pill" style={{ border: `1px solid ${p.color}`, color: p.color, width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}>
                          View Repository <ExternalLink size={16} />
                        </a>
                        {p.colabUrl && (
                          <a href={p.colabUrl} target="_blank" rel="noreferrer" className="btn btn-pill" style={{ border: '1px solid #f9ab00', color: '#f9ab00', width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}>
                            Run in Colab <ExternalLink size={16} />
                          </a>
                        )}
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
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overlay-backdrop" onClick={() => setSelectedCaseStudy(null)} data-lenis-prevent="true" onWheel={(e) => e.stopPropagation()} style={{ padding: isMobile ? '1rem' : '2rem', zIndex: 100000 }}>
                {CASE_STUDIES.map(cs => cs.id === selectedCaseStudy && (
                  <motion.div layoutId={`cs-${cs.id}`} key={cs.id} className="project-modal" data-lenis-prevent="true" onWheel={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '1000px', padding: isMobile ? '2rem' : '4rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', maxHeight: '90vh', overscrollBehavior: 'contain' }}>
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
