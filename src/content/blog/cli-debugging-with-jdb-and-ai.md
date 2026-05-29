---
title: "Java Command-Line Debugging with AI Agent"
date: 2026-05-25
description: "Debugging a java application using nothing but jdb and an AI coding agent in the terminal."
draft: true
tags: ["debugging", "java", "jdb", "ai", "agentic", "cli"]
---

![Eclipse IDE suspended at a breakpoint showing the debugging perspective](../../assets/eclipse_suspended_at_breakpoint.webp)

*Image: [Eclipse suspended at breakpoint](https://commons.wikimedia.org/wiki/File:Eclipse_suspended_at_breakpoint.png)*

IDEs and their visual debuggers in the agentic coding era are not an option. 🙅

When I need to investigate a complex issue, the agent normally adds a bunch of `System.out.println`, `print`, or `log.info` statements in order to get more information.

```java
System.out.println("I am here!!");
```

 It's a natural approach; many times I did that before. Also that means compiling, packaging, and running again, especially in Java. 🙅

I need something my agent can use.

## JDB: The built-in command-line debugger for Java

I decided to give `jdb` a try, the command-line debugger that was always there (since jdk 1).

You can do almost everything: 

- add breakpoints: `stop at com.saburto.Bar:46` or by method `stop at com.saburto.Bar.getAllLedgers`
- steps: `step`, `step up`,  `stepi`, `next`, `cont`
- get variables info: `print`, `dump`, `eval`, `locals`, `set`
- threads: `where`, `threadgroups`, `up`, `down`, `kill`, `interrup`
- show source code: `use` to add the source code path, `list` to show the code

The source code looks very nice in the output of the coding agent

```java
  42    @GetMapping
  43    public PageResponse<LedgerResponse> getAllLedgers(
  44            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
  45
  46 =>     var ledgers = ledgerService.getAllLedgers(page, size);
  47
  48        var content =
  49                ledgers.getContent().stream().map(mapper::toLedgerResponse).toList();
  50
  51        return new PageResponse<>(content, page, size, ledgers.getTotalElements(), ledgers.getTotalPages());
```


This opens incredible opportunities for your agent to give you much better information when you need to do some debugging. Here are a few prompts you can try:

1. **Dump a request payload:** "Attach jdb to my app at port 5005, set a breakpoint at `LedgerController.getAllLedgers`, trigger `curl localhost:8080/api/ledgers`, and dump every field of the `ledgers` Page object — I want to see the actual database records returned."

2. **Trace a variable's mutations:** "Set a breakpoint in `PaymentService.process`, step through line by line with `next`, and dump the `payment` variable after each line. I want to see how the status field changes as it moves through validation, enrichment, and persistence."

3. **Inspect concurrency at a checkpoint:** "Break at the top of my scheduled job in `ReconciliationScheduler.run`, trigger a full thread dump with `where all`, and show me what every other thread is doing at that moment. Any thread blocked on a lock?"

4. **Evaluate an expression in place:** "Set a breakpoint at line 89 of `InvoiceCalculator`, and when it hits, run `eval invoice.getLineItems().stream().mapToDouble(LineItem::getTotal).sum()` — I want to verify the line-item math without adding a log line, rebuilding, and waiting for Maven."

5. **Debug exception state without re-deploying:** "Break inside the catch block of `PaymentGateway.submit` (line 203), send a payment request with a bad card number, and when the breakpoint fires, dump the exception's message, cause chain, and the local variables — I want to see exactly what the gateway rejected and what state the request was in."

These prompts share a common shape: pick a breakpoint, trigger the code path, and let the agent extract the data. The agent handles the timing, the jdb commands, and the output parsing — you get the answer in your terminal.

Let's see some examples

## Example 1: checking variables in a request


For a Java application, you need to start the system with the proper arguments: `java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005 -jar app.jar`

For spring-boot application using mvn:

```bash
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=5005"
```

Then connect by attaching to the port: `jdb -attach 5005`, and that is it.

`jdb` is interactive by design, but in an agentic workflow the session must run hands-off, with the HTTP request firing while the debugger is attached and waiting. The agent constructed this shell script:


To see the actual ledger records, we need to poke at the ArrayList's internals. The agent assembled another script, this time adding a `next` step and a series of `dump` commands:


IMPORTANT: this is only an example of how my agent generated the script to use the debugger. Depending on your case it may be different; let your agent create the right script.

```bash
cd ~/projects/my-app && rm -f /tmp/jdb-output6.txt && (
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

1. The `( echo ... echo ... )` subshell pipes a sequence of `jdb` commands into the debugger. Each command goes in at the right time: set the breakpoint, continue, wait 5 seconds for the HTTP request to arrive and hit the breakpoint, then step over the assignment and dump the ledger data.
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


## A better workflow using Tmux

The pipe-and-background approach works, but there is an even smoother way: `tmux` You can tell the agent to open a new panel or window and send all the debugging commands there while keeping your editor open in the original pane.

Here is an example. Without touching a single line of code, I asked the agent to show me the HTTP request headers hitting a controller method. After a few tries, it delivered exactly what I needed:

```
Request Headers at LedgerController.getAllLedgers() (line 46, bci=0)

 ┌───┬───────────────┬─────────────────────────────────────────────────────────────┐
 │ # │ Header        │ Value                                                       │
 ├───┼───────────────┼─────────────────────────────────────────────────────────────┤
 │ 0 │ Host          │ localhost:8080                                              │
 ├───┼───────────────┼─────────────────────────────────────────────────────────────┤
 │ 1 │ User-Agent    │ curl/8.5.0                                                  │
 ├───┼───────────────┼─────────────────────────────────────────────────────────────┤
 │ 2 │ Accept        │ */*                                                         │
 ├───┼───────────────┼─────────────────────────────────────────────────────────────┤
 │ 3 │ Authorization │ Bearer                                                      │
 │   │               │ eyJraWQiOiJkZWZhdWx0IiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ. │
 │   │               │ ..                                                          │
 └───┴───────────────┴─────────────────────────────────────────────────────────────┘
```

### How I got there (wrapper chain)

The request object at `DispatcherServlet.doDispatch` frame 15 goes through 5 nested `.request` fields:

```
SecurityContextHolderAwareRequestWrapper
  → HeaderWriterFilter$HeaderWriterRequest
    → (firewall wrapper)
      → RequestFacade
        → Request
          → coyoteRequest.headers  (MimeHeaders, count=4)
            → headers[0..3]        (MimeHeaderField with nameB/valueB MessageBytes)
```

No code changes, no rebuilds, no restart. Just the debugger, the agent, and a `tmux`


## AI Agentic Debugging

It lacks mouseover variable inspection, inline values, and expandable call-stack trees. But that constraint has its advantages:

* **Agent-friendly.** Text is the universal interface. An AI agent can read jdb output and decide its next command.
* **Scriptable.** You can capture, replay, or script every jdb session.
* **Composable.** jdb fits into pipelines: other tools can parse its output to explain thread stacks, for example.
* **Remote-friendly.** It works over SSH just as well as locally.

The terminal is the agent's native habitat. Every CLI tool you learn becomes a tool the agent can wield on your behalf. `jdb` is just one example; the same pattern applies to `gdb` for C/C++, `pdb` for Python, `dlv` for Go, or any debugger that exposes a command interface. If you can type it, the agent can use it.

So, do you still prefer hitting F11 to step through your code?
