"use client"

import { Grid } from 'pretty-grid'
import p5 from 'p5'
import { useCallback, useEffect, useRef, useState } from 'react'

const MODE = {
  ORIGIN: 0, // Curve origin
  OCPOINT: 1, // Origin's control point
  DESTINATION: 2, // Destination
  DCPOINT: 3, // Destination's control point
};
const MODE_KEYS = Object.keys(MODE);
const MODE_COLORS = ['#F0F', '#FF0', '#0FF', '#0F0'];
const SKETCH_WIDTH = 500;
const SKETCH_HEIGHT = 500;
const SKETCH_GREY = 220;

const s = (sketch: p5) => {
  const curves = [];
  let currCurve = 0,
      currMode = MODE.ORIGIN,
      font,
      grid,
      pointer,
      pointerDown = false;

  function setMode () {
  if (currMode === MODE.ORIGIN && curves.length !== 0) {
    updateCurve();
    currCurve++;
  }
    updateCurve();
    currMode = (currMode + 1) % MODE_KEYS.length;
  }

  function updateCurve() {
    const c = {
      d: 5,
    };
    c[`x${currMode}`] = sketch.mouseX;
    c[`y${currMode}`] = sketch.mouseY;
    curves[currCurve] = {
      ...curves[currCurve],
      ...c,
    };
  }

  function drawPointer() {
    const pointerColor = sketch.color(MODE_COLORS[currMode]);
    if (pointerDown) {
      pointerColor.setAlpha(255);
      sketch.fill(pointerColor);
      pointer = sketch.circle(sketch.mouseX, sketch.mouseY, 10);
    } else {
      pointerColor.setAlpha(125);
      sketch.fill(pointerColor);
      pointer = sketch.circle(sketch.mouseX, sketch.mouseY, 7.5);
    }
    sketch.fill(0);

    const pX = sketch.mouseX - 50;

    const pY = SKETCH_HEIGHT - sketch.mouseY - 50;

    sketch.text(`(${pX.toFixed(0)},${pY.toFixed(0)})`, sketch.mouseX - 2.5, sketch.mouseY - 10, 100, 100);
  }

  function drawDotGrid () {
    sketch.fill(200);
    
    // Draw dots for all the points on the grid
    grid.every(({ x, y }) => sketch.circle(x, y, 2));
  }

  function hasProperties(data, arr) {
    return arr.every((r) => data.hasOwnProperty(r))
  }

  // in p5.js, origin = top-left corner
function drawCurves () {
  for (let i = 0; i < curves.length; i++) {
    const c = curves[i];
    if (c) {
      
      // Draw bezier curve
      sketch.stroke(0);
      sketch.strokeWeight(1.5);
      const fillC = sketch.color('antiquewhite');
      fillC.setAlpha(150);
      sketch.fill(fillC);
      if (hasProperties(c, ['x0','y0','x1','y1','x2','y2','x3','y3'])) {
        sketch.bezier(c.x0, c.y0, c.x1, c.y1, c.x3, c.y3, c.x2, c.y2); 
      }
      
      // Draw control point lines
      sketch.noFill();
      sketch.stroke(210);
      sketch.strokeWeight(1);
      
      // Draw line from origin to control point
      if (hasProperties(c, ['x0','y0','x1','y1'])) {
        sketch.line(c.x1, c.y1, c.x0, c.y0); 
      }
      
      // Draw line from destination to control point
      if (hasProperties(c, ['x2','y2','x3','y3'])) {
        sketch.line(c.x2, c.y2, c.x3, c.y3);
      }
      
      // Draw points of bezier
      sketch.noStroke();
      
      if (hasProperties(c, ['x0','y0'])) {
        sketch.fill(MODE_COLORS[MODE.ORIGIN]);
        sketch.circle(c.x0, c.y0, c.d);
      }
      if (hasProperties(c, ['x1','y1'])) {
        sketch.fill(MODE_COLORS[MODE.OCPOINT]);
        sketch.circle(c.x1, c.y1, c.d);
      }
      if (hasProperties(c, ['x2','y2'])) {
        sketch.fill(MODE_COLORS[MODE.DESTINATION]);
        sketch.circle(c.x2, c.y2, c.d);
      }
      if (hasProperties(c, ['x3','y3'])) {
        sketch.fill(MODE_COLORS[MODE.DCPOINT]);
        sketch.circle(c.x3, c.y3, c.d);  
      }
      sketch.noFill();
    }
  }
}

  function drawAxes () {
    sketch.stroke(180);
    sketch.strokeWeight(1.5);
    const margin = 50;
    // y-axis
    sketch.line(margin, margin, margin, SKETCH_HEIGHT-margin);
    // x-axis
    sketch.line(margin, SKETCH_HEIGHT - margin, SKETCH_WIDTH - margin, SKETCH_HEIGHT-margin);
    sketch.noStroke();
  }

  function drawModeLabel () {
    const label = `Mode: ${MODE_KEYS[currMode]}`;
    const margin = 5;
    const bounds = font.textBounds(label, 5, 15);
    const c = sketch.color(MODE_COLORS[currMode]);
    c.setAlpha(50);
    sketch.fill(c);
    sketch.rect(bounds.x - margin/2,bounds.y - margin/2,bounds.w +margin *2,bounds.h + margin*2);
    sketch.fill(0);
    sketch.text(label,5+margin/2,15+margin/2);
  }


  function drawCurveCount () {
    const label = `Curves: ${curves.length}`;
    const margin = 5;
    const bounds = font.textBounds(label, 5, SKETCH_HEIGHT-15);
    sketch.fill(220);
    sketch.rect(bounds.x - margin/2,bounds.y - margin/2,bounds.w +margin *2,bounds.h + margin*2);
    sketch.fill(0);
    sketch.text(label,5+margin/2,SKETCH_HEIGHT-15+margin/2);
  }

  function drawUI () {
    drawDotGrid();
    drawAxes();
    drawModeLabel();
    drawCurveCount();
    drawPointer();
  }

  sketch.mousePressed = () => {
    pointerDown = true;
    setMode();
  }
  sketch.mouseReleased = () => {
    pointerDown = false;
  }
  sketch.keyPressed = () => {
    if (sketch.keyCode === 27) { // ESC pressed
      currMode = MODE.ORIGIN;
    }
  }
  sketch.draw = () => {
    sketch.background(255);
    sketch.noStroke();
    drawUI();
    drawCurves();
  }
  sketch.setup = async () => {
    try {
      // p5.js doesn't know what the client's default font is
      // So a font must be loaded before we can get textBounds dynamically
      await sketch.loadFont(
        '/assets/fonts/Karla-Medium.ttf',
        (data) => { 
          font = sketch.textFont(data, 12)
          console.log(font)
        },
        (err) => { 
          console.warn('Could not load preferred font. Attempting to load fallback.', err)
          font = sketch.textFont('Arial', 12)
          console.log(font)
        }
      )
    } catch(err) {
      console.warn('Could not load preferred font. Attempting to load fallback.', err)
      font = sketch.textFont('Arial', 12)
      console.log(font)
    }
    // No need to call sketch.createCanvas in instance mode
    sketch.resizeCanvas(SKETCH_WIDTH,SKETCH_HEIGHT,true)
    grid = new Grid(40, 40, SKETCH_WIDTH, SKETCH_HEIGHT)
  }
}

export default function BezierDrawingTool (): React.ReactElement {
  // Following an approach from Claude to use refs for the div and the sketch
  const containerRef = useRef<HTMLDivElement>(null)
  const sketchRef = useRef<p5>(null)

  useEffect(() => {
    if (containerRef.current && !sketchRef.current) {
      sketchRef.current = new p5(s, containerRef.current)
    }
    return () => {
      // FIXME this cleanup creates multiple components
      // if (sketchRef.current) {
      //   // Stop p5 draw loop and remove HTML elements created by sketch
      //   sketchRef.current.remove()
      //   sketchRef.current = null
      // }
    }
  }, [])

  return (
    <div ref={containerRef}></div>
  )
}