// @ts-nocheck: p5.js v2.0.5 types are not fully implement or correct
// opportunity to contribute!

"use client"

import p5 from 'p5'
import { useCallback, useEffect, useRef } from 'react'

const SHAPE_COLORS = [
  '#E63946', // red
  '#F9A825', // yellow
  '#2E4C9C', // blue
  '#2B2B2B', // black
  '#FFFFFF', // white
]
const SKETCH_WIDTH = 500
const SKETCH_HEIGHT = 500
const SKETCH_GREY = 185

let currMode = 0,
    font,
    isDrawing,
    // isEditing,
    pointer,
    pointerDown = false,
    _shapes

const s = (sketch: p5) => {
  function drawShapeHelper (shape) {
    const origin = shape.vertices[0]
    sketch.beginShape()
    sketch.vertex(...origin)
    for(let i = 1; i < shape.vertices.length; i++) {
      const currBezier = shape.vertices[i]
      sketch.bezierVertex(currBezier[0],currBezier[1])
      sketch.bezierVertex(currBezier[2],currBezier[3])
      sketch.bezierVertex(currBezier[4],currBezier[5])
    }
    sketch.fill(shape.color)
    sketch.endShape(p5.CLOSE)
  }
  function drawShapes () {
    if (!_shapes || _shapes.length === 0) return
    for(let i = 0; i < _shapes.length; i++) {
      const shape = _shapes[i]
      drawShapeHelper(shape)
    }
  }
  sketch.draw = () => {
    sketch.background('#E8D5C4')
    sketch.noStroke()
    drawShapes()
  }
  sketch.setup = async () => {
    // Try to preload items
    try {
      // p5.js doesn't know what the client's default font is
      // So a font must be loaded before we can get textBounds dynamically
      await sketch.loadFont(
        '/assets/fonts/Karla-Medium.ttf',
        (data) => { 
          font = sketch.textFont(data, 12)
        },
        (err) => { 
          console.warn('Could not load preferred font. Attempting to load fallback.', err)
          font = sketch.textFont('Arial', 12)
        }
      )
    } catch(err) {
      console.warn('Could not load preferred font. Attempting to load fallback.', err)
      font = sketch.textFont('Arial', 12)
    }
    // No need to call sketch.createCanvas in instance mode
    sketch.resizeCanvas(SKETCH_WIDTH,SKETCH_HEIGHT,true)
  }
}

export default function BezierCanvas ({ shapes }): React.ReactNode {
  // Following an approach from Claude to use refs for the div and the sketch
  const containerRef = useRef<HTMLDivElement>(null)
  const sketchRef = useRef<p5>(null)

  useEffect(() => {
    _shapes = shapes
  }, [shapes])

  useEffect(() => {
    if (containerRef.current && !sketchRef.current) {
      sketchRef.current = new p5(s, containerRef.current)
    }

    // Clean up sketch
    return () => sketchRef.current?.remove()
  }, [])

  return (
    <div ref={containerRef}></div>
  )
}