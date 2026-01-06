import type p5 from 'p5'

export default function drawMetaball (sketch: p5) {
  sketch.beginShape()
  
  // M63.8,49.79 - Move to starting point
  sketch.vertex(63.8, 49.79)
  
  // c11.26,-2.07,20.16,-11.62,20.62,-23.27 (relative)
  // From (63.8, 49.79) → End (84.42, 26.52)
  sketch.bezierVertex(75.06, 47.72)
  sketch.bezierVertex(83.96, 38.17)
  sketch.bezierVertex(84.42, 26.52)
  
  // C85.01,11.19,73.7,-0.16,58.37,0.53 (absolute)
  sketch.bezierVertex(85.01, 11.19)
  sketch.bezierVertex(73.7, -0.16)
  sketch.bezierVertex(58.37, 0.53)
  
  // c-12.24,0.55,-23.51,9.3,-23.79,21.95 (relative)
  // From (58.37, 0.53) → End (34.58, 22.48)
  sketch.bezierVertex(46.13, 1.08)
  sketch.bezierVertex(34.86, 9.83)
  sketch.bezierVertex(34.58, 22.48)
  
  // c-0.04,1.69,-1.42,3,-3.11,2.92 (relative, chained)
  // From (34.58, 22.48) → End (31.47, 25.40)
  sketch.bezierVertex(34.54, 24.17)
  sketch.bezierVertex(33.16, 25.48)
  sketch.bezierVertex(31.47, 25.40)
  
  // c-0.47,-0.02,-0.95,-0.03,-1.42,-0.03 (relative, chained)
  // From (31.47, 25.40) → End (30.05, 25.37)
  sketch.bezierVertex(31.00, 25.38)
  sketch.bezierVertex(30.52, 25.37)
  sketch.bezierVertex(30.05, 25.37)
  
  // C13.1,25.36,-0.51,39.62,0.56,56.79 (absolute)
  sketch.bezierVertex(13.1, 25.36)
  sketch.bezierVertex(-0.51, 39.62)
  sketch.bezierVertex(0.56, 56.79)
  
  // c0.91,14.71,12.89,26.69,27.6,27.6 (relative)
  // From (0.56, 56.79) → End (28.16, 84.39)
  sketch.bezierVertex(1.47, 71.50)
  sketch.bezierVertex(13.45, 83.48)
  sketch.bezierVertex(28.16, 84.39)
  
  // c17.17,1.07,31.43,-12.55,31.43,-29.49 (relative, chained)
  // From (28.16, 84.39) → End (59.59, 54.90)
  sketch.bezierVertex(45.33, 85.46)
  sketch.bezierVertex(59.59, 71.84)
  sketch.bezierVertex(59.59, 54.90)
  
  // c0,-0.02,0,-0.03,0,-0.05 (relative, chained)
  // From (59.59, 54.90) → End (59.59, 54.85)
  sketch.bezierVertex(59.59, 54.88)
  sketch.bezierVertex(59.59, 54.87)
  sketch.bezierVertex(59.59, 54.85)
  
  // c0,-2.5,1.75,-4.61,4.21,-5.07 (relative, chained)
  // From (59.59, 54.85) → End (63.80, 49.78) ≈ start point
  sketch.bezierVertex(59.59, 52.35)
  sketch.bezierVertex(61.34, 50.24)
  sketch.bezierVertex(63.80, 49.78)
  
  // Z - Close path back to starting point
  sketch.endShape() // NOTE: may need to import p5.CLOSE but how to do so with invoking window and causing an error Next.js?
}