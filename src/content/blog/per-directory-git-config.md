---
title: How to Use Per-Directory Git Configs with `includeIf`
date: 2024-06-15
description: How to use includeIf in .gitconfig for per-directory settings
tags: [git, tools]
---

Sometimes you need different Git configurations for different repositories.

**Real-Life Case:** On your company laptop, you have your personal `dotfiles` repository where you use your personal email. However, for all company repositories, you want to use your work email or other corporate-specific configurations.

## Solution

The `includeIf` directive in your global Git configuration file `~/.gitconfig` allows you to specify a path prefix condition. When the condition is met, Git loads a separate configuration file.

**`~/.gitconfig`**

```ini
[user]
  name = John Smith
  email = john@smith.com

[includeIf "gitdir:~/git/work/projects/"]
  path = ~/.gitconfig-for-work
```

**`~/.gitconfig-for-work`**

```ini
[user]
  name = jsmith
  email = jsmith@acme.com
```

**How it works:**

1. The main `.gitconfig` file sets your personal name and email
1. The `includeIf` directive checks if the Git directory (`gitdir`) starts with the specified path (`~/git/work/projects/`)
1. If the condition is true, Git also loads the configurations from `~/.gitconfig-work`, overriding the user name and email with your work-specific values

## More info

[Git docs on includeIf](https://git-scm.com/docs/git-config#Documentation/git-config.txt-includeIfltconditiongtpath)
