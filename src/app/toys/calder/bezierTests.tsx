"use client"

// Q: What might server-side THREE js look like?

import { useRef, useEffect, useState, useCallback } from 'react'
import * as THREE from 'three'
import { Canvas, ThreeElements, useFrame } from '@react-three/fiber'
import { Box, CameraControls, OrbitControls } from '@react-three/drei'

import dynamic from 'next/dynamic'
import { Physics, RigidBody, } from '@react-three/rapier'

const BezierBox2d = dynamic(() => import('./bezierBox2d'), {
  ssr: false,
})
const BezierShapeTool = dynamic(() => import('./bezierShapeTool'), {
  ssr: false,
})
const BezierDrawingTool = dynamic(() => import('./bezierTool'), {
  ssr: false,
})

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

function Arm(): React.ReactElement {
  const x = 0, y = 0
  const shape = new THREE.Shape()

  shape.moveTo(x, y)
  shape.lineTo(35,1)
  shape.lineTo(55,1)

  return (
    <mesh position={[2.25,2.40,0.025]} scale={0.25}>
      <lineBasicMaterial color={"antiquewhite"} />
      {/* <bufferGeometry setFromPoints={[
        new THREE.Vector3(0,0,0),
        new THREE.Vector3(35,1,0),
        new THREE.Vector3(55,0,0)
        ]}
      /> */}
      <extrudeGeometry args={[shape, {
        depth: 0.35,
      }]} />
      {/* <sphereGeometry args={[0.5,10,10]}/> */}
    </mesh>
  )
}

function CounterWeight(): React.ReactElement {
  const meshRef = useRef<THREE.Mesh>(null!)
  const x = 0, y = 0
  const shape = new THREE.Shape()

  // Origin = bottom left of drawing area, standard
  shape.moveTo( x, y )

  // Sketch of bounds
  // shape.lineTo( x + 2, y + 10 )
  // shape.lineTo( x + 10, y + 10 )
  // shape.lineTo( x + 6, y + 3)

  shape.bezierCurveTo( x + 1, y + 8, x + 1.5, y + 9, x + 2, y + 10)
  shape.bezierCurveTo(x + 2, y + 11, x + 10, y + 11, x + 10, y + 10)
  shape.bezierCurveTo(x + 7, y + 3, x + 6, y + 3, x + 6, y + 3)
  shape.bezierCurveTo(x+1, y, x, y, x, y)

  
  useFrame((state, delta) => {
    // meshRef.current.rotation.x += delta
    // meshRef.current.rotation.y += delta
  })

  return (
    <mesh
      ref={meshRef}
      scale={[0.25, 0.25, 0.25]}
      position={[0, 0, 0]}
    >
      <meshStandardMaterial color={"#AC493F"} />
      <extrudeGeometry args={[shape, {
        depth: .25,
      }]} />
    </mesh>
  )
}

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
    <div className="w-[500px] h-[500px]" style={{
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
    <div className="w-[500px] h-[500px]" style={{
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
      <div className="flex">
        <div>
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
      <div>
        <h2>p5.js + Box2D</h2>
        <BezierBox2d shapes={shapes} />
      </div>
    </div>
  )
}

export default function CalderPage (): React.ReactNode {
  return (
    <div>
      <h1>Calder</h1>
      <h2>p5 to threejs pipeline</h2>
      <CalderData />
      {/* <h2>p5.js Shape Tool</h2> */}
      {/* <BezierShapeTool /> */}
      {/* <h2>p5.js Drawing Tool</h2> */}
      {/* <BezierDrawingTool /> */}
      <h2>Three.js Playground</h2>
      <div className="flex items-stretch h-[80vh]">
        <Canvas className="w-full h-full">
          <ambientLight intensity={Math.PI / 2} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
          <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
          <CounterWeight />
          <Arm />
          <OrbitControls />
        </Canvas>
      </div>
      <hr />
      <div>
        <h2>Project Notes</h2>
        <p>
          25-10-18 Create a Calder shape editor in p5.js that moves data between p5 and three.js.
        </p>
        <p>
          Bezier shaping
        </p>
        <ol>
          <li>Begin shape</li>
          <li>Click to add vertices</li>
          <ul>
            <li>1 vertex</li>
            <ul>
              <li>store first point, (x, y)</li>
            </ul>
            <li>n bezierVertex</li>
            <ul>
              <li>store (x1, y1) origin control point</li>
              <li>store (x3, y3) destination point</li>
              <li>store (x2, y2) destination control point (default to x3, y3)</li>
            </ul>
          </ul>
          <li>End shape</li>
        </ol>
        <ul>
          <li>While bezierVertex is not complete, preview resulting line based on mouseX, mouseY</li>
          <li>When the bezierVertex is complete, allow the control point to be manipulated</li>
        </ul>
        <p>
          25-10-16 To start, we will attempt to model some of the more common Alexander Calder mobiles.
        </p>
        {/* Alt text from Claude! */}
        <img src="https://www.cahh.es/wp-content/uploads/2023/06/Alexander-Calder-Black-and-Yellow-Dots-in-the-Air-1960-1.jpg" alt="Alexander Calder mobile sculpture with black and yellow circular discs suspended on wire arms." />
        <div>
          Black and Yellow Dots in the Air, 1960
        </div>
        <p>
          Each "arm" of this mobile has at least one pivot joint and at least one counter weight. Terminating arms have usually only have one pivot joint and are more likely to have multiple counter weights.  Non-terminating arms tend to have two pivot points, one at the end of the arm opposing the counter weight, and somewhere in the middle of the arm to balance the counterweight against the rest of the connected arms.
        </p>
        <p>
          Ideas to Recreate
        </p>
        <ol>
          <li>Experiment with a few 2d geometries for the counter weights that look like they could be Calder's work</li>
          <ol>
            <li>Learn about three.js coordinate system</li>
            <li>Learn how beziers work</li>
          </ol>
          <li>Draw the rest of the arm</li>
          <li>Attempt to add joints to the arm</li>
          <li>Connect an arm to a terminal arm</li>
        </ol>
        <h4>References</h4>
        <ul>
          <li>
            <a className="underline" href="https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_shapes.html">Three.js sample with simple drawn shapes</a>
          </li>
          <li>
            <a className="underline" href="https://www.summbit.com/blog/bezier-curve-guide/#quadratic-bezier-curve-construction">An Interactive Guide for Bezier Curves</a>
          </li>
        </ul>
      </div>
    </div>
  )
}