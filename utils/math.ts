import * as THREE from 'three';
import { TREE_HEIGHT, TREE_RADIUS, SCATTER_RADIUS } from '../constants';

// Helper to get random float between min/max
const random = (min: number, max: number) => Math.random() * (max - min) + min;

// Generate a random point inside a sphere (SCATTERED state)
export const getScatterPosition = (): THREE.Vector3 => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(Math.random()) * SCATTER_RADIUS; // Cube root for uniform distribution
  
  const x = r * Math.sin(phi) * Math.cos(theta);
  const y = r * Math.sin(phi) * Math.sin(theta);
  const z = r * Math.cos(phi);
  
  return new THREE.Vector3(x, y, z);
};

// Generate a point on/in a Cone (TREE state)
// We bias towards the surface for better definition
export const getTreePosition = (heightBias: number = 0): THREE.Vector3 => {
  // y goes from 0 (base) to height (tip), but let's center it vertically
  const h = TREE_HEIGHT;
  const rBase = TREE_RADIUS;

  // Normalized height (0 to 1)
  const yNorm = Math.pow(Math.random(), 0.8); // Bias towards bottom slightly for volume
  const y = yNorm * h; 

  // Radius at this height
  const currentRadius = rBase * (1 - yNorm);
  
  // Angle
  const theta = Math.random() * Math.PI * 2;
  
  // Distance from center (Concentrate on surface for definition, fill inside loosely)
  // Mix uniform distribution with surface clamping
  const surfaceBias = Math.random() > 0.3 ? 0.9 + Math.random() * 0.1 : Math.random();
  const r = currentRadius * surfaceBias;

  const x = r * Math.cos(theta);
  const z = r * Math.sin(theta);
  
  // Offset Y to center the tree
  const finalY = y - (h / 2) + heightBias;

  return new THREE.Vector3(x, finalY, z);
};

// Generate random rotation
export const getRandomEuler = (): THREE.Euler => {
  return new THREE.Euler(
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI
  );
};