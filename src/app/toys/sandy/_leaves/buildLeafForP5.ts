import p5 from 'p5'
import { BezierShape } from './types';

export function buildLeafForP5 (
  sketch: p5,
  shapeData: BezierShape,
) {
  sketch.beginShape()
  sketch.bezierOrder(3)
  sketch.vertex(...shapeData.origin)
  for (const [_, vertex] of shapeData.vertices) {
    sketch.bezierVertex(vertex[0], vertex[1])
    sketch.bezierVertex(vertex[2], vertex[3])
    sketch.bezierVertex(vertex[4], vertex[5])
  }
  sketch.endShape()
}