// for any given number of sub nodes (n)
// we'll want to multiply them
// we'll place them at an angle of 2PI / n (and add a random phase = how much they are all rotated)

// e.g.
// a = phase of pi
// b = phase of pi/4

// y = depth in the tree
// x = cos(angle) * radius
// z = sin(angle) * radius

// radius should shrink as we go down in the tree

// calculate from the bottom up, so from the leaves
// so radius will grow as we go up in the tree

// go down tree and add y's
// recurse for the children
// return from recursion to look at children's radii to get parent's radii

// length to determine angles

const SCALE_FACTOR = 2;
const RADIUS_SCALE_FACTOR = 1.5;

class Leaf {
  x: number
  y: number
  z: number
  radius: number
  label: string
  flipLabel: string
  children: Array<Leaf>

  constructor () {
    this.children = []
  }

  calcRadius (data) {
    let max_radius = 1
    if (data.subs?.length > 1) {
      for (let i = 0; i < data.subs.length; i++) {
        const subLeaf = new Leaf()
        max_radius = Math.max(
          max_radius,
          subLeaf.calcRadius(data.subs[i])
        )
        this.children.push(subLeaf)
      }
    } else if (data.colon) {
      const iLeaf = new Leaf()
      const dLeaf = new Leaf()
      max_radius = Math.max(
        iLeaf.calcRadius(data.i),
        dLeaf.calcRadius(data.d)
      )
      this.children.push(iLeaf, dLeaf)
    } else {
      // In the leaf, already constructed
      max_radius = 0
    }
    this.radius = RADIUS_SCALE_FACTOR * max_radius
    return this.radius
  }
  calcArms (data, angle, depth, parentRadius) {
    if (data.subs?.length > 1) {
      let angle = 2 * Math.PI / data.subs.length
      for (let i = 0; i < data.subs.length; i++) {
        this.calcArms(data.subs[i], angle * i, depth+1, parentRadius / RADIUS_SCALE_FACTOR)
      }
    } else if (data.colon) {
      this.calcArms(data.i, 0, depth+1, parentRadius / RADIUS_SCALE_FACTOR)
      this.calcArms(data.d, Math.PI, depth+1, parentRadius / RADIUS_SCALE_FACTOR)
    } else {
      parentRadius = 0
      this.label = data.node
      this.flipLabel = data.flip ? data.flip : this.label
    }
    this.x = Math.sin(angle) * parentRadius
    this.z = Math.cos(angle) * parentRadius
    this.y = depth * SCALE_FACTOR
  }
}

const data = {"node":"val...lav","subs":[{"node":"of fac(7)"},{"colon":1,"i":{"node":"fac(n)"},"d":{"node":"if...fi","subs":[{"node":"match n"},{"node":"0 -> 1","flip":"1 <- 0"},{"node":"m+1 -> n*fac(m)","flip":"n*fac(m) <- m+1"}]}}]}

const leaf = new Leaf();
leaf.calcRadius(data);
console.log('\nCalc Radius', JSON.stringify(leaf))
leaf.calcArms(data, 0, 0, 0)
console.log('\nCalc Arms', JSON.stringify(leaf))