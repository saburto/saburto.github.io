

**TIL: How to Debug Ruby Applications with the Built-in `debug` Gem**

Today, I learned how to leverage Ruby's integrated `debug` gem for more effective troubleshooting. Here's a breakdown of what I discovered:

**Why Use the `debug` Gem?**

* **Integrated:** It's part of Ruby's standard library since version 2.6, so no need for external gems.
* **Powerful:**  Offers features like breakpoints, variable inspection, stepping through code, and more.
* **Familiar:** Similar in concept to other debuggers you might have used (e.g., pdb in Python, gdb for C).

**Getting Started**

1. **Require the Gem:**
   ```ruby
   require 'debug'
   ```

2. **Set Breakpoints:**
   Use `debugger` within your code to halt execution at specific points.
   ```ruby
   def calculate(x, y)
     debugger  # Execution stops here
     result = x * y + 5
     puts result
   end
   ```

**Basic Commands**

Here are some essential commands to use when the debugger pauses your code:

* **`continue` (or `c`)**:  Resume execution until the next breakpoint or the end of the script.
* **`step` (or `s`)**:  Execute the next line of code and step into method calls.
* **`next` (or `n`)**:  Execute the next line of code but step over method calls.
* **`break <line_number>`**: Set a new breakpoint at a specific line.
* **`p <variable>`**: Print the current value of a variable.
* **`quit`**: Exit the debugger.

**Example Debugging Session**

```bash
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

**Advanced Features**

* **Conditional Breakpoints:** Stop only when certain conditions are met.
* **Catchpoints:** Trigger breakpoints on specific exceptions.
* **Remote Debugging:** Debug applications running on different machines.

more information here https://github.com/ruby/debug