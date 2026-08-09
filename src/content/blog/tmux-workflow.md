---
title: "Coding Agent and Tmux: A Terminal-Native Combination"
date: 2026-07-31
description: Working with a coding agent and tmux creates a powerful combination
draft: false
tags: [ai, tools, terminal, tmux]
---

Working with a coding agent and tmux creates a powerful combination, unlocking capabilities no IDE or GUI tool can offer. Tmux allows your agent to interact directly with any terminal application, opening up infinite possibilities.

You don't need heavy, token-expensive abstractions like MCP to query a database, browse the internet, or debug an application. You just need tmux and two simple commands that, surprise, surprise, every frontier model already knows how to use.


Hello world example:

```
Make a new pane in the bottom use 10 lines height,
then send a command figlet hello world piped lolcat in tmux,
then verify the text was sent
```

<script src="https://asciinema.org/a/SGbfbrSeUMZvb9vA.js" id="asciicast-SGbfbrSeUMZvb9vA" async="true"></script>

## Simplest protocol

Tmux has been around for years, so it is no surprise that frontier models already know exactly how it works. There are only a few operations needed to manage windows and panes, and that simplicity is its biggest strength.

You don't need an MCP or complex integrations. You just need a simple system prompt instructing the agent on how to interact with tmux.

> [!NOTE] Default to the current session and window, and ask for confirmation before sending keys to a specific pane.

It all boils down to two simple, but incredibly powerful commands:

- `tmux send-keys`: Send simple text, system commands, or control sequences (like Enter or Ctrl+C) directly to any pane.

- `tmux capture-pane`: Grab the exact text visible in any pane and pass it straight back to the LLM to read.

These two commands provide the leverage needed to interact seamlessly with any terminal application.

## Interact with other terminal applications

Let me show you an example of how to interact with a database using the pgcli client open in another pane.

I can ask for whatever data I need in plain human language. The LLM translates the request into SQL, uses send-keys to execute the query in the pgcli pane, captures the output, and distills the information for me. There is no need for complex external tools or plugins: just Pi, tmux, and pgcli.

<script src="https://asciinema.org/a/1262638.js" id="asciicast-1262638" async="true"></script>


This exact same pattern works for nearly any terminal application:

- **REPLs**: jshell, ipython, irb
- **Debuggers**: gdb, jdb ([how to use jdb](/cli-debugging-with-jdb-and-ai/))
- **Web browsers**: lynx, w3m
- **Editors**: vim, nano, emacs
- etc.


## Interact with remote server using SSH

Because SSH is just another interactive terminal application, the exact same pattern applies. Here is a simple example showing another pane with an open SSH session, where I instruct the agent to run commands and check the weather on that remote machine.

<script src="https://asciinema.org/a/1262643.js" id="asciicast-1262643" async="true"></script>

## Great power needs great responsibilities

Giving your agent access to databases or remote servers means you must apply the same security principles you would for a human.

> [!WARNING] Always enforce the principle of least privilege: use read-only credentials for databases and non-root users for SSH sessions.

The same security concerns apply here as with any bash command your agent executes. If the agent operates using your access level, you are ultimately responsible for its actions, so put sensible safeguards in place to prevent accidents.

However, there is no need to be extreme. If you use a proper sandbox and stick to managing your development in small, controlled batches, you naturally minimize the blast radius.

> [!CAUTION] You must know what you are doing

## My Workflow

I prefer tools that I can customize to my own needs, not the other way around. While there are newer tools out there like `cmux` or `herdr` that promise specialized session management for multiple agents, I don't need them.

I have used tmux for a decade. It launches by default when I open my terminal ([tmux plugin](https://github.com/ohmyzsh/ohmyzsh/blob/99aaf58d007f1378d1e0609bcd9baf8abbbaf327/plugins/tmux/README.md)).

I don't persist sessions, I don't feel yet any case when I need to keep the session persistent, or even the layout. My session remains lightweight: typically 2 to 3 windows, with 1 to 2 panes each. When I finish something I close the window.

Because I manage my software development in small batches, I rarely have more than a couple of agents running simultaneously. I do not use hidden sub-agents. I try to focus on one task at a time, performing proper context engineering by giving the agent access exactly to what it needs, whether that is an MCP, a standard CLI tool, or an interactive application in an adjacent tmux pane.

The agent's tmux `skill` is incredibly simple: how to send an Enter keystroke, how to target a specific pane, and how to default to the current window.

I also added a small customization to notify me strictly when an agent pauses and needs me to make a decision.

Is this the definitive best way of working? It is the best for me right now.

![Robot companion looking at a glowing terminal screen, Studio Ghibli anime style](../../assets/tmux-workflow-hero.webp)

## Conclusion


The terminal is the natural habitat for a coding agent. Combining it with tmux unlocks powerful capabilities that heavy GUIs and IDEs simply cannot match.

Investing time in tools you can customize to your own workflow always pays off. The stack of Neovim, Pi, and tmux creates an incredibly powerful, terminal-native environment, and it is hard to imagine any shiny new abstraction beating it.

> [!TIP] If you already work in the terminal, give tmux a try. The investment will pay dividends for your agentic workflow.
