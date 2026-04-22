# Project Roadmap

This document tracks how the boilerplate is built out from scratch. Each phase is independently mergeable and produces a working state. Complete phases in order.

---

## Phase 1: Core Setup

**Goal:** A working project where a developer can write a component and publish it to Webflow locally.

### Tasks

- [ ] Initialize `package.json` with project name, version `0.1.0`, and script stubs
- [ ] Install and configure TypeScript (`tsconfig.json` — strict mode, JSX preserve, path aliases)
- [ ] Add `.nvmrc` pinned to Node 20 LTS
- [ ] Install React and React DOM
- [ ] Install Webflow CLI (`@webflow/cli`); create `webflow.json` with components glob (`./src/**/*.webflow.@(js|jsx|mjs|ts|tsx)`) and globals path
- [ ] Create `.env.example` with `WEBFLOW_WORKSPACE_API_TOKEN` and `WEBFLOW_WORKSPACE_API_TOKEN` placeholder values
- [ ] Create `.gitignore` (node_modules, .env, dist, .DS_Store, storybook-static, cypress/screenshots, cypress/videos)
- [ ] Create empty `src/index.ts` barrel file
- [ ] Install Tailwind CSS (`tailwindcss @tailwindcss/postcss postcss`); create `postcss.config.mjs`
- [ ] Create `src/globals.css` with `@import "tailwindcss"`
- [ ] Create `src/globals.ts` that imports `./globals.css`; reference it in `webflow.json` as `"globals": "./src/globals.ts"`
- [ ] Build `ExampleButton` — all five files:
  - `ExampleButton.tsx` with `ExampleButtonProps` (label, disabled, onClick) — pure React, Tailwind classes
  - `ExampleButton.webflow.tsx` with `declareComponent` (from `@webflow/react`) and `props` (from `@webflow/data-types`)
  - `ExampleButton.stories.tsx` (placeholder — full stories in Phase 3)
  - `ExampleButton.test.tsx` (placeholder — full tests in Phase 2)
  - `index.ts` re-export
- [ ] Export `ExampleButton` from `src/index.ts`
- [ ] Install ESLint with TypeScript and React plugins; create `.eslintrc.json`
- [ ] Install Prettier; create `.prettierrc`
- [ ] Add `pnpm lint` and `pnpm format` scripts
- [ ] Verify lint and format run cleanly locally (`pnpm lint` and `pnpm format:check`)

**Deliverables:** Component publishable to Webflow via `pnpm deploy` (`npx webflow library share`). Lint enforced via GitHub Actions CI.

---

## Phase 2: Testing Infrastructure

**Goal:** Full Jest and Cypress setup with `ExampleButton` covered by real tests.

### Tasks

- [ ] Install Jest, `ts-jest`, `@types/jest`
- [ ] Install `@testing-library/react` and `@testing-library/jest-dom`
- [ ] Create `jest.config.ts` — configure transform (ts-jest), module name mapper, setup files
- [ ] Create `jest.setup.ts` to import `@testing-library/jest-dom`
- [ ] Write complete `ExampleButton.test.tsx`:
  - Renders without crashing
  - `label` prop renders in the DOM
  - `disabled` prop applies disabled state
  - Click fires `onClick` callback
- [ ] Run `pnpm test` — all tests pass
- [ ] Install Cypress
- [ ] Configure `cypress.config.ts` for **component testing mode** (no app server required)
- [ ] Create `cypress/component/ExampleButton.cy.tsx`:
  - Mounts the component
  - Verifies label renders
  - Verifies click behavior in a real browser
- [ ] Add `pnpm cypress:open` and `pnpm cypress:run` scripts
- [ ] Run `pnpm cypress:run` — spec passes

**Deliverables:** All tests pass locally. Test infrastructure ready for new components.

---

## Phase 3: Storybook

**Goal:** Storybook running locally with `ExampleButton` stories, ready to use as a component dev environment.

### Tasks

- [ ] Install Storybook with Vite framework (manual setup preferred over `storybook init` to avoid config conflicts)
- [ ] Configure `.storybook/main.ts` — Vite framework, stories glob, addons
- [ ] Configure `.storybook/preview.ts` — import Tailwind CSS, global decorators if needed
- [ ] Write complete `ExampleButton.stories.tsx`:
  - `Default` — standard button
  - `Disabled` — disabled state
  - `LongLabel` — edge case with long text
- [ ] Run `pnpm storybook` — Storybook starts on port 6006 with no errors, stories render
- [ ] Add `pnpm build-storybook` script

**Deliverables:** Storybook running with ExampleButton stories. No build errors. Tailwind classes render correctly in stories.

---

## Phase 4: CI/CD Pipeline

**Goal:** GitHub Actions workflows that enforce quality gates on PRs and automate publishing on merge to `main`.

### Tasks

- [ ] Create `.github/workflows/ci.yml`:
  - Trigger: `pull_request` targeting `dev` or `main`
  - Steps: checkout → setup Node 20 → `pnpm install --frozen-lockfile` → lint → Jest → Cypress headless
  - Cache `node_modules` using `actions/cache`
  - This workflow is a required status check on both `dev` and `main`
- [ ] Create `.github/workflows/deploy.yml`:
  - Trigger: `push` to `main`
  - Steps: same as `ci.yml`, then `npx webflow library share --no-input`
  - Inject `WEBFLOW_WORKSPACE_API_TOKEN` and `WEBFLOW_WORKSPACE_API_TOKEN` as env vars from GitHub Secrets
  - On failure: workflow fails → GitHub sends default failure notification to commit author
- [ ] Update README.md CI/CD Setup section with actual workflow names and status check configuration steps
- [ ] **Test:** Open a PR with a lint error — verify CI fails and blocks merge
- [ ] **Test:** Merge a clean PR to `main` — verify components appear in the Webflow Designer after `deploy.yml` completes

**Deliverables:** Both workflows green end-to-end. Deploy confirmed working against a real Webflow site.

---

## Phase 5: Component Generator (DX)

**Goal:** `pnpm new-component` produces a complete, correctly structured component scaffold.

### Tasks

- [ ] Install Plop
- [ ] Create `plopfile.js` at root — define `new-component` generator
- [ ] Create Handlebars templates in `plop/component/`:
  - `__name__.tsx.hbs` — React component with typed props and Tailwind placeholder
  - `__name__.webflow.tsx.hbs` — `declareComponent` (from `@webflow/react`) + `props` (from `@webflow/data-types`) wrapper with placeholder prop mapping
  - `__name__.stories.tsx.hbs` — Storybook story with `Default` export
  - `__name__.test.tsx.hbs` — Jest test with render test
  - `index.ts.hbs` — re-export template
- [ ] Define Plop prompts:
  - Component name (PascalCase, validated)
  - Short description
  - Has slots? (yes/no — conditionally adds slot definition in `.webflow.tsx` template)
- [ ] Add `"new-component": "plop"` script to `package.json`
- [ ] **Test:** Run `pnpm new-component`, enter `TestCard` — verify all five files are created with correct content and naming
- [ ] Verify generated component passes `pnpm lint` and `pnpm test` immediately after generation (with placeholder content)
- [ ] Update README.md and AGENTS.md if any generator behavior differs from what is documented

**Deliverables:** `pnpm new-component` produces a working scaffold. Generated components are lint-clean and have a passing placeholder test.

---

## Future Considerations

These are not planned but worth tracking as the project matures:

- **Storybook deployment** — publish Storybook as a static site (GitHub Pages, Vercel) for stakeholder review
- **Visual regression testing** — add Chromatic or Percy to catch unintended visual changes
- **Multi-site support** — allow a single repo to publish to multiple Webflow sites via environment profiles
- **CLI tool** — a separate CLI that initializes a new project from this boilerplate with prompted configuration (API keys, site ID, component name)
- **npm publishing** — if components are ever shared across projects as an npm package, add Changesets for versioning
