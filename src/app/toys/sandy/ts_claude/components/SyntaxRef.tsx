const SyntaxRef = () => {
  const items = [
    ['val...lav', 'define bindings'], ['if...fi', 'pattern match'],
    ['of expr', 'return value'], ['match expr', 'match subject'],
    ['name: expr', 'binding'], ['pat → expr', 'clause'],
    ['f(x): expr', 'function'], ['m+1', 'successor pattern'],
    ['_', 'wildcard'], ['!', 'statement separator'],
  ];
  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <div className="text-slate-500 text-xs mb-2 font-mono">Quick Reference:</div>
      <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-400">
        {items.map(([syn, desc]) => <div key={syn}><span className="text-orange-400">{syn}</span> — {desc}</div>)}
      </div>
    </div>
  );
};

export default SyntaxRef
