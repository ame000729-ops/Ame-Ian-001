import React, { useLayoutEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { TreeState, DualPosition } from '../types';
import { getScatterPosition, getTreePosition, getRandomEuler } from '../utils/math';
import { ANIMATION_SPEED } from '../constants';

interface Props {
  count: number;
  shape: 'cube' | 'tetrahedron' | 'sphere';
  color: string;
  size: number;
  emissive?: boolean;
  emissiveIntensity?: number;
  targetState: TreeState;
}

const MorphingInstancedMesh: React.FC<Props> = ({
  count,
  shape,
  color,
  size,
  emissive = false,
  emissiveIntensity = 0,
  targetState,
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Pre-calculate positions for both states
  const particles = useMemo(() => {
    const data: DualPosition[] = [];
    for (let i = 0; i < count; i++) {
      data.push({
        scatter: getScatterPosition(),
        tree: getTreePosition(),
        rotation: getRandomEuler(),
        scale: Math.random() * 0.5 + 0.5, // Variance in size
      });
    }
    return data;
  }, [count]);

  // Geometry Factory
  const geometry = useMemo(() => {
    switch (shape) {
      case 'cube':
        return new THREE.BoxGeometry(size, size, size);
      case 'tetrahedron':
        return new THREE.TetrahedronGeometry(size);
      case 'sphere':
        return new THREE.SphereGeometry(size, 16, 16);
      default:
        return new THREE.BoxGeometry(size, size, size);
    }
  }, [shape, size]);

  // Material Factory
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      roughness: shape === 'sphere' ? 0.1 : 0.4, // Spheres are shiny ornaments
      metalness: shape === 'sphere' ? 0.9 : 0.6,
      emissive: emissive ? new THREE.Color(color) : new THREE.Color(0x000000),
      emissiveIntensity: emissive ? emissiveIntensity : 0,
    });
  }, [color, shape, emissive, emissiveIntensity]);

  useLayoutEffect(() => {
    // Initial placement to avoid flicker
    if (meshRef.current) {
      particles.forEach((p, i) => {
        dummy.position.copy(p.scatter);
        dummy.rotation.copy(p.rotation);
        dummy.scale.setScalar(p.scale);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [particles, dummy]);

  // Animation Loop
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Define target Lerp factor based on state
    // We maintain a "current progress" internally by lerping positions directly
    // Ideally we would use a shader for 100k particles, but for <5k this loop is fine.
    
    // Smooth damp factor
    const step = delta * ANIMATION_SPEED; 

    particles.forEach((p, i) => {
      // Get current matrix
      meshRef.current!.getMatrixAt(i, dummy.matrix);
      dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);

      // Determine Target Position
      const targetPos = targetState === TreeState.TREE_SHAPE ? p.tree : p.scatter;

      // Smoothly interpolate position
      dummy.position.lerp(targetPos, step);
      
      // Add a slow idle rotation for liveliness
      dummy.rotation.x += delta * 0.2;
      dummy.rotation.y += delta * 0.2;

      // Update Matrix
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, count]}
      castShadow
      receiveShadow
    />
  );
};

export default MorphingInstancedMesh;