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

const { Engine, World, Bodies, Runner } = Matter

let currMode = 0,
    font,
    grid,
    isDrawing,
    // isEditing,
    pointer,
    pointerDown = false,
    _shapes

const engine = Engine.create()
const world = engine.world
const runner = Runner.create()
// Runner.run(runner, engine)

class Shape {
  constructor (sketch: p5, shape: any) {
    if (!shape || !shape.vertices) {
      return
    }
    this.sketch = sketch
    this.vertices = shape.vertices
    this.color = shape.color
    this.buildBody()
  }
  buildBody () {
    const options = {
      friction: 0.4,
      restitution: 0.8,
      label: 'weight'
    }
    const vertices = []
    vertices.push({
      x: this.vertices[0][0],
      y: this.vertices[0][1],
    })
    for (let i = 1; i < this.vertices.length; i++) {
      // This approach is going to look weird...because control points are being added to this shape
      const currBezier = this.vertices[i]
      vertices.push({
        x: currBezier[0],
        y: currBezier[1],
      },{
        x: currBezier[2],
        y: currBezier[3],
      },{
        x: currBezier[4],
        y: currBezier[5]
      })
    }
    this.body = Bodies.fromVertices(
      this.vertices[0][0],
      this.vertices[0][1],
      vertices,
      options,
    )
  }
  show () {
    // console.log(this.body.id, this.body.position, this.body.angle)
    this.pos = this.body.position
    this.bounds = this.body.bounds
    const w = this.bounds.max.x - this.bounds.min.x
    const h = this.bounds.max.y - this.bounds.min.y
    this.angle = this.body.angle
    this.sketch.push()
    this.sketch.noStroke()
    this.sketch.translate(
      this.pos.x - w,
      this.pos.y - h,
    )
    this.sketch.rotate(this.angle)
    this.sketch.fill(this.color)
    this.sketch.beginShape()
    this.sketch.vertex(...this.vertices[0])
    for(let i = 1; i < this.vertices.length; i++) {
      const currBezier = this.vertices[i]
      this.sketch.bezierVertex(currBezier[0],currBezier[1])
      this.sketch.bezierVertex(currBezier[2],currBezier[3])
      this.sketch.bezierVertex(currBezier[4],currBezier[5])
    }
    this.sketch.endShape(p5.CLOSE)
    this.sketch.pop()
  }
}


const matterShapes = []
let prevShapes = []
function buildMatterShapes(sketch: p5, shapes: any[]) {
  const difference = shapes.filter(shape => !prevShapes.includes(shape))
  difference.forEach(
    (shape) =>{
      const _shape = new Shape(sketch, shape)
      World.add(world, _shape.body)
      matterShapes.push(_shape)
    }
  )
  prevShapes = shapes
 
}

const s = (sketch: p5) => {
  // function drawShapeHelper (shape) {
  //   const origin = shape.vertices[0]
  //   sketch.beginShape()
  //   sketch.vertex(...origin)
  //   for(let i = 1; i < shape.vertices.length; i++) {
  //     const currBezier = shape.vertices[i]
  //     sketch.bezierVertex(currBezier[0],currBezier[1])
  //     sketch.bezierVertex(currBezier[2],currBezier[3])
  //     sketch.bezierVertex(currBezier[4],currBezier[5])
  //   }
  //   sketch.fill(shape.color)
  //   sketch.endShape(p5.CLOSE)
  // }
  // function drawShapes () {
  //   if (!_shapes || _shapes.length === 0) return
  //   for(let i = 0; i < _shapes.length; i++) {
  //     const shape = _shapes[i]
  //     drawShapeHelper(shape)
  //   }
  // }
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

  sketch.draw = () => {
    sketch.background('#E8D5C4')
    sketch.noStroke()
    drawUI()
    matterShapes.forEach((shape) => shape.show())
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
    grid = new Grid(40, 40, SKETCH_WIDTH, SKETCH_HEIGHT)

    // Add boundaries for shapes
    const boundsOpts = { isStatic: true }
    const ground = Bodies.rectangle(
      SKETCH_WIDTH/2, // x
      SKETCH_HEIGHT - 5, // y
      SKETCH_WIDTH, // w
      10, // h
      boundsOpts
    )
    const leftWall = Bodies.rectangle(
      -5,
      SKETCH_HEIGHT / 2,
      20,
      SKETCH_HEIGHT,
      boundsOpts,
    )
    const rightWall = Bodies.rectangle(
      SKETCH_WIDTH - 5,
      SKETCH_HEIGHT / 2,
      10,
      SKETCH_HEIGHT,
      boundsOpts,
    )

    World.add(world,[ground, leftWall, rightWall])
    Runner.run(runner, engine)
  }
}

export default function BezierMatter ({ shapes }): React.ReactNode {
  // Following an approach from Claude to use refs for the div and the sketch
  const containerRef = useRef<HTMLDivElement>(null)
  const sketchRef = useRef<p5>(null)

  useEffect(() => {
    if (sketchRef.current && shapes && shapes.length) {
      buildMatterShapes(sketchRef.current, shapes)
    }
    // _shapes = shapes
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