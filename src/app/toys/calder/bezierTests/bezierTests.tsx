"use client"

// Q: What might server-side THREE js look like?

import { Box, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useRef, useEffect, useState, useCallback } from 'react'
import * as THREE from 'three'

import dynamic from 'next/dynamic'
import { Physics, RigidBody, } from '@react-three/rapier'


const BezierCanvas = dynamic(() => import('./bezierCanvas'), {
  ssr: false,
})
const BezierMatter = dynamic(() => import('./bezierMatter'), {
  ssr: false,
})
const BezierShapeTool = dynamic(() => import('./bezierShapeTool'), {
  ssr: false,
})

function BezierShapeCanvas ({
  setShapes,
}): React.ReactNode {
  return (
    <BezierShapeTool setShapes={setShapes} />
  )
}
function CalderMesh ({
  data,
  shape,
  index,
  scale = 1,
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const extrudeRef = useRef<THREE.ExtrudeGeometry>(null);
  useEffect(() => {
    if (meshRef.current) {
      let _mesh = meshRef.current
      _mesh.translateZ((index + 1) * (1+scale))
    }
  }, [meshRef])
  useEffect(() => {
    if (extrudeRef.current) {
      let _extrude = extrudeRef.current
      _extrude.translate(
        -data.vertices[0][0], 
        -data.vertices[0][1]*(scale / 2),
        0
      )
    }
  }, [extrudeRef])
  return (
    <mesh castShadow receiveShadow ref={meshRef}
      // position={[-data.vertices[0][0],-data.vertices[0][1],0]}
    >
      <meshStandardMaterial color={data.color}/>
      <extrudeGeometry args={[shape, { depth: scale/10 }]} />
      <axesHelper />
    </mesh>
  )
}
function CalderCanvas ({
  shapes,
}): React.ReactNode {
  // p5js canvas = 0-500
  // threejs scene in view = 0-5
  const scale = .125;
  const generateShapes = useCallback((): React.ReactNode[] => {
    if (!shapes) return
    const _shapes = []
    for (let i = 0; i < shapes.length; i++) {
      const data = shapes[i]
      if (!data) continue;
      const shape = new THREE.Shape()
      // grid is 400
      const origin = data.vertices[0]
      // shape.moveTo(origin[0],origin[1])
      shape.moveTo(0,0)
      for (let j = 1; j < data.vertices.length; j++) {
        const coords = data.vertices[j]
        shape.bezierCurveTo(
          (coords[0]-origin[0])*scale,-(coords[1]-origin[1])*scale,
          (coords[2]-origin[0])*scale,-(coords[3]-origin[1])*scale,
          (coords[4]-origin[0])*scale,-(coords[5]-origin[1])*scale,
        )
      }
      // shape.moveTo(origin[0],origin[1])
      shape.moveTo(0,0)
      _shapes.push(
        <CalderMesh key={i} data={data} shape={shape} index={i} scale={scale} />
      )
    }
    setMeshes((_prev) => _shapes)
  }, [shapes])
  const getOrigin = useCallback((): number[] => {
    if (!shapes || shapes.length === 0) return [0,0]
    return shapes[0].vertices[0]
  }, [shapes])
  const [meshes, setMeshes] = useState<any[]>(null)
  useEffect(() => {
    generateShapes()
  }, [shapes])
  return (
    // TODO: Figure out why tailwind isn't working
    <div className="w-[500px] h-[500px] border-calder-black/10 border-2" style={{
      width: '500px',
      height: '500px',
      backgroundColor: '#E8D5C4',
    }}>
      <Canvas camera={{
        position: [0,0,50]
      }}>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 100]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-50, -50, 100]} decay={0} intensity={Math.PI} />
      <OrbitControls />
      { meshes }
      <mesh position={[0,0,0]}>
        <meshBasicMaterial color={'white'} />
        <sphereGeometry args={[0.1,32,16]} />
      </mesh>
      <gridHelper args={[1,10]} />
      <axesHelper />
    </Canvas>
      
    </div>
  )
}
function CalderThreeRapier ({
  shapes,
}): React.ReactNode {
  // p5js canvas = 0-500
  // threejs scene in view = 0-5
  const scale = .125;
  const generateShapes = useCallback((): React.ReactNode[] => {
    if (!shapes) return
    const _shapes = []
    for (let i = 0; i < shapes.length; i++) {
      const data = shapes[i]
      if (!data) continue;
      const shape = new THREE.Shape()
      // grid is 400
      const origin = data.vertices[0]
      // shape.moveTo(origin[0],origin[1])
      shape.moveTo(0,0)
      for (let j = 1; j < data.vertices.length; j++) {
        const coords = data.vertices[j]
        shape.bezierCurveTo(
          (coords[0]-origin[0])*scale,-(coords[1]-origin[1])*scale,
          (coords[2]-origin[0])*scale,-(coords[3]-origin[1])*scale,
          (coords[4]-origin[0])*scale,-(coords[5]-origin[1])*scale,
        )
      }
      // shape.moveTo(origin[0],origin[1])
      shape.moveTo(0,0)
      _shapes.push(
        <RigidBody key={i} colliders="trimesh">
          <CalderMesh data={data} shape={shape} index={i} scale={scale} />
        </RigidBody>
      )
    }
    setMeshes((_prev) => _shapes)
  }, [shapes])
  const getOrigin = useCallback((): number[] => {
    if (!shapes || shapes.length === 0) return [0,0]
    return shapes[0].vertices[0]
  }, [shapes])
  const [meshes, setMeshes] = useState<any[]>(null)
  useEffect(() => {
    generateShapes()
  }, [shapes])
  return (
    // TODO: Figure out why tailwind isn't working
    <div className="w-[500px] h-[500px] border-calder-black/10 border-2" style={{
      width: '500px',
      height: '500px',
      backgroundColor: '#E8D5C4',
    }}>
      <Canvas camera={{
        position: [0,0,100]
      }}>
      <Physics>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 100]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-50, -50, 100]} decay={0} intensity={Math.PI} />
        <OrbitControls />
        { meshes }
        <mesh position={[0,0,0]}>
          <meshBasicMaterial color={'white'} />
          <sphereGeometry args={[0.1,32,16]} />
        </mesh>
        <gridHelper args={[1,10]} />
        <axesHelper />
        <RigidBody type="fixed" colliders="cuboid" name="floor">
          <Box
            position={[0, -75, 0]}
            scale={[200, 10, 200]}
            rotation={[0, 0, 0]}
            receiveShadow
          >
            <shadowMaterial opacity={0.2} />
          </Box>
        </RigidBody>
      </Physics>
    </Canvas>
      
    </div>
  )
}

export function CalderData (): React.ReactNode {
  const [shapes, setShapes] = useState<any[]>();
  return (
    <div>
      <div className="flex gap-4 mb-4">
        <div className="sticky top-4">
          <h2>Bezier shape tool</h2>
          <BezierShapeCanvas setShapes={setShapes} />
        </div>
        <div>
          <h2>Three js canvas</h2>
          <CalderCanvas shapes={shapes} />
        </div>
        <div>
          <h2>Three + Rapier canvas</h2>
          <CalderThreeRapier shapes={shapes} />
        </div>
      </div>
      <div className="flex gap-4 justify-end">
        <div>
          <h2>p5.js + Canvas</h2>
          <BezierCanvas shapes={shapes} />
        </div>
        <div>
          <h2>p5.js + Matter</h2>
          <BezierMatter shapes={shapes} />
        </div>
      </div>
    </div>
  )
}