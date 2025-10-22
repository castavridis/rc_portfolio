// @ts-nocheck: p5.js v2.0.5 types are not fully implement or correct
// opportunity to contribute!

"use client"

import { Grid } from 'pretty-grid'
import Matter from 'matter-js'
import p5 from 'p5'
import { useCallback, useEffect, useRef } from 'react'

const MODE = {
  0: {
    name: 'Origin',
    color: '#00F',
  },
  1: {
    name: 'Destination',
    color: '#0FF',
  },
  2: {
    name: 'Destination Control Point',
    color: '#FF0',
  },
  3: {
    name: 'Origin Control Point',
    color: '#F0F',
  },
}
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

const { Engine, World, Bodies, Bounds, Composite } = Matter

let currMode = 0,
    font,
    grid,
    isDrawing,
    // isEditing,
    pointer,
    pointerDown = false,
    _shapes,
    engine,
    world,
    ground

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
  function drawDotGrid () {
    sketch.fill(SKETCH_GREY)
    grid.every(({ x, y }) => sketch.circle(x, y, 2))
  }
  function drawAxes () {
    const margin = 50
    sketch.stroke(SKETCH_GREY)
    sketch.strokeWeight(1.5)
    // y-axis
    sketch.line(margin, margin, margin, SKETCH_HEIGHT-margin)
    // x-axis
    sketch.line(margin, SKETCH_HEIGHT - margin, SKETCH_WIDTH - margin, SKETCH_HEIGHT-margin)
    sketch.noStroke()
  }
  function drawUI () {
    drawDotGrid()
    drawAxes()
  }

  class Boundary {}
  
  function setupMatter () {
    engine = Engine.create()
    world = engine.world
    ground = Bounds.create()
    Composite.add(world, ground)
    // follow bounds of drawAxes with a second axis on the right
    // Use chamfering
  }
  sketch.draw = () => {
    sketch.background('#E8D5C4')
    sketch.noStroke()
    drawUI()
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
    // setupMatter()
    grid = new Grid(40, 40, SKETCH_WIDTH, SKETCH_HEIGHT)
  }
}

export default function BezierBox2d ({ shapes }): React.ReactNode {
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