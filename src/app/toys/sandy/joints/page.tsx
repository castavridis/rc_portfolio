'use client'

import { Box, CameraControls, OrbitControls, Torus } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Physics, RigidBody, useSphericalJoint, useRevoluteJoint } from '@react-three/rapier';
import { useRef, useState } from 'react';

function degToRads(degrees: number) {
  return (degrees % 360) * Math.PI / 180
}

function SphericalJointTest ({
  dynamic = false
}: {
  dynamic: boolean
}): React.ReactElement {
  const rigidRef = useRef(null)
  const tBRef = useRef(null)
  /** Previous issues, rigid bodies were intersecting with each other creating a jittery experience as the engine tried to resolve the colliding bodies. For spherical or revolute, position the visual mesh where I'd like the joint to seem but place the actual joint on a rigid body well outside the bounds of the body rotating */
  useSphericalJoint(rigidRef, tBRef, [[0,-0.75,0],[0,1,-1]])
  // useRevoluteJoint(rigidRef, tBRef, [
  //   [0,-2,1],
  //   [0,0,0],
  //   [0,0,0.1],
  // ])
  return (
    <>
      <RigidBody ref={rigidRef} type="fixed" colliders={false}>
        <Torus args={[1,0.25]} visible={true}>
          <meshPhysicalMaterial transmission={1.0} thickness={1.0} metalness={0.0} roughness={0.3} color="aquamarine" />
        </Torus>
      </RigidBody>

      {/* Higher linearDamping looks more convincing */}
      <RigidBody ref={tBRef} linearDamping={0.75} angularDamping={0.5} type={dynamic ? "dynamic" : "fixed"} position={[0,-1.75,1]}>
        <Torus args={[0.75,0.25]} position={[0,0.5,-1]} rotation={[0, degToRads(90), 0]}>
          <meshLambertMaterial color="greenyellow" />
        </Torus>
        <Box args={[15, 0.5, 0.5]} position={[5,-0.25,-1]}>
          <meshPhysicalMaterial transmission={1.0} thickness={5.0} metalness={0.0} roughness={0.3} color="hotpink" />
        </Box>
        <Box args={[3,6.75,4]} position={[-4, -0.25, -1]}></Box>
        {/* <Box args={[3,2,1]} position={[11, -0.25, -1]}></Box> */}
        <Torus args={[0.5,0.125]} rotation={[degToRads(-90), degToRads(45), degToRads(0)]} position={[12.75,-0.5,-1]} />
      </RigidBody>
    </>
  )
}

function Backdrop () {
  return (
    <Box args={[1000, 1000, 0.5]} position={[0,0,-50]}>
      <meshLambertMaterial color="#100" />
    </Box>
  )
}

export default function JointsPage() {
  const [dynamic, toggleDynamic] = useState(false)

  return (
    <div className="w-full h-[80vh]">
      <Canvas camera={{ position: [0,0,25], fov: 100 }}>
        <Backdrop />
        <directionalLight intensity={5} color="goldenrod" position={[0, 10, 5]} />
        <directionalLight intensity={50} color="pink" position={[0, -5, 5]} />
        <Physics debug>
          <SphericalJointTest dynamic={dynamic} />
        </Physics>
        <OrbitControls />
        <CameraControls />
      </Canvas>
      <button onClick={() => toggleDynamic(!dynamic)}>Toggle Dynamism</button>
    </div>
  )
}