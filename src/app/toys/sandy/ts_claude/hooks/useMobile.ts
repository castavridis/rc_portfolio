// ============================================================================
// HOOKS: useMobile.js
// ============================================================================

import { useCallback, useEffect, useMemo, useState } from 'react';
import { analyzeAST } from '../mobile/analysis';
import { calculatePermutations, initMobileState, randomizeMobileState } from '../mobile/permutations';

const useMobile = (ast) => {
  const [orders, setOrders] = useState({});
  const [flips, setFlips] = useState({});
  const [shakeCount, setShakeCount] = useState(0);
  
  const structure = useMemo(() => ast ? analyzeAST(ast) : null, [ast]);
  const permutations = useMemo(() => structure ? calculatePermutations(structure) : { orderings: 0, flips: 0, total: 0 }, [structure]);
  
  useEffect(() => {
    if (structure) {
      const { orders: o, flips: f } = initMobileState(structure);
      setOrders(o); setFlips(f); setShakeCount(1);
    } else {
      setOrders({}); setFlips({}); setShakeCount(0);
    }
  }, [structure]);
  
  const shake = useCallback(() => {
    const { orders: o, flips: f } = randomizeMobileState(orders, flips);
    setOrders(o); setFlips(f); setShakeCount(c => c + 1);
  }, [orders, flips]);
  
  return { structure, orders, flips, permutations, shakeCount, shake, hasMobile: !!structure };
};

export default useMobile
