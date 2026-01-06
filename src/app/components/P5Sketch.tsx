"use client"

import p5 from 'p5'
import { useEffect, useRef } from 'react'

type P5SketchProps = {
  sketchFn: (s: p5) => void
  className?: string
  children?: React.ReactNode
}

export default function P5Sketch ({
  sketchFn,
  className,
  children,
}: P5SketchProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null)
  const sketchRef = useRef<p5>(null)

  useEffect(() => {
    // When component mounts, load sketch
    if (containerRef.current && !sketchRef.current) {
      sketchRef.current = new p5(
        sketchFn,
        containerRef.current
      )
    }

    // When the component unmounts, clean up p5 sketch
    return () => sketchRef.current?.remove()
  }, [])

  return (
    <div 
      className={className ? className : undefined}>
        <div ref={containerRef}></div>
        {children}
    </div>
  )
}