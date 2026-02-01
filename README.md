# Drydock: The Offline Logic Studio

## Team Members

- **Parker Groneck**

## Project Description

  Drydock is a specialized desktop IDE designed to streamline the creation and debugging of enterprise data integration logic in an offline, safe environment. It utilizes a hybrid architecture where developers can define logic using either a concise, null-safe Domain Specific Language (DSL) or a synchronized visual block interface. This "sandbox" approach allows for rapid testing and bug-fixing, instantly transpiling your logic into production-ready Java or Python code for deployment on middleware platforms like Boomi or MuleSoft.

## Problem Domain

  The problem domain is Enterprise Data Transformation, specifically the friction between high-level business requirements and the rigid, error-prone code needed to implement them in middleware platforms. Developers currently struggle with a "Black Box" development cycle, where debugging logic requires slow cloud deployments and offers zero visibility into data flow until a failure occurs. This lack of an offline, safe testing environment leads to fragile integration scripts that are susceptible to runtime errors and costly production downtime.

## Features and Requirements

### Features

  1.  Hybrid Logic Editor
    - A dual-view interface allowing users to write logic via the Visual Block Canvas OR the text-based Drydock Script (DSL). Changes in one view instantly update the other.
  
  2.  The "Drydock Script" DSL
    - A proprietary, concise, null-safe scripting language designed specifically for data piping

  3.  Live Data Inspector
    - A real-time debugging panel that visualizes the state of data at every step of the pipeline (Input $\rightarrow$ Transformation $\rightarrow$ Output) without requiring a compile/deploy cycle.

  4.  Polyglot Transpiler
    - An engine that compiles Drydock Script into standardized, production-ready code for multiple targets (initially Java/Groovy for Boomi and Python for AWS Lambda).
  
  5.  Mock Context Manager
    - A settings environment to simulate production variables (e.g., Process Properties, Environment IDs) locally, enabling full "offline" testing.

  5.  Legacy Data Parser
    - Built-in, zero-configuration parsers for complex legacy formats (EDI X12, XML, Fixed-Width) that visualize hierarchical data as a navigable tree.

### Requirements

- Electron to run as a native offline application on Windows, macOS, and Linux.
- The application must maintain a 1:1 mapping between the AST (Abstract Syntax Tree), the Visual Blocks (Google Blockly), and the Text Editor (Monaco/VS Code Editor).
- Must utilize Node.js child processes to execute logic safely in a separate thread to prevent UI freezing during large file parsing.
- The Compiler architecture must be modular, allowing new "Target Printers" (e.g., C# or SQL) to be added without rewriting the core logic engine.
- Null Safety Enforcement
- Users must be able to drag raw text/XML files from their desktop directly into the "Input" panel to trigger immediate parsing.
- The "Export" function must wrap the generated logic in the specific boilerplate required by the target middleware
- The Inspector must automatically detect and display the data type (String, Integer, Date) of the output to prevent type-mismatch errors.
 
 
We have 5 features and 8 requirements.

## Tests

### Acceptance Tests

- Coming Soon

  Link: -

### Integration Tests

- Coming Soon

  Link: - 

### E2E Tests

- Coming Soon

## Project Documentation

- [Project Plan Presentation (PPP)](link-to-ppp)
- [Individual Contributions - Parker Groneck](https://nku.instructure.com/courses/87393/pages/individual-progress-parker-groneck-2)

## Schedule & Milestones

### Sprint 1

- Setup Electron with TypeScript, React, and Redux (for state management).
- Define the JSON specification for the Pipeline and Statement objects (the internal data structure).
- Build the 3-pane layout (Input, Editor, Output) using a resizable split-pane component.
- Initialize Google Blockly in the Visual Panel.
- Initialize Monaco Editor in the Script Panel with basic syntax highlighting for .dd (Drydock Script).
- Build the logic that translates Blockly Events $\rightarrow$ AST $\rightarrow$ Monaco Text (and vice versa).
- Dragging a block updates the text; typing text updates the block.