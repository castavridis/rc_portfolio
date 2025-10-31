"use client"

import { Box, CameraControls, Html, OrbitControls, Torus } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshCollider, MeshColliderProps, Physics, RapierCollider, RapierRigidBody, RigidBody, RigidBodyAutoCollider, RigidBodyProps, Vector3Object, Vector3Tuple } from '@react-three/rapier';
import { ArrowLeft, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Vector3 } from 'three';

type AnnotationsContextValue = {
  handleCheck: (e: React.ChangeEvent<HTMLInputElement>) => void
  isDynamic: boolean
  showAnnotations: boolean
  showMass: boolean
  showLocalCom: boolean
  showWorldCom: boolean
  toggleAnnotations: (bool: boolean) => void
  toggleIsDynamic: (bool: boolean) => void
  toggleMass: (bool: boolean) => void
  toggleLocalCom: (bool: boolean) => void
  toggleWorldCom: (bool: boolean) => void
}
const AnnotationsContext = React.createContext(null)
function AnnotationsProvider(
  {children}: {children: React.ReactNode}
): React.ReactNode {
  const [isDynamic, toggleIsDynamic] = useState(false)
  const [showAnnotations, toggleAnnotations] = useState(true)
  const [showMass, toggleMass] = useState(true)
  const [showLocalCom, toggleLocalCom] = useState(true)
  const [showWorldCom, toggleWorldCom] = useState(true)

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name
    console.log(name, e.target.checked)
    switch (name) {
      case 'dynamic':
        toggleIsDynamic(!isDynamic)
        break;
      case 'annotation':
        toggleAnnotations(!showAnnotations)
        break;
      case 'mass':
        toggleMass(!showMass)
        break;
      case 'lCom':
        toggleLocalCom(!showLocalCom)
        break;
      case 'wCom':
        toggleWorldCom(!showWorldCom)
        break;
      default:
        break;
    }
  }
  const value: AnnotationsContextValue = {
    handleCheck,
    isDynamic,
    showAnnotations,
    showMass,
    showLocalCom,
    showWorldCom,
    toggleAnnotations,
    toggleIsDynamic,
    toggleMass,
    toggleLocalCom,
    toggleWorldCom,
  }
  return (
    <AnnotationsContext.Provider value={value}>
      {children}
    </AnnotationsContext.Provider>
  )
}
function useAnnotations () {
  const context = React.useContext(AnnotationsContext)
  if (!context) {
    throw new Error('useAnnotations must be used within AnnotationsProvider')
  }
  return context
}
function AnnotationControls (): React.ReactNode {
  const opts = useAnnotations()
  return (
    <div className="flex gap-4 p-4">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="dynamic"
          defaultChecked={opts.isDynamic}
          onChange={opts.handleCheck} />
        Make Dynamic
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="annotation"
          defaultChecked={opts.showAnnotations}
          onChange={opts.handleCheck} />
        Show Annotations
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="mass"
          defaultChecked={opts.showMass}
          onChange={opts.handleCheck} />
        Show Mass
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="lCom"
          defaultChecked={opts.showLocalCom}
          onChange={opts.handleCheck} />
        Show Local COM
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="wCom"
          defaultChecked={opts.showWorldCom}
          onChange={opts.handleCheck} />
        Show World COM
      </label>
    </div>
  )
}

type CalderPageProps = {
  children: React.ReactNode
}
function CalderPage ({
  children
}: CalderPageProps): React.ReactNode {
  return (
    <AnnotationsProvider>
      <div className="font-outfit-100 bg-calder-beige text-calder-black fixed top-0 left-0 right-0 bottom-0 overflow-auto">
        <div className="container mx-auto py-12">
          {children}
        </div>
      </div>
    </AnnotationsProvider>
  )
}

type HeaderProps = {
  heading: string
  subHeading?: React.ReactNode
}
function Header ({
  heading,
  subHeading,
}: HeaderProps): React.ReactNode {
  return (
    <header>
      { subHeading
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
      {/* <axesHelper args={[5]} /> */}
    </MeshCollider>
  )
}

type ColliderLabelProps = {
  name: string,
  collider: RapierCollider,
  position?: Vector3Tuple,
  type?: 'parent' | 'child' | 'default'
}
function ColliderLabel ({
  name,
  collider,
  position,
  type = 'default',
}: ColliderLabelProps): React.ReactNode {
  const massRef = useRef("")
  const translationRef = useRef<Vector3Object | null>(null)
  const wComRef = useRef<Vector3Object | null>(null)
  const annotationOpts = useAnnotations()
  useEffect(() => {
    if (collider) {
      massRef.current = collider.mass().toFixed(2)
      translationRef.current = collider.translation()//collider.translation()
      if (collider.parent()) {
        wComRef.current = collider.parent().worldCom()
      }
    }
  }, [collider, collider.translation()])

  const labelContent = useCallback(() => {
    return (
      annotationOpts.showAnnotations
        ?
        <div 
          className="bg-calder-black px-2 py-1.5 text-white rounded-md font-normal text-xs" 
          style={{
            background: 
              (type === 'default') ? 'rgba(255,255,255,0.25)' 
                : (type === 'child') ? 'rgba(249, 168, 37,0.125)'
                : 'rgba(46, 76, 156,0.125)' ,
            border: 
              (type === 'default') ? '1px solid rgba(255,255,255,0.5)' 
                  : (type === 'child') ? '1px solid rgba(249, 168, 37,0.5)'
                  : '1px solid rgba(46, 76, 156,0.5)' ,
            backdropFilter: 'blur(0.5rem)',
            whiteSpace: 'nowrap'
          }}>
            <div className="text-calder-black">
              { name
                  && <span className="font-bold">{name}<br/></span>
              }
              {
                annotationOpts.showMass && massRef.current
                  && <>Mass <span className="font-bold">{massRef.current}</span><br /></>
              }
              {
                annotationOpts.showLocalCom && translationRef.current
                  && <>Translation <span className="font-bold">{`[${translationRef.current.x.toFixed(1)},${translationRef.current.y.toFixed(1)},${translationRef.current.z.toFixed(1)}]`}</span><br/></>
              }
              {
                annotationOpts.showWorldCom && wComRef.current
                  && <>Parent COM <span className="font-bold">{`[${wComRef.current.x.toFixed(1)},${wComRef.current.y.toFixed(1)},${wComRef.current.z.toFixed(1)}]`}</span></>
              }
            </div>
          </div>
        : null
    )
  }, [annotationOpts])

  return (
    <Html position={position}>
      {labelContent()}
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
        const collider = bodyRef.current.collider(i)
        collider.setFriction(1)
        collider.setRestitution(0)
        _newColliders.push(collider)
      }
      props.setColliders(_newColliders)
    }
  })

  return (
    <RigidBody
      ref={bodyRef}
      type={props.type}
      colliders={props.colliders}
      position={props.position}
    >
      {props.children}
    </RigidBody>
  )
}

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
  return (
    <Suspense>
      <Physics gravity={[0,-9.81,0]}>
        <CeilingBody />
        <CalderArm />
      </Physics>
    </Suspense>
  )
}

export default function MobileTestPage (): React.ReactNode {
  return (
    <CalderPage>
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
    </CalderPage>
  )
}