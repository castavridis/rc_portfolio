import type p5 from 'p5'
import { BezierShape } from './types';

export const triangle_data: BezierShape = {
  origin: [54.79, 0],
  vertices: [
    [52.19, 0, 49.55, 0.96, 47.39, 3.12],
    [47.39, 3.12, 3.12, 47.39, 3.12, 47.39],     // line to (3.12, 47.39)
    [-3.54, 54.05, 1.18, 65.44, 10.60, 65.44],
    [10.60, 65.44, 54.88, 65.44, 54.88, 65.44], // line to (54.88, 65.44)
    [60.72, 65.44, 65.45, 60.71, 65.45, 54.87],
    [65.45, 54.87, 65.44, 10.59, 65.44, 10.59], // line to (65.44, 10.59)
    [65.44, 4.22, 60.23, 0, 54.79, 0],
  ],
  color: 'cyan',
}

export default function drawTriangle (sketch: p5) {
  sketch.beginShape()

  sketch.vertex(54.79, 0)
  
  // C52.19,0,49.55,0.96,47.39,3.12 (absolute)
  sketch.bezierVertex(52.19, 0)
  sketch.bezierVertex(49.55, 0.96)
  sketch.bezierVertex(47.39, 3.12)
  
  // L3.12,47.39 - Line to (use sketch.vertex for lines)
  sketch.vertex(3.12, 47.39)
  
  // c-6.66,6.66,-1.94,18.05,7.48,18.05 (relative from 3.12, 47.39)
  sketch.bezierVertex(-3.54, 54.05)
  sketch.bezierVertex(1.18, 65.44)
  sketch.bezierVertex(10.60, 65.44)
  
  // h44.28 - horizontal line (relative)
  // Current: (10.60, 65.44) → (54.88, 65.44)
  sketch.vertex(54.88, 65.44)
  
  // c5.84,0,10.57,-4.73,10.57,-10.57 (relative from 54.88, 65.44)
  sketch.bezierVertex(60.72, 65.44)
  sketch.bezierVertex(65.45, 60.71)
  sketch.bezierVertex(65.45, 54.87)
  
  // V10.59 - vertical line to (absolute)
  sketch.vertex(65.44, 10.59)
  
  // C65.44,4.22,60.23,0,54.79,0 (absolute)
  sketch.bezierVertex(65.44, 4.22)
  sketch.bezierVertex(60.23, 0)
  sketch.bezierVertex(54.79, 0)
  
  // h0 and Z - close
  sketch.endShape()
}