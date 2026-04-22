# Project Setup Guide

A technical reference for the project structure and configuration files. Read this alongside `RULES.md` before making changes.

---

## How the project works

```
Your React component (.tsx)
  └── Webflow wrapper (.webflow.tsx)  ← declareComponent registers props with the Designer
       └── Webflow CLI picks it up via glob in webflow.json
            └── npx webflow library share
                 └── Published to your Webflow site as a shared library
```

The key separation: your React component knows nothing about Webflow. The `.webflow.tsx` file is the bridge — it wraps the component and tells Webflow how to expose its props in the Designer.

---

## Configuration files

### `webflow.json`

The main configuration for the Webflow CLI.

```json
{
  "library": {
    "name": "My Component Library",
    "components": ["./src/**/*.webflow.@(js|jsx|mjs|ts|tsx)"],
    "globals": "./src/globals.ts"
  }
}
```

| Field        | What it does                                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------------------------ |
| `name`       | The library name shown in the Webflow Designer. **Change this per project.**                                 |
| `components` | Glob that tells the CLI which files to bundle. Any `*.webflow.tsx` file in `src/` is automatically included. |
| `globals`    | Entry point for global styles and decorators. This is where Tailwind CSS is loaded.                          |

> When starting a new project from this boilerplate, the first thing to change is `library.name` in `webflow.json`.

---

### `src/globals.ts` and `src/globals.css`

Webflow renders components inside a [Shadow DOM](https://developers.webflow.com/code-components/component-architecture#shadow-dom-and-react-roots), which isolates them from the page's global styles. To make Tailwind classes work inside that Shadow DOM, styles must be injected via the `globals` entry point.

```
src/globals.css   →   @import "tailwindcss"
src/globals.ts    →   import './globals.css'
webflow.json      →   "globals": "./src/globals.ts"
```

The Webflow CLI reads `globals.ts` and injects the resulting CSS into every component's Shadow DOM automatically. You do not need to import `globals.css` in your components — it is applied globally.

---

### `postcss.config.mjs`

Configures PostCSS to process Tailwind CSS during the Webflow CLI build step.

```mjs
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

No changes needed here unless you add other PostCSS plugins (e.g. autoprefixer).

---

### `tsconfig.json`

TypeScript configuration for the project. Key settings:

| Option               | Value       | Why                                                                  |
| -------------------- | ----------- | -------------------------------------------------------------------- |
| `strict`             | `true`      | Enforces full type safety — do not relax this                        |
| `jsx`                | `react-jsx` | Enables JSX without importing React in every file                    |
| `moduleResolution`   | `bundler`   | Modern resolution compatible with the Webflow CLI's internal Webpack |
| `noUnusedLocals`     | `true`      | Keeps code clean — unused imports are a compile error                |
| `noUnusedParameters` | `true`      | Same for function parameters                                         |

---

### `eslint.config.js`

ESLint v9 flat config for TypeScript + React. Key rules:

| Rule                                 | Setting | Why                                      |
| ------------------------------------ | ------- | ---------------------------------------- |
| `@typescript-eslint/no-explicit-any` | `error` | Forces proper typing — no escape hatches |
| `react/react-in-jsx-scope`           | `off`   | Not needed with `react-jsx` transform    |
| `@typescript-eslint/no-unused-vars`  | `error` | Keeps components clean                   |

---

### `.prettierrc`

Formatting settings applied by `pnpm format` and enforced on push:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

---

### Lint and format enforcement

Lint and formatting are enforced by GitHub Actions on every PR — both `pnpm lint` and `pnpm format:check` must pass before a PR can merge. Run them locally before pushing to catch issues early:

```sh
pnpm lint         # ESLint across all .ts and .tsx files
pnpm format:check # Prettier check (read-only, does not auto-fix)
pnpm format       # Auto-fix formatting issues
```

---

## Component structure

Every component follows the same five-file pattern. Use `pnpm new-component` to scaffold them — do not create files manually.

```
src/components/ExampleButton/
├── ExampleButton.tsx          # 1. React component — pure UI
├── ExampleButton.webflow.tsx  # 2. Webflow registration — declareComponent
├── ExampleButton.stories.tsx  # 3. Storybook stories
├── ExampleButton.test.tsx     # 4. Jest tests
└── index.ts                   # 5. Re-exports
```

### 1. `ExampleButton.tsx` — the React component

Pure React. No Webflow SDK imports. Receives typed props and renders UI using Tailwind classes.

```tsx
export interface ExampleButtonProps {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}

export const ExampleButton = ({ label, disabled = false, onClick }: ExampleButtonProps) => (
  <button onClick={onClick} disabled={disabled} className="...">
    {label}
  </button>
);
```

### 2. `ExampleButton.webflow.tsx` — the Webflow wrapper

The only file that imports from `@webflow/react` or `@webflow/data-types`. It wraps the React component and maps props to Webflow Designer controls.

```tsx
import { declareComponent } from '@webflow/react';
import { props } from '@webflow/data-types';
import { ExampleButton } from './ExampleButton';

export default declareComponent(ExampleButton, {
  name: 'ExampleButton',
  description: 'A simple button component',
  group: 'Buttons',
  options: {
    ssr: true,
  },
  props: {
    label: props.Text({ name: 'Label', defaultValue: 'Click me' }),
  },
});
```

`declareComponent` configuration fields:

| Field         | Required | Description                                              |
| ------------- | -------- | -------------------------------------------------------- |
| `name`        | Yes      | Component name shown in the Webflow Designer             |
| `description` | No       | Short description shown in the Designer                  |
| `group`       | No       | Groups related components together in the Designer panel |
| `options.ssr` | No       | Enable server-side rendering support                     |
| `props`       | No       | Maps React props to Webflow Designer controls            |

Prop type helpers from `@webflow/data-types`:

| Helper               | Designer control            |
| -------------------- | --------------------------- |
| `props.Text(...)`    | Text input                  |
| `props.Variant(...)` | Dropdown with fixed options |

For the full list, see the [Webflow prop types reference](https://developers.webflow.com/code-components/reference/prop-types).

### 3. `ExampleButton.stories.tsx` — Storybook stories

Imports the raw React component (never the `.webflow.tsx` wrapper). Added in Phase 3.

### 4. `ExampleButton.test.tsx` — Jest tests

Uses React Testing Library. Added in Phase 2. At minimum covers: renders without crashing, key props, key interactions.

### 5. `index.ts` — re-exports

```ts
export { ExampleButton } from './ExampleButton';
export type { ExampleButtonProps } from './ExampleButton';
```

After creating a new component, manually add its export to `src/index.ts`.

---

## Publishing workflow

### Local

```bash
# Publish to Webflow (reads WEBFLOW_WORKSPACE_API_TOKEN from .env automatically)
pnpm deploy
```

To inspect the bundle before publishing:

```bash
pnpm bundle
```

Generates a `dist/` folder and serves it at `http://localhost:4000/`. Use this to debug bundle issues without uploading to Webflow. To inspect the raw Webpack config being used, add `--debug-bundler` to the command.

### CI/CD

On merge to `main`, GitHub Actions runs:

```bash
npx webflow library share --no-input
```

Using `WEBFLOW_WORKSPACE_API_TOKEN` from GitHub repository secrets. See the CI/CD Setup section in `README.md` for configuration steps.

> **Change detection:** The Webflow CLI will overwrite the current library on every deploy. If you remove a `*.webflow.tsx` file without running a new deploy, that component stays in Webflow. Always deploy after removing components.

---

## Starting a new project from this boilerplate

1. Click **"Use this template"** on GitHub (or clone and remove the remote)
2. Update `library.name` in `webflow.json`
3. Run `pnpm install`
4. Add `WEBFLOW_WORKSPACE_API_TOKEN` to `.env` (copy from `.env.example`)
5. Add the same secrets to GitHub repository settings
6. Enable branch protection on `main` and `dev` (see `README.md`)
7. Run `pnpm storybook` to verify the dev environment
8. Start building components with `pnpm new-component`
