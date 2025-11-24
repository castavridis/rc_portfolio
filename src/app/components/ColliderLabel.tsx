import { Html } from '@react-three/drei'
import { RapierCollider, Vector3Object } from '@react-three/rapier'
import { useCallback, useEffect, useRef } from 'react'
import { Vector3Tuple } from 'three'
import useAnnotations from './useAnnotations'

type ColliderLabelProps = {
  name: string,
  collider: RapierCollider,
  position?: Vector3Tuple,
  type?: 'parent' | 'child' | 'default'
}
export default function ColliderLabel ({
  name,
  collider,
  position,
  type = 'default',
}: ColliderLabelProps): React.ReactNode {
  const massRef = useRef("")
  const translationRef = useRef<Vector3Object | null>(null)
  const wComRef = useRef<Vector3Object | null>(null)
  const annotationOpts = useAnnotations()
  useEffect(() => {
    if (collider) {
      massRef.current = collider.mass().toFixed(2)
      translationRef.current = collider.translation()//collider.translation()
      if (collider.parent()) {
        wComRef.current = collider.parent().worldCom()
      }
    }
  }, [collider, collider.translation()])

  const labelContent = useCallback(() => {
    return (
      annotationOpts.showAnnotations
        ?
        <div 
          className="bg-calder-black px-2 py-1.5 text-white rounded-md font-normal text-xs" 
          style={{
            background: 
              (type === 'default') ? 'rgba(255,255,255,0.25)' 
                : (type === 'child') ? 'rgba(249, 168, 37,0.125)'
                : 'rgba(46, 76, 156,0.125)' ,
            border: 
              (type === 'default') ? '1px solid rgba(255,255,255,0.5)' 
                  : (type === 'child') ? '1px solid rgba(249, 168, 37,0.5)'
                  : '1px solid rgba(46, 76, 156,0.5)' ,
            backdropFilter: 'blur(0.5rem)',
            whiteSpace: 'nowrap'
          }}>
            <div className="text-calder-black">
              { name
                  && <span className="font-bold">{name}<br/></span>
              }
              {
                annotationOpts.showMass && massRef.current
                  && <>Mass <span className="font-bold">{massRef.current}</span><br /></>
              }
              {
                annotationOpts.showLocalCom && translationRef.current
                  && <>Translation <span className="font-bold">{`[${translationRef.current.x.toFixed(1)},${translationRef.current.y.toFixed(1)},${translationRef.current.z.toFixed(1)}]`}</span><br/></>
              }
              {
                annotationOpts.showWorldCom && wComRef.current
                  && <>Parent COM <span className="font-bold">{`[${wComRef.current.x.toFixed(1)},${wComRef.current.y.toFixed(1)},${wComRef.current.z.toFixed(1)}]`}</span></>
              }
            </div>
          </div>
        : null
    )
  }, [annotationOpts])

  return (
    <Html position={position}>
      {labelContent()}
    </Html>
  )
}