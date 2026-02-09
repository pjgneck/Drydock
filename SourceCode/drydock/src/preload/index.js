import { contextBridge, ipcRenderer } from 'electron'

const api = {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  //Save the file in local App data instead of the original file path.
  saveAs: (content) => ipcRenderer.invoke('dialog:saveFile', { content }),

  //Save to the file instead of create a new file in local App data.
  saveDirect: (filePath, content) => ipcRenderer.invoke('file:saveDirect', { filePath, content }),

  //starts the PY file on the terminal to run the code and show the output on the terminal.
  startPython: (args) => ipcRenderer.send('run-python-stream', args),

  sendInput: (data) => ipcRenderer.send('terminal-input', data),
  
  sendCommand: (text) => ipcRenderer.send('system-command', text),
  resizeTerminal: (size) => ipcRenderer.send('terminal-resize', size),
  onTerminalData: (callback) => {
    const sub = (_event, val) => callback(val)
    ipcRenderer.on('terminal-data', sub)
    return () => ipcRenderer.removeListener('terminal-data', sub)
  }
}

if (process.contextIsolated) {
  try { contextBridge.exposeInMainWorld('electron', api) } catch (e) { console.error(e) }
} else {
  window.electron = api
}