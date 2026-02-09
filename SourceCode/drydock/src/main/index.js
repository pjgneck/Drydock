import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join, dirname } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import fs from 'fs'
import os from 'os'
import { spawn } from 'child_process'
import pty from 'node-pty'

let ptyProcess = null;
let currentWorkingDirectory = os.homedir();

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200, height: 800, show: false, autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false, contextIsolation: true,
      nodeIntegration: true // Required for some PTY integrations
    }
  })
  mainWindow.on('ready-to-show', () => mainWindow.show())
  
  // Initialize the PTY immediately when window opens
  initPty(mainWindow);

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url); return { action: 'deny' }
  })
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// --- REAL PTY LOGIC ---
function initPty(window) {
  const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

  ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: currentWorkingDirectory,
    env: process.env
  });

  // Pipe data FROM PTY -> TO FRONTEND
  ptyProcess.onData((data) => {
    if (window && !window.isDestroyed()) {
      window.webContents.send('terminal-data', data);
    }
  });
}

// --- IPC HANDLERS ---

// 1. RESIZE (Critical for making it look right)
ipcMain.on('terminal-resize', (event, { cols, rows }) => {
  if (ptyProcess) {
    try { ptyProcess.resize(cols, rows) } catch (e) {}
  }
})

ipcMain.on('terminal-input', (event, data) => {
  if (ptyProcess) {
    ptyProcess.write(data);
  } else {
    console.log("[ERROR] PTY Process is NULL!")
  }
})

// 3. FILE SYSTEM (Same as before)
ipcMain.handle('dialog:openFile', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openFile'] })
  if (canceled) return null
  const content = fs.readFileSync(filePaths[0], 'utf-8')
  // Update CWD for PTY
  currentWorkingDirectory = dirname(filePaths[0]);
  if(ptyProcess) {
     // Run 'cd' command in the existing shell
     const cdCommand = os.platform() === 'win32' 
        ? `cd "${currentWorkingDirectory}"\r` 
        : `cd "${currentWorkingDirectory}"\n`;
     ptyProcess.write(cdCommand);
  }
  return { name: filePaths[0], content }
})

// ... (Keep your save handlers) ...

// --- RUN SCRIPT (The Fix) ---
ipcMain.on('run-python-stream', (event, { code, filePath }) => {
  if (!ptyProcess) return;

  // A. SAVE FILE
  // We must save before running so Python sees the changes on disk
  let scriptPath = filePath;
  if (filePath && filePath !== "Untitled.py") {
    fs.writeFileSync(filePath, code);
  }
  /*
  else {
    // Fallback for Untitled files -> Save to Temp
    const tempPath = join(os.tmpdir(), 'drydock_script.py');
    fs.writeFileSync(tempPath, code);
    scriptPath = tempPath;
  }
  */

  // B. KILL PREVIOUS PROCESS
  // Write "Ctrl + C" to the terminal to stop any running script
  ptyProcess.write('\x03'); 

  // C. RUN NEW COMMAND (With a tiny delay)
  // We wait 100ms to give the shell time to reset and show the prompt again.
  setTimeout(() => {
    const pythonCmd = (process.platform === 'darwin' || process.platform === 'linux') ? 'python3' : 'python';
    
    // Clear screen command (optional, keeps it clean)
    // ptyProcess.write('clear\r'); // Uncomment if you want a fresh screen every time

    // Run the script
    const cmdString = `${pythonCmd} "${scriptPath}"\r`;
    ptyProcess.write(cmdString);
  }, 100);
})

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')
  createWindow()
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() })
})
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })