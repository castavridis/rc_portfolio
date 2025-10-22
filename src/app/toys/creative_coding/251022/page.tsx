"use client"

import p5 from 'p5'
import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

const Sketch251022 = dynamic(() => import('./sketch'),{
  ssr: false,
})

export default function CreativeCoding251022 (): React.ReactNode {

  return (
    <div className="bg-calder-black">
      <Sketch251022 />
    </div>
  )
}