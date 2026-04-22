# Webflow REST API

A reference for using the Webflow REST API alongside Code Components. This is a separate product from DevLink — you don't need it to build or publish components, but it's useful when your components need to fetch data from Webflow (CMS collections, sites, pages, etc.).

---

## What it is

The [Webflow REST API](https://developers.webflow.com/data/reference) lets you read and write Webflow data programmatically:

- CMS collections and items
- Sites, pages, and domains
- Forms, members, orders
- Assets

Access is granted via **OAuth 2.0** (for apps installed by multiple users) or a **Workspace API token** (for personal scripts and server-side use).

---

## When to use it with Code Components

| Scenario                                | Use the API?                                           |
| --------------------------------------- | ------------------------------------------------------ |
| Component renders static UI from props  | No — props from the Webflow Designer are enough        |
| Component fetches CMS data at runtime   | Yes — fetch from your own backend that proxies the API |
| Component needs live product/order data | Yes                                                    |
| Component is purely visual              | No                                                     |

> **Important:** Code Components run in the browser inside Webflow's Shadow DOM. Never call the Webflow REST API directly from a component — your API token would be exposed. Always proxy requests through a backend.

---

## Authentication

### Workspace API token (simplest)

For server-side scripts and CI tooling. Found in **Webflow Dashboard → Workspace Settings → API Access**.

```bash
curl https://api.webflow.com/v2/sites \
  -H "Authorization: Bearer YOUR_TOKEN"
```

This is the same token used by the Webflow CLI (`WEBFLOW_API_TOKEN` in `.env`).

### OAuth 2.0 (for apps)

For apps installed by other Webflow users. Requires registering an app in your Workspace and implementing the OAuth flow.

```js
import { WebflowClient } from 'webflow-api';

// Step 1 — redirect user to authorization page
const url = WebflowClient.authorizeURL({
  scope: ['sites:read', 'cms:read'],
  clientId: process.env.WEBFLOW_CLIENT_ID,
});

// Step 2 — exchange the code for an access token
const token = await WebflowClient.getAccessToken({
  clientId: process.env.WEBFLOW_CLIENT_ID,
  clientSecret: process.env.WEBFLOW_SECRET,
  code: req.query.code,
});

// Step 3 — make authenticated requests
const webflow = new WebflowClient({ accessToken: token });
const sites = await webflow.sites.list();
```

See the [OAuth 2.0 guide](https://developers.webflow.com/data/reference/oauth-app) for the full flow.

---

## JavaScript SDK

Install the official SDK:

```bash
pnpm add webflow-api
```

Example — list CMS items:

```ts
import { WebflowClient } from 'webflow-api';

const webflow = new WebflowClient({ accessToken: process.env.WEBFLOW_API_TOKEN });

const items = await webflow.collections.items.list(COLLECTION_ID);
```

Full SDK reference: [developers.webflow.com/data/reference](https://developers.webflow.com/data/reference)

---

## Fetching data inside a Code Component

Since components run in the browser, use a backend proxy pattern:

```
Component (browser)
  → fetch('/api/cms-items')
       → Your backend (Node/Edge function)
            → Webflow REST API (with server-side token)
```

Example component:

```tsx
import { useEffect, useState } from 'react';

export const ArticleList = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/api/articles')
      .then((r) => r.json())
      .then(setItems);
  }, []);

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.fieldData.name}</li>
      ))}
    </ul>
  );
};
```

The `/api/articles` endpoint lives in your own backend — not in this repo.

---

## Environment variables

If you add API calls to a backend that lives alongside this repo, extend `.env.example`:

```
# Webflow CLI — required for pnpm deploy
WEBFLOW_API_TOKEN=your_token_here

# Webflow OAuth App — only needed if building a Data Client app
WEBFLOW_CLIENT_ID=your_client_id
WEBFLOW_SECRET=your_client_secret
```

Never add OAuth credentials to this repo unless you're building a companion backend. Keep `.env` out of git.

---

## Further reading

- [REST API reference](https://developers.webflow.com/data/reference)
- [Webflow JavaScript SDK (npm)](https://www.npmjs.com/package/webflow-api)
- [OAuth 2.0 guide](https://developers.webflow.com/data/reference/oauth-app)
- [Data Client getting started](https://developers.webflow.com/data/docs/getting-started-data-clients)
- [Frameworks and libraries guide](https://developers.webflow.com/code-components/frameworks-and-libraries)
