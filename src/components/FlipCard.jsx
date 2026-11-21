import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCw, CornerDownLeft } from 'lucide-react';

export default function FlipCard({ domain, isMobile, theme = 'light' }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const isLight = theme === 'light';

  const handleFlip = () => {
    setIsFlipped(prev => !prev);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleFlip();
    }
  };

  return (
    <div
      style={{
        perspective: '1200px',
        height: isMobile ? '470px' : '450px',
        width: '100%',
      }}
      className="flip-card-wrapper"
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* FRONT FACE */}
        <div
          role="button"
          tabIndex={0}
          onClick={handleFlip}
          onKeyDown={handleKeyDown}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(25, 25, 30, 0.75)',
            backdropFilter: isMobile ? 'none' : 'blur(12px)',
            border: isLight ? `1.5px solid rgba(120, 149, 117, 0.35)` : `1px solid ${domain.color}40`,
            borderRadius: '24px',
            padding: isMobile ? '1.6rem' : '2.2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            boxShadow: isLight ? '0 12px 35px rgba(120, 149, 117, 0.12)' : '0 12px 35px rgba(0, 0, 0, 0.35)',
            transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
          }}
        >
          <div>
            {/* Top row: Icon and Domain Tag */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.4rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: isLight ? 'rgba(120, 149, 117, 0.18)' : `${domain.color}20`,
                  color: isLight ? '#405B3D' : domain.color,
                }}
              >
                {domain.icon}
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.35rem 0.85rem',
                  borderRadius: '50px',
                  background: isLight ? 'rgba(120, 149, 117, 0.14)' : 'rgba(255, 255, 255, 0.06)',
                  color: isLight ? '#384E35' : '#bbb',
                  border: isLight ? '1px solid rgba(120, 149, 117, 0.25)' : '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                {domain.tag}
              </span>
            </div>

            {/* Title & Summary */}
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit', marginBottom: '0.75rem', color: isLight ? '#1C1D20' : '#fff', lineHeight: 1.25 }}>
              {domain.category}
            </h3>
            <p style={{ color: isLight ? '#474F44' : '#aaa', fontSize: '0.92rem', lineHeight: 1.55, marginBottom: '1.2rem' }}>
              {domain.summary}
            </p>

            {/* Concepts Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {domain.concepts.map((c, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '0.25rem 0.65rem',
                    borderRadius: '8px',
                    background: isLight ? 'rgba(120, 149, 117, 0.1)' : 'rgba(255, 255, 255, 0.04)',
                    color: isLight ? '#283625' : '#ddd',
                    border: isLight ? '1px solid rgba(120, 149, 117, 0.2)' : '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  {c.name}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Flip Cue */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '1rem',
              borderTop: isLight ? '1px solid rgba(120, 149, 117, 0.18)' : '1px solid rgba(255, 255, 255, 0.06)',
              fontSize: '0.8rem',
              color: isLight ? '#405B3D' : domain.color,
              fontWeight: 700,
            }}
          >
            <span>{isMobile ? 'Tap to view formulas & proof' : 'Click to inspect deep-dive'}</span>
            <RotateCw size={14} />
          </div>
        </div>

        {/* BACK FACE */}
        <div
          role="button"
          tabIndex={0}
          onClick={handleFlip}
          onKeyDown={handleKeyDown}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: isLight ? 'rgba(247, 249, 241, 0.98)' : 'rgba(15, 17, 24, 0.97)',
            border: isLight ? `1.5px solid #789575` : `1px solid ${domain.color}60`,
            borderRadius: '24px',
            padding: isMobile ? '1.5rem' : '1.8rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            boxShadow: isLight ? '0 12px 35px rgba(120, 149, 117, 0.18)' : '0 12px 35px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', borderBottom: isLight ? '1px solid rgba(120, 149, 117, 0.2)' : '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.5rem' }}>
              <span style={{ fontWeight: 800, color: isLight ? '#2D3E2B' : domain.color, fontSize: '0.95rem' }}>
                {domain.category} — Deep Dive
              </span>
              <span style={{ fontSize: '0.7rem', color: isLight ? '#667262' : '#888', textTransform: 'uppercase', fontWeight: 600 }}>
                Theoretical Rigor
              </span>
            </div>

            {/* Scrollable concept list */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
                maxHeight: isMobile ? '310px' : '300px',
                overflowY: 'auto',
                paddingRight: '4px',
              }}
            >
              {domain.concepts.map((concept, cIdx) => (
                <div
                  key={cIdx}
                  style={{
                    background: isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.02)',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: isLight ? '1px solid rgba(120, 149, 117, 0.2)' : '1px solid rgba(255, 255, 255, 0.04)',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: isLight ? '#283A26' : domain.color, marginBottom: '0.2rem' }}>
                    {concept.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: isLight ? '#464F43' : '#aaa', lineHeight: 1.45 }}>
                    {concept.details}
                  </div>
                  {concept.formula && (
                    <div
                      style={{
                        marginTop: '0.4rem',
                        background: isLight ? '#E7EBDD' : '#0a0c10',
                        padding: '0.35rem 0.6rem',
                        borderRadius: '6px',
                        border: isLight ? '1px solid rgba(120, 149, 117, 0.3)' : '1px solid rgba(255, 255, 255, 0.06)',
                        fontFamily: 'monospace',
                        fontSize: '0.75rem',
                        color: isLight ? '#1B291A' : '#ffbd2e',
                        fontWeight: 600,
                      }}
                    >
                      {concept.formula}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Return Cue */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '0.75rem',
              marginTop: '0.5rem',
              borderTop: isLight ? '1px solid rgba(120, 149, 117, 0.2)' : '1px solid rgba(255, 255, 255, 0.06)',
              fontSize: '0.8rem',
              color: isLight ? '#405B3D' : '#aaa',
              fontWeight: 700,
            }}
          >
            <span>Click to return to overview</span>
            <CornerDownLeft size={14} color={isLight ? '#405B3D' : domain.color} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
