"use client"

import { Box, CameraControls, OrbitControls, Torus } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Physics, RapierCollider, RapierRigidBody } from '@react-three/rapier';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Vector3 } from 'three';
import Header from '../../../components/Header';
import CodeBlock from '../../../components/CodeBlock';
import AnnotatedRigidBody from '../../../components/AnnotatedRigidBody';
import useAnnotations from '../../../components/useAnnotations';
import AnnotatedMeshCollider from '../../../components/AnnotatedMeshCollider';
import ColliderLabel from '../../../components/ColliderLabel';
import SandyTheme from '../../../components/themes/Sandy';
import AnnotationControls from '../../../components/AnnotationControls';

/**
 * This iteration is using multiple MeshColliders to calculate the 
 * objects attached to a single Rigid-Body
 */

function CalderArm (): React.ReactNode {
  const [colliders, setColliders] = useState<RapierCollider[]>(null)
  const [loading, setLoading] = useState(true)
  const { isDynamic } = useAnnotations()
  useEffect(() => {
    if (loading && colliders) {
      console.log(colliders)
      setLoading(false)
    }
  }, [colliders, loading])
  return (
    <>
      <AnnotatedRigidBody 
        type={ isDynamic ? "dynamic" : "fixed"}
        colliders={false}
        setColliders={setColliders}
      >
        <AnnotatedMeshCollider
          type="trimesh"
          annotationLabel={
            colliders && colliders[1] &&
              <ColliderLabel
                name="Arm > Torus"
                collider={colliders[1]}
                
                position={[0,-1,0]} 
              />
          }>
          <Torus args={[1,0.25]} position={[0,-1,0]} rotation={[0,1.5,0]}>
            <meshBasicMaterial color={'blue'}/>
            <axesHelper args={[5]} />
          </Torus>
        </AnnotatedMeshCollider>
        <mesh position={[2,0,0]}>
          <AnnotatedMeshCollider
            type="cuboid"
            annotationLabel={
              colliders && colliders[2] &&
                <ColliderLabel
                  name="Arm > Bar"
                  collider={colliders[2]}
                  position={[-8,-2,0]}
                  
                />
            }
          >
            <Box args={[32,0.5,0.5]} position={[-8,-2,0]}>
              <meshBasicMaterial color={'blue'}/>
            </Box>
          </AnnotatedMeshCollider>
          <AnnotatedMeshCollider
            type="cuboid"
            annotationLabel={
              colliders && colliders[0] &&
                <ColliderLabel
                  name="Arm > Counterweight"
                  collider={colliders[0]}
                  position={[4,-2.5,0]}
                   />
            }>
            <Box position={[6,-2,0]} args={[6,5,4.25]}>
              <meshBasicMaterial color={'blue'}/>
            </Box>
          </AnnotatedMeshCollider>
          <AnnotatedMeshCollider
            type="trimesh"
            annotationLabel={
              colliders && colliders[3] &&
                <ColliderLabel
                  name="Arm > Torus"
                  collider={colliders[3]}
                  position={[-24.5,-2.75,0]}
                  
                />
            }>
            <Torus args={[1,0.25]} position={[-24.5,-2.75,0]} rotation={[1.5,0.75,0]}>
              <meshBasicMaterial color="blue" />
              <axesHelper args={[5]} />
            </Torus>
          </AnnotatedMeshCollider>
        </mesh>
      </AnnotatedRigidBody>
      <CalderArmTerminal position={[-23.5,-2.5,0]} />
        </>
  )
}

type CalderArmTerminalProps = {
  position: number[]
}
function CalderArmTerminal ({ position }: CalderArmTerminalProps): React.ReactNode {
  const { isDynamic } = useAnnotations()
  const [colliders, setColliders] = useState<RapierCollider[]>(null)
  return (
      <AnnotatedRigidBody 
        type={ isDynamic ? "dynamic" : "fixed"}
        colliders={false}
        setColliders={setColliders}
        position={new Vector3(...position)}
      >
        <AnnotatedMeshCollider
          type="trimesh"
          annotationLabel={
            colliders && colliders[1] &&
              <ColliderLabel name="Terminal > Torus" collider={colliders[1]} position={[0,-1,0]} />
          }>
          <Torus args={[1,0.25]} position={[0,-1,0]} rotation={[0,0,0]}>
            <axesHelper args={[5]} />
          </Torus>
        </AnnotatedMeshCollider>
        <mesh position={[2,0,0]}>
          <AnnotatedMeshCollider
            type="cuboid"
            annotationLabel={
              colliders && colliders[0] &&
                <ColliderLabel
                  name="Terminal > Bar"
                  collider={colliders[0]}
                  position={[-8,-2,0]}
                />
            }
          >
            <Box args={[32,0.5,0.5]} position={[-8,-2,0]} />
          </AnnotatedMeshCollider>
          <AnnotatedMeshCollider
            type="cuboid"
            annotationLabel={
              colliders && colliders[2] &&
                <ColliderLabel
                  name="Terminal > Counterweight"
                  collider={colliders[2]}
                  position={[4,-2.5,0]} />
            }>
            <Box position={[6,-2,0]} args={[4,4,2]} />
          </AnnotatedMeshCollider>
          <AnnotatedMeshCollider
            type="cuboid"
            annotationLabel={
              colliders && colliders[3] &&
                <ColliderLabel
                  name="Terminal > Counterweight"
                  collider={colliders[3]}
                  position={[-24,-2,0]} />
            }>
            <Box position={[-24,-3.5,0]} args={[2,2,1]} />
          </AnnotatedMeshCollider>
        </mesh>
      </AnnotatedRigidBody>
  )
}

function CeilingBody (): React.ReactNode {
  const [colliders, setColliders] = useState<RapierCollider[]>(null)
  const ceilingRef = useRef<RapierRigidBody>(null)
  // useFrame(() => {
  //   if (ceilingRef.current) {

  //   }
  // })
  return (
      <AnnotatedRigidBody ref={ceilingRef} type="fixed" colliders={false} setColliders={setColliders}>
        <AnnotatedMeshCollider
          type="cuboid"
          annotationLabel={
            colliders && colliders[0] &&
              <ColliderLabel
                name="Ceiling > Bar"
                collider={colliders[0]}
                position={[0,8.5,0]} />
          }>
          <Box position={[0,8.5,0]} args={[0.5,15, 0.5]}>
            <meshBasicMaterial color="red" />
          </Box>
        </AnnotatedMeshCollider>
        <AnnotatedMeshCollider
          type="trimesh"
          annotationLabel={
            colliders && colliders[1] &&
              <ColliderLabel
                name="Ceiling > Torus"
                collider={colliders[1]}/>
          }>
          <Torus args={[1,0.25]}>
            <meshBasicMaterial color="red" />
          </Torus>
        </AnnotatedMeshCollider>
      </AnnotatedRigidBody>
  )
}

function PhysicsTest (): React.ReactNode {
  // NOTE 25-11-14: Why am I using Suspense again? To combat a Vercel issue?
  return (
    <Suspense>
      <Physics gravity={[0,-9.81,0]} timeStep="vary">
        <CeilingBody />
        <CalderArm />
      </Physics>
    </Suspense>
  )
}

export default function MobileTestPage (): React.ReactNode {
  return (
    <SandyTheme>
      <Header 
        subHeading={
          <Link href="/toys/sandy" className="flex items-center gap-1 relative -left-1.5"><ChevronLeft />Sandy</Link>
        }
        heading="Mobile Test (MeshCollider)"
      />
      <p className="my-4 text-3xl font-light leading-relaxed">
        This test will use multiple <CodeBlock str={"<MeshCollider />"} /> objects attached to a single, dynamic <CodeBlock str={"<Rigidbody colliders={false} />"} />. With this construction, we should be able to get the masses of each <CodeBlock str={"<MeshCollider />"} /> present in the system. From those masses, I expect to be able to calculate the correct distance between masses to attach the "fulcrum" torus to balance the masses.
      </p>
      <div className="bg-calder-yellow h-[500px]">
        <Canvas camera={{ position: [0,0,10] }}>
          <PhysicsTest />
          <OrbitControls />
          <CameraControls />
        </Canvas>
        <AnnotationControls />
      </div>
    </SandyTheme>
  )
}