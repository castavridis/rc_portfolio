import { BezierShape } from './types';
import * as THREE from 'three';

/** returns shape data to be put into arguments of <extrudeGeometry /> */
export function buildLeafForThree (
  shapeData: BezierShape,
  scale = 0.0675,
): THREE.Shape {
  const shape = new THREE.Shape()
  const oX = shapeData.origin[0]
  const oY = shapeData.origin[1]
  // shape.moveTo(oX, oY)
  for (const i in shapeData.vertices) {
    const vertex = shapeData.vertices[i]
    shape.bezierCurveTo(
      (vertex[0]-oX) * scale, -(vertex[1]-oY) * scale,
      (vertex[2]-oX) * scale, -(vertex[3]-oY) * scale,
      (vertex[4]-oX) * scale, -(vertex[5]-oY) * scale,
    )
  }
  // shape.moveTo(oX, oY)
  return shape
}