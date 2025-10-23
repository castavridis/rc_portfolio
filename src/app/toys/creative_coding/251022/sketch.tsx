"use client"

import p5 from 'p5'
import { useEffect, useRef } from 'react'

import Matter from 'matter-js'

const { Engine, World, Bodies, Runner } = Matter
const SCREEN_WIDTH = 500
const SCREEN_HEIGHT = 500

const engine = Engine.create()
const world = engine.world
const runner = Runner.create()

const pumpkinConstructor = (settings) => {
  const {sketch, world} = settings
  return function Pumpkin(x, y, w) {
    const options = {
      friction: 0.4,
      restitution: 0.8,
      label: 'pumpkin'
    }
    this.body = Bodies.circle(x, y, w * 0.55, options)
    this.w = w

    this.show = function () {
      this.pos = this.body.position
      this.angle = this.body.angle
      sketch.push()
      sketch.noStroke()
      sketch.translate(
        this.pos.x,
        this.pos.y
      )
      sketch.rotate(this.angle)
      sketch.fill('orange')
      sketch.circle(0,0,this.w)
      sketch.fill('green')
      sketch.rect(
        0 - this.w/20,
        -this.w/2 - this.w/6,
        this.w/10,
        this.w/4,
        this.w/2,
      )
      sketch.pop()
    }
  }
}

const drawPumpkins = pumpkins => {
  for (let i = 0; i < pumpkins.length; i++) {
    pumpkins[i].show()
  }
}

let pumpkins = []
const addPumpkin = (settings, pumpkins) => {
  const { sketch, world } = settings
  const Pumpkin = pumpkinConstructor(settings)
  const pumpkin = new Pumpkin(
    sketch.mouseX,
    sketch.mouseY,
    sketch.random(10,40),
  )
  World.add(world, pumpkin.body)
  pumpkins.push(pumpkin)
}

const s = (sketch) => {
  sketch.setup = () => {
    sketch.resizeCanvas(SCREEN_WIDTH, SCREEN_HEIGHT)
    const boundsOpts = { isStatic: true }
    const ground = Bodies.rectangle(
      SCREEN_WIDTH/2, // x
      SCREEN_HEIGHT - 5, // y
      SCREEN_WIDTH, // w
      10, // h
      boundsOpts
    )
    const leftWall = Bodies.rectangle(
      -5,
      SCREEN_HEIGHT / 2,
      20,
      SCREEN_HEIGHT,
      boundsOpts,
    )
    const rightWall = Bodies.rectangle(
      SCREEN_WIDTH - 5,
      SCREEN_HEIGHT / 2,
      10,
      SCREEN_HEIGHT,
      boundsOpts,
    )
    World.add(world,[ground, leftWall, rightWall])
    Runner.run(runner, engine)
    // Engine.run(engine)
  }
  sketch.mousePressed = () => {
    addPumpkin({
      sketch: sketch,
      world,
    }, pumpkins)
  }
  sketch.draw = () => {
    sketch.background(0)
    drawPumpkins(pumpkins)
  }
}

export default function Sketch251022 (): React.ReactNode {
  // Following an approach from Claude to use refs for the div and the sketch
  const containerRef = useRef<HTMLDivElement>(null)
  const sketchRef = useRef<p5>(null)

  useEffect(() => {
    if (containerRef.current && !sketchRef.current) {
      sketchRef.current = new p5(s, containerRef.current)
    }

    // Clean up sketch
    return () => sketchRef.current?.remove()
  }, [])

  return (
    <div>
      <h1>Sketch</h1>
      <p>Click to draw pumpkins</p>
      <div 
        ref={containerRef}>
        
      </div>
    </div>
  )
}