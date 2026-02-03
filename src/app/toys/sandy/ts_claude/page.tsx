'use client'

import { useState } from 'react';
import useInterpreter from './hooks/useInterpreter';
import useMobile from './hooks/useMobile';
import CodeEditor from './components/CodeEditor';
import OutputPanel from './components/OutputPanel';
import MobileView from './components/MobileView';
import SyntaxRef from './components/SyntaxRef';
import { examples } from './config/examples';

export default function CalderMobile() {
  const [code, setCode] = useState(examples.factorial);
  const interpreter = useInterpreter();
  const mobile = useMobile(interpreter.ast);
  
  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-slate-900 min-h-screen">
      <h1 className="text-xl font-mono text-orange-500">Calder Mobile</h1>
      
      <div className="w-full max-w-3xl flex flex-col gap-4">
        <CodeEditor 
          code={code} 
          onChange={setCode} 
          onRun={() => interpreter.run(code)} 
          onExampleSelect={interpreter.clear}
        />
        <OutputPanel output={interpreter.output}/>
        <MobileView mobile={mobile}/>
        <SyntaxRef/>
      </div>
    </div>
  );
}