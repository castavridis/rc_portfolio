"use client"

import { useRef } from 'react';
import * as THREE from 'three';
import { Canvas, ThreeElements, useFrame } from '@react-three/fiber';

function MobilePiece (props: ThreeElements['mesh']): React.ReactElement {
  const meshRef = useRef<THREE.Mesh>(null!)
  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta
  })
  return (
    <mesh 
      {...props}
      ref={meshRef}
    >
      <boxGeometry args={[1, 1, 1]} />
    </mesh>
  )
}

export default function CalderPage (): React.ReactNode {
  return (
    <Canvas>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <MobilePiece />
    </Canvas>
  )
}