import { MeshCollider, MeshColliderProps, RigidBodyAutoCollider } from '@react-three/rapier'

type AnnotatedMeshColliderProps = {
  type: RigidBodyAutoCollider
  children: React.ReactNode
  annotationLabel?: React.ReactNode
} & Partial<MeshColliderProps>
export default function AnnotatedMeshCollider (props: AnnotatedMeshColliderProps): React.ReactNode {
  return (
    <MeshCollider type={props.type}>
      {props.children}
      {props.annotationLabel}
      {/* <axesHelper args={[5]} /> */}
    </MeshCollider>
  )
}