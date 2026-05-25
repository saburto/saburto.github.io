---
title: "Java Command-Line Debugging with AI Agent"
date: 2026-05-25
description: "Debugging a Spring Boot application at the breakpoint level using nothing but jdb and an AI coding agent in the terminal."
draft: true
tags: ["debugging", "java", "jdb", "ai", "agentic", "cli"]
---

Since my development workflow realies on TDD,  I rarely need to use a debugger, but occasinally I had to use in some cases for checking some legacy system.

I am not big fan of IDEs and their visual debuggers and in the Agentic Coding era those are not an option.

When I need to to investigate a complex isuse, the agent normally add a bunch of ... `prints` in order to get more information, I can't blame it, many times I did that before.

But that is not a right option, sometimes you don't have good information about the what is the status of the variables, threads, etc. Then you need sometime more advance.


## JDB Built-in command-line debuger

I had in the past oportuinity to work with some command line debuger for ruby and perl. For obvious reason they are first-class command line tools from the begining. So was not an issue to use them.

Most of the time I work in Java.

But in Java the history is different, normally I had a IDE that give me the super full-fledge debugger visusal.

Again! But using a Agentic the visual GUI is not an option anymore.

So for java, I decided to give a try to `jdb`, the command-line debugger was always there. Despite of the popularity of the IDE in java there are already bunch of command line tools available in the JDK, `jstack`, `jcmd`, `jdump`, `jshell`, etc..

Then you have the same options that you got visualy in any IDE: add breakpoints, steps: `next, stepi, stepo, cont`, get variables info, thread ifnormation and much more.

This opens increaible oportuinities for your agent to give you much better informatio when you need to do some debugging.

## Example: checking a variables in a request


For a java applicationi you need to start the system with the proper arguments: `java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005 -jar app.jar`

Then connect the with the attact of the port `jdb -attach 5005`, and that is it.

`jdb` is interactive, but we are not. We need the whole session to run hands-off, with the HTTP request firing while the debugger is attached and waiting. The agent constructed this shell script:



To see the actual ledger records, we need to poke at the ArrayList's internals. The agent assembled another script, this time adding a `next` step and a series of `dump` commands:


IMPORTATN: this is only a example of how my agent generate the script to use the debugger, depending of the your case may be different, let;s you agent create the right script

```bash
cd /home/saburto/git/codex-playground && rm -f /tmp/jdb-output6.txt && (
  echo "stop in com.saburto.ledger.controller.LedgerController.getAllLedgers"
  echo "cont"
  sleep 5
  echo "next"
  sleep 1
  echo "dump ledgers.content.elementData"
  echo "dump ledgers.content.elementData[0]"
  sleep 2
) | timeout 30 jdb -attach 5005 > /tmp/jdb-output6.txt 2>&1 &
JDB_PID=$!
sleep 2
curl -s localhost:8080/api/v1/ledgers \
  -H "Authorization: Bearer $(./scripts/get-token.sh)" > /dev/null
wait $JDB_PID 2>/dev/null
echo "JDB_EXIT=$?"
```


Let's break this down:

1. The `( echo ... echo ... )` subshell pipes a sequence of `jdb` commands into the debugger. Each command goes in at the right time: set the breakpoint, continue, wait 8 seconds for the HTTP request to arrive and hit the breakpoint, then dump threads and stack trace.
2. The whole thing runs in the **background** (`&`), with its PID captured.
3. After a 2-second head start, `curl` triggers the REST endpoint that runs `getAllLedgers()`.
4. The script then waits for jdb to finish and reports the exit code.

The agent reads `/tmp/jdb-output.txt` afterward and sees the breakpoint hit:

The `next` command steps past the `var ledgers = ...` assignment before the dumps run. The `sleep` calls pace the commands so they arrive after the breakpoint fires. The agent reads the output file and reconstructs the data.

Now we see each `LedgerEntity` instance:

```jdb
ledgers.content.elementData[0] = {
    id: instance of java.util.UUID(id=15654)
    name: "Basic Transactions Ledger"
    createdAt: instance of java.time.Instant(id=15670)
    isNew: false
}
```


## AI Agentic Debugging

There is no mouseover variable inspection, no inline values, no call-stack tree with expandable frames. But that constraint has its advantages:

* **Scriptable.** Every jdb session can be captured, replayed, or scripted.
* **Composable.** jdb fits into pipelines: its output can be parsed by other tools. For example can explain the thread stack.
* **Remote-friendly.** It works over SSH just as well as locally.
* **Agent-friendly.** Text is the universal interface. An AI agent can read jdb output and decide its next command.


The terminal is the agent's native habitat. Every CLI tool you learn becomes a tool the agent can wield on your behalf. `jdb` is just one example; the same pattern applies to `gdb` for C/C++, `pdb` for Python, `dlv` for Go, or any debugger that exposes a command interface. If you can type it, the agent can use it.
