'use client'

import { Box, CameraControls, OrbitControls, Torus } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Physics, RigidBody, useSphericalJoint, useRevoluteJoint } from '@react-three/rapier';
import { useRef } from 'react';

function SphericalJointTest (): React.ReactElement {
  const rigidRef = useRef(null)
  const tBRef = useRef(null)
  /** Previous issues, rigid bodies were intersecting with each other creating a jittery experience as the engine tried to resolve the colliding bodies. For spherical or revolute, position the visual mesh where I'd like the joint to seem but place the actual joint on a rigid body well outside the bounds of the body rotating */
  useSphericalJoint(rigidRef, tBRef, [[0,-2,0],[0,0,-1]])
  // useRevoluteJoint(rigidRef, tBRef, [
  //   [0,-2,1],
  //   [0,0,0],
  //   [0,0,0.1],
  // ])
  return (
    <>
      <RigidBody ref={rigidRef} type="fixed">
        <Torus args={[1,0.25]} visible={false}></Torus>
      </RigidBody>
      <Torus args={[1,0.25]} position={[0,-1.5,0]}>
        <meshBasicMaterial color="red" />
      </Torus>
      {/* Higher linearDamping looks more convincing */}
      <RigidBody ref={tBRef} linearDamping={0.75} angularDamping={0.5}>
        <Torus args={[1,0.25]} position={[0,-1,-1]} rotation={[0, 1.65, 0]}>
          <meshBasicMaterial color="blue" />
        </Torus>
        <Box args={[15, 0.5, 0.5]} position={[5,-2,-1]}>
          <meshBasicMaterial color="hotpink" />
        </Box>
      </RigidBody>
    </>
  )
}

export default function JointsPage() {
  return (
    <div className="w-full h-[80vh]">
      <Canvas>
        <Physics debug>
          <SphericalJointTest />
        </Physics>
        <OrbitControls />
        <CameraControls />
      </Canvas>
    </div>
  )
}