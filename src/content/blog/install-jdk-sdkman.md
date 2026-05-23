---
title: Install Any JDK Version in Seconds with SDKMAN
date: 2024-04-05
description: A quick guide to using SDKMAN to manage Java environments and tools
tags: [java, sdkman, tools, tutorial]
---

When developing software in Java, you may need to install various environments and tools: JDKs, Maven, Gradle, JMeter, and more.

## Solution

Use **SDKMAN!**, a software development kit manager. Install it from [sdkman.io](https://sdkman.io/).

## Usage

List available JDKs:

```bash
sdk ls java
```

This displays a list of available JDKs. Each has an `identifier`. Copy the identifier and install:

```bash
sdk install java <identifier>
```

To switch to a different JDK:

```bash
sdk use java <identifier>
```

Check which JDK or tool is currently in use:

```bash
sdk current
```

See all supported tools:

```bash
sdk ls
```

For more information, visit the [SDKMAN! website](https://sdkman.io/).

Once your JDK is set up, you're ready to start writing tests. Check out my [JUnit 5 command-line tutorial](/blog/junit5-beginners-guide/).
