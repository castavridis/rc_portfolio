import type p5 from 'p5'

export default function drawRectangle (sketch: p5) {
  sketch.beginShape();
  sketch.bezierOrder(3);
  
  // M54.53,0 - Start point
  sketch.vertex(54.53, 0);
  
  // H18.97 - horizontal line to (absolute)
  sketch.vertex(18.97, 0);
  
  // C8.49,0,0,8.49,0,18.97 (cubic, absolute)
  sketch.bezierVertex(8.49, 0);        // cp1
  sketch.bezierVertex(0, 8.49);        // cp2
  sketch.bezierVertex(0, 18.97);       // end
  
  // v35.56 - vertical line (relative)
  // From (0, 18.97) → (0, 54.53)
  sketch.vertex(0, 54.53);
  
  // c0,10.48,8.49,18.97,18.97,18.97 (cubic, relative)
  // From (0, 54.53)
  sketch.bezierVertex(0, 65.01);       // cp1
  sketch.bezierVertex(8.49, 73.50);    // cp2
  sketch.bezierVertex(18.97, 73.50);   // end
  
  // h35.56 - horizontal line (relative)
  // From (18.97, 73.50) → (54.53, 73.50)
  sketch.vertex(54.53, 73.50);
  
  // c10.48,0,18.97,-8.49,18.97,-18.97 (cubic, relative)
  // From (54.53, 73.50)
  sketch.bezierVertex(65.01, 73.50);   // cp1
  sketch.bezierVertex(73.50, 65.01);   // cp2
  sketch.bezierVertex(73.50, 54.53);   // end
  
  // V18.97 - vertical line to (absolute)
  sketch.vertex(73.50, 18.97);
  
  // c0,-10.48,-8.49,-18.97,-18.97,-18.97 (cubic, relative)
  // From (73.50, 18.97)
  sketch.bezierVertex(73.50, 8.49);    // cp1
  sketch.bezierVertex(65.01, 0);       // cp2
  sketch.bezierVertex(54.53, 0);       // end
  
  // h0Z - close path
  sketch.endShape();
}