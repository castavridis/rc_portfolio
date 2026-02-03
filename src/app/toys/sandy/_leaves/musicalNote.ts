import type p5 from 'p5'
import { BezierShape } from './types';

export const musicalNote_data: BezierShape = {
  origin: [62.26, 0],
  vertices: [
    [62.26, 0, 45.78, 0, 45.78, 0],             // line to (45.78, 0)
    [40.94, 0, 37.02, 3.92, 37.02, 8.76],
    [37.02, 10.59, 35.53, 12.00, 33.75, 12.00],
    [33.61, 12.00, 33.46, 12.00, 33.32, 11.97],
    [32.08, 11.81, 30.82, 11.73, 29.54, 11.73],
    [28.79, 11.73, 28.03, 11.76, 27.27, 11.82],
    [12.66, 12.92, 0.89, 24.91, 0.05, 39.54],
    [-0.93, 56.65, 12.65, 70.82, 29.55, 70.82],
    [46.45, 70.82, 59.10, 57.59, 59.10, 41.27],
    [59.10, 41.26, 59.10, 41.25, 59.10, 41.24],
    [59.10, 39.42, 60.53, 37.92, 62.35, 37.92],
    [69.31, 37.92, 74.96, 32.27, 74.96, 25.31],
    [74.96, 25.31, 74.96, 12.69, 74.96, 12.69], // line to (74.96, 12.69)
    [74.96, 5.68, 69.28, 0, 62.27, 0],
  ],
  color: 'orange',
}

export default function drawMusicalNote (sketch: p5) {
  sketch.beginShape();
  sketch.bezierOrder(3);
  
  // M62.26,0 - Start point
  sketch.vertex(62.26, 0);
  
  // h-16.48 - horizontal line (relative)
  // From (62.26, 0) → (45.78, 0)
  sketch.vertex(45.78, 0);
  
  // c-4.84,0,-8.76,3.92,-8.76,8.76 (cubic, relative)
  // From (45.78, 0)
  sketch.bezierVertex(40.94, 0);       // cp1
  sketch.bezierVertex(37.02, 3.92);    // cp2
  sketch.bezierVertex(37.02, 8.76);    // end
  
  // h0 - no movement, skip
  
  // c0,1.83,-1.49,3.24,-3.27,3.24 (cubic, relative)
  // From (37.02, 8.76)
  sketch.bezierVertex(37.02, 10.59);   // cp1
  sketch.bezierVertex(35.53, 12.00);   // cp2
  sketch.bezierVertex(33.75, 12.00);   // end
  
  // c-.14,0,-.29,0,-.43,-.03 (cubic, relative)
  // From (33.75, 12.00)
  sketch.bezierVertex(33.61, 12.00);   // cp1
  sketch.bezierVertex(33.46, 12.00);   // cp2
  sketch.bezierVertex(33.32, 11.97);   // end
  
  // c-1.24,-.16,-2.50,-.24,-3.78,-.24 (cubic, relative)
  // From (33.32, 11.97)
  sketch.bezierVertex(32.08, 11.81);   // cp1
  sketch.bezierVertex(30.82, 11.73);   // cp2
  sketch.bezierVertex(29.54, 11.73);   // end
  
  // c-.75,0,-1.51,.03,-2.27,.09 (cubic, relative)
  // From (29.54, 11.73)
  sketch.bezierVertex(28.79, 11.73);   // cp1
  sketch.bezierVertex(28.03, 11.76);   // cp2
  sketch.bezierVertex(27.27, 11.82);   // end
  
  // C12.66,12.92,.89,24.91,.05,39.54 (cubic, absolute)
  sketch.bezierVertex(12.66, 12.92);   // cp1
  sketch.bezierVertex(0.89, 24.91);    // cp2
  sketch.bezierVertex(0.05, 39.54);    // end
  
  // c-.98,17.11,12.60,31.28,29.50,31.28 (cubic, relative)
  // From (0.05, 39.54)
  sketch.bezierVertex(-0.93, 56.65);   // cp1
  sketch.bezierVertex(12.65, 70.82);   // cp2
  sketch.bezierVertex(29.55, 70.82);   // end
  
  // s29.55,-13.23,29.55,-29.55 (smooth cubic, relative)
  // Previous cp2 was (12.65, 70.82), reflect from (29.55, 70.82)
  sketch.bezierVertex(46.45, 70.82);   // cp1 (reflected)
  sketch.bezierVertex(59.10, 57.59);   // cp2
  sketch.bezierVertex(59.10, 41.27);   // end
  
  // c0,-.01,0,-.02,0,-.03 (cubic, relative)
  // From (59.10, 41.27)
  sketch.bezierVertex(59.10, 41.26);   // cp1
  sketch.bezierVertex(59.10, 41.25);   // cp2
  sketch.bezierVertex(59.10, 41.24);   // end
  
  // c0,-1.82,1.43,-3.32,3.25,-3.32 (cubic, relative)
  // From (59.10, 41.24)
  sketch.bezierVertex(59.10, 39.42);   // cp1
  sketch.bezierVertex(60.53, 37.92);   // cp2
  sketch.bezierVertex(62.35, 37.92);   // end
  
  // h0 - no movement, skip
  
  // c6.96,0,12.61,-5.65,12.61,-12.61 (cubic, relative)
  // From (62.35, 37.92)
  sketch.bezierVertex(69.31, 37.92);   // cp1
  sketch.bezierVertex(74.96, 32.27);   // cp2
  sketch.bezierVertex(74.96, 25.31);   // end
  
  // v-12.62 - vertical line (relative)
  // From (74.96, 25.31) → (74.96, 12.69)
  sketch.vertex(74.96, 12.69);
  
  // c0,-7.01,-5.68,-12.69,-12.69,-12.69 (cubic, relative)
  // From (74.96, 12.69)
  sketch.bezierVertex(74.96, 5.68);    // cp1
  sketch.bezierVertex(69.28, 0);       // cp2
  sketch.bezierVertex(62.27, 0);       // end
  
  // h0Z - close path
  sketch.endShape();
}