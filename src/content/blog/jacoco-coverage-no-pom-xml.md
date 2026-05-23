---
title: JaCoCo Code Coverage Without Touching pom.xml
date: 2024-05-18
description: Run JaCoCo directly from the command line. No changes needed to your Maven project
tags: [java, maven, testing, jacoco]
---

No configuration needed inside `pom.xml`. Run this single command:

```bash
mvn clean org.jacoco:jacoco-maven-plugin:prepare-agent test org.jacoco:jacoco-maven-plugin:report
```

**How it works:**

1. `org.jacoco:jacoco-maven-plugin:prepare-agent`: Adds the JaCoCo agent to the JVM that runs the tests
2. `test`: Runs tests as usual
3. `org.jacoco:jacoco-maven-plugin:report`: Generates the HTML report

The report is generated in `target/site/jacoco`. To view it:

```bash
python3 -m http.server -d target/site/jacoco 8181
```

Then open `http://localhost:8181`.

> **Note:** This approach works because of [Maven's plugin-based architecture](/blog/why-use-maven/). Plugins can be invoked directly without any permanent configuration.
