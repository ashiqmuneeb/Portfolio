import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // Disable on touch devices, coarse pointers, or prefers-reduced-motion
    const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || reducedMotion) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isVisible = false;
    let isClickable = false;
    let isInput = false;
    let isMouseDown = false;
    let rafId;

    const updateRingStyle = () => {
      if (!ringRef.current) return;
      if (isInput) {
        ringRef.current.style.opacity = '0';
        if (dotRef.current) dotRef.current.style.opacity = '0';
        return;
      }
      if (isVisible) {
        ringRef.current.style.opacity = '1';
        if (dotRef.current) dotRef.current.style.opacity = '1';
      }

      const scale = isMouseDown ? 0.85 : isClickable ? 1.35 : 1;
      const border = isClickable
        ? '1.5px solid var(--accent-glow-strong)'
        : '1px solid var(--accent-glow-strong)';
      const bg = isClickable ? 'rgba(120, 149, 117, 0.14)' : 'transparent';

      ringRef.current.style.border = border;
      ringRef.current.style.backgroundColor = bg;
      ringRef.current.style.transform = `translate3d(${ringX - 13}px, ${ringY - 13}px, 0) scale(${scale})`;
    };

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        ringX = mouseX;
        ringY = mouseY;
        if (dotRef.current) dotRef.current.style.opacity = '1';
        if (ringRef.current) ringRef.current.style.opacity = '1';
      }

      if (dotRef.current && !isInput) {
        dotRef.current.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0)`;
      }
    };

    const onMouseOver = (e) => {
      const target = e.target;
      if (!target || !(target instanceof Element)) return;

      const inputEl = target.closest('input, textarea, select, [contenteditable="true"]');
      if (inputEl) {
        isInput = true;
        isClickable = false;
        if (dotRef.current) dotRef.current.style.opacity = '0';
        if (ringRef.current) ringRef.current.style.opacity = '0';
        return;
      }

      isInput = false;
      const clickableEl = target.closest(
        'button, a, [role="button"], .btn, .flip-card-wrapper, .cs-card, .github-card, [tabindex="0"], [data-clickable="true"]'
      );
      isClickable = Boolean(clickableEl);
      updateRingStyle();
    };

    const onMouseDown = () => {
      isMouseDown = true;
      updateRingStyle();
    };

    const onMouseUp = () => {
      isMouseDown = false;
      updateRingStyle();
    };

    const onMouseLeave = () => {
      isVisible = false;
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
    };

    const onMouseEnter = () => {
      isVisible = true;
      if (!isInput) {
        if (dotRef.current) dotRef.current.style.opacity = '1';
        if (ringRef.current) ringRef.current.style.opacity = '1';
      }
    };

    const render = () => {
      ringX += (mouseX - ringX) * 0.32;
      ringY += (mouseY - ringY) * 0.32;
      updateRingStyle();
      rafId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.documentElement.addEventListener('mouseleave', onMouseLeave, { passive: true });
    document.documentElement.addEventListener('mouseenter', onMouseEnter, { passive: true });
    window.addEventListener('scroll', updateRingStyle, { passive: true });

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      document.documentElement.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('scroll', updateRingStyle);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (typeof window !== 'undefined' && (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window)) {
    return null;
  }

  return (
    <>
      {/* Precision pointer dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '6px',
          height: '6px',
          backgroundColor: 'var(--accent-glow-strong)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 1000000,
          willChange: 'transform',
          opacity: 0,
          transition: 'opacity 0.12s ease',
          boxShadow: '0 0 6px var(--accent-glow-strong)'
        }}
      />
      {/* Smooth follower ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '26px',
          height: '26px',
          border: '1.5px solid var(--accent-glow-strong)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 999999,
          willChange: 'transform',
          opacity: 0,
          transform: 'translate3d(-100px, -100px, 0)',
          transition: 'border 0.2s ease, background-color 0.2s ease, opacity 0.12s ease',
        }}
      />
    </>
  );
}
