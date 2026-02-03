// ============================================================================
// COMPONENTS: MobileRenderer.jsx
// ============================================================================

import { getNodeColor } from '../config/colors';

const truncate = (str, len) => (!str ? '' : str.length > len ? str.slice(0, len - 1) + '…' : str);

const MobileNode = ({ node, x, y, width, path, orders, flips }) => {
  if (!node) return null;
  
  const isFlipped = flips[path] || false;
  const order = orders[path] || node.children?.map((_, i) => i) || [];
  const color = getNodeColor(node.type);
  
  // Block with children
  if ((node.type === 'vallav' || node.type === 'iffi') && node.children?.length > 0) {
    const childCount = node.children.length;
    const childWidth = Math.min(120, (width - 40) / childCount);
    const totalW = childWidth * childCount;
    const startX = x - totalW / 2 + childWidth / 2;
    
    return (
      <g>
        <line x1={x - totalW/2 - 20} y1={y} x2={x + totalW/2 + 20} y2={y} stroke={color} strokeWidth="3"/>
        <circle cx={x} cy={y} r="4" fill={color}/>
        <text x={x} y={y - 10} textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">{node.label}</text>
        {order.map((ci, pi) => {
          const child = node.children[ci];
          if (!child) return null;
          const cx = startX + pi * childWidth;
          const cp = `${path}.${ci}`;
          return (
            <g key={cp}>
              <line x1={cx} y1={y} x2={cx} y2={y + 30} stroke={color} strokeWidth="1.5"/>
              <MobileNode node={child} x={cx} y={y + 40} width={childWidth * 0.9} path={cp} orders={orders} flips={flips}/>
            </g>
          );
        })}
      </g>
    );
  }
  
  // When clause
  if (node.type === 'when') {
    const arrow = isFlipped ? '←' : '→';
    const leftLabel = isFlipped ? truncate(node.result, 10) : truncate(node.pattern, 10);
    const rightLabel = isFlipped ? truncate(node.pattern, 10) : truncate(node.result, 10);
    return (
      <g>
        <line x1={x - 35} y1={y} x2={x + 35} y2={y} stroke={color} strokeWidth="2"/>
        <circle cx={x} cy={y} r="3" fill={color}/>
        <text x={x} y={y - 6} textAnchor="middle" fill={color} fontSize="9" fontFamily="monospace">{arrow}</text>
        <line x1={x - 25} y1={y} x2={x - 25} y2={y + 20} stroke={color} strokeWidth="1.5"/>
        <g transform={`translate(${x - 25}, ${y + 35})`}>
          <ellipse cx="0" cy="0" rx="30" ry="14" fill={color} opacity="0.9"/>
          <text x="0" y="4" textAnchor="middle" fill="white" fontSize="7" fontFamily="monospace">{leftLabel}</text>
        </g>
        <line x1={x + 25} y1={y} x2={x + 25} y2={y + 20} stroke={color} strokeWidth="1.5"/>
        <g transform={`translate(${x + 25}, ${y + 35})`}>
          <ellipse cx="0" cy="0" rx="30" ry="14" fill={color} opacity="0.9"/>
          <text x="0" y="4" textAnchor="middle" fill="white" fontSize="7" fontFamily="monospace">{rightLabel}</text>
        </g>
      </g>
    );
  }
  
  // Binding with nested
  if (node.type === 'binding' && node.children?.length > 0) {
    return (
      <g>
        <g transform={`translate(${x}, ${y})`}>
          <rect x="-50" y="-12" width="100" height="24" rx="4" fill={color} opacity="0.9"/>
          <text x="0" y="4" textAnchor="middle" fill="white" fontSize="8" fontFamily="monospace">{truncate(node.name, 12)}</text>
        </g>
        <line x1={x} y1={y + 12} x2={x} y2={y + 35} stroke={color} strokeWidth="1.5"/>
        <MobileNode node={node.children[0]} x={x} y={y + 50} width={width} path={`${path}.nested`} orders={orders} flips={flips}/>
      </g>
    );
  }
  
  // Simple leaf
  const label = (node.flippable && isFlipped && node.labelFlipped) ? node.labelFlipped : node.label;
  const isEllipse = ['of', 'match', 'echo', 'assert'].includes(node.type);
  return (
    <g transform={`translate(${x}, ${y})`}>
      {isEllipse 
        ? <ellipse cx="0" cy="0" rx="45" ry="18" fill={color} opacity="0.9"/>
        : <rect x="-45" y="-14" width="90" height="28" rx="4" fill={color} opacity="0.9"/>}
      <text x="0" y="4" textAnchor="middle" fill="white" fontSize="8" fontFamily="monospace">{truncate(label, 14)}</text>
    </g>
  );
};

const MobileRenderer = ({ structure, orders, flips, shakeCount, totalPerms }) => {
  if (!structure) return null;
  return (
    <svg viewBox="0 0 500 300" className="w-full h-64 bg-slate-900 rounded">
      <circle cx="250" cy="20" r="4" fill="#f97316"/>
      <line x1="250" y1="20" x2="250" y2="50" stroke="#f97316" strokeWidth="2"/>
      <MobileNode node={structure} x={250} y={60} width={400} path="root" orders={orders} flips={flips}/>
      <text x="250" y="290" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">
        Shake #{shakeCount} • {totalPerms.toLocaleString()} permutations
      </text>
    </svg>
  );
};

export default MobileRenderer