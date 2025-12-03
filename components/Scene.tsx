import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

import MorphingInstancedMesh from './MorphingInstancedMesh';
import { TreeState } from '../types';
import { COLORS, COUNTS } from '../constants';

interface SceneProps {
  treeState: TreeState;
}

const Rig = () => {
    useFrame((state) => {
        // Subtle camera sway
        const t = state.clock.getElapsedTime();
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 5 + Math.sin(t / 2) * 2, 0.05);
    })
    return null;
}

const Scene: React.FC<SceneProps> = ({ treeState }) => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 5, 25], fov: 45 }}
      gl={{ antialias: false, toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.5 }}
      dpr={[1, 2]} // Optimize for mobile vs desktop
    >
      <color attach="background" args={[COLORS.BG_DARK]} />
      
      {/* Cinematic Lighting Setup */}
      <ambientLight intensity={0.2} color={COLORS.PLATINUM_GOLD} />
      
      {/* Key Light */}
      <spotLight
        position={[10, 20, 10]}
        angle={0.5}
        penumbra={1}
        intensity={1000}
        color={COLORS.PLATINUM_GOLD}
        castShadow
        shadow-bias={-0.0001}
      />
      
      {/* Rim Light for drama */}
      <pointLight position={[-10, 5, -10]} intensity={500} color="#ffffff" />
      
      {/* Fill Light warm */}
      <pointLight position={[0, -10, 10]} intensity={200} color={COLORS.METALLIC_RED} />

      {/* HDRI Environment for reflections */}
      <Environment preset="city" background={false} blur={0.8} />

      {/* Camera Movement */}
      <OrbitControls 
        enablePan={false} 
        minPolarAngle={Math.PI / 4} 
        maxPolarAngle={Math.PI / 1.8}
        minDistance={10}
        maxDistance={40}
        autoRotate={treeState === TreeState.TREE_SHAPE}
        autoRotateSpeed={0.5}
      />
      <Rig />

      {/* Floating Group to add overall life */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
        
        {/* 1. Platinum Gold Cubes (Glow) */}
        <MorphingInstancedMesh
          count={COUNTS.PLATINUM}
          shape="cube"
          color={COLORS.PLATINUM_GOLD}
          size={0.15}
          emissive={true}
          emissiveIntensity={2.5}
          targetState={treeState}
        />

        {/* 2. Emerald Green Tetrahedrons (Foliage) */}
        <MorphingInstancedMesh
          count={COUNTS.EMERALD}
          shape="tetrahedron"
          color={COLORS.EMERALD}
          size={0.25}
          targetState={treeState}
        />

        {/* 3. Metallic Red Spheres (Ornaments) */}
        <MorphingInstancedMesh
          count={COUNTS.RED}
          shape="sphere"
          color={COLORS.METALLIC_RED}
          size={0.4}
          targetState={treeState}
        />
        
      </Float>
      
      {/* Ambient particles for atmosphere */}
      {treeState === TreeState.TREE_SHAPE && (
        <Sparkles count={200} scale={12} size={2} speed={0.4} opacity={0.5} color={COLORS.PLATINUM_GOLD} />
      )}

      {/* Post Processing for the "Cinematic Glow" */}
      <EffectComposer disableNormalPass>
        <Bloom 
            luminanceThreshold={1.2} // Only very bright things glow
            mipmapBlur 
            intensity={1.5} 
            radius={0.6}
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </Canvas>
  );
};

export default Scene;