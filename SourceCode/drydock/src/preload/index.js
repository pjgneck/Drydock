import { contextBridge, ipcRenderer } from 'electron'

const api = {
  // File System
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  saveAs: (content) => ipcRenderer.invoke('dialog:saveFile', { content }), // Renamed for clarity
  
  // NEW: Save to existing path
  saveDirect: (filePath, content) => ipcRenderer.invoke('file:saveDirect', { filePath, content }),

  // ... (Keep execution and listeners the same)
  startPython: (args) => ipcRenderer.send('run-python-stream', args),
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