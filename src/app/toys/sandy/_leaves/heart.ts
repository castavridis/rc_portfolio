import type p5 from 'p5'

export default function drawHeart (sketch: p5) {
  sketch.beginShape();
  sketch.bezierOrder(3);
  
  // M24.71,63.97 - Start point
  sketch.vertex(24.71, 63.97);
  
  // s35.3,-3.42,44.15,-13.43 (smooth cubic, relative)
  // No previous curve, so cp1 = current point
  // From (24.71, 63.97)
  sketch.bezierVertex(24.71, 63.97);   // cp1 (reflection, but no prior curve = same point)
  sketch.bezierVertex(60.01, 60.55);   // cp2: (24.71+35.3, 63.97-3.42)
  sketch.bezierVertex(68.86, 50.54);   // end: (24.71+44.15, 63.97-13.43)
  
  // c8.84,-10.02,7.89,-25.3,-2.13,-34.14 (cubic, relative)
  // From (68.86, 50.54)
  sketch.bezierVertex(77.70, 40.52);   // cp1: (68.86+8.84, 50.54-10.02)
  sketch.bezierVertex(76.75, 25.24);   // cp2: (68.86+7.89, 50.54-25.3)
  sketch.bezierVertex(66.73, 16.40);   // end: (68.86-2.13, 50.54-34.14)
  
  // c-6.24,-5.51,-14.53,-7.21,-22.03,-5.29 (cubic, relative)
  // From (66.73, 16.40)
  sketch.bezierVertex(60.49, 10.89);   // cp1: (66.73-6.24, 16.40-5.51)
  sketch.bezierVertex(52.20, 9.19);    // cp2: (66.73-14.53, 16.40-7.21)
  sketch.bezierVertex(44.70, 11.11);   // end: (66.73-22.03, 16.40-5.29)
  
  // C40.35,4.7,33.01,0.5,24.69,0.5 (cubic, absolute)
  sketch.bezierVertex(40.35, 4.70);    // cp1
  sketch.bezierVertex(33.01, 0.50);    // cp2
  sketch.bezierVertex(24.69, 0.50);    // end
  
  // C11.33,0.5,0.5,11.33,0.5,24.69 (cubic, absolute - chained)
  sketch.bezierVertex(11.33, 0.50);    // cp1
  sketch.bezierVertex(0.50, 11.33);    // cp2
  sketch.bezierVertex(0.50, 24.69);    // end
  
  // s24.21,39.28,24.21,39.28 (smooth cubic, relative)
  // Previous cp2 was (0.5, 11.33), reflect from current (0.5, 24.69)
  // Reflection: (2*0.5 - 0.5, 2*24.69 - 11.33) = (0.5, 38.05)
  sketch.bezierVertex(0.50, 38.05);    // cp1 (reflected)
  sketch.bezierVertex(24.71, 63.97);   // cp2: (0.5+24.21, 24.69+39.28)
  sketch.bezierVertex(24.71, 63.97);   // end: (0.5+24.21, 24.69+39.28)
  
  // No Z in original, but path returns to start
  sketch.endShape();
}