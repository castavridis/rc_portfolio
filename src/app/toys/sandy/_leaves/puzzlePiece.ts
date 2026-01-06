import type p5 from 'p5'

export default function drawPuzzlePiece (sketch: p5) {
  sketch.beginShape();
  sketch.bezierOrder(3);
  
  // M54.46,0 - Start point
  sketch.vertex(54.46, 0);
  
  // h-17.19 - horizontal line (relative)
  // From (54.46, 0) → (37.27, 0)
  sketch.vertex(37.27, 0);
  
  // c-5.72,0,-10.36,4.64,-10.36,10.36 (cubic, relative)
  // From (37.27, 0)
  sketch.bezierVertex(31.55, 0);       // cp1
  sketch.bezierVertex(26.91, 4.64);    // cp2
  sketch.bezierVertex(26.91, 10.36);   // end
  
  // v.15 - vertical line (relative)
  // From (26.91, 10.36) → (26.91, 10.51)
  sketch.vertex(26.91, 10.51);
  
  // c0,4.66,-3.78,8.45,-8.45,8.45 (cubic, relative)
  // From (26.91, 10.51)
  sketch.bezierVertex(26.91, 15.17);   // cp1
  sketch.bezierVertex(23.13, 18.96);   // cp2
  sketch.bezierVertex(18.46, 18.96);   // end
  
  // h-8.1 - horizontal line (relative)
  // From (18.46, 18.96) → (10.36, 18.96)
  sketch.vertex(10.36, 18.96);
  
  // c-5.72,0,-10.36,4.64,-10.36,10.36 (cubic, relative)
  // From (10.36, 18.96)
  sketch.bezierVertex(4.64, 18.96);    // cp1
  sketch.bezierVertex(0, 23.60);       // cp2
  sketch.bezierVertex(0, 29.32);       // end
  
  // v25.14 - vertical line (relative)
  // From (0, 29.32) → (0, 54.46)
  sketch.vertex(0, 54.46);
  
  // c0,5.72,4.64,10.36,10.36,10.36 (cubic, relative)
  // From (0, 54.46)
  sketch.bezierVertex(0, 60.18);       // cp1
  sketch.bezierVertex(4.64, 64.82);    // cp2
  sketch.bezierVertex(10.36, 64.82);   // end
  
  // h25.14 - horizontal line (relative)
  // From (10.36, 64.82) → (35.50, 64.82)
  sketch.vertex(35.50, 64.82);
  
  // c5.72,0,10.36,-4.64,10.36,-10.36 (cubic, relative)
  // From (35.50, 64.82)
  sketch.bezierVertex(41.22, 64.82);   // cp1
  sketch.bezierVertex(45.86, 60.18);   // cp2
  sketch.bezierVertex(45.86, 54.46);   // end
  
  // v-8.1 - vertical line (relative)
  // From (45.86, 54.46) → (45.86, 46.36)
  sketch.vertex(45.86, 46.36);
  
  // c0,-4.66,3.78,-8.45,8.45,-8.45 (cubic, relative)
  // From (45.86, 46.36)
  sketch.bezierVertex(45.86, 41.70);   // cp1
  sketch.bezierVertex(49.64, 37.91);   // cp2
  sketch.bezierVertex(54.31, 37.91);   // end
  
  // h.15 - horizontal line (relative)
  // From (54.31, 37.91) → (54.46, 37.91)
  sketch.vertex(54.46, 37.91);
  
  // c5.72,0,10.36,-4.64,10.36,-10.36 (cubic, relative)
  // From (54.46, 37.91)
  sketch.bezierVertex(60.18, 37.91);   // cp1
  sketch.bezierVertex(64.82, 33.27);   // cp2
  sketch.bezierVertex(64.82, 27.55);   // end
  
  // V10.36 - vertical line to (absolute)
  sketch.vertex(64.82, 10.36);
  
  // c0,-5.72,-4.64,-10.36,-10.36,-10.36 (cubic, relative)
  // From (64.82, 10.36)
  sketch.bezierVertex(64.82, 4.64);    // cp1
  sketch.bezierVertex(60.18, 0);       // cp2
  sketch.bezierVertex(54.46, 0);       // end
  
  // h0Z - close path
  sketch.endShape();
}