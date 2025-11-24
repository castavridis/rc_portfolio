"use client"

import type p5 from 'p5'
import { useEffect, useRef } from 'react'
import Header from '../../components/Header';

class Walker {
  s: p5;
  x: number;
  y: number;
  constructor(s: p5, x: number, y:number) {
    this.s = s
    this.x = x
    this.y = y
  }

  display () {
    this.s.stroke(0)
    this.s.point(this.x, this.y)
  }

  step () {
    this.x += Math.floor(Math.random()*3.05)-1
    this.y += Math.floor(Math.random()*3.05)-1
  }
}

function sketch (s: p5) {
  let w: Walker

  s.draw = () => {
    w.step()
    w.display()
  }
  s.setup = () => {
    s.resizeCanvas(500,500)
    w = new Walker(s, s.width/2, s.height/2)
    s.background(255)
  }
}

export default function NatureOfCodePage (): React.ReactNode {
  const containerRef = useRef<HTMLDivElement>(null)
  const sketchRef = useRef<p5>(null)

  async function loadP5() {
    // Import p5 here so component doesn't attempt
    // to load p5 before window exists
    const p5 = (await import('p5')).default
    sketchRef.current = new p5(sketch, containerRef.current)
  }

  useEffect(() => {
    if (containerRef.current && !sketchRef.current) {
      loadP5()
    }
  }, [containerRef, sketchRef])
  return (
    <div>
      <Header heading="The Nature of Code" />
      <h2>Exercise I. Random Walk</h2>
      <div ref={containerRef}></div>
    </div>
  )
}