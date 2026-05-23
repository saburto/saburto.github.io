---
title: "Handling Entity Status in DDD: A Clean Approach"
date: 2024-06-22
description: How to implement status-based logic in a way that is both robust and easy to understand
tags: [java, domain-driven-design, patterns, design-patterns]
---

More than once, you have encountered a scenario where a simple class representing a domain entity has a `status`, like this:

```java
public class Order {
  private long id;
  private Status status;

  public Status getStatus() {
    return status;
  }
}
```

This status could have different values:

```java
public enum Status {
  ACTIVE, PENDING, CANCELED
}
```

Now you have to implement some logic for that `Order` entity based on the status.

## Simple direct Comparison

This is the simplest approach. It's easy to understand and works well when the logic is straightforward.

```java
public void process(Order order) {
  if (order.getStatus() == Status.ACTIVE) {
    // some important logic here
  }
}
```

However, one downside is that `BusinessService` has to know about `Status.ACTIVE` in order to check its status. Also if we need to add another process class that requires the order in status active we must duplicate the `if` expression:

```java
public void anotherProcess(Order order) {
  if (order.getStatus() == Status.ACTIVE) {
    // even more important logic here!
  }
}
```

## Encapsulation with a Method

Now we have two classes with the same `if` expression. But now the business asks for new changes:

> An order is active when the status is `active` and the creation time is not older than 1 month.

We could add something like this in both locations:

```java
order.getStatus() == Status.ACTIVE &&
  order.getCreatedDate().before(order.getCreatedDate().plus(1, Month))
```

Do we really want that duplicated across our project?

Time to introduce some encapsulation inside the `Order` class.

> **Warning:** Some developers have a strong tendency to introduce **"utility methods" or "helper methods."** Please resist this temptation! Use the existing objects within your current context instead.

```java
public class Order {
  public boolean isActive() {
    return status == Status.ACTIVE && isOlderThan(Month.of(1));
  }

  private boolean isOlderThan(Period period) {
    return createdDate.isBefore(Now.minus(period));
  }
}
```

Now both services can just call `order.isActive()`:

```java
public void process(Order order) {
  if (order.isActive()) {
    // some important logic here
  }
}
```

We encapsulate the knowledge of what constitutes an **"active"** order within the `Order` class. This improves readability and reduces coupling. Consumers don't need to know about the underlying enum values or any other criteria.

## Using polymorphism with strategies

Business requires more changes (again!), **for each status** we need to apply some logic:

| Description                      | Initial Status              | Result Status |
| -------------------------------- | --------------------------- | ------------- |
| Do some important logic          | Active                      | Success       |
| Set order pending                | Active and older than 1 month | Pending     |
| Send email when order is pending | Pending                     | Sent          |
| Cancel order after 1 month       | Sent and 1 month in `Sent`  | Cancel        |

Each concrete implementation of `StatusHandler` encapsulates the logic for a specific order status. In other words, these are different **strategies**.

The business service now gets the handler according to the order, then executes it:

```java
public void process(Order order) {
  var handler = statusHandlerFactory.generate(order);
  var orderProcessed = handler.process();
}
```

Creation of specific handlers is moved to the `StatusHandlerFactory`:

```java
public StatusHandler generate(Order order) {
  return switch(status) {
    case ACTIVE -> new ActiveStatusHandler(order);
    case CANCELED -> new CanceledStatusHandler(order);
    case PENDING -> new PendingStatusHandler(order, emailSenderService);
  };
}
```

Example implementation:

```java
public class PendingStatusHandler implements StatusHandler {

  private final Order order;
  private final EmailSenderService emailSenderService;

  public PendingStatusHandler(Order order, EmailSenderService emailSenderService) {
    Assert.isTrue(order.isPending(), "Order must be pending");
    this.order = order;
    this.emailSenderService = emailSenderService;
  }

  @Override
  public Order process() {
    var emailContent = prepareEmailContent(order);
    var email = order.email();
    emailSenderService.send(email, emailContent);
    return order.withStatusSent();
  }
}
```

### Main benefits

- **Open/Closed Principle:** New status handlers can be added without modifying existing `Order` or `BusinessService` classes.
- **Easy to Test:** The logic for each status is isolated in its own class.
- **External Calls:** Status handlers can easily interact with other objects (e.g., repositories, services).

## Using the State pattern

Another polymorphic approach is the **State** design pattern, where `Order` behaves differently according to its internal state:

```java
public class Order {
  private Status status;
  private StateHandler stateHandler;

  public void process() {
    stateHandler.process();
  }
}
```

I don't prefer this approach, because it forces `Order` to be mutable and allows `stateHandler` to be `null`.

> **Tip:** Design patterns are like a **glossary, a common vocabulary**, rather than a **specific recipe**. Implementations can vary but the idea is the same.

## Conclusion

When developing your system, begin with the simplest approach. Don't rush to implement complex patterns like strategy or state at the beginning. Let your requirements and business rules guide the implementation, and embrace evolutionary design, gradually adding more abstraction as needed.

For a deeper dive into domain modeling patterns, read my post on [why value objects are better than utility classes](/blog/value-objects-vs-utility-classes/).

**Don't shoot yourself in the foot!**

## Resources

- [Strategy Pattern - Wikipedia](https://en.wikipedia.org/wiki/Strategy_pattern)
- [State Pattern - Wikipedia](https://en.wikipedia.org/wiki/State_pattern)
- [Open/Closed Principle - Wikipedia](https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle)
- [Head First Design Patterns, 2nd Edition](https://www.oreilly.com/library/view/head-first-design/9781492077992/)
