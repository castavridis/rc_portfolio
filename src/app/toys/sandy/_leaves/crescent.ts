import p5 from 'p5'
import { BezierShape } from './types';

export const crescent_data: BezierShape = {
  origin: [43.32, 0],
  vertices: [
    [42.68, 0, 42.05, 0.01, 41.40, 0.04],
    [19.03, 1.01, 0.87, 19.28, 0.03, 41.66],
    [-0.89, 66.34, 18.84, 86.64, 43.32, 86.64],
    [48.94, 86.64, 54.31, 85.57, 59.24, 83.61],
    [63.29, 82.00, 63.35, 76.34, 59.42, 74.46],
    [47.79, 68.92, 39.74, 57.06, 39.74, 43.32],
    [39.74, 29.58, 47.78, 17.72, 59.41, 12.18],
    [63.35, 10.30, 63.28, 4.63, 59.23, 3.03],
    [54.30, 1.08, 48.94, 0.01, 43.32, 0.01],
  ],
  color: 'pink',
}

export default function drawCrescent (sketch: p5) {
  sketch.beginShape();
  sketch.bezierOrder(3);
  
  // M43.32,0 - Start point
  sketch.vertex(43.32, 0);
  
  // c-.64,0,-1.27,.01,-1.92,.04 (cubic, relative)
  // From (43.32, 0)
  sketch.bezierVertex(42.68, 0);       // cp1
  sketch.bezierVertex(42.05, 0.01);    // cp2
  sketch.bezierVertex(41.40, 0.04);    // end
  
  // C19.03,1.01,.87,19.28,.03,41.66 (cubic, absolute)
  sketch.bezierVertex(19.03, 1.01);    // cp1
  sketch.bezierVertex(0.87, 19.28);    // cp2
  sketch.bezierVertex(0.03, 41.66);    // end
  
  // c-.92,24.68,18.81,44.98,43.29,44.98 (cubic, relative)
  // From (0.03, 41.66)
  sketch.bezierVertex(-0.89, 66.34);   // cp1
  sketch.bezierVertex(18.84, 86.64);   // cp2
  sketch.bezierVertex(43.32, 86.64);   // end
  
  // c5.62,0,10.99,-1.07,15.92,-3.03 (cubic, relative)
  // From (43.32, 86.64)
  sketch.bezierVertex(48.94, 86.64);   // cp1
  sketch.bezierVertex(54.31, 85.57);   // cp2
  sketch.bezierVertex(59.24, 83.61);   // end
  
  // c4.05,-1.61,4.11,-7.27,.18,-9.15 (cubic, relative)
  // From (59.24, 83.61)
  sketch.bezierVertex(63.29, 82.00);   // cp1
  sketch.bezierVertex(63.35, 76.34);   // cp2
  sketch.bezierVertex(59.42, 74.46);   // end
  
  // c-11.63,-5.54,-19.68,-17.40,-19.68,-31.14 (cubic, relative)
  // From (59.42, 74.46)
  sketch.bezierVertex(47.79, 68.92);   // cp1
  sketch.bezierVertex(39.74, 57.06);   // cp2
  sketch.bezierVertex(39.74, 43.32);   // end
  
  // s8.04,-25.60,19.67,-31.14 (smooth cubic, relative)
  // Previous cp2 was (39.74, 57.06), reflect from (39.74, 43.32)
  sketch.bezierVertex(39.74, 29.58);   // cp1 (reflected)
  sketch.bezierVertex(47.78, 17.72);   // cp2
  sketch.bezierVertex(59.41, 12.18);   // end
  
  // c3.94,-1.88,3.87,-7.55,-.18,-9.15 (cubic, relative)
  // From (59.41, 12.18)
  sketch.bezierVertex(63.35, 10.30);   // cp1
  sketch.bezierVertex(63.28, 4.63);    // cp2
  sketch.bezierVertex(59.23, 3.03);    // end
  
  // c-4.93,-1.95,-10.29,-3.02,-15.91,-3.02 (cubic, relative)
  // From (59.23, 3.03)
  sketch.bezierVertex(54.30, 1.08);    // cp1
  sketch.bezierVertex(48.94, 0.01);    // cp2
  sketch.bezierVertex(43.32, 0.01);    // end
  
  // h0Z - close path
  sketch.endShape();
}