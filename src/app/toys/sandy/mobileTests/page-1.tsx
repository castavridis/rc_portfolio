"use client"

import { OrbitControls, Html } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Physics, RapierRigidBody, RigidBody, useFixedJoint, useRevoluteJoint } from '@react-three/rapier'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

function Rope (): React.ReactElement {
  return (
    <mesh>

    </mesh>
  )
}

type ArmProps = {
  left?: React.ReactElement,
  right?: React.ReactElement
}
function Arm ({
  left,
  right,
}: ArmProps): React.ReactElement {
  const path = new THREE.CubicBezierCurve3(
    new THREE.Vector3(0,0),
    new THREE.Vector3(2,2),
    new THREE.Vector3(8,2),
    new THREE.Vector3(10,0),
  )
  return (
    <group>
      <RigidBody type="fixed">
        <mesh
          position={[0, 0, 0]}
        >
          <meshStandardMaterial color={'black'} />
          <tubeGeometry args={[path, 20, 0.1]} />
        </mesh>
      </RigidBody>
      { right }
    </group>
  )
}

function CounterWeight (): React.ReactElement {
  const x = 0, y = 0
  const shape = new THREE.Shape()

  shape.moveTo( x, y )
  shape.bezierCurveTo( x + 1, y + 8, x + 1.5, y + 9, x + 2, y + 10)
  shape.bezierCurveTo(x + 2, y + 11, x + 10, y + 11, x + 10, y + 10)
  shape.bezierCurveTo(x + 7, y + 3, x + 6, y + 3, x + 6, y + 3)
  shape.bezierCurveTo(x+1, y, x, y, x, y)

  return (
    <RigidBody type="fixed">
      <mesh
        scale={[0.25,0.25,0.25]}
        position={[-1, -1, 0]}
      >
        <meshStandardMaterial color={"#AC493F"} />
        <extrudeGeometry args={[shape, {
          depth: .25,
        }]} />
      </mesh>
    </RigidBody>
  )
}

/**
 * CalderJoints probably were comprised of two
 * cylinder joints that were constrained to
 * the y-axis. Some rarer variants were constrained
 * on two axes
 * @param topAnchor 
 * @param bottomAnchor 
 * @returns 
 */
function CalderJoint (
  topAnchor: THREE.Mesh,
  bottomAnchor: THREE.Mesh,
): React.ReactElement {
  return (
    <mesh></mesh>
  )
}

function Annotation ({
  children
}) {
  return (
                         <Html content='test'>
              <div className="bg-calder-yellow px-2 py-1.5 text-calder-black rounded-md font-normal">
                {children}
              </div>
            </Html>
  )
}

function TestCalderJoint () {
  const ceiling = useRef<RapierRigidBody>(null)
  const ceiling_wire = useRef<RapierRigidBody>(null)
  const ceiling_joint = useRevoluteJoint(
    ceiling,
    ceiling_wire,
    [
      [0,0,0],
      [0,8.5,0],
      [0,1,0],
    ]
  )
  const weight1 = useRef<RapierRigidBody>(null)
  const weight2 = useRef<RapierRigidBody>(null)
  const [w1Mass,setW1Mass] = useState(0)
  const [w2Mass,setW2Mass] = useState(0)
  useFrame(() => {
    if (weight1.current) {
      setW1Mass(weight1.current.mass())
    }
    if (weight2.current) {
      setW2Mass(weight2.current.mass())
    }
  })

  return (
    <group position={[0,15,0]} rotation={[0,1.5,0]}>
      <RigidBody ref={ceiling} type="fixed" colliders="cuboid">
        {/* bodies cannot collide? */}
        <mesh>
          <meshToonMaterial color="transparent" />
          <boxGeometry args={[10,1,10]} />
        </mesh>
      </RigidBody>
      <RigidBody position={[0,-8.5,0]} ref={ceiling_wire} type="fixed" colliders="trimesh">
        <mesh>
          <meshToonMaterial color="red"/>
          <boxGeometry args={[0.5,15,0.5]} />
        </mesh>
        <mesh position={[0,-8.5,0]}>
          <meshToonMaterial color="red"/>
          <torusGeometry args={[1,.25,16]} />
        </mesh>
      </RigidBody>
      <RigidBody ref={weight2} type="dynamic" colliders="trimesh" rotation={[0,1.5,0]}>
        <mesh position={[0,-18,0]}>
          <meshToonMaterial color="red"/>
          <torusGeometry args={[1,.25,16]} />
          <Annotation>
            Mass <span className="font-bold">{w2Mass.toFixed(2)}</span>
          </Annotation>
        </mesh>
        <mesh position={[5,-19,0]}>
          <meshToonMaterial color="red" />
          <boxGeometry args={[32,0.5,0.5]} />
        </mesh>
        <mesh position={[-9.5,-19,0]}>
          <meshToonMaterial color="blue" />
          <boxGeometry args={[5,5.5,5]} />
        </mesh>
        <mesh position={[21.75,-19.5,0]} rotation={[1.5,-.5,0]}>
          <meshToonMaterial color="red"/>
          <torusGeometry args={[1,.25,16]} />
        </mesh>
      </RigidBody>
      <RigidBody ref={weight1} type="dynamic" colliders="trimesh" rotation={[0,1.5,0]}>
        <mesh position={[22.75,-20,0]}>
          <meshToonMaterial color="red"/>
          <torusGeometry args={[1,.25,16]} />
          <Annotation>
            Mass <span className="font-bold">{w1Mass.toFixed(2)}</span>
          </Annotation>
        </mesh>
        <mesh position={[25,-21,0]}>
          <meshToonMaterial color="red" />
          <boxGeometry args={[32,0.5,0.5]} />
        </mesh>
        <mesh position={[10,-21.5,0]}>
          <meshToonMaterial color="blue" />
          <boxGeometry args={[3.5,3.5,2.5]} />
        </mesh>
        <mesh position={[40,-21.5,0]}>
          <meshToonMaterial color="blue" />
          <boxGeometry args={[2.75,2.5,2.5]} />
        </mesh>
        
      </RigidBody>
    </group>
  )
}

export default function CalderMobileTestsPage (): React.ReactNode {
  return (
    <div className="font-outfit-100 bg-calder-beige text-calder-black fixed top-0 left-0 right-0 bottom-0 overflow-auto">
      <div className="container mx-auto py-12">
        <h2 className="text-2xl">Sandy</h2>
        <h1 className="text-5xl">Mobile Tests</h1>
        <div className="pt-8">
          <div className="flex gap-4">
            <div className="w-full h-[800px]">
              <h3>Balanced Mobile</h3>
              <p>Components: Attachment to ceiling (crossed-cylinder joint), an arm, two weights (one fixed, one with a crossed-cylinder joint)</p>
              <Canvas className="border-2 border-white" camera={{
                  position: [0,0,35],
                }}>
                <Physics>
                  <pointLight args={['white', 25, 50, 1.5]} position={[-1,5,0]} />
                  <ambientLight args={['antiquewhite',0.5]} />
                  {/* <Arm right={<CounterWeight />} /> */}
                  <TestCalderJoint />
                </Physics>
                <OrbitControls />
              </Canvas>
            </div>
            {/* <div className="w-full h-[500px]">
              <h3>Imbalanced Mobile</h3>
            </div>
            <div className="w-full h-[500px]">
              <h3>Multi-tier Mobile</h3>
              <p>I believe Calder frequently crossed-cylinder joints for his mobile connections </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}