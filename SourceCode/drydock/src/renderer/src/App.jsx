import { useState, useEffect } from 'react' // Import hooks
import Split from 'react-split'
import Editor from '@monaco-editor/react'
import XTermComponent from './components/Terminal' // Import your new terminal
import './assets/main.css'

function App() {

  // --- STATE VARIABLES ---
  const [inputData, setInputData] = useState("")
  const [userScript, setUserScript] = useState("")
  const [outputData, setOutputData] = useState("")
  const [fileName, setFileName] = useState("")
  
  //Set up for the States.
  const [isRunning, setIsRunning] = useState(false)

  var FILE = null

  // --- FILE OPERATIONS ---
  const handleOpen = async () => {
    if (window.electron) {
      FILE = await window.electron.openFile()
      if (FILE) {
        setUserScript(FILE.content)
        setFileName(FILE.name)
      }
    }
  }

  const handleSave = async () => {
    if (!window.electron) return

    if (FILE) {
      const newPath = await window.electron.saveAs(userScript)
      if (newPath) setFileName(newPath)
    } else {
      await window.electron.saveDirect(fileName, userScript)
    }
  }

const runPython = async () => {
    setIsRunning(true)
    if (window.electron) {
        window.electron.startPython({ 
            code: userScript, 
            data: inputData, 
            filePath: fileName
        })
    }
    setTimeout(() => setIsRunning(false), 3000)
  }

  // --- THEME ---
  function handleEditorWillMount(monaco) {
    monaco.editor.defineTheme('drydock-pro', { base: 'vs-dark', inherit: true, rules: [], colors: { 'editor.background': '#1e1e1e' }});
  }


  // React Output.
  return (
    <div style={{height:'100vh', display:'flex', flexDirection:'column', background:'#1e1e1e'}}>
      
      {/* TOOLBAR */}
      <div style={{height:'40px', background:'#252526', display:'flex', alignItems:'center', padding:'0 10px', borderBottom:'1px solid #333'}}>
        <div style={{color:'#7fb4cc', fontWeight:'bold', marginRight:'20px'}}>DRYDOCK</div>  
        <button onClick={handleOpen} className="btn-tool">Open</button>
          <button onClick={handleSave} className="btn-tool">Save</button>
          <div style={{flex:1, textAlign:'center', color:'#888', fontSize:'12px'}}>{fileName}</div>
          <button onClick={runPython} className={isRunning ? "btn-tool-running btn-tool" : "btn-tool-run btn-tool"}>
            {isRunning ? 'Running...' : 'Run Script'}
          </button> 
      </div>

      {/* MAIN LAYOUT */}
      <Split className="split-horizontal" sizes={[20, 60, 20]} minSize={100} gutterSize={8} style={{flex:1, display:'flex'}}>
        
        {/* LEFT: INPUT */}
        <div className="pane" onDrop={async (e) => { e.preventDefault(); setInputData(await e.dataTransfer.files[0].text()) }} onDragOver={e=>e.preventDefault()}>
          <div className="header">INPUT DATA</div>
          <Editor height="100%" defaultLanguage="json" theme="drydock-pro" value={inputData} beforeMount={handleEditorWillMount} options={{minimap:{enabled:false}, fontSize:12}} />
        </div>

        {/* CENTER: CODE + TERMINAL */}
        <div className="pane-wrapper">
          <Split className="split-vertical" sizes={[70, 30]} minSize={60} gutterSize={8} direction="vertical">
            <div className="pane">
              <Editor height="100%" defaultLanguage="python" theme="drydock-pro" value={userScript} onChange={v => setUserScript(v||"")} beforeMount={handleEditorWillMount} options={{minimap:{enabled:false}, fontSize:14}}/>
            </div>
            
            {/* TERMINAL PANE */}
            <div className="pane terminal-pane" style={{overflow: 'hidden', padding: '5px', background: '#1e1e1e'}}>
               {/* Pass isRunning to the component if needed, or just mount it */}
               <XTermComponent /> 
            </div>
          </Split>
        </div>

        {/* RIGHT: OUTPUT */}
        <div className="pane">
          <div className="header">RETURN</div>
          <Editor height="100%" defaultLanguage="json" theme="drydock-pro" value={outputData} beforeMount={handleEditorWillMount} options={{readOnly:true, minimap:{enabled:false}, fontSize:12}} />
        </div>
      </Split>
    </div>
  )
}
export default App