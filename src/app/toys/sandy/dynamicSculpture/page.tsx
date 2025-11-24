"use client"

import Link from 'next/link';
import Header from '../../../components/Header';
import SandyTheme from '../../../components/themes/Sandy';
import { ChevronLeft } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { CameraControls, OrbitControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { MobileProvider } from '../../../components/useMobile';

function MobileCeilingAnchor (): React.ReactNode {
  return (
    <></>
  )
}
function MobileBody (): React.ReactNode {
  return (
    <></>
  )
}
function MobileShape (): React.ReactNode {
  return (
    <></>
  )
}
function MobileArm (): React.ReactNode {
  return (
    <></>
  )
}
function MobileArmTerminus (): React.ReactNode {
  return (
    <></>
  )
}
function Mobile (): React.ReactNode {
  return (
    <Physics gravity={[0,-9.81,0]}>
      <MobileCeilingAnchor />
      <MobileBody />
    </Physics>
  )
}

export default function DynamicSculpturePage (): React.ReactNode {
  return (
    <SandyTheme>
      <Header
        subHeading={
          <Link href="/toys/sandy" className="flex items-center gap-1 relative -left-1.5"><ChevronLeft />Sandy</Link>
        }
        heading="Dynamic Mobile Test"
      />
      <p className="my-4 text-3xl font-light leading-relaxed">
        This will be a test to build leaves for mobiles.
      </p>
      <div className="bg-calder-yellow h-[500px]">
        <MobileProvider>
          <Canvas camera={{ position: [0,0,10] }}>
            <Mobile />
            <OrbitControls />
            <CameraControls />
          </Canvas>
        </MobileProvider>
      </div>
    </SandyTheme>
  )
}