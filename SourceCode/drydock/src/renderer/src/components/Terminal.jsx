import { useEffect, useRef } from 'react'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css'

export default function XTermComponent() {
  const terminalRef = useRef(null)

  useEffect(() => {
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Consolas, "Courier New", monospace',
      theme: { background: '#1e1e1e' },
      allowProposedApi: true
    })

    const fitAddon = new FitAddon()
    term.loadAddon(fitAddon)
    term.open(terminalRef.current)
    fitAddon.fit()

    term.focus()
    terminalRef.current.addEventListener('click', () => term.focus())
    // 1. INPUT: Send RAW keystrokes to backend
    term.onData((data) => {
      if (window.electron) window.electron.sendInput(data)
    })

    // 2. OUTPUT: Write exactly what backend sends
    // (node-pty handles echo, backspace, colors, etc.)
    if (window.electron && window.electron.onTerminalData) {
      window.electron.onTerminalData((data) => {
        term.write(data)
      })
    }

    // 3. RESIZE: Tell backend when window size changes
    const handleResize = () => {
      fitAddon.fit()
      if (window.electron) {
        window.electron.resizeTerminal({ 
          cols: term.cols, 
          rows: term.rows 
        })
      }
    }
    window.addEventListener('resize', handleResize)
    // Initial resize
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
      term.dispose()
    }
  }, [])

  return <div style={{ width: '100%', height: '100%' }} ref={terminalRef} />
}