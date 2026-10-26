# Git Workflow

Quick reference for the branching and release workflow on this project.

---

## Branch types

| Branch                | Purpose                                     |
| --------------------- | ------------------------------------------- |
| `main`                | Production — deploys to Webflow             |
| `dev`                 | Integration — all branches merge here first |
| `feat/<name>`         | New component or feature                    |
| `fix/<description>`   | Bug fix                                     |
| `chore/<description>` | Tooling, config, dependencies               |
| `docs/<description>`  | Documentation only                          |

---

## 1. Start a new branch

Always cut from `dev`:

```bash
git checkout dev
git pull origin dev
git checkout -b feat/<name>
```

---

## 2. Scaffold a new component

```bash
pnpm new-component
```

Then manually add the export to `src/index.ts`:

```ts
export { ComponentName } from './components/ComponentName';
```

---

## 3. Before committing — run tests and lint

```bash
pnpm test
pnpm lint
```

Both must pass before committing.

---

## 4. Stage and commit

Stage specific files (avoid `git add .`):

```bash
git add src/components/MyComponent/ src/index.ts
git add -u   # picks up deletions of tracked files
```

Commit using Conventional Commits format:

```bash
git commit -m "feat(MyComponent): short description in imperative mood"
```

### Commit types

| Type       | When to use                         |
| ---------- | ----------------------------------- |
| `feat`     | New component or feature            |
| `fix`      | Bug fix                             |
| `docs`     | Documentation changes               |
| `style`    | Formatting only, no logic change    |
| `refactor` | Restructure with no behavior change |
| `test`     | Adding or updating tests            |
| `chore`    | Tooling, dependencies, config       |

### Examples

```
feat(CtaCodeComponent): add hover animation
fix(CtaCodeComponent): correct white variant background
chore: update webflow CLI to 1.17.1
```

---

## 5. Push the branch

First push (sets upstream):

```bash
git push -u origin feat/<name>
```

Subsequent pushes:

```bash
git push
```

---

## 6. Open a pull request to `dev`

```bash
gh pr create --base dev --head feat/<name> --title "feat(MyComponent): short description" --body ""
```

Check PR status:

```bash
gh pr status
gh pr view feat/<name>
```

---

## 7. Merge `dev` into `main`

Once the feature is stable on `dev`, open a PR from `dev` to `main`:

```bash
gh pr create --base main --head dev --title "chore: merge dev into main" --body ""
```

Merging to `main` triggers the deploy workflow — components publish to Webflow automatically.

---

## 8. Delete a branch after merging

Remote:

```bash
git push origin --delete <branch-name>
```

Local:

```bash
git branch -d <branch-name>
```

---

## Useful checks

```bash
git log --all --oneline --graph --decorate   # full branch overview
gh pr status                                  # open PRs
pnpm test                                     # run tests
pnpm lint                                     # run linter
```
