// @ts-nocheck: p5.js v2.0.5 types are not fully implement or correct
// opportunity to contribute!

"use client"

import * as PolyDecomp from 'poly-decomp'
import { Grid } from 'pretty-grid'
import { Common, Engine, World, Bodies, Bounds, Render, Runner, Vertices, Body } from 'matter-js'
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
const SKETCH_GREY = 150
const BEZIER_RESOLUTION = 24

let currMode = 0,
    font,
    grid,
    prevShapes = [],
    letMatterDebug

const matterShapes = []
const engine = Engine.create()
const world = engine.world
const runner = Runner.create()

function buildShapeVertices(sketch: p5, shape: any) {
  const vertices = []
  let originVertex = shape.vertices[0]
  for (let i = 1; i < shape.vertices.length; i++) {
    const currBezier = shape.vertices[i]
    for (let j = 0; j <= BEZIER_RESOLUTION; j++) {
      vertices.push({
        x: sketch.bezierPoint(
          originVertex[0],
          currBezier[0],
          currBezier[2],
          currBezier[4],
          j / BEZIER_RESOLUTION
        ),
        y: sketch.bezierPoint(
          originVertex[1],
          currBezier[1],
          currBezier[3],
          currBezier[5],
          j / BEZIER_RESOLUTION,
        ),
      })
    }
    originVertex = [currBezier[4],currBezier[5]]
  }
  return vertices
}

// https://stackoverflow.com/questions/68602889/how-to-apply-physics-to-complex-shapes-matter-js-p5-js
// from http://paulbourke.net/geometry/polygonmesh/
// function computeArea(vertices) {
//   let area = 0;
//   for (let i = 0; i < vertices.length - 1; i++) {
//     let v = vertices[i];
//     let vn = vertices[i + 1];
//     area += (v.x * vn.y - vn.x * v.y) / 2;
//   }

//   return area;
// }

// function computeCenter(vertices) {
//   let area = computeArea(vertices);
//   let cx = 0,
//     cy = 0;
//   for (let i = 0; i < vertices.length - 1; i++) {
//     let v = vertices[i];
//     let vn = vertices[i + 1];
//     cx += (v.x + vn.x) * (v.x * vn.y - vn.x * v.y) / (6 * area);
//     cy += (v.y + vn.y) * (v.x * vn.y - vn.x * v.y) / (6 * area);
//   }

//   return {
//     x: cx,
//     y: cy
//   };
// }

class Shape {
  sketch: p5
  shape: any
  vertices: {x:number,y:number}[]
  center: {x: number, h: number}
  body: Matter.Body

  constructor (sketch: p5, shape: any) {
    if (!shape || !shape.vertices) return
    this.sketch = sketch
    this.shape = shape
    this.vertices = buildShapeVertices(sketch, shape)
    // this.center = computeCenter(this.vertices)
    // console.log(this.center)
    this.color = shape.color
    this.buildBody()
  }
  buildBody () {
    const options = {
      friction: 0.4,
      restitution: 0.8,   
      render: {
          fillStyle: this.color,
      }
    }
    this.body = Bodies.fromVertices(
      this.shape.vertices[0][0],
      this.shape.vertices[0][1],
      this.vertices,
      options,
    )
  }
  show () {
    this.pos = this.body.position
    this.angle = this.body.angle
    // this.bounds = this.body.bounds
    // this.w = this.bounds.max.x - this.bounds.min.x
    // this.h = this.bounds.max.y - this.bounds.min.y
    // this.cx = this.bounds.max.x + this.bounds.min.x
    // this.cy = this.bounds.max.y + this.bounds.min.y
    this.sketch.push()
    this.sketch.translate(
      this.pos.x,
      this.pos.y,
    )
    this.sketch.rotate(this.angle)
    this.sketch.stroke(this.color)
    this.sketch.strokeWeight(2)
    this.sketch.noFill()
    // this.sketch.noStroke()
    // this.sketch.fill(this.color)
    this.sketch.beginShape()
    const origin = this.shape.vertices[0]
    this.sketch.vertex(0,0)
    for(let i = 1; i < this.shape.vertices.length; i++) {
      const currBezier = this.shape.vertices[i]
      this.sketch.bezierVertex(
        currBezier[0]-origin[0],
        currBezier[1]-origin[1],
      )
      this.sketch.bezierVertex(
        currBezier[2]-origin[0],
        currBezier[3]-origin[1],
      )
      this.sketch.bezierVertex(
        currBezier[4]-origin[0],
        currBezier[5]-origin[1],
      )
    }
    this.sketch.endShape(p5.CLOSE)
    this.sketch.pop()
  }
}

function buildMatterShapes(
  sketch: p5,
  shapes: any[],
) {
  const difference = shapes.filter(shape => !prevShapes.includes(shape))
  difference.forEach((shape) =>{
    if (!shape) return
    const _shape = new Shape(sketch, shape)
    World.add(world, _shape.body)
    matterShapes.push(_shape)
  })
  prevShapes = shapes
}

const s = (sketch: p5) => {
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
    // drawUI()
    // matterShapes.forEach((shape) => shape.show())
  }
  sketch.setup = async () => {
    // No need to call sketch.createCanvas in instance mode
    sketch.resizeCanvas(SKETCH_WIDTH,SKETCH_HEIGHT,true)
    grid = new Grid(40, 40, SKETCH_WIDTH, SKETCH_HEIGHT)
    // Add boundaries for shapes
    const boundsOpts = { isStatic: true }
    const ground = Bodies.rectangle(
      SKETCH_WIDTH / 2 + 1, // x
      SKETCH_HEIGHT + 6, // y
      SKETCH_WIDTH, // w
      10, // h
      boundsOpts
    )
    const leftWall = Bodies.rectangle(
      -10,
      SKETCH_HEIGHT / 2 + 1,
      10,
      SKETCH_HEIGHT,
      boundsOpts,
    )
    const rightWall = Bodies.rectangle(
      SKETCH_WIDTH + 10,
      SKETCH_HEIGHT / 2 + 1,
      10,
      SKETCH_HEIGHT,
      boundsOpts,
    )
    World.add(world,[ground, leftWall, rightWall])
    Runner.run(runner, engine)
    Common.setDecomp(PolyDecomp)
  }
}

function attachRenderer (element: HTMLDivElement) {
  const render = Render.create({
    element,
    engine,
    options: {
      background: 'transparent',
      wireframes: false,
      wireframeBackground: 'transparent',
      // wireframeStrokeStyle: `rgb(${SKETCH_GREY},${SKETCH_GREY},${SKETCH_GREY})`,
      // showBounds: true,
      showAngleIndicator: true,
    }
  })
  Render.setSize(render, SKETCH_WIDTH, SKETCH_HEIGHT)
  Render.run(render)
  return render
}

export default function BezierMatter ({ shapes }): React.ReactNode {
  // Following an approach from Claude to use refs for the div and the sketch
  const containerRef = useRef<HTMLDivElement>(null)
  const debugRef = useRef<HTMLDivElement>(null)
  const matterRef = useRef<Matter>(null)
  const sketchRef = useRef<p5>(null)

  useEffect(() => {
    if (sketchRef.current && shapes && shapes.length) {
      buildMatterShapes(sketchRef.current, shapes)
    }
  }, [shapes])
  useEffect(() => {
    if (containerRef.current && !sketchRef.current) {
      sketchRef.current = new p5(s, containerRef.current)
    }
    return () => { 
      // Clean up sketch
      debugRef.current?.remove()
      sketchRef.current?.remove()
    }
  }, [])
  useEffect(() => {
    if (!matterRef.current) {
      matterRef.current = attachRenderer(debugRef.current)
    }
  }, [debugRef])

  return (
    <div className="relative">
      <div className="border-calder-black/10 border-2" ref={containerRef}></div>
      <div className="absolute top-0 left-0" ref={debugRef}></div>
    </div>
  )
}