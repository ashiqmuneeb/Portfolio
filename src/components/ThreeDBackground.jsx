import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, Stars } from '@react-three/drei';

const SimpleSphere = ({ isHackMode }) => {
  const meshRef = useRef();
  const { mouse, viewport } = useThree();

  useFrame(() => {
    if (meshRef.current) {
      // Smooth subtle mouse track
      const targetX = (mouse.x * viewport.width) / 6;
      const targetY = (mouse.y * viewport.height) / 6;
      meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.04;
      meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.04;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1.2, 24, 24]} position={[2, 0, -2]} scale={1.3}>
      <meshStandardMaterial
        color={isHackMode ? "#ff0033" : "#eb6434"}
        roughness={0.35}
        metalness={0.65}
      />
    </Sphere>
  );
};

const ThreeDBackground = ({ isHackMode }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [inView, setInView] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    // Check if mobile, touch device, or prefers-reduced-motion
    const isMobile = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isMobile && !prefersReducedMotion) {
      setShouldRender(true);
    }

    // Pause rendering when scrolled out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.45,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5] }}
        frameloop={inView ? 'always' : 'never'}
        dpr={1}
        gl={{ powerPreference: 'low-power', antialias: false, depth: false }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[8, 8, 4]} intensity={1} />
        <Stars radius={80} depth={30} count={500} factor={2.5} saturation={0} fade speed={0.4} />
        <SimpleSphere isHackMode={isHackMode} />
      </Canvas>
    </div>
  );
};

export default ThreeDBackground;
