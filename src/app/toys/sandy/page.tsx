"use client"
import dynamic from 'next/dynamic'

import type p5 from 'p5'
const P5Sketch = dynamic(() => import('../../components/P5Sketch'), {
  ssr: false,
}) 
import SandyTheme from '../../components/themes/Sandy'
import drawMetaball from './_leaves/metaball'
import drawTriangle from './_leaves/triangle'
import drawHeart from './_leaves/heart'
import drawPuzzlePiece from './_leaves/puzzlePiece'
import drawRectangle from './_leaves/rectangle'
import drawMusicalNote from './_leaves/musicalNote'
import drawTeardrop from './_leaves/teardrop'
import drawCrescent from './_leaves/crescent'

const sFn = (s: p5) => {
  s.draw = () => {
    s.fill('red')
    s.noStroke()
    // drawMetaball(s)
    // drawTriangle(s)
    // drawHeart(s)
    // drawPuzzlePiece(s)
    // drawRectangle(s)
    // drawMusicalNote(s)
    // drawTeardrop(s)
    drawCrescent(s)
  }
}

export default function SandyPage(): React.ReactNode {
  return (
    <SandyTheme>
      {/* Custom Header/Hero */}
      <div className="absolute left-0 right-0 bg-white h-[60vh]">
        <P5Sketch
          className="absolute top-0 left-0 right-0 bottom-0"
          sketchFn={sFn}
        />
        <div className="relative h-full z-10 p-8 flex flex-col" style={     {justifyContent: 'center'}
        }>
          <h1 className="text-9xl font-light">Sandy</h1>
          <p className="text-3xl mt-4">
            A visualizer for Dave Long's commutative esolang, <a href="https://github.com/demaere-oiie/calder/tree/main/src">Calder</a>.
          </p>
        </div>
      </div>
    </SandyTheme>
  )
}