"use client"

import { Box, Html, OrbitControls, Torus } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshCollider, MeshColliderProps, Physics, RapierCollider, RapierRigidBody, RigidBody, RigidBodyAutoCollider, RigidBodyProps } from '@react-three/rapier';
import React, { useEffect, useRef, useState } from 'react';
import { Vector3 } from 'three';

type CalderPageProps = {
  children: React.ReactNode
}
function CalderPage ({
  children
}: CalderPageProps): React.ReactNode {
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
      <axesHelper args={[5]} />
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
  const [label, setLabel] = useState<React.ReactElement>(null)
  useEffect(() => {
    if (collider) {
      const lCom = collider.translation()
      const wCom = collider.parent().worldCom()
      setLabel(
        <div className="text-calder-black">
            Mass <span className="font-bold">{collider.mass().toFixed(1)}</span>
            <br />
            Local <span className="font-bold">{`{ x: ${lCom.x.toFixed(1)}, y: ${lCom.y.toFixed(1)}, z: ${lCom.z.toFixed(1)} }`}</span>
            <br />
            World <span className="font-bold">{`{ x: ${wCom.x.toFixed(1)}, y: ${wCom.y.toFixed(1)}, z: ${wCom.z.toFixed(1)} }`}</span>
        </div>
      )
    }
  }, [collider])
  return (
    <Html position={position} style={{ width: '235px' }}>
      <div 
        className="bg-calder-black px-2 py-1.5 text-white rounded-md font-normal" 
        style={{
          background: 'rgba(255,255,255,0.125)',
          border: '1px solid rgba(255,255,255,0.5)',
          backdropFilter: 'blur(0.5rem)',
        }}>
          {label}
      </div>
    </Html>
  )
}

type AnnotatedRigidbodyProps = RigidBodyProps & {
  setColliders: (colliders: RapierCollider[]) => void
}

function AnnotatedRigidBody (props: AnnotatedRigidbodyProps): React.ReactNode {
  const bodyRef = useRef<RapierRigidBody>(null)

  useFrame(() => {
    if (bodyRef.current) {
      const colliderMax = bodyRef.current.numColliders()
      const _newColliders: RapierCollider[] = []
      for (let i = 0; i < colliderMax; i++) {
        _newColliders.push(bodyRef.current.collider(i))
      }
      props.setColliders(_newColliders)
    }
  })

  return (
    <RigidBody ref={bodyRef} type={props.type} colliders={props.colliders}>
      {props.children}
    </RigidBody>
  )
}

function CalderArm (): React.ReactNode {
  const [colliders, setColliders] = useState<RapierCollider[]>(null)
  return (
      <AnnotatedRigidBody 
        type="dynamic"
        colliders={false}
        setColliders={setColliders}
      >
        <AnnotatedMeshCollider
          type="trimesh"
          annotationLabel={
            colliders && colliders[0] &&
              <ColliderLabel collider={colliders[0]} />
          }>
          <Torus args={[1,0.25]} position={[0,-1,0]} rotation={[0,1.5,0]}>
            <axesHelper args={[5]} />
          </Torus>
        </AnnotatedMeshCollider>
        <mesh position={[2,0,0]}>
          <AnnotatedMeshCollider
            type="cuboid"
            annotationLabel={
              colliders && colliders[1] &&
                <ColliderLabel
                  collider={colliders[1]}
                  position={new Vector3(-8,-2,0)}
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
                  collider={colliders[2]}
                  position={new Vector3(4,-2.5,0)} />
            }>
            <Box position={[6,-2,0]} args={[4,2,2]} />
          </AnnotatedMeshCollider>
          <AnnotatedMeshCollider
            type="cuboid"
            annotationLabel={
              colliders && colliders[3] &&
                <ColliderLabel
                  collider={colliders[3]}
                  position={new Vector3(-24,-2,0)} />
            }>
            <Box position={[-24,-2,0]} args={[2,2,1]} />
          </AnnotatedMeshCollider>
        </mesh>
      </AnnotatedRigidBody>
  )
}

function CeilingBody (): React.ReactNode {
  const [colliders, setColliders] = useState<RapierCollider[]>(null)
  const ceilingRef = useRef<RapierRigidBody>(null)
  useFrame(() => {
    if (ceilingRef.current) {
      // ceilingRef.current.setV
    }
  })
  return (
      <AnnotatedRigidBody ref={ceilingRef} type="fixed" colliders={false} setColliders={setColliders}>
        <AnnotatedMeshCollider
          type="cuboid"
          annotationLabel={
            colliders && colliders[0] &&
              <ColliderLabel
                collider={colliders[0]}
                position={new Vector3(0,8.5,0)} />
          }>
          <Box position={[0,8.5,0]} args={[0.5,15, 0.5]} />
        </AnnotatedMeshCollider>
        <AnnotatedMeshCollider
          type="trimesh"
          annotationLabel={
            colliders && colliders[1] &&
              <ColliderLabel
                collider={colliders[1]}/>
          }>
          <Torus args={[1,0.25]} />
        </AnnotatedMeshCollider>
      </AnnotatedRigidBody>
  )
}

function PhysicsTest (): React.ReactNode {
  return (
    <Physics>
      <CeilingBody />
      <CalderArm />
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
        <Canvas camera={{ position: [0,0,10] }}>
          <PhysicsTest />
          <OrbitControls />
        </Canvas>
      </div>
    </CalderPage>
  )
}