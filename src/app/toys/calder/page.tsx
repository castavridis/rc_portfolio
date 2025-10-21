"use client"

// Q: What might server-side THREE js look like?

import { useRef, useEffect, useState, useCallback } from 'react'
import * as THREE from 'three'
import { Canvas, ThreeElements, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

import dynamic from 'next/dynamic'

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
}) {
  const meshRef = useRef(null);
  return (
    <mesh ref={meshRef} scale={0.25}>
      <meshStandardMaterial color={data.color} />
      <extrudeGeometry args={[shape, { depth: 0.25 }]} />
    </mesh>
  )
}
function CalderCanvas ({
  shapes,
}): React.ReactNode {
  const generateShapes = useCallback((): React.ReactNode[] => {
    if (!shapes) return
    const _shapes = []
    for (let i = 0; i < shapes.length; i++) {
      const data = shapes[i]
      if (!data) continue;
      const shape = new THREE.Shape()
      const origin = data.vertices[0]
      shape.moveTo(origin[0],origin[1])
      for (let j = 1; j < data.vertices.length; j++) {
        const coords = data.vertices[j]
        shape.bezierCurveTo(
          coords[0],coords[1],
          coords[2],coords[3],
          coords[4],coords[5],
        )
      }
      shape.moveTo(origin[0],origin[1])
      _shapes.push(
        <CalderMesh key={i} data={data} shape={shape} />
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

  const scene = new THREE.Scene()
  scene.background = new THREE.Color('0xFF00FF')
  return (
    // TODO: Figure out why tailwind isn't working
    <div className="w-[500px] h-[500px] border-2" style={{
      width: '500px',
      height: '500px',
    }}>
      { meshes &&
            <Canvas scene={scene} camera={{
              position: [getOrigin()[0], getOrigin()[1], 5] 
            }}>
            <ambientLight intensity={Math.PI / 2} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
            <OrbitControls />
            { meshes }
          </Canvas>
      }
    </div>
  )
}

function CalderData (): React.ReactNode {
  const [shapes, setShapes] = useState<any[]>();
  return (
    <div className="flex">
      <div>
        <h2>Bezier shape tool</h2>
        <BezierShapeCanvas setShapes={setShapes} />
      </div>
      <div>
        <h2>Three js canvas</h2>
        <CalderCanvas shapes={shapes} />
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