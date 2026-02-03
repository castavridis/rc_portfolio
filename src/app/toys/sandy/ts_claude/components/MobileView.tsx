import MobileRenderer from './MobileRenderer';

const MobileView = ({ mobile }) => {
  if (!mobile.hasMobile) return null;
  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <div className="flex justify-between items-center mb-2">
        <div className="text-slate-500 text-xs font-mono">Mobile Visualization</div>
        <button onClick={mobile.shake}
          className="px-3 py-1 bg-orange-500 hover:bg-orange-400 text-white text-xs font-mono rounded transition-all flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Shake
        </button>
      </div>
      <MobileRenderer structure={mobile.structure} orders={mobile.orders} flips={mobile.flips} shakeCount={mobile.shakeCount} totalPerms={mobile.permutations.total}/>
    </div>
  );
};

export default MobileView