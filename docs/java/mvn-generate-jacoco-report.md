---
title: Jacoco report with mvn without configuration
tags: [java, mvn, tests]
---

No need any configuration inside the pom.xml.

```sh
mvn clean org.jacoco:jacoco-maven-plugin:prepare-agent test org.jacoco:jacoco-maven-plugin:report
```

**Explanation**

1. `org.jacoco:jacoco-maven-plugin:prepare-agent`: Add the agent to the JVM that runs the tests
1. `test`: run the test as usual
1. `org.jacoco:jacoco-maven-plugin:report`: generate html report

The report is generated in `target/site/jacoco`

Recommend way to open it:

```sh
python3 -m http.server -d target/site/jacoco 8181
```

then open http://localhost:8181
