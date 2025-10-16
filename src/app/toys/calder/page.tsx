"use client"

// Q: What might server-side THREE js look like?

import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { Canvas, ThreeElements, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

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

export default function CalderPage (): React.ReactNode {
  return (
    <div>
      <h1>Calder</h1>
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
          To start, we will attempt to model some of the more common Alexander Calder mobiles.
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