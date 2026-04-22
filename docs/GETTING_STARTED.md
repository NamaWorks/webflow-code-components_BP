# Getting Started

A practical, step-by-step guide for working with this boilerplate — from first setup to deploying components to Webflow.

---

## 1. Starting a new project

### Clone the boilerplate

Click **"Use this template"** on GitHub, or clone manually and reset the remote:

```bash
git clone https://github.com/NamaWorks/webflow-code-components_BP.git my-project
cd my-project
git remote remove origin
git remote add origin https://github.com/YOUR_ORG/YOUR_NEW_REPO.git
```

### Install dependencies

```bash
pnpm install
```

### Configure the project

**1. Set the library name** — open `webflow.json` and change `"name"` to your project name:

```json
{
  "library": {
    "name": "My Project Name"
  }
}
```

**2. Set up environment variables:**

```bash
cp .env.example .env
```

Open `.env` and add your Webflow Workspace API token (found in Webflow Dashboard → Workspace Settings → API Access):

```
WEBFLOW_API_TOKEN=your_token_here
```

**3. Add the token to GitHub Secrets** — go to your repo's **Settings → Secrets and variables → Actions** and add `WEBFLOW_API_TOKEN`.

**4. Enable branch protection** — go to **Settings → Branches** and add rules for both `main` and `dev`:

- Require status checks to pass before merging (select the `CI` check)
- Require branches to be up to date before merging

### Verify the setup

```bash
pnpm storybook
```

If Storybook opens at `http://localhost:6006` and you can see the `ExampleButton` stories, you're ready to build.

---

## 2. Creating a component

### Step 1 — Create your branch

Always cut a new branch from `dev`:

```bash
git checkout dev
git pull origin dev
git checkout -b feat/my-component-name
```

### Step 2 — Run the generator

```bash
pnpm new-component
```

Answer the prompts:

- **Component name** — PascalCase (e.g. `HeroCard`)
- **Description** — short description used in file comments
- **Has slots?** — yes if the component accepts Webflow child elements

The generator creates five files in `src/components/HeroCard/`:

```
src/components/HeroCard/
├── HeroCard.tsx             ← implement your React component here
├── HeroCard.webflow.tsx     ← wire up Webflow props here
├── HeroCard.stories.tsx     ← add Storybook stories here
├── HeroCard.test.tsx        ← write your tests here
└── index.ts                 ← re-exports (do not edit)
```

### Step 3 — Implement the React component

Open `HeroCard.tsx` and build your component using Tailwind classes. Keep it pure React — no Webflow SDK imports:

```tsx
export interface HeroCardProps {
  title: string;
  subtitle?: string;
}

export const HeroCard = ({ title, subtitle }: HeroCardProps) => (
  <div className="rounded-lg bg-white p-6 shadow-md">
    <h2 className="text-2xl font-bold">{title}</h2>
    {subtitle && <p className="mt-2 text-gray-500">{subtitle}</p>}
  </div>
);
```

### Step 4 — Wire up Webflow props

Open `HeroCard.webflow.tsx` and map your React props to Webflow Designer controls:

```tsx
import { declareComponent } from '@webflow/react';
import { props } from '@webflow/data-types';
import { HeroCard } from './HeroCard';

export default declareComponent(HeroCard, {
  name: 'HeroCard',
  props: {
    title: props.Text({ name: 'Title', defaultValue: 'Hello World' }),
    subtitle: props.Text({ name: 'Subtitle', defaultValue: '' }),
  },
});
```

See the full list of prop types at [developers.webflow.com/code-components/reference/prop-types](https://developers.webflow.com/code-components/reference/prop-types).

### Step 5 — Add Storybook stories

Open `HeroCard.stories.tsx` and add stories for each key variation:

```tsx
export const Default: Story = {
  args: { title: 'Hello World' },
};

export const WithSubtitle: Story = {
  args: { title: 'Hello World', subtitle: 'A short description' },
};
```

Preview your component locally:

```bash
pnpm storybook
```

### Step 6 — Write tests

Open `HeroCard.test.tsx` and write your Jest tests:

```tsx
describe('HeroCard', () => {
  it('renders the title', () => {
    render(<HeroCard title="Hello" />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

Run tests locally to verify:

```bash
pnpm test
```

### Step 7 — Export the component

Manually add the export to `src/index.ts`:

```ts
export { HeroCard } from './components/HeroCard';
export type { HeroCardProps } from './components/HeroCard';
```

### Step 8 — Verify locally

```bash
pnpm lint
pnpm format:check
pnpm test
```

All three must pass before opening a PR.

---

## 3. Commits, branches, and merging

### Branch model

| Branch                | Purpose                                             |
| --------------------- | --------------------------------------------------- |
| `main`                | Production — auto-deploys to Webflow on merge       |
| `dev`                 | Integration — all feature branches merge here first |
| `feat/<name>`         | New component                                       |
| `fix/<description>`   | Bug fix                                             |
| `chore/<description>` | Tooling, config, dependencies                       |
| `docs/<description>`  | Documentation only                                  |

**Rules:**

- Never push directly to `main` or `dev`
- Always cut branches from `dev`, not `main`
- One branch per component or concern
- Delete the branch after merging

### Writing commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples:**

```bash
git commit -m "feat(HeroCard): add initial component with title and subtitle props"
git commit -m "test(HeroCard): add render and prop tests"
git commit -m "fix(ExampleButton): correct disabled pointer-events"
git commit -m "docs: update getting started guide"
```

Rules: imperative mood, lowercase, no period, max 72 characters. See `RULES.md` for the full reference.

### Opening a PR

When your component is ready:

```bash
git push -u origin feat/hero-card
```

Then open a PR on GitHub targeting **`dev`** (not `main`). Fill in:

- What the component does
- Any decisions worth noting
- Screenshots or Storybook link if visual

The CI pipeline will run automatically. Fix any failures before requesting a review.

### Merging to main

When `dev` is stable and ready to deploy:

1. Open a PR from **`dev` → `main`** on GitHub
2. CI runs again on the PR
3. Once approved and CI passes, merge
4. The deploy workflow triggers automatically

---

## 4. CI/CD pipeline

### How it works

```
feat/my-component
  └── PR to dev
        └── ci.yml runs → lint, format, test
             └── merge to dev
                  └── PR to main
                        └── ci.yml runs again
                             └── merge to main
                                  └── deploy.yml runs → same checks + webflow publish
```

### `ci.yml` — runs on every PR to `dev` or `main`

| Step    | What it does                     | Fails on                             |
| ------- | -------------------------------- | ------------------------------------ |
| Install | `pnpm install --frozen-lockfile` | Missing or broken dependencies       |
| Lint    | `pnpm lint`                      | Any ESLint error                     |
| Format  | `pnpm format:check`              | Any file not matching Prettier rules |
| Test    | `pnpm test`                      | Any failing Jest test                |

All steps must pass. If any fails, the PR is blocked from merging.

### `deploy.yml` — runs on every push to `main`

Runs the same steps as `ci.yml`, then:

```bash
npx webflow library share --no-input --api-token $WEBFLOW_API_TOKEN
```

This bundles all `*.webflow.tsx` components found by the glob in `webflow.json` and publishes them to your Webflow workspace as a shared library.

**If the deploy fails:** the workflow is marked as failed and GitHub sends a notification to the commit author. Check the Actions tab for logs. Common causes:

- Invalid or expired `WEBFLOW_API_TOKEN`
- A component has a broken `declareComponent` declaration
- Bundle size exceeds Webflow's 50MB limit

### Running checks locally

Before pushing, run the same checks CI will run:

```bash
pnpm lint          # ESLint
pnpm format:check  # Prettier
pnpm test          # Jest
```

To auto-fix formatting:

```bash
pnpm format
```

### Publishing locally

To publish to Webflow without going through CI:

```bash
pnpm deploy
```

This reads `WEBFLOW_API_TOKEN` from your `.env` file automatically.
