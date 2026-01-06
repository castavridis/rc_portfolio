import p5 from 'p5'

export default function drawTeardrop (sketch: p5) {
  sketch.beginShape();
  sketch.bezierOrder(3);
  
  // M33.72,0 - Start point
  sketch.vertex(33.72, 0);
  
  // c-3.53,0,-7.06,1.63,-9.32,4.88 (cubic, relative)
  // From (33.72, 0)
  sketch.bezierVertex(30.19, 0);       // cp1
  sketch.bezierVertex(26.66, 1.63);    // cp2
  sketch.bezierVertex(24.40, 4.88);    // end
  
  // C14.42,19.26,0,42.15,0,54.32 (cubic, absolute)
  sketch.bezierVertex(14.42, 19.26);   // cp1
  sketch.bezierVertex(0, 42.15);       // cp2
  sketch.bezierVertex(0, 54.32);       // end
  
  // c0,18.62,15.10,33.72,33.72,33.72 (cubic, relative)
  // From (0, 54.32)
  sketch.bezierVertex(0, 72.94);       // cp1
  sketch.bezierVertex(15.10, 88.04);   // cp2
  sketch.bezierVertex(33.72, 88.04);   // end
  
  // s33.72,-15.10,33.72,-33.72 (smooth cubic, relative)
  // Previous cp2 was (15.10, 88.04), reflect from (33.72, 88.04)
  sketch.bezierVertex(52.34, 88.04);   // cp1 (reflected)
  sketch.bezierVertex(67.44, 72.94);   // cp2
  sketch.bezierVertex(67.44, 54.32);   // end
  
  // c0,-12.18,-14.42,-35.07,-24.40,-49.45 (cubic, relative)
  // From (67.44, 54.32)
  sketch.bezierVertex(67.44, 42.14);   // cp1
  sketch.bezierVertex(53.02, 19.25);   // cp2
  sketch.bezierVertex(43.04, 4.87);    // end
  
  // c-2.26,-3.25,-5.79,-4.88,-9.32,-4.88 (cubic, relative)
  // From (43.04, 4.87)
  sketch.bezierVertex(40.78, 1.62);    // cp1
  sketch.bezierVertex(37.25, -0.01);   // cp2
  sketch.bezierVertex(33.72, -0.01);   // end
  
  // h0Z - close path
  sketch.endShape();
}