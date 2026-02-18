import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  Environment, 
  Float, 
  Text, 
  RoundedBox, 
  Torus,
  ContactShadows
} from '@react-three/drei';

import { motion, useScroll, useTransform } from 'framer-motion';
import * as THREE from 'three';

// --- IMPROVED CYBER BUCKET (VAULT) ---
export const Bucket = () => {
  const ringRef = useRef();
  
  useFrame((state) => {
    // Rotating the glowing ring for a "scanning" effect
    ringRef.current.rotation.z += 0.01;
  });

  return (
    <group position={[0, -4.5, 0]}>
      {/* Main Outer Container */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[2.5, 2, 2.5, 32, 1, true]} />
        <meshStandardMaterial 
          color="#0f172a" 
          metalness={0.9} 
          roughness={0.1} 
          side={THREE.DoubleSide} 
        />
      </mesh>

      {/* Inner Glowing Floor (Where cards start) */}
      <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.2, 32]} />
        <meshStandardMaterial 
          color="#3b82f6" 
          emissive="#3b82f6" 
          emissiveIntensity={5} 
        />
      </mesh>

      {/* Floating Cyber Ring */}
      <group ref={ringRef} position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <Torus args={[2.8, 0.05, 16, 100]}>
          <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={2} />
        </Torus>
      </group>

      {/* Rim Glow */}
      <mesh position={[0, 1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.4, 2.6, 64]} />
        <meshBasicMaterial color="#3b82f6" side={THREE.DoubleSide} />
      </mesh>
      
      <pointLight position={[0, 2, 0]} intensity={3} color="#3b82f6" distance={10} />
    </group>
  );
};

// --- REFINED FLYING CARD ---
const FlyingCard = ({ index, total, scrollProgress, title, color }) => {
  const ref = useRef();
  
  // Unique physics for each card
  const brain = useMemo(() => ({
    xOffset: (index - (total - 1) / 2) * 2.5, // Spreads them left-to-right
    rotationSpeed: Math.random() * 0.5 + 0.5,
    delay: index * 0.1, // Staggers the "pop"
    curve: Math.random() * 2 - 1,
  }), [index, total]);

  useFrame(() => {
    const s = scrollProgress.get();
    
    // Normalizing scroll for this specific card
    // Cards start emerging at 10% scroll and finish by 90%
    const start = 0.1 + (index / total) * 0.4;
    const end = start + 0.3;
    const p = THREE.MathUtils.smoothstep(s, start, end);

    if (p > 0) {
      // Y-axis: Move from inside bucket up to the screen
      ref.current.position.y = -4 + p * 12;
      
      // Z-axis: Move from center toward camera
      ref.current.position.z = p * 8;
      
      // X-axis: Fan out based on index + some random wobble
      ref.current.position.x = p * brain.xOffset + (Math.sin(p * 3) * brain.curve);
      
      // Rotation: Professional "Card Flip"
      ref.current.rotation.x = p * Math.PI * 2;
      ref.current.rotation.y = p * (Math.PI / 4);
      ref.current.rotation.z = Math.sin(p) * 0.5;

      // Scale: Small to Large
      const scale = 0.2 + p * 0.8;
      ref.current.scale.setScalar(scale);
    } else {
      // Keep hidden in the "bucket"
      ref.current.position.y = -10;
    }
  });

  return (
    <group ref={ref}>
      <RoundedBox args={[3, 4, 0.1]} radius={0.15} smoothness={4}>
        <meshStandardMaterial 
          color={color} 
          metalness={0.7} 
          roughness={0.2} 
          envMapIntensity={1}
        />
        <Text
          position={[0, 0, 0.06]}
          fontSize={0.3}
          maxWidth={2}
          textAlign="center"
          color="white"
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
        >
          {title.toUpperCase()}
        </Text>
      </RoundedBox>
    </group>
  );
};

// --- DOM OVERLAY ---
const UIOverlay = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col items-center">
      <section className="h-screen flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-blue-500/10 border border-blue-500/20 px-4 py-1 rounded-full text-blue-400 text-xs font-bold tracking-[0.3em] mb-6"
        >
          MODULE 04: TALENT EXTRACTION
        </motion.div>
        <h1 className="text-white text-6xl md:text-8xl font-black tracking-tighter mb-4">
          THE <span className="text-blue-500">SKILL</span> VAULT
        </h1>
        <p className="text-gray-400 max-w-lg">
          Scroll to deploy our agentic search. Watch as the AI extracts the most 
          relevant profiles from your internal database.
        </p>
      </section>

      {/* This spacer creates the scroll length required for the animation */}
      <div className="h-[300vh]" /> 

      <section className="h-screen flex items-center justify-center">
        <h2 className="text-white text-4xl font-bold opacity-20 italic">End of Extraction</h2>
      </section>
    </div>
  );
};

export default function VaultPage() {
  const { scrollYProgress } = useScroll();
  
  const cards = [
    { title: "Senior Python Developer", color: "#1e40af" },
    { title: "Cloud Architect", color: "#3b82f6" },
    { title: "UI/UX Researcher", color: "#1d4ed8" },
    { title: "Data Engineer", color: "#60a5fa" },
    { title: "Product Manager", color: "#2563eb" },
    { title: "DevOps Specialist", color: "#1e3a8a" },
  ];

  return (
    <div className="bg-[#020617] w-full min-h-[400vh] selection:bg-blue-500/30">
      {/* 3D Scene */}
      <div className="fixed inset-0 w-full h-full">
        <Canvas shadows gl={{ antialias: true }}>
          <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={40} />
          
          <Suspense fallback={null}>
            <Environment preset="city" />
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            
            <Bucket />
            
            {cards.map((card, i) => (
              <FlyingCard 
                key={i} 
                index={i} 
                total={cards.length} 
                scrollProgress={scrollYProgress}
                title={card.title}
                color={card.color}
              />
            ))}

            {/* Bottom Shadow/Floor Plane */}
            <ContactShadows 
              position={[0, -4.5, 0]} 
              opacity={0.4} 
              scale={15} 
              blur={2} 
              far={4.5} 
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full p-10 z-50 flex justify-between items-center mix-blend-difference">
        <div className="text-white font-black text-2xl tracking-tighter italic">apriora.ai</div>
        <div className="flex gap-6">
          <button className="text-white/50 hover:text-white text-sm font-bold transition-colors uppercase tracking-widest">Database</button>
          <button className="text-white/50 hover:text-white text-sm font-bold transition-colors uppercase tracking-widest">Vault</button>
        </div>
      </nav>

      <UIOverlay />
    </div>
  );
}