// ============================================================================
// HOOKS: useInterpreter.js
// ============================================================================

import { useCallback, useState } from 'react';
import runCalder from '../interpreter';

const useInterpreter = () => {
  const [output, setOutput] = useState([]);
  const [ast, setAst] = useState(null);
  
  const run = useCallback((code) => {
    const result = runCalder(code);
    setOutput(result.output);
    setAst(result.ast);
    return result;
  }, []);
  
  const clear = useCallback(() => { setOutput([]); setAst(null); }, []);
  
  return { run, clear, output, ast, hasOutput: output.length > 0 };
};

export default useInterpreter