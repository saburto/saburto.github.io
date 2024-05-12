---
title: Install JDK or other tools
tags: ["java"]
---

## Problem

When developing software in Java, you may need to install various environments and tools. These could include:

- A Java environment
- A Scala environment
- Tools such as Mission Control, JMeter, Maven, or Gradle

## Solution

A convenient solution to this problem is to use **SDKMAN!**, a software development kit manager. You can install SDKMAN! from [sdkman.io](https://sdkman.io/).

## Example

Here's how you can use SDKMAN! to install a JDK:

First, list the available JDKs:

```bash
sdk ls java
```

This will display a list of available JDKs. Each JDK has an `identifier`.

Next, copy the `identifier` of the JDK version you want to install, and use it to install that JDK:

```bash
sdk install java <identifier>
```

Replace `<identifier>` with the identifier of the JDK version you want to install.

If you want to switch to a different JDK, you can select it using:

```bash
sdk use java <identifier>
```

Again, replace `<identifier>` with the identifier of the JDK version you want to use.

To check which JDK or tool is currently in use, use:

```bash
sdk current
```

To see the complete list of supported tools, use:

```bash
sdk ls
```

## More Info

For more information, visit the [SDKMAN! website](https://sdkman.io/). You can also find additional resources, such as tutorials and documentation, to help you understand how to use SDKMAN! effectively.
