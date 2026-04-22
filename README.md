# Webflow Code Components Boilerplate

<!-- ![CI](https://github.com/YOUR_ORG/YOUR_REPO/actions/workflows/ci.yml/badge.svg) -->
<!-- ![License](https://img.shields.io/badge/license-MIT-blue.svg) -->
<!-- ![Node](https://img.shields.io/badge/node-20.x-green.svg) -->

A production-ready starting point for Webflow Code Component projects using React, TypeScript, and the Webflow DevLink CLI.

---

## Overview

[Webflow Code Components](https://developers.webflow.com/code-components/introduction) let you build advanced React components in your own codebase and make them available directly in the Webflow Designer — with configurable props, slots, and variants — via [DevLink](https://developers.webflow.com/devlink).

This boilerplate gives you:

- A pre-wired React + TypeScript project structure
- An `ExampleButton` component demonstrating the full pattern
- Unit and component tests (Jest)
- Visual component preview with Storybook
- Code quality enforcement via ESLint, Prettier, and GitHub Actions
- A component scaffolding generator (`pnpm new-component`)
- A complete CI/CD pipeline with GitHub Actions

**What this is not:** this is not an npm package or a library to install. It is a GitHub Template Repository — clone it once per Webflow project, then build your components inside it.

**Bundling:** The Webflow CLI handles bundling internally via Webpack. You do not need to configure your own bundler for component code.

For a full walkthrough, see the `docs/` folder:

- [`docs/GETTING_STARTED.md`](docs/GETTING_STARTED.md) — step-by-step guide: setup, creating components, commits/branches, CI/CD
- [`docs/SETUP.md`](docs/SETUP.md) — technical reference for config files and project structure
- [`docs/WEBFLOW_API.md`](docs/WEBFLOW_API.md) — using the Webflow REST API alongside Code Components

---

## Prerequisites

- **Node.js 20 LTS** — use [nvm](https://github.com/nvm-sh/nvm) and run `nvm use` (an `.nvmrc` is included)
- **pnpm 9+** — comes with Node 20
- A **Webflow account** with Code Components enabled on your workspace
- A Webflow **site** where components will be deployed

> Verify Webflow CLI authentication at [developers.webflow.com/code-components/installation](https://developers.webflow.com/code-components/installation) before running `pnpm deploy`.

---

## Getting Started

```bash
# 1. Clone (or use the GitHub "Use this template" button)
git clone https://github.com/YOUR_ORG/YOUR_REPO.git my-project
cd my-project

# 2. Use the correct Node version
nvm use

# 3. Install dependencies
pnpm install

# 4. Set up environment variables
cp .env.example .env
# Open .env and fill in your values (see Environment Variables below)

# 5. Verify everything works
pnpm storybook
```

Storybook opens at `http://localhost:6006`. If you see the `ExampleButton` stories, you're ready to build.

---

## Environment Variables

Copy `.env.example` to `.env` and populate the following:

| Variable                      | Required | Description                                                                        |
| ----------------------------- | -------- | ---------------------------------------------------------------------------------- |
| `WEBFLOW_API_TOKEN` | Yes      | Workspace API token — found in Webflow Dashboard → Workspace Settings → API Access |

> **Never commit `.env`** — it is listed in `.gitignore`. Only `.env.example` (with a placeholder value) should be committed.

> The CLI reads `WEBFLOW_API_TOKEN` automatically from your `.env` file, or you can pass it directly with `--api-token`. See the [Webflow CLI docs](https://developers.webflow.com/code-components/reference/cli).

---

## Project Structure

```
.
├── src/
│   ├── components/
│   │   └── ExampleButton/                        # Reference implementation — mirror this for every component
│   │       ├── ExampleButton.tsx                 # React component (pure UI, no Webflow SDK imports)
│   │       ├── ExampleButton.webflow.tsx          # declareComponent wrapper (picked up by Webflow CLI)
│   │       ├── ExampleButton.stories.tsx          # Storybook stories
│   │       ├── ExampleButton.test.tsx             # Jest + React Testing Library tests
│   │       └── index.ts                           # Re-exports only
│   ├── globals.ts                                 # Webflow globals entry — imports globals.css
│   ├── globals.css                                # Tailwind CSS import (@import "tailwindcss")
│   └── index.ts                                   # Barrel export for the entire library
├── .storybook/
│   ├── main.ts                            # Storybook configuration (Vite framework)
│   └── preview.ts                         # Global decorators and parameters
├── .github/
│   └── workflows/
│       ├── ci.yml                         # Runs on PR: lint → Jest
│       └── deploy.yml                     # Runs on merge to main: tests → devlink publish
├── docs/
│   ├── GETTING_STARTED.md                 # Step-by-step guide: setup, components, workflow, CI/CD
│   └── SETUP.md                           # Technical reference for config files and project structure
├── plop/
│   └── component/                         # Handlebars templates for new-component generator
├── .env.example                           # Environment variable template (commit this, not .env)
├── .gitignore
├── .prettierignore
├── eslint.config.js                       # ESLint v9 flat config
├── .prettierrc
├── webflow.json                           # Webflow CLI configuration (components glob, globals)
├── postcss.config.mjs                     # PostCSS config for Tailwind CSS
├── plopfile.js                            # Component generator definition
├── package.json
├── tsconfig.json
├── CHANGELOG.md
├── ROADMAP.md
└── RULES.md
```

---

## Creating a New Component

Use the component generator — do not create files manually:

```bash
pnpm new-component
```

Answer the prompts:

- **Component name** (PascalCase, e.g. `HeroCard`)
- **Description** (short, used in file comments)
- **Has slots?** (yes/no — slots are Webflow content regions that accept child elements)

The generator creates five files in `src/components/<ComponentName>/`:

```
src/components/HeroCard/
├── HeroCard.tsx
├── HeroCard.webflow.tsx
├── HeroCard.stories.tsx
├── HeroCard.test.tsx
└── index.ts
```

After generating, **manually add the export** to `src/index.ts`:

```ts
export { HeroCard } from './components/HeroCard';
```

Then implement your component following the `ExampleButton` pattern.

---

## ExampleButton Walkthrough

The `ExampleButton` in `src/components/ExampleButton/` is a complete, working example of every convention in this boilerplate. Read it before building your first component.

**`ExampleButton.tsx`** — The React component. Pure React: no imports from `@webflow/react` or any Webflow SDK. Props are typed via `ExampleButtonProps`. Tailwind classes handle all styling.

**`ExampleButton.webflow.tsx`** — The Webflow boundary. This is the only file that imports `declareComponent` (from `@webflow/react`) and `props` (from `@webflow/data-types`). It wraps the React component and maps each prop to a Webflow Designer control (text input, toggle, color picker, etc.). The Webflow CLI picks up this file via the `*.webflow.tsx` glob in `webflow.json`. Props declared here must exactly match `ExampleButtonProps`.

**`ExampleButton.stories.tsx`** — Storybook stories. Imports the raw React component (not the `.webflow.tsx` wrapper). Includes at minimum a `Default` story and stories covering key prop variations.

**`ExampleButton.test.tsx`** — Jest tests using React Testing Library. Covers: renders without crashing, props render correctly, key interactions fire correctly.

**`index.ts`** — Re-exports the component and its types. No logic here.

---

## Development Workflow

### Storybook

```bash
pnpm storybook        # Start Storybook dev server at http://localhost:6006
pnpm build-storybook  # Build static Storybook output
```

Use Storybook to build and visually validate components before publishing to Webflow. Stories render the raw React component — no DevLink connection required.

### Linting and Formatting

```bash
pnpm lint     # Run ESLint across the project
pnpm format   # Run Prettier across the project
```

Both are enforced by GitHub Actions on every PR — a lint or format error will block the PR from merging. Run them locally before pushing to catch issues early.

---

## Testing

### Unit and Component Tests — Jest

```bash
pnpm test              # Run all Jest tests
pnpm test -- --watch   # Watch mode for active development
```

Test files live at `src/components/<Name>/<Name>.test.tsx`. Uses React Testing Library. Every component must have a test file before a PR can merge.

---

## Publishing to Webflow

### Local

```bash
pnpm webflow:share
```

Runs `npx webflow library share` using your local credentials. After a successful run, your components appear in the Webflow Designer under Libraries. Ensure you are authenticated with the Webflow CLI before running this command.

To inspect the bundle locally before publishing:

```bash
pnpm bundle
```

This generates a `dist/` folder and serves it at `http://localhost:4000/`. Useful for debugging bundle issues without uploading to Webflow.

### CI/CD (automatic)

On every merge to `main`, the `deploy.yml` workflow automatically:

1. Runs lint and Jest (same checks as a PR)
2. Runs `pnpm deploy` using secrets stored in the GitHub repository
3. If the publish fails, the workflow fails and GitHub sends a failure notification to the commit author

See [CI/CD Setup](#cicd-setup) for how to configure secrets.

---

## CI/CD Setup

### 1. Push to GitHub and enable template

In your repository settings, check **Template repository** so others can use the "Use this template" button.

### 2. Add GitHub secrets

Go to **Settings → Secrets and variables → Actions** and add:

| Secret name                   | Value                            |
| ----------------------------- | -------------------------------- |
| `WEBFLOW_API_TOKEN` | Your Webflow Workspace API token |

### 3. Enable branch protection

Go to **Settings → Branches → Add rule** and apply the same settings to **both** `main` and `dev`:

- Check **Require status checks to pass before merging**
- Select the `CI` check from `.github/workflows/ci.yml`
- Check **Require branches to be up to date before merging**
- Check **Do not allow bypassing the above settings**

For `main` only, also enable:

- **Require a pull request before merging** (only `dev` → `main` PRs should reach here)

### Branch model

```
feat/* / fix/* / chore/*
  └── PR to dev    → CI runs
       └── merge to dev
            └── PR to main  → CI runs
                 └── merge to main → deploy to Webflow
```

Feature and fix branches always target `dev`. Only `dev` merges into `main`. See `RULES.md` for the full branching guide.

### How the workflows behave

**`ci.yml`** — triggers on pull requests targeting `dev` or `main`:

1. Install dependencies
2. Run `pnpm lint`
3. Run `pnpm test`
4. All steps must pass — enforced as a required status check on both branches

**`deploy.yml`** — triggers on push to `main` only:

1. Same steps as `ci.yml`
2. Run `npx webflow library share --no-input` with `WEBFLOW_API_TOKEN` injected from GitHub Secrets via `--api-token`
3. If any step fails, the workflow is marked as failed and GitHub sends a notification to the commit author

---

## Changelog

Changes are tracked in `CHANGELOG.md`. Follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:

```
feat: add HeroCard component
fix: correct ExampleButton disabled state
docs: update deployment instructions
```

Update `CHANGELOG.md` manually when merging significant changes to `main`.

---

## License

MIT
