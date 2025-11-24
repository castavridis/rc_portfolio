import { useFrame } from '@react-three/fiber'
import { RapierCollider, RapierRigidBody, RigidBody, RigidBodyProps } from '@react-three/rapier'
import { useRef } from 'react'

type AnnotatedRigidbodyProps = RigidBodyProps & {
  setColliders: (colliders: RapierCollider[]) => void
}
export default function AnnotatedRigidBody (props: AnnotatedRigidbodyProps): React.ReactNode {
  const bodyRef = useRef<RapierRigidBody>(null)

  useFrame(() => {
    if (bodyRef.current) {
      const colliderMax = bodyRef.current.numColliders()
      const _newColliders: RapierCollider[] = []
      for (let i = 0; i < colliderMax; i++) {
        const collider = bodyRef.current.collider(i)
        collider.setFriction(1)
        collider.setRestitution(0)
        _newColliders.push(collider)
      }
      props.setColliders(_newColliders)
    }
  })

  return (
    <RigidBody
      ref={bodyRef}
      type={props.type}
      colliders={props.colliders}
      position={props.position}
      // linearDamping={0.75}
      // angularDamping={0}
      // friction={1}
    >
      {props.children}
    </RigidBody>
  )
}
