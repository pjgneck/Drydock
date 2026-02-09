# Team Information

**Team Members:**

- Parker Groneck - <groneckp1@mymail.nku.edu>
  - [[Individual Canvas Page](https://nku.instructure.com/courses/87393/pages/individual-progress-parker-groneck-2)]

---

# Drydock: The Offline Logic Studio

## Project Description

Drydock is a specialized desktop IDE designed to streamline the creation, debugging, and execution of data integration logic in an offline, safe environment. Built on **Electron** and **React**, it provides a "sandbox" approach where developers can prototype scripts using standard **Python**. 

The application solves the "Black Box" development cycle by offering a local runtime environment with a **real-time system terminal**, allowing for immediate feedback, variable inspection, and rapid iteration without the need for slow cloud deployments.

## Problem Domain

The problem domain is Enterprise Data Transformation, specifically the friction between writing complex integration logic and testing it. Developers currently struggle with rigid middleware platforms where debugging requires deploying to the cloud, offering zero visibility into data flow until a failure occurs. Drydock bridges this gap by providing a local, native application that simulates the execution environment, catches errors early, and ensures logic is robust before it ever touches a production server.

# Features

- **Professional Code Editor:** Fully integrated **Monaco Editor** (the engine behind VS Code) providing syntax highlighting, line numbers, and "Dark Mode" theming for Python and JSON.
- **Integrated System Terminal:** A fully functional terminal emulator powered by **xterm.js** and **node-pty**. It supports standard shell commands (PowerShell/Bash), colored output, tab completion, and interactive inputs (stdin/stdout).
- **Process Isolation:** Utilizes Node.js child processes and pseudo-terminals (PTY) to execute user scripts safely without freezing the main application UI.
- **Real-Time Streaming:** Live streaming of script output and errors, allowing developers to see execution logs instantly as they happen.
- **File System Integration:** Native support to Open, Edit, and Save local Python files (`.py`) and data files directly from the desktop.
- **Context-Aware Execution:** Automatically detects the working directory of open files to ensure imports and relative paths work correctly during execution.

## Technical Requirements

- **Framework:** Electron (to run as a native offline application on Windows, macOS, and Linux).
- **Frontend:** React with Vite for a high-performance, component-based UI.
- **Backend:** Node.js main process handling file I/O and child process management.
- **Terminal Engine:** Must utilize `node-pty` for native PTY support to handle ANSI color codes and interactive shell sessions.
- **Editor Engine:** `monaco-editor` for providing an IDE-grade coding experience.
- **Concurrency:** Execution must occur in non-blocking threads to maintain UI responsiveness during long-running scripts.

# GitHub Repository

**Main Repository:** [https://github.com/pjgneck/ASE485-Capstone](https://github.com/pjgneck/ASE485-Capstone)

## Quick Links to Key Directories

- [Documentation](https://github.com/pjgneck/ASE485-Capstone/tree/main/docs)
- [Source Code](https://github.com/pjgneck/ASE485-Capstone/tree/main/src)

# Documents

## Requirements

- [Acceptance Tests](https://github.com/pjgneck/ASE485-Capstone/blob/main/docs/requirements/acceptance_tests.md)

## Project Plan Presentation (PPP)  

- [PPP Document](https://github.com/pjgneck/ASE485-Capstone/blob/main/docs/ppp/ppp_document.md)
- [PPP Slides (Marp)](https://github.com/pjgneck/ASE485-Capstone/blob/main/docs/ppp/ppp_slides.md)
- [PDF Version of Slides](#) 

## Diagrams

- [Data Model](https://github.com/pjgneck/ASE485-Capstone/blob/main/docs/architecture/data_model.png)
- [System Architecture](https://github.com/pjgneck/ASE485-Capstone/blob/main/docs/architecture/system_architecture.png)

# Progress

## Milestones

- **Milestone 1:** Team formation and GitHub setup - **Completed**
- **Milestone 2:** Problem analysis and PPP preparation - **Completed**
- **Milestone 3:** Core IDE Development (Editor & Terminal) - **Completed**
- **Milestone 4:** Advanced Features & Polish - **In Progress**