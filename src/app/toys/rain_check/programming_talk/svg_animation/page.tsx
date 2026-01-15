'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import DrawSVGPlugin from 'gsap/DrawSVGPlugin'
import { useGSAP } from '@gsap/react'

import SealGuilloche from './seal_guilloche'

gsap.registerPlugin(DrawSVGPlugin)
gsap.registerPlugin(useGSAP) // register the hook to avoid React version discrepancies

export default function SVGAnimationPage (): React.ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const startPt = "100%"
  const endPt = "5%"
  useGSAP(
    () => {
      gsap
        .timeline({
          repeat: 0,
          defaults: {
            duration: 3,
            ease: 'circ.inOut'
          }
        })
        .set('path', {
          drawSVG: `99.65% ${startPt}`,
        })
        .to('path', {
          delay: 5,
          drawSVG: `${endPt} ${startPt}`,
        })
    },
    { scope: containerRef }
  )

  return (
    <div ref={ containerRef }>
      <SealGuilloche />
    </div>
  )
}
