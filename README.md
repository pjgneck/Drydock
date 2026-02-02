---
marp: true
title: ⚓ Drydock: The Python Data Station
theme: default
paginate: true
---

# ⚓ Drydock  
## The Python Data Station

**Team Member:**  
Parker Groneck

---

## Project Description

**Drydock** is a lightweight, specialized **Desktop IDE** for rapid data transformation and debugging.

- Replaces heavy environments (Docker, PyCharm)
- Enforces a rigid **Linear Workflow**
- Load raw data → Write Python → See output instantly
- Designed for fixing real production data fast

---

## Why Drydock Exists

- File-first workflow
- No cloud deployments
- No black-box debugging
- Real files, real execution, immediate feedback

Drydock lets developers fix broken **EDI, CSV, and JSON** files in seconds instead of minutes.

---

## Problem Domain

### Enterprise Data Transformation

Key pain points:
- **Complexity:** EDI and legacy formats are brittle
- **Black Box:** Debugging often requires cloud deploys
- **Overhead:** Local setup for tiny scripts is excessive
- **AI Risk:** AI code hallucinates without real-data testing

---

## Core Features (1/2)

### Tri-Pane Linear Interface
- Left: Input File  
- Center: Python Logic  
- Right: Output Result  

### File-First Input Engine
- Left pane is a file previewer
- Drag-and-drop CSV, EDI, JSON files

---

## Core Features (2/2)

### Invisible Wrapper Engine
- Handles all file I/O automatically
- Users write only Python logic

### Live Data Inspector
- Auto-detects JSON / XML
- Syntax highlighting and folding

### Safe-Mode Execution
- Isolated Node.js Child Process
- Infinite loops never crash the app

---

## Engineering Standards (1/3)

- **Cross-Platform Parity**  
  Electron builds for Windows, macOS, Linux

- **Process Isolation**  
  All user logic runs outside the UI thread

- **State Synchronization**  
  Redux manages Input / Script / Output buffers

---

## Engineering Standards (2/3)

- **Defensive Wrapping**  
  Auto-injected try/except for all scripts

- **Error Visibility**  
  All Python stderr piped directly to the UI

- **DOM Virtualization**  
  Only visible lines rendered (>100MB files)

---

## Engineering Standards (3/3)

- **Environment Flexibility**  
  Support system Python and virtual envs

- **Persistence Protocol**  
  Auto-save window state and scripts

- **Keyboard First**  
  Global hotkeys (Ctrl + Enter)

- **Data Sanitization**  
  Enforced UTF-8 on all I/O streams

---

## Tests

- Acceptance Tests — *Coming Soon*
- Integration Tests — *Coming Soon*
- End-to-End Tests — *Coming Soon*

---

## Project Documentation

- Project Plan Presentation (PPP)
- Individual Contributions — Parker Groneck

---

## Sprint 1 — The Foundation

**Goal:** Build a working shell for  
**Files · State · Layout**

---

## Week 1 — The Skeleton

- Initialize Electron with TypeScript & React
- Build rigid 3-pane layout (Left / Center / Right)
- Verify cross-platform rendering

---

## Week 2 — The Brain

- Integrate Monaco Editor in all panes
- Initialize Redux store
- Sync Input, Script, Output buffers
- Enable Python syntax highlighting

---

## Week 3 — The Bridge

- Drag-and-drop support in left pane
- Node.js file system bridge
- Load file contents into input buffer
- Lock input and output panes (read-only)

---

## Week 4 — The Polish

- Auto-save window state and scripts
- Bind Ctrl + Enter (stub execution)
- Final UI styling
- Implement Dark Mode theme

---
