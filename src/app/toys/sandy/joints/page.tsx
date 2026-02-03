'use client'

/** Previous issues, rigid bodies were intersecting with each other creating a jittery experience as the engine tried to resolve the colliding bodies. For spherical or revolute, position the visual mesh where I'd like the joint to seem but place the actual joint on a rigid body well outside the bounds of the body rotating */

import { Box, CameraControls, OrbitControls, Sphere, Torus } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, RigidBody, useSphericalJoint, useRevoluteJoint, CuboidCollider, BallCollider, RigidBodyAutoCollider, RapierRigidBody } from '@react-three/rapier';
import { useRef, useState } from 'react';
import { Vector3 } from 'three';

import { MobileProvider } from '../../../components/useMobile';
import { buildLeafForThree } from '../_leaves/buildLeafForThree';
import { crescent_data } from '../_leaves/crescent';

function degToRads(degrees: number) {
  return (degrees % 360) * Math.PI / 180
}

function SandyAnchor () {}
function SandyTerminalArm () {}
function SandyArm () {}

function SphericalJointTest ({
  dynamic = false
}: {
  dynamic: boolean
}): React.ReactElement {
  const [color, setColor] = useState("blue");
  const ceilingRef = useRef<RapierRigidBody>(null)
  const terminalRef = useRef<RapierRigidBody>(null)
  const armRef = useRef<RapierRigidBody>(null)

  useSphericalJoint(
    ceilingRef,
    terminalRef,
    [[0,-0.75,0],[0,1,-1]]
  )
  useSphericalJoint(
    terminalRef,
    armRef,
    [[13.5,0,-1],[0,1.5,-1]]
  )
  
  const rigidBodyType = dynamic ? "dynamic" : "fixed"
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
          <Torus args={[0.75,0.25]}>
            <meshLambertMaterial color="greenyellow" />
          </Torus>
        </CuboidCollider>
        <CuboidCollider args={[7.5, 0.25, 0.25]} position={[5,-0.25,-1]}>
          <Box args={[15, 0.5, 0.5]}>
            <meshPhysicalMaterial transmission={1.0} thickness={5.0} metalness={0.0} roughness={0.3} color="hotpink" />
          </Box>
        </CuboidCollider>
        {/* TODO: Calculate size for collider from extruded mesh */}
        <CuboidCollider args={[3/2,6.25/2,2/2]} position={[-4, -0.25, -1]}>
          <mesh 
            position={[0,3,0]}
            onPointerEnter={() => setColor("red")}
            onPointerLeave={() => setColor("blue")}
            onClick={(e) => { 
              terminalRef.current.applyImpulseAtPoint(new Vector3(0,0,1),new Vector3(e.clientX, e.clientY, 0), true)
            }}
            >
            <meshLambertMaterial color={color} />
            <extrudeGeometry args={[
              buildLeafForThree(crescent_data), 
              {depth: 1}
            ]} />
          </mesh>
          {/* <Box args={[3,6.25,2]} onPointerEnter={() => setColor("red")} onPointerLeave={() => setColor("blue")} onClick={(e) => { 
            terminalRef.current.applyImpulseAtPoint(new Vector3(0,0,1),new Vector3(e.clientX, e.clientY, 0), true)
          }}>
            <meshLambertMaterial color={color} />
          </Box> */}
        </CuboidCollider>
        <Torus args={[0.75,0.25]} position={[13.5,-0.25,-1]}>
          <meshPhysicalMaterial transmission={1.0} thickness={1.0} metalness={0.0} roughness={0.3} color="aquamarine" />
        </Torus>
      </RigidBody>

      <RigidBody ref={armRef} type={rigidBodyType} position={[13.5,-3.5,1]} linearDamping={0.75} angularDamping={0.5}>
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
      <meshLambertMaterial color="#333" />
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
      <MobileProvider>
        <Canvas camera={{ position: [0,0,25], fov: 100 }}>
          <Backdrop />
          <directionalLight intensity={5} color="goldenrod" position={[0, 10, 5]} />
          <directionalLight intensity={50} color="pink" position={[0, -5, 5]} />
          <Physics key={physicsKey} debug>
            <SphericalJointTest dynamic={dynamic} />
            {/* <Pointer /> */}
          </Physics>
          <OrbitControls />
          <CameraControls />
        </Canvas>
        <button onClick={() => toggleDynamic(!dynamic)}>Toggle Dynamism</button>
        <button onClick={() => setPhysicsKey(physicsKey+1)}>Reset</button>
      </MobileProvider>
    </div>
  )
}