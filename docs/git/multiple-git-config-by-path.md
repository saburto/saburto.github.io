---
title: Different git configurations by current path
tags: [git]
---

## Problem

Sometimes you need different Git configurations for different repositories.

**Real-Life Case:** On your company laptop, you have your personal `dotfiles` repository where you use your personal email. However, for all your company repositories, you want to use your work email or other corporate-specific configurations.

## Solution

The `includeIf` directive in your global Git configuration file `(~/.gitconfig)` allows you to specify a path prefix condition. When the condition is met, Git loads a separate configuration file.

## Example

```ini title=.gitconfig

[user]
  name = John Smith
  email = john@smith.com
[includeIf "gitdir:~/git/work/projects"]
  path = ~/.gitconfig-for-work
```

```ini title=.gitconfig-for-work
[user]
  name = jsmith
  email = jsmith@acme.com
```

**Explanation:**

1. The main `.gitconfig` file sets your personal name and email.
1. The `includeIf `directive checks if the Git directory `(gitdir)` starts with the specified path `(~/git/work/projects/)`.
1. If the condition is true (you're working within a project under `~/git/work/projects/`), Git also loads the configurations from `~/.gitconfig-work`. This file overrides the user name and email with your work-specific values.

## More info

https://git-scm.com/docs/git-config#Documentation/git-config.txt-includeIfltconditiongtpath
