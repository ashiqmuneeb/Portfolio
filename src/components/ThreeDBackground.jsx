import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Stars, Float } from '@react-three/drei';

const InteractiveSphere = ({ isHackMode }) => {
  const meshRef = useRef();
  const { mouse, viewport } = useThree();

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Smoothly track mouse
      const targetX = (mouse.x * viewport.width) / 4;
      const targetY = (mouse.y * viewport.height) / 4;
      meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.05;
      meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.05;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 64, 64]} position={[2, 0, -2]} scale={1.5}>
        <MeshDistortMaterial 
          color={isHackMode ? "#ff0033" : "#eb6434"} 
          attach="material" 
          distort={0.5} 
          speed={2} 
          roughness={0.2} 
          metalness={0.8} 
        />
      </Sphere>
    </Float>
  );
};

const ThreeDBackground = ({ isHackMode }) => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', opacity: 0.6 }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <InteractiveSphere isHackMode={isHackMode} />
      </Canvas>
    </div>
  );
};

export default ThreeDBackground;
