# ----------------------------------------------------------------
# DRYDOCK SETUP SCRIPT (Final Version)
# Includes: Electron, React, Vite, Python Bridge, and VS Code Debugging
# ----------------------------------------------------------------

# Stop on first error
$ErrorActionPreference = "Stop"

# 1. ADJUST LOCATION
$parentPath = Split-Path -Parent $PSScriptRoot
Set-Location $parentPath
Write-Host ">>> Working in: $parentPath" -ForegroundColor Cyan

# 2. CLEANUP
if (Test-Path "drydock") {
    Write-Host "Removing old 'drydock' folder..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "drydock"
}

# 3. SCAFFOLDING
Write-Host "Creating new project..." -ForegroundColor Cyan
npm create @quick-start/electron drydock -- --template react-ts --no-addons

# 4. INSTALLATION
Set-Location "drydock"
Write-Host "Installing Dependencies..." -ForegroundColor Cyan
npm install
npm install react-split @monaco-editor/react

# 5. CONFIGURE BACKEND (main.ts)
Write-Host "Configuring Backend..." -ForegroundColor Cyan
$mainContent = @"
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from 'fs'
import os from 'os'
import { exec } from 'child_process'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1200, height: 800, show: false, autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => mainWindow.show())
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

ipcMain.handle('run-python', async (_event, { code, data }) => {
  return new Promise((resolve) => {
    const tempDir = os.tmpdir()
    const inputPath = join(tempDir, 'drydock_input.txt')
    const scriptPath = join(tempDir, 'drydock_script.py')
    
    fs.writeFileSync(inputPath, data || "")
    
    const wrapper = \`
import sys
sys.stdout.reconfigure(encoding='utf-8')
try:
    with open(r"\${inputPath.replace(/\\/g, '/')}", "r", encoding="utf-8") as f:
        input_data = f.read()
except:
    input_data = ""
\${code}
\`
    fs.writeFileSync(scriptPath, wrapper)
    
    exec(\`python "\${scriptPath}"\`, (error, stdout, stderr) => {
      resolve({ success: !error, output: stdout || stderr || error?.message })
    })
  })
})

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')
  app.on('browser-window-created', (_, window) => optimizer.watchWindowShortcuts(window))
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
"@
Set-Content -Path "src/main/index.ts" -Value $mainContent

# 6. CONFIGURE BRIDGE (preload.ts)
Write-Host "Configuring Bridge..." -ForegroundColor Cyan
$preloadContent = @"
import { contextBridge, ipcRenderer } from 'electron'

const api = {
  runPython: (args) => ipcRenderer.invoke('run-python', args)
}

if (process.contextIsolated) {
  try { contextBridge.exposeInMainWorld('electron', api) } catch (error) { console.error(error) }
} else {
  window.electron = api
}
"@
Set-Content -Path "src/preload/index.ts" -Value $preloadContent

# 7. CONFIGURE FRONTEND (App.tsx)
Write-Host "Configuring Frontend..." -ForegroundColor Cyan
$appContent = @"
import { useState } from 'react'
import Split from 'react-split'
import Editor from '@monaco-editor/react'
import './assets/main.css'

function App(): JSX.Element {
  const [input, setInput] = useState('// Drag file here')
  const [script, setScript] = useState(\`print('--- SYSTEM PYTHON ---')\\nprint(f'Input length: {len(input_data)}')\`)
  const [log, setLog] = useState('Ready.')
  const [running, setRunning] = useState(false)
  
  const run = async () => {
    setRunning(true)
    setLog('Running...')
    try {
        const res = await (window as any).electron.runPython({ code: script, data: input })
        setLog(res.output)
    } catch (e) {
        setLog('Error: Bridge not connected.')
    }
    setRunning(false)
  }

  return (
    <Split sizes={[30,50,20]} style={{display:'flex', height:'100vh', background:'#1e1e1e', overflow:'hidden'}}>
      <div onDrop={async (e)=>{e.preventDefault(); setInput(await e.dataTransfer.files[0].text())}} onDragOver={e=>e.preventDefault()}>
        <Editor height='100%' theme='vs-dark' value={input} options={{readOnly:true, minimap:{enabled:false}}}/>
      </div>
      <div style={{display:'flex', flexDirection:'column'}}>
        <div style={{background:'#252526', padding:'5px', textAlign:'right'}}>
           <button onClick={run} disabled={running} style={{background: running ? '#444' : 'green', color:'white', border:'none', padding:'5px 15px', cursor:'pointer'}}>
             {running ? 'RUNNING...' : 'RUN ▶'}
           </button>
        </div>
        <Editor height='100%' theme='vs-dark' defaultLanguage='python' value={script} onChange={v=>setScript(v||'')} options={{minimap:{enabled:false}}}/>
      </div>
      <div style={{color:'#ccc', whiteSpace:'pre-wrap', padding:'10px', fontFamily:'monospace', overflowY:'auto', background:'#1e1e1e'}}>{log}</div>
    </Split>
  )
}
export default App
"@
Set-Content -Path "src/renderer/src/App.tsx" -Value $appContent

# 8. CONFIGURE CSS
Write-Host "Configuring CSS..." -ForegroundColor Cyan
$cssContent = @"
body, html, #root { margin: 0; padding: 0; width: 100%; height: 100%; background-color: #1e1e1e; overflow: hidden; }
"@
Set-Content -Path "src/renderer/src/assets/main.css" -Value $cssContent

# 9. CONFIGURE VS CODE (Debugging)
Write-Host "Configuring VS Code..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path ".vscode" | Out-Null
$launchJson = @"
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Drydock",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}",
      "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron",
      "windows": {
        "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron.cmd"
      },
      "args": ["."],
      "outputCapture": "std",
      "console": "integratedTerminal"
    }
  ]
}
"@
Set-Content -Path ".vscode/launch.json" -Value $launchJson

# 10. FINISH
Write-Host ">>> SETUP COMPLETE!" -ForegroundColor Green
Write-Host "1. Run: cd ../drydock"
Write-Host "2. Run: npm run dev"
Write-Host "3. Or open VS Code and press F5!"