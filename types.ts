import * as THREE from 'three';

export enum TreeState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE',
}

export interface ParticleConfig {
  count: number;
  color: string;
  shape: 'cube' | 'tetrahedron' | 'sphere';
  size: number;
  emissive?: boolean;
  emissiveIntensity?: number;
}

export interface DualPosition {
  scatter: THREE.Vector3;
  tree: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
}