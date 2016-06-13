## TODO
- Command line interface
  - Parse commandline arguments

- Client
  - Run specific task

- Parser
  - Identify builtin commands

- DSL
  - REPORT task
  - ENV task

- Daemon
  - Error handing
  - Pipe messages to monitoring service

- Tests
  ~Tests can wait until coupling with streamify is refactored.~


### V2

- Lexer should be a state machine
  - Define possible states (Comment, Task, Invocation).
    - Possible states should include lexeme format
  - Trigger a state change when a certain lexeme is hit.
  - Return stream of tokens.
