'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import DrawSVGPlugin from 'gsap/DrawSVGPlugin'
import { useGSAP } from '@gsap/react'

import SealGuilloche from './SealGuilloche'

gsap.registerPlugin(DrawSVGPlugin)
gsap.registerPlugin(useGSAP) // register the hook to avoid React version discrepancies

export default function SVGAnimationPage (): React.ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const startPt = "100%"
  const endPt = "1%"
  useGSAP(
    () => {
      gsap
        .timeline({
          repeat: 0,
          defaults: {
            delay: 5,
            duration: 3,
            ease: 'circ.inOut'
          }
        })
        .from('path', {
          drawSVG: `99.65% ${startPt}`,
        })
        .to('path', {
          drawSVG: `${endPt} ${startPt}`,
        })
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef}>
      <div className="p-20 w-full h-full bg-[url('https://images.unsplash.com/photo-1601662528567-526cd06f6582?q=80&w=1430&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-repeat bg-size-[50%]">
      <div className="relative">
        <div className="seal-guilloche-content w-full h-[80vh] bg-blue-700"></div>
        <div className="mix-blend-multiply p-40">
          <SealGuilloche />
        </div>
      </div>
      </div>
    </div>
  )
}
