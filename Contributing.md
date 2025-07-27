# Contributing Guidelines

Keep your repository updated. When your mentor accepts your pull request, it goes to the Academy's repository, but not to your fork.

#### 1. Don't commit anything directly to `master` in your repository

This will prevent you from updating your repository cleanly and may cause conflicts.

#### 2. Before starting a new assignment, update `master`

You can update your repository from the Academy's repository like this:

```
# In your local copy, switch to the master branch
git checkout master

# Pull changes from the Academy's repository¹
git pull academy master

# Push changes to your fork on GitHub
git push
```

¹ The `academy` should have a link to the Academy's repository. If it's not there, add it:

```
git remote add academy git@github.com:htmlacademy-nestjs/107440-readme-6.git
```

When you've updated `master`, create a branch for the new assignment:

```
git checkout -b module2-task1
```

`module2-task1` is the branch name. Under each assignment description in the intensive interface, you'll be shown the correct branch name.

--

#### Have a question?

Check out the [collection of frequently asked Git questions](http://firstaidgit.ru).
