"use client"

import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Physics, RigidBody, useRevoluteJoint } from '@react-three/rapier'
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

export default function CalderMobileTestsPage (): React.ReactNode {
  return (
    <div className="font-outfit-100 bg-calder-beige text-calder-black fixed top-0 left-0 right-0 bottom-0 overflow-auto">
      <div className="container mx-auto py-12">
        <h2 className="text-2xl">Calder</h2>
        <h1 className="text-5xl">Mobile Tests</h1>
        <div className="pt-8">
          <div className="flex gap-4">
            <div className="w-full h-[500px]">
              <h3>Balanced Mobile</h3>
              <p>Components: Attachment to ceiling (crossed-cylinder joint), an arm, two weights (one fixed, one with a crossed-cylinder joint)</p>
              <Canvas className="border-2">
                <Physics>
                  <Arm right={<CounterWeight />} />
                  <OrbitControls />
                </Physics>
              </Canvas>
            </div>
            <div className="w-full h-[500px]">
              <h3>Imbalanced Mobile</h3>
            </div>
            <div className="w-full h-[500px]">
              <h3>Multi-tier Mobile</h3>
              <p>I believe Calder frequently crossed-cylinder joints for his mobile connections </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}