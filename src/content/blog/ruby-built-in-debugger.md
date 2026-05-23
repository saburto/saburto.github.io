---
title: How to Use Ruby's Built-In Debugger from the Terminal
date: 2024-03-12
description: Leverage Ruby's integrated debug gem for breakpoints, stepping, and variable inspection
tags: [ruby, debugging, tools]
---

Ruby's `debug` gem is part of the standard library since Ruby 2.6. No external gems needed.

## Getting Started

Require the gem and set breakpoints:

```ruby
require 'debug'

def calculate(x, y)
  debugger  # Execution stops here
  result = x * y + 5
  puts result
end
```

## Basic Commands

| Command | Action |
|---|---|
| `continue` / `c` | Resume execution until next breakpoint |
| `step` / `s` | Execute next line, stepping into method calls |
| `next` / `n` | Execute next line, stepping over method calls |
| `break <line>` | Set a new breakpoint at a specific line |
| `p <variable>` | Print the current value of a variable |
| `quit` | Exit the debugger |

## Example Session

```
$ ruby my_script.rb
Debugger stopped.
[1, 12] in my_script.rb
   11:
   12:   debugger  # Execution stops here
=> 13:   result = x * y + 5
   14:   puts result
   15: end

(rdbg) p x
10
(rdbg) p y
2
(rdbg) next
[1, 14] in my_script.rb
   13:   result = x * y + 5
=> 14:   puts result
   15: end
(rdbg) p result
25
(rdbg) continue
25
```

## Advanced Features

- **Conditional breakpoints**: Stop only when certain conditions are met
- **Catchpoints**: Trigger breakpoints on specific exceptions
- **Remote debugging**: Debug applications running on different machines

More info: [github.com/ruby/debug](https://github.com/ruby/debug)
