# Ashiq Muneeb — AI Systems Engineer & System Architect

[![React 19](https://img.shields.io/badge/React-19.0-61dafb.svg?style=flat&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg?style=flat&logo=vite)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.182-black.svg?style=flat&logo=three.js)](https://threejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Interactive personal portfolio and engineering showcase designed with **React 19**, **Vite**, **Three.js**, **Framer Motion**, and **React Flow**. Highlights real-time client-side vector cosine semantic similarity retrieval, 3D hardware-accelerated interactive system architectures, and production-grade edge AI solutions.

---

## ⚡ Key Highlights & Engineering Features

- **Edge Vector Retrieval Engine:** Real-time client-side vector cosine similarity search executing directly on the browser thread with sub-millisecond latency benchmarks.
- **Interactive System Architecture Explorer:** Dynamic directed graphs powered by `@xyflow/react` and interactive inspector drawers with node-level tradeoff analysis.
- **3D Foundations Flip Cards:** Hardware-accelerated 3D perspective flip cards with zero layout-shift or height collapsing.
- **Responsive Custom Cursor Physics:** Precision 6px pointer locked 1:1 to hardware mouse movements with a smooth 26px follower ring and automatic text-mode caret switching on inputs.
- **Calm Nature-Inspired Palette:** Pale Sage Ivory (`#E5E8CE`) base background, Muted Forest Sage (`#789575`) brand accents, and Deep Charcoal (`#1C1D20`) high-contrast typography.
- **Strict Mobile & Reduced-Motion Performance:**
  - Complete elimination of backdrop-blur on low-end mobile devices.
  - Automatic suspension of Three.js canvas on mobile viewports and when `prefers-reduced-motion` matches.
  - Lenis smooth-scroll isolation preventing modal background scroll leaks (`overscroll-behavior: contain`).

---

## 🛠️ Tech Stack & Arsenal

| Domain | Technologies & Libraries |
| :--- | :--- |
| **Frontend Framework** | React 19, Vite, JavaScript (ESNext) |
| **Motion & 3D** | Framer Motion, Three.js, `@react-three/fiber`, `@react-three/drei` |
| **Graphing & Schematics** | `@xyflow/react` (React Flow), HTML-to-Image |
| **Icons & Typography** | Lucide React, Google Fonts (Inter, Outfit, Fira Code) |
| **Styling Architecture** | Modular CSS Variables, Hardware-accelerated CSS transforms |

---

## 🚀 Getting Started

### Prerequisites
- Node.js `>= 18.0.0`
- npm `>= 9.0.0`

### Installation
```bash
# Clone repository
git clone https://github.com/ashiqmuneeb/Portfolio.git

# Enter project directory
cd Portfolio

# Install dependencies
npm install

# Start local development server
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 📂 Project Architecture

```
├── public/                 # Static assets, CV document, icons
│   ├── Ashiq_Muneeb_CV_METI.pdf
│   └── favicon.svg
├── src/
│   ├── components/         # Modular interactive UI components
│   │   ├── AIChatbot.jsx
│   │   ├── CodingStats.jsx
│   │   ├── CommandPalette.jsx
│   │   ├── CustomCursor.jsx
│   │   ├── EdgePlayground.jsx
│   │   ├── FlipCard.jsx
│   │   ├── MarkdownReader.jsx
│   │   └── ThreeDBackground.jsx
│   ├── utils/              # Animation configs & physics presets
│   │   └── animations.js
│   ├── App.jsx             # Main application orchestrator
│   ├── index.css           # Global design system & theme variables
│   └── main.jsx            # Application entrypoint
├── package.json
└── vite.config.js
```

---

## 📜 License
Released under the [MIT License](LICENSE).
Created with precision by **Ashiq Muneeb**.
