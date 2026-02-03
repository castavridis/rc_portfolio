// ============================================================================
// CONFIG: colors.js
// ============================================================================

const nodeColors = {
  vallav: '#f97316',
  iffi: '#f97316',
  of: '#0ea5e9',
  match: '#22c55e',
  when: '#ec4899',
  binding: '#8b5cf6',
  echo: '#06b6d4',
  assert: '#eab308',
  default: '#64748b',
};

export const getNodeColor = (type) => nodeColors[type] || nodeColors.default;