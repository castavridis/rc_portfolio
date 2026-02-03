// Note: An array of six numbers is based on p5.js v1.x's implementation of
// bezier points that took six points; the p5.js v2.x takes two - five arguments
// and only the first two arguments are the x,y coordinates
// the syntax for bezierCurves has changed and requires a bezierOrder(3)

type BezierVertex = [number, number, number, number, number, number]

export type BezierShape = {
  origin: [number, number]
  vertices: BezierVertex[]
  color: string
}