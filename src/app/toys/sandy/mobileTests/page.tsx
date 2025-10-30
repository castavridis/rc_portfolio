"use client"

import { Box, Html, OrbitControls, Torus } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshCollider, MeshColliderProps, Physics, RapierCollider, RapierRigidBody, RigidBody, RigidBodyAutoCollider } from '@react-three/rapier';
import React, { useRef, useState } from 'react';
import { Vector3 } from 'three';

type CalderPageProps = {
  children: React.ReactNode
}
function CalderPage ({
  children
}): React.ReactNode {
  return (
    <div className="font-outfit-100 bg-calder-beige text-calder-black fixed top-0 left-0 right-0 bottom-0 overflow-auto">
      <div className="container mx-auto py-12">
        {children}
      </div>
    </div>
  )
}

type HeaderProps = {
  heading: string
  subHeading?: string
}
function Header ({
  heading,
  subHeading,
}: HeaderProps): React.ReactNode {
  return (
    <header>
      { subHeading && subHeading.trim().length > 0
        && <h2 className="text-2xl font-normal mb-2">{subHeading}</h2>
      }
      <h1 className="text-5xl font-semibold">{heading}</h1>
    </header>
  )
}

type CodeBlockProps = {
  str: string
}
function CodeBlock ({
  str
}: CodeBlockProps): React.ReactNode {
  return (
    <code className="text-2xl font-semibold">
      {str}
    </code>
  )
}

type AnnotatedMeshColliderProps = {
  type: RigidBodyAutoCollider
  children: React.ReactNode
  annotationLabel?: React.ReactNode
} & Partial<MeshColliderProps>
function AnnotatedMeshCollider (props: AnnotatedMeshColliderProps): React.ReactNode {
  return (
    <MeshCollider type={props.type}>
      {props.children}
      {props.annotationLabel}
    </MeshCollider>
  )
}

type ColliderLabelProps = {
  collider: RapierCollider,
  position?: Vector3,
}
function ColliderLabel ({
  collider,
  position,
}: ColliderLabelProps): React.ReactNode {
  return (
    <Html position={position}>
      <div 
        className="bg-calder-black px-2 py-1.5 text-white rounded-md font-normal" 
        style={{
          background: 'rgba(255,255,255,0.125)',
          border: '1px solid rgba(255,255,255,0.5)',
          backdropFilter: 'blur(0.5rem)',
        }}>
          Mass <span className="font-bold">{collider.mass().toFixed(2)}</span>
      </div>
    </Html>
  )
}

function PhysicsTest (): React.ReactNode {
  const armRef = useRef<RapierRigidBody>(null)
  const [colliders, setColliders] = useState<RapierCollider[]>(null)

  useFrame(() => {
    if (armRef.current) {
      const colliderMax = armRef.current.numColliders()
      const _newColliders: RapierCollider[] = []
      for (let i = 0; i < colliderMax; i++) {
        _newColliders.push(armRef.current.collider(i))
      }
      setColliders((_prev) => _newColliders)
    }
  })

  return (
    <Physics>
      <RigidBody ref={armRef} type="fixed" colliders={false}>
        <AnnotatedMeshCollider
          type="cuboid"
          annotationLabel={
            colliders && colliders[0] &&
              <ColliderLabel collider={colliders[0]} position={new Vector3(0,-15,0)} />
          }>
          <Box position={[0,-15,0]} args={[1,15, 1]} />
        </AnnotatedMeshCollider>
        <AnnotatedMeshCollider
          type="hull"
          annotationLabel={
            colliders && colliders[1] &&
              <ColliderLabel collider={colliders[1]} />
          }>
          <Torus />
        </AnnotatedMeshCollider>
      </RigidBody>
    </Physics>
  )
}


export default function MobileTestPage (): React.ReactNode {
  return (
    <CalderPage>
      <Header 
        subHeading="Sandy"
        heading="Mobile Test (MeshCollider)"
      />
      <p className="my-4 text-3xl font-light leading-relaxed">
        This test will use multiple <CodeBlock str={"<MeshCollider />"} /> objects attached to a single, dynamic <CodeBlock str={"<Rigidbody colliders={false} />"} />. With this construction, we should be able to get the masses of each <CodeBlock str={"<MeshCollider />"} /> present in the system. From those masses, I expect to be able to calculate the correct distance between masses to attach the "fulcrum" torus to balance the masses.
      </p>
      <div className="bg-calder-yellow h-[500px]">
        <Canvas camera={{ position: [0,0,100] }}>
          <PhysicsTest />
          <OrbitControls />
        </Canvas>
      </div>
    </CalderPage>
  )
}