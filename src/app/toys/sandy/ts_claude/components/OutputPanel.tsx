const OutputPanel = ({ output }) => {
  if (!output?.length) return null;
  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <div className="text-slate-500 text-xs mb-2 font-mono">Output:</div>
      <pre className="text-cyan-400 font-mono text-sm whitespace-pre-wrap">{output.join('\n')}</pre>
    </div>
  );
};

export default OutputPanel
