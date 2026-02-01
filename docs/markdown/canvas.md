# Team Information

**Team Members:**

- Parker Groneck- <groneckp1@mymail.nku.edu>
  - [[Individual Canvas Page](https://nku.instructure.com/courses/87393/pages/individual-progress-parker-groneck-2)]


# Drydock: The Offline Logic Studio

## Project Description

Drydock is a specialized desktop IDE designed to streamline the creation and debugging of enterprise data integration logic in an offline, safe environment. It utilizes a hybrid architecture where developers can define logic using either a concise, null-safe Domain Specific Language (DSL) or a synchronized visual block interface. This "sandbox" approach allows for rapid testing and bug-fixing, instantly transpiling your logic into production-ready Java or Python code for deployment on middleware platforms like Boomi or MuleSoft.

## Problem Domain

The problem domain is Enterprise Data Transformation, specifically the friction between high-level business requirements and the rigid, error-prone code needed to implement them in middleware platforms. Developers currently struggle with a "Black Box" development cycle, where debugging logic requires slow cloud deployments and offers zero visibility into data flow until a failure occurs. This lack of an offline, safe testing environment leads to fragile integration scripts that are susceptible to runtime errors and costly production downtime.

# Features and Requirements

- Hybrid Logic Editor, A dual-view interface allowing users to write logic via the Visual Block Canvas OR the text-based Drydock Script (DSL). Changes in one view instantly update the other.
- The "Drydock Script" DSL: A proprietary, concise, null-safe scripting language designed specifically for data piping
- Live Data Inspector: A real-time debugging panel that visualizes the state of data at every step of the pipeline (Input $\rightarrow$ Transformation $\rightarrow$ Output) without requiring a compile/deploy cycle.
- Polyglot Transpiler: An engine that compiles Drydock Script into standardized, production-ready code for multiple targets (initially Java/Groovy for Boomi and Python for AWS Lambda).
- Mock Context Manager: A settings environment to simulate production variables (e.g., Process Properties, Environment IDs) locally, enabling full "offline" testing.
- Legacy Data Parser: Built-in, zero-configuration parsers for complex legacy formats (EDI X12, XML, Fixed-Width) that visualize hierarchical data as a navigable tree.


## Features & Requirements

- Electron to run as a native offline application on Windows, macOS, and Linux.
- The application must maintain a 1:1 mapping between the AST (Abstract Syntax Tree), the Visual Blocks (Google Blockly), and the Text Editor (Monaco/VS Code Editor).
- Must utilize Node.js child processes to execute logic safely in a separate thread to prevent UI freezing during large file parsing.
- The Compiler architecture must be modular, allowing new "Target Printers" (e.g., C# or SQL) to be added without rewriting the core logic engine.
- Null Safety Enforcement
- Users must be able to drag raw text/XML files from their desktop directly into the "Input" panel to trigger immediate parsing.
- The "Export" function must wrap the generated logic in the specific boilerplate required by the target middleware
- The Inspector must automatically detect and display the data type (String, Integer, Date) of the output to prevent type-mismatch errors.

# GitHub Repository

**Main Repository:** https://github.com/pjgneck/ASE485-Capstone

## Quick Links to Key Directories

- [Documentation](https://github.com/ken-username/early-starter/tree/main/docs)
- [Source Code](https://github.com/ken-username/early-starter/tree/main/src)
...

# Documents

## Requirements

- [Acceptance Tests](https://github.com/ken-username/arly-starter/blob/main/docs/requirements/acceptance_tests.md)

## Project Plan Presentation (PPP)  

- [PPP Document](https://github.com/ken-username/early-starter/lob/main/docs/ppp/ppp_document.md)
- [PPP Slides (Marp)](https://github.com/ken-username/arly-starter/blob/main/docs/ppp/ppp_slides.md)
- [PDF Version of Slides](link-to-pdf)

## Diagrams

- [Data Model](https://github.com/ken-username/early-starter/lob/main/docs/architecture/data_model.png)
- [System Architecture](https://github.com/ken-username/arly-starter/blob/main/docs/architecture/system_architecture.png)

...

# Progress

## Milestones

- Milestone 1: Team formation and GitHub setup - Completed
- Milestone 2: Problem analysis and PPP preparation - In Progress
- Milestone 3: Initial development sprint - Upcoming
...

## Weekly Progress

- Week 4 Presentation: [Link to the Github page]
- Week 3 Presentation: [Link to the GitHub page]
