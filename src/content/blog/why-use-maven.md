---
title: Why Use Maven? Stability, Simplicity, and a Rich Plugin Ecosystem
date: 2024-01-10
description: For new Java projects, use Maven. It's simple, stable, and extensible.
tags: [java, maven, build-tools]
---

For new Java projects, use Maven as your build tool. It's a time-tested solution offering stability and reliability for long-term projects. And on top of that, it's extensible through a rich ecosystem of plugins.

## Simple to use

Maven uses a declarative approach with XML and a single file called `pom.xml`. Convention over configuration means minimal setup to build a Java project.

### Installation

- **SDKMAN**: `sdk install maven`
- **Maven Wrapper**: Use `./mvnw` in projects that include it. This downloads the exact Maven version required.

### Alternatives

Gradle is the most common alternative, using a programmatic DSL (Groovy or Kotlin). While powerful, its flexibility can lead to inconsistency across projects.

## Consistent and stable over time

Maven's XML configuration has remained stable for over two decades, and all signs point to it staying that way. No alternative configuration syntax. The lifecycle is the same as always. You rarely need to update your build just because Maven changed.

There are projects that have been around for decades and still build successfully with Maven.

## Extensible

Maven's architecture is plugin-based. There are hundreds of community plugins, and all major frameworks support it (Spring, Quarkus, Jakarta EE).

For example, you can run [JaCoCo code coverage without touching your pom.xml](/blog/jacoco-coverage-no-pom-xml/). Just invoke the plugin directly from the command line.

If you can't find what you need, you can write your own plugin (MOJO) in Java.

## Conclusion

Next time you create a Java project, you have good reasons to choose Maven: simple to use, stable for decades to come, and easy to extend. You won't regret it.
