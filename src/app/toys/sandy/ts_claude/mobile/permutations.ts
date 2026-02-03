// ============================================================================
// MOBILE: permutations.js
// ============================================================================

const factorial = (n) => { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; };

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const calculatePermutations = (node) => {
  if (!node) return { orderings: 1, flips: 1, total: 1 };
  let orderings = 1, flips = 1;
  if (node.reorderable && node.children?.length > 1) orderings *= factorial(node.children.length);
  if (node.flippable) flips *= 2;
  if (node.children) for (const c of node.children) { const p = calculatePermutations(c); orderings *= p.orderings; flips *= p.flips; }
  return { orderings, flips, total: orderings * flips };
};

export const initMobileState = (structure) => {
  const orders = {}, flips = {};
  const walk = (node, path = 'root') => {
    if (!node) return;
    if (node.reorderable && node.children) orders[path] = node.children.map((_, i) => i);
    if (node.flippable) flips[path] = false;
    if (node.children) node.children.forEach((c, i) => walk(c, `${path}.${i}`));
  };
  walk(structure);
  return { orders, flips };
};

export const randomizeMobileState = (orders, flips) => {
  const newOrders = {}, newFlips = {};
  for (const k in orders) newOrders[k] = shuffle([...orders[k]]);
  for (const k in flips) newFlips[k] = Math.random() > 0.5;
  return { orders: newOrders, flips: newFlips };
};
