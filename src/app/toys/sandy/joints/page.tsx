'use client'

import { Box, CameraControls, OrbitControls, Sphere, Torus } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, RigidBody, useSphericalJoint, useRevoluteJoint, CuboidCollider, BallCollider, RigidBodyAutoCollider, RapierRigidBody } from '@react-three/rapier';
import { useRef, useState } from 'react';
import { Vector3 } from 'three';

function degToRads(degrees: number) {
  return (degrees % 360) * Math.PI / 180
}

function SphericalJointTest ({
  dynamic = false
}: {
  dynamic: boolean
}): React.ReactElement {
  const ceilingRef = useRef(null)
  const terminalRef = useRef(null)
  const armRef = useRef(null)
  /** Previous issues, rigid bodies were intersecting with each other creating a jittery experience as the engine tried to resolve the colliding bodies. For spherical or revolute, position the visual mesh where I'd like the joint to seem but place the actual joint on a rigid body well outside the bounds of the body rotating */
  useSphericalJoint(
    ceilingRef,
    terminalRef,
    [[0,-0.75,0],[0,1,-1]]
  )
  useSphericalJoint(
    terminalRef,
    armRef,
    [[13.25,0,-1],[0,3,-1]]
  )
  const rigidBodyType = dynamic ? "dynamic" : "fixed"
  // useRevoluteJoint(rigidRef, tBRef, [
  //   [0,-2,1],
  //   [0,0,0],
  //   [0,0,0.1],
  // ])
  return (
    <>
      <RigidBody ref={ceilingRef} type="fixed" colliders={false}>
        <Torus args={[1,0.25]} visible={true}>
          <meshPhysicalMaterial transmission={1.0} thickness={1.0} metalness={0.0} roughness={0.3} color="aquamarine" />
        </Torus>
      </RigidBody>

      {/* Higher linearDamping looks more convincing */}
      <RigidBody ref={terminalRef} linearDamping={0.75} angularDamping={0.5} type={rigidBodyType} position={[0,-1.75,1]} colliders={false}>
        <CuboidCollider args={[1,1,0.25]} position={[0,0.5,-1]} rotation={[0, degToRads(90), 0]}>
          <Torus onClick={()=>{}} args={[0.75,0.25]}>
            <meshLambertMaterial color="greenyellow" />
          </Torus>
        </CuboidCollider>
        <CuboidCollider args={[7.5, 0.25, 0.25]} position={[5,-0.25,-1]}>
          <Box args={[15, 0.5, 0.5]}>
            <meshPhysicalMaterial transmission={1.0} thickness={5.0} metalness={0.0} roughness={0.3} color="hotpink" />
          </Box>
        </CuboidCollider>
        <CuboidCollider args={[3/2,6.25/2,2/2]} position={[-4, -0.25, -1]}>
          <Box args={[3,6.25,2]}>
            <meshLambertMaterial color="hotpink" />
          </Box>
        </CuboidCollider>
        {/* <Box args={[3,2,1]} position={[11, -0.25, -1]}></Box> */}
          <Torus args={[0.75,0.25]} position={[13.5,-0.25,-1]} />
      </RigidBody>

      <RigidBody ref={armRef} type={rigidBodyType} position={[14,-4,1]} linearDamping={1.0} angularDamping={1.0}>
        <Torus args={[0.75,0.25]} position={[0,0.5,-1]} rotation={[0, degToRads(90), 0]}>
          <meshLambertMaterial color="greenyellow" />
        </Torus>
        <Box args={[15, 0.5, 0.5]} position={[0,-0.25,-1]}>
          <meshPhysicalMaterial transmission={1.0} thickness={5.0} metalness={0.0} roughness={0.3} color="hotpink" />
        </Box>
        <Box args={[1,2,1]} position={[-8, -0.25, -1]}>
          <meshLambertMaterial color="hotpink" />
        </Box>
        <Box args={[1,2,1]} position={[8, -0.25, -1]}>
          <meshLambertMaterial color="hotpink" />
        </Box>
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

/**
 * via: https://codesandbox.io/p/sandbox/xy8c8z?file=%2Fsrc%2FApp.js%3A91%2C1-101%2C2
 */
function Pointer({ vec = new Vector3(0,0,0) }) {
  const ref = useRef<RapierRigidBody>(null)
  useFrame(({ pointer, viewport }) => {
    ref.current?.setNextKinematicTranslation(vec.set((pointer.x * viewport.width) / 2, (pointer.y * viewport.height) / 2, 0))
  })
  return (
    <RigidBody position={[0, 0, 0]} type="kinematicPosition" colliders={false} ref={ref}>
      <BallCollider args={[1]}>
        <Sphere args={[1]}>
          <meshLambertMaterial color="hotpink" />
        </Sphere>
      </BallCollider>
    </RigidBody>
  )
}

export default function JointsPage() {
  const [dynamic, toggleDynamic] = useState(false)
  const [physicsKey, setPhysicsKey] = useState(0)

  return (
    <div className="w-full h-[80vh]">
      <Canvas camera={{ position: [0,0,25], fov: 100 }}>
        <Backdrop />
        <directionalLight intensity={5} color="goldenrod" position={[0, 10, 5]} />
        <directionalLight intensity={50} color="pink" position={[0, -5, 5]} />
        <Physics key={physicsKey} debug>
          <SphericalJointTest dynamic={dynamic} />
          <Pointer />
        </Physics>
        <OrbitControls />
        <CameraControls />
      </Canvas>
      <button onClick={() => toggleDynamic(!dynamic)}>Toggle Dynamism</button>
      <button onClick={() => setPhysicsKey(physicsKey+1)}>Reset</button>
    </div>
  )
}