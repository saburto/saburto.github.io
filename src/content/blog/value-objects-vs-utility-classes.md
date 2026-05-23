---
title: "Value Objects vs Utility Classes: A Better Way to Model Domain Concepts"
date: 2025-03-30
description: Why value objects provide a superior approach for representing domain concepts over static utility classes
tags: [java, domain-driven-design, patterns]
---

While utility classes offer a way to organize general-purpose functionality, value objects often provide a superior approach, especially for representing domain concepts.

## What Are Utility Classes?

Utility classes contain static methods for general-purpose functionality, not tied to specific objects.

While useful, utility classes can lead to:

- **Procedural Code**: They encourage a procedural style, separating data and behavior.
- **Anemic Domain Model**: They can result in domain objects with little behavior, pushing logic into utility classes.
- **Reduced Readability**: Overuse can make code harder to follow as logic is scattered across different classes.

### Example: MoneyUtils

Imagine a utility class for handling monetary amounts:

```java
public class MoneyUtils {

  public static BigDecimal add(BigDecimal amount1, Currency currency1,
                                BigDecimal amount2, Currency currency2) {
    if (!currency1.equals(currency2)) {
      throw new IllegalArgumentException("Currencies must match for addition");
    }
    return amount1.add(amount2);
  }

  public static BigDecimal subtract(BigDecimal amount1, Currency currency1,
                                     BigDecimal amount2, Currency currency2) {
    if (!currency1.equals(currency2)) {
      throw new IllegalArgumentException("Currencies must match for subtraction");
    }
    return amount1.subtract(amount2);
  }

  public static BigDecimal multiply(BigDecimal amount, Currency currency,
                                     BigDecimal multiplier) {
    return amount.multiply(multiplier);
  }

  public static boolean isGreaterThan(BigDecimal amount1, Currency currency1,
                                       BigDecimal amount2, Currency currency2) {
    if (!currency1.equals(currency2)) {
      throw new IllegalArgumentException("Currencies must match for comparison");
    }
    return amount1.compareTo(amount2) > 0;
  }
}
```

This class has several drawbacks:

- It's not object-oriented.
- It scatters monetary logic across multiple static methods.
- It forces you to pass currency codes repeatedly.
- It doesn't naturally represent the concept of "money" in the domain.

## Value Objects: A Better Approach

Value objects are immutable objects that represent a domain concept. They encapsulate data and the behavior associated with that data.

Key characteristics include:

- **Immutability**: Their state cannot change after creation.
- **Value Equality**: Two value objects are equal if their attributes are equal.
- **Domain Focus**: They model concepts from the problem domain.

### Example: The Money Value Object

Instead of a static `MoneyUtils` class, a `Money` value object encapsulates monetary amounts and currency, unifying data and operations:

```java
public record Money(BigDecimal amount, Currency currency) {

    public Money add(Money other) {
        if (!this.currency.equals(other.currency)) {
            throw new IllegalArgumentException("Currencies must match for addition");
        }
        return new Money(this.amount.add(other.amount), this.currency);
    }

    public Money subtract(Money other) {
        if (!this.currency.equals(other.currency)) {
            throw new IllegalArgumentException("Currencies must match for subtraction");
        }
        return new Money(this.amount.subtract(other.amount), this.currency);
    }

    public Money multiply(BigDecimal multiplier) {
        return new Money(this.amount.multiply(multiplier), this.currency);
    }

    public boolean isGreaterThan(Money other) {
        if (!this.currency.equals(other.currency)) {
            throw new IllegalArgumentException("Currencies must match for comparison");
        }
        return this.amount.compareTo(other.amount) > 0;
    }

    @Override
    public boolean equals(Object other) {
        if (!(other instanceof Money otherMoney)) {
            return false;
        }
        return amount.compareTo(otherMoney.amount) == 0
            && currency.equals(otherMoney.currency);
    }

    @Override
    public int hashCode() {
        return Objects.hash(amount.stripTrailingZeros(), currency);
    }
}
```

> **Tip:** Always use `BigDecimal` for monetary operations, and use `compareTo` for equality checks.

### Benefits of Value Objects

- **Domain-Driven Design**: `Money` represents a clear domain concept.
- **Encapsulation**: Data and behavior are combined, improving cohesion.
- **Immutability**: Thread-safe and predictable.
- **Value Equality**: You can easily compare monetary values.
- **Readability**: Code becomes more expressive.

```java
// Before: utility class
BigDecimal newAmount = MoneyUtils.add(amount1, currency1, amount2, currency2);
```

vs.

```java
// After: value object
Money money1 = new Money(amount1, currency1);
Money money2 = new Money(amount2, currency2);
Money newAmount = money1.add(money2);
```

## When to Use Value Objects

Prioritize value objects when you are **modeling domain concepts**: monetary amounts, physical quantities, or any group of data that forms a conceptual whole.

## When Utility Classes Still Make Sense

Utility classes remain suitable for **truly general-purpose**, stateless operations that don't belong to a specific domain concept (e.g., pure helper functions).

If you're interested in more domain modeling patterns, check out my post on [handling status-based logic in domain objects](/blog/entity-status-ddd/).
