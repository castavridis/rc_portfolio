import { examples } from '../config/examples';

const CodeEditor = ({ code, onChange, onRun, onExampleSelect }) => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-wrap gap-2">
      <span className="text-slate-500 text-sm font-mono py-1">Examples:</span>
      {Object.keys(examples).map(name => (
        <button key={name} onClick={() => { onChange(examples[name]); onExampleSelect?.(); }}
          className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-mono rounded transition-all">
          {name}
        </button>
      ))}
    </div>
    <textarea value={code} onChange={e => onChange(e.target.value)}
      className="w-full h-64 bg-slate-800 text-green-400 font-mono text-sm p-4 rounded-lg border border-slate-700 focus:border-orange-500 focus:outline-none resize-none"
      spellCheck={false} placeholder="Write your Calder code here..."/>
    <button onClick={onRun}
      className="px-6 py-3 bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-mono font-bold rounded-lg shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      Run
    </button>
  </div>
);

export default CodeEditor