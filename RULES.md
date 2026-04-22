# RULES.md

Project rules for contributors and AI coding agents. Read this before making any changes.

---

## Branching Rules

### Branch model

| Branch                | Purpose                                             | Protected | Deploys to Webflow  |
| --------------------- | --------------------------------------------------- | --------- | ------------------- |
| `main`                | Production — source of truth                        | Yes       | Yes, on every merge |
| `dev`                 | Integration — all feature branches merge here first | Yes       | No                  |
| `feat/<name>`         | New component or feature                            | No        | No                  |
| `fix/<description>`   | Bug fix                                             | No        | No                  |
| `chore/<description>` | Tooling, config, dependencies                       | No        | No                  |
| `docs/<description>`  | Documentation only                                  | No        | No                  |

### Rules

- **Never push directly to `main` or `dev`** — always use a pull request
- **Always cut branches from `dev`**, not from `main`
- **One branch per component or concern** — do not bundle unrelated changes
- **Branch names are lowercase and hyphenated**: `feat/hero-card`, `fix/button-disabled-state`
- **Delete the branch after merging** — keep the remote clean

### Workflow

```
dev
 └── feat/hero-card         ← cut from dev
      └── (work, commits)
      └── PR to dev          ← CI runs (lint, Jest, Cypress)
           └── merge to dev
                └── PR to main ← CI runs again
                     └── merge to main → deploy to Webflow
```

1. Cut a branch from `dev`: `git checkout -b feat/hero-card dev`
2. Build, test, and commit following the commit rules
3. Open a PR targeting `dev` — CI must pass before merging
4. Once the feature is stable on `dev`, open a PR from `dev` to `main`
5. Merge to `main` triggers the deploy workflow — components publish to Webflow automatically

### Component branches

Every new component gets its own branch:

```bash
git checkout -b feat/hero-card dev
```

The branch should contain only the work for that component: its five files, its export in `src/index.ts`, and nothing else. If you discover a bug in another component while working, open a separate `fix/` branch for it.

---

## What This Repository Is

This is a Webflow Code Components project. Components are built in React + TypeScript, then published to a Webflow site via the Webflow CLI (`npx webflow library share`). One repo = one Webflow site's component library. Multiple components live in `src/components/`. The Webflow CLI uses its own internal Webpack to bundle components — there is no bundler config for component code itself (unless custom CSS processing is needed). Storybook has its own internal bundler (Vite) used only for the dev server and stories.

---

## Key Commands

| Command                | What it does                                                     |
| ---------------------- | ---------------------------------------------------------------- |
| `pnpm new-component`   | Scaffold a new component with Plop (interactive prompts)         |
| `pnpm test`            | Run all Jest unit/component tests                                |
| `pnpm test -- --watch` | Jest watch mode                                                  |
| `pnpm cypress:open`    | Open Cypress GUI (component mode)                                |
| `pnpm cypress:run`     | Run Cypress headless (used in CI)                                |
| `pnpm storybook`       | Start Storybook dev server at localhost:6006                     |
| `pnpm build-storybook` | Build static Storybook output                                    |
| `pnpm lint`            | Run ESLint                                                       |
| `pnpm format`          | Run Prettier                                                     |
| `pnpm deploy`          | Runs `npx webflow library share` — publish components to Webflow |

---

## Canonical Component Structure

Every component follows this exact five-file pattern. No exceptions.

```
src/components/<ComponentName>/
├── <ComponentName>.tsx              # React component — pure UI, no Webflow SDK imports
├── <ComponentName>.webflow.tsx      # declareComponent wrapper — picked up by Webflow CLI glob
├── <ComponentName>.stories.tsx      # Storybook stories — import from .tsx, not .webflow.tsx
├── <ComponentName>.test.tsx         # Jest + React Testing Library tests
└── index.ts                         # Re-exports only — no logic
```

**Rules:**

- `<ComponentName>.tsx` must have zero imports from `@webflow/react`, `@webflow/data-types`, or any Webflow SDK package. Keep it pure React.
- `<ComponentName>.webflow.tsx` is the only file that calls `declareComponent` (imported from `@webflow/react`) and uses `props` (imported from `@webflow/data-types`). Props mapped here must match the React component's `Props` interface exactly.
- The Webflow CLI picks up `*.webflow.tsx` files via the glob in `webflow.json` — do not rename this file or change the extension.
- `index.ts` re-exports the component and its types. Nothing else.
- Do not add a `styles/` subfolder or separate CSS files — use Tailwind classes directly in JSX.
- Component folder names are PascalCase, matching the component name exactly.

---

## Naming Conventions

| Thing                     | Convention                                      | Example                                                               |
| ------------------------- | ----------------------------------------------- | --------------------------------------------------------------------- |
| Component name            | PascalCase                                      | `HeroCard`                                                            |
| Component folder          | PascalCase                                      | `src/components/HeroCard/`                                            |
| Props interface           | `<Name>Props`                                   | `HeroCardProps`                                                       |
| Story file default export | Component meta object                           | `export default { title: 'HeroCard', component: HeroCard }`           |
| Story named exports       | Descriptive, PascalCase                         | `export const Default`, `export const Disabled`                       |
| Test file                 | One `describe` per component, `it` per behavior | `describe('HeroCard', () => { it('renders without crashing', ...) })` |
| Cypress spec              | `<Name>.cy.tsx` in `cypress/component/`         | `HeroCard.cy.tsx`                                                     |

---

## TypeScript Rules

- Strict mode is enabled in `tsconfig.json` — do not relax it
- Do not use `any`. Use `unknown` if the type is genuinely unknown, then narrow it
- All component props must be typed via a named interface (e.g. `HeroCardProps`), not inline
- The `declareComponent` wrapper in `.webflow.tsx` must type its props to match the React component's interface
- Do not use `// @ts-ignore` or `// @ts-expect-error` without an explanatory comment on the same line

---

## Testing Expectations

### Jest (unit / component)

- Every component must have a `.test.tsx` file
- Minimum coverage per component:
  - Renders without crashing
  - Key props render the correct output
  - Key interactions (clicks, inputs) fire the correct callbacks
- Mock external dependencies; never make real network calls in Jest tests
- Use `@testing-library/react` and `@testing-library/jest-dom`

### Cypress (integration — component mode)

- Specs live in `cypress/component/<Name>.cy.tsx`
- Cypress mounts components in a real browser — no app server needed
- Use Cypress for behavior that benefits from a real browser (hover states, focus management, animations)
- Do not duplicate what Jest already covers
- Do not test the Webflow publish flow in Cypress — that is handled by the deploy workflow

---

## CI Pipeline Reference

### `ci.yml` — runs on every pull request to `dev` or `main`

1. Checkout code
2. Set up Node 20
3. `pnpm install --frozen-lockfile`
4. `pnpm lint` — fails on any ESLint error
5. `pnpm format:check` — fails if any file is not Prettier-formatted
6. `pnpm test` — fails if any Jest test fails
7. `pnpm cypress:run` — fails if any Cypress spec fails
8. All steps must pass for the PR to be mergeable

### `deploy.yml` — runs on push to `main`

1. Same steps as `ci.yml`
2. `npx webflow library share --no-input --api-token $WEBFLOW_WORKSPACE_API_TOKEN` — publishes using the token from GitHub Secrets
3. If the deploy step fails: workflow is marked failed, GitHub notifies the commit author

---

## Files to Never Modify Without Explicit Instruction

| File / Directory          | Why                                                                                                          |
| ------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `.github/workflows/*.yml` | CI/CD pipeline — changes affect the whole team and break deployments                                         |
| `plop/component/`         | Generator templates — changes affect all future components scaffolded                                        |
| `webflow.json`            | Webflow CLI configuration — incorrect changes break publishing (components glob, globals path, bundleConfig) |
| `tsconfig.json`           | TypeScript config — changes cascade to all components                                                        |
| `src/index.ts`            | Library barrel export — must stay in sync with all components                                                |

---

## Adding a New Component (step-by-step)

1. Run `pnpm new-component` and follow the prompts
2. Do **not** create files manually — always use the generator
3. Implement the React component in `<Name>.tsx` using Tailwind for styling
4. Wire up `declareComponent` (from `@webflow/react`) in `<Name>.webflow.tsx`, mapping props using `props` (from `@webflow/data-types`) to Webflow Designer controls
5. Add at least a `Default` story in `<Name>.stories.tsx`
6. Write Jest tests in `<Name>.test.tsx` (minimum: render, props, interactions)
7. Write a Cypress spec in `cypress/component/<Name>.cy.tsx`
8. **Manually add** the export to `src/index.ts`:
   ```ts
   export { ComponentName } from './components/ComponentName';
   ```
9. Run `pnpm test` and `pnpm lint` — both must pass before committing

---

## `declareComponent` Explained

`declareComponent` is the function from `@webflow/react` that registers a React component with the Webflow Designer. It lives in `<ComponentName>.webflow.tsx` — nowhere else. Prop type helpers come from `@webflow/data-types` (e.g. `props.Text`, `props.Variant`).

It does three things:

1. Wraps the React component
2. Maps React props to Webflow Designer controls (text fields, toggles, dropdowns, color pickers)
3. Optionally defines slots — content regions that accept Webflow child elements

The props you declare here must exactly match the React component's `Props` interface. Do not invent new props in the wrapper — add them to the React component first, then expose them in the wrapper.

See the [Webflow prop types reference](https://developers.webflow.com/code-components/reference/prop-types) for the full list of available Designer controls.

---

## Environment Variables

- Never hardcode API keys, site IDs, or any credentials in source files
- `.env` is gitignored — never commit it
- `.env.example` must stay up to date — if you add a new env var, add it to `.env.example` with a placeholder value and a comment explaining what it is
- Access env vars in code via `process.env.VARIABLE_NAME`; do not import `.env` directly

---

## Storybook Conventions

- Every component must have at least a `Default` story
- Add stories for each meaningful prop variation (e.g. `Disabled`, `WithIcon`, `Loading`)
- Import the raw React component from `<ComponentName>.tsx` or `index.ts` — never from `<ComponentName>.webflow.tsx`
- Story `args` must match the component's `Props` interface exactly
- Stories are for visual development and documentation — keep them clean and representative

---

## Commit Rules

Follow [Conventional Commits](https://www.conventionalcommits.org/). Every commit message must match this format:

```
<type>(<scope>): <short description>
```

### Types

| Type       | When to use                                           |
| ---------- | ----------------------------------------------------- |
| `feat`     | Adding a new component or new functionality           |
| `fix`      | Bug fix in a component or configuration               |
| `docs`     | Changes to README, RULES, ROADMAP, or inline comments |
| `style`    | Formatting, whitespace, Prettier — no logic change    |
| `refactor` | Code restructure with no behavior change              |
| `test`     | Adding or updating tests (Jest or Cypress)            |
| `chore`    | Tooling, dependencies, CI config, generator templates |

### Scope (optional but encouraged)

Use the component name or area being changed:

```
feat(HeroCard): add slot support
fix(ExampleButton): correct disabled pointer-events
chore(ci): cache node_modules in deploy workflow
test(ExampleButton): add Cypress click interaction spec
```

### Rules

- **Subject line:** imperative mood, lowercase, no period — `add slot support` not `Added slot support.`
- **Max length:** 72 characters for the subject line
- **Body (optional):** use it to explain _why_, not _what_ — the diff already shows what changed
- **Breaking changes:** add `!` after the type and explain in the body: `feat(ExampleButton)!: rename label prop to children`
- **One concern per commit:** do not mix a component change with a CI fix in the same commit
- **Never commit:**
  - `.env` files
  - `node_modules/`
  - `dist/` or any build output
  - API keys or secrets anywhere in the codebase

### Examples

```
feat(Badge): add Light and Dark variant support
fix(ExampleButton): prevent double-click firing onClick twice
docs: update deployment instructions in README
chore(deps): upgrade @webflow/react to 1.2.0
test(HeroCard): add Cypress focus management spec
refactor(ExampleButton): extract button classes into constant
```
