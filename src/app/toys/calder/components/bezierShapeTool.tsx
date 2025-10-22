// @ts-nocheck: p5.js v2.0.5 types are not fully implement or correct
// opportunity to contribute!

"use client"

import { Grid } from 'pretty-grid'
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

let currMode = 0,
    font,
    grid,
    isDrawing,
    // isEditing,
    pointer,
    pointerDown = false

const s = (sketch: p5, addShape: () => void) => {
  let shapes = []
  let currShape = null
  let currBezier = [] // [ocpX,ocpY,dcpX,dcpY,dX,dY]
  let prevBezier = []
  let currOrigin = []
  // let prevOrigin = []
  function buildBezier () {
    if (!isDrawing) {
      isDrawing = true
      currShape = {
        vertices: [],
        color: SHAPE_COLORS[shapes.length % SHAPE_COLORS.length]
      }
    }
    switch (currMode) {
      case 0: // Origin (o)
        currOrigin = [sketch.mouseX, sketch.mouseY]
        currShape.vertices.push(currOrigin)
        break
      case 1: // Destination (d)
        currBezier = [
          ...currOrigin, // ocp
          sketch.mouseX, sketch.mouseY, // dcp
          sketch.mouseX, sketch.mouseY, // d
        ]
        currShape.vertices.push(currBezier)
        break
      case 2: // Destination control point (dcp)
        prevBezier = currBezier
        currBezier = [
          ...currOrigin,
          sketch.mouseX, sketch.mouseY,
          prevBezier[4], prevBezier[5],
        ]
        currShape.vertices[currShape.vertices.length - 1] = currBezier
        break
      case 3: // Origin control point (ocp)
        prevBezier = currBezier
        currBezier = [
          sketch.mouseX, sketch.mouseY,
          prevBezier[2], prevBezier[3],
          prevBezier[4], prevBezier[5],
        ]
        currOrigin = [prevBezier[4], prevBezier[5]]
        currShape.vertices[currShape.vertices.length - 1] = currBezier
        break
      default:
        // Do nothing
        break
    }
    // currMode will always be greater than 0 moving forward
    currMode = (currMode % (Object.keys(MODE).length - 1)) + 1
  }
  function drawCurrentShape () {
    if (!currShape) return

    const origin = currShape.vertices[0]
    sketch.beginShape()

    sketch.stroke(SKETCH_GREY)
    sketch.strokeWeight(1)
    sketch.fill(MODE[0].color)
    sketch.vertex(...origin)
    sketch.circle(...origin, 5)

    for(let i = 1; i < currShape.vertices.length; i++) {
      const currBezier = currShape.vertices[i]
      sketch.bezierVertex(currBezier[0],currBezier[1])
      sketch.bezierVertex(currBezier[2],currBezier[3])
      sketch.bezierVertex(currBezier[4],currBezier[5])

      sketch.line(...origin, currBezier[0], currBezier[1])
      sketch.line(currBezier[4],currBezier[5], currBezier[2], currBezier[3])
      sketch.noStroke()

      sketch.fill(MODE[3].color)
      sketch.circle(currBezier[0], currBezier[1], 5)
      sketch.fill(MODE[2].color)
      sketch.circle(currBezier[2], currBezier[3], 5)
      sketch.fill(MODE[1].color)
      sketch.circle(currBezier[4], currBezier[5], 5)
    }
    if (currMode != 0) {
      sketch.fill(currShape.color)
      sketch.endShape(p5.CLOSE)
    }
  }
  function drawShapes () {
    for(let i = 0; i < shapes.length; i++) {
      const shape = shapes[i]
      const vertices = shape.vertices
      sketch.fill(shape.color)
      sketch.beginShape()
      sketch.bezierOrder(2)
      for (let j = 0; j < vertices.length; j++) {
        sketch.noStroke();
        sketch.bezierVertex(...vertices[j])
        sketch.stroke('red')
        sketch.strokeWeight(7.5)
        sketch.point(...vertices[j])
      }
      // Return to origin to close shape
      sketch.point(...vertices[0])
      sketch.noStroke();
      sketch.bezierVertex(...vertices[0])
      sketch.endShape()
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
  function drawPointer() {
    const pointerColor = sketch.color(SKETCH_GREY)
    if (pointerDown) {
      pointerColor.setAlpha(255)
      sketch.fill(pointerColor)
      pointer = sketch.circle(sketch.mouseX, sketch.mouseY, 10)
    } else {
      pointerColor.setAlpha(125)
      sketch.fill(pointerColor)
      pointer = sketch.circle(sketch.mouseX, sketch.mouseY, 7.5)
    }
    // Coordinates
    sketch.fill(0)
    const pX = sketch.mouseX - 50
    const pY = SKETCH_HEIGHT - sketch.mouseY - 50
    sketch.text(`(${pX.toFixed(0)},${pY.toFixed(0)})`, sketch.mouseX - 2.5, sketch.mouseY - 10, 100, 100)
  }
  function drawModeLabel () {
    const label = `Mode: ${MODE[currMode].name}`
    const margin = 5
    const bounds = font.textBounds(label, 5, 15)
    const c = sketch.color(MODE[currMode].color)
    c.setAlpha(50)
    sketch.fill(c)
    sketch.rect(bounds.x - margin/2,bounds.y - margin/2,bounds.w +margin *2,bounds.h + margin*2)
    sketch.fill(0)
    sketch.text(label,5+margin/2,15+margin/2)
  }
  function drawUI () {
    drawDotGrid()
    drawAxes()
    drawModeLabel()
    drawPointer()
  }
  sketch.mousePressed = (event) => {
    // This will fire in another p5 canvas on the same page
    if (event.target.nodeName === 'CANVAS') {
      buildBezier()
    }
  }
  sketch.keyPressed = () => {
    if (sketch.key = 'ESC') {
      isDrawing = false
      shapes.push(currShape)
      addShape(currShape)
      currShape = null
      currMode = 0
    }
  }
  sketch.draw = () => {
    sketch.background('#E8D5C4')
    sketch.noStroke()
    drawUI()
    drawCurrentShape()
    // drawShapes()
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
  }
}

export default function BezierShapeTool ({ setShapes }: {
  setShapes?: () => void
}): React.ReactElement {
  // Following an approach from Claude to use refs for the div and the sketch
  const containerRef = useRef<HTMLDivElement>(null)
  const sketchRef = useRef<p5>(null)

  const addShape = useCallback((shape) => {
    setShapes((prev) => [...(prev || []), shape])
  }, [setShapes])

  useEffect(() => {
    if (containerRef.current && !sketchRef.current) {
      sketchRef.current = new p5((sketch) => s(sketch, addShape), containerRef.current)
    }

    // Clean up sketch
    return () => sketchRef.current?.remove()
  }, [])

  return (
    <div ref={containerRef}></div>
  )
}
