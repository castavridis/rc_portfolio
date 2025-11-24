import * as RAPIER from '@dimforge/rapier3d'
import CodeBlock from '../../../components/CodeBlock';
import Header from '../../../components/Header';
import Subheader from '../../../components/HeaderSubheaderLink';
import SandyTheme from '../../../components/themes/Sandy';

/**
 * RAPIER needs to be loaded into memory, will importing it from the NPM package
 * be enough?
 * 
 * How will React-based meshes be associated with the Rigid Bodies and colliders
 * in 'vanilla' Rapier and @react-three/fiber?
 * 
 * The physics engine needs to give the rendering engine information about what
 * is being drawn. @react-three/rapier uses the JS compatible version of rapier,
 * `rapier3d-compat`
 * 
 * Instead of starting from scratch, consider augmenting the existing
 * @react-three/rapier library and submit a PR
 * @returns 
 */

/**
 * Of note: @react-three/rapier has a utility hook, useConst, that creates
 * a ref of the object passed to it, and returns ref.current 
 */
function MobilePhysics (): React.ReactNode {
  let world = new RAPIER.World({
    x: 0.0,
    y: -9.81, // earth's gravity
    z: 0.0
  })

  return (
    <div></div>
  )
}

export default function MobileTestsPageV3 (): React.ReactNode {
  return (
    <SandyTheme>
      <Header
        subHeading={ <Subheader href="/toys/sandy/" label="Sandy" /> }
        heading="Mobile Tests" />
      <p className="font-normal text-2xl">The last test attached <CodeBlock str="<MeshColliders />" /> to <CodeBlock str="<RigidBody colliders={false} />" />. The use case for Rapier that I'm aiming for may be too unique for what comes out of the box of React Three Rapier. I wonder how I might combine "vanilla" Rapier 3D with React.</p>
    </SandyTheme>
  )
}