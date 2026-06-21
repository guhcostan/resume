# ask-gustavo — AI proxy (Cloudflare Worker)

Tiny serverless proxy that keeps the **Groq API key server-side** and streams
chat completions to the portfolio's AI terminal. The static site never sees the
key — it only calls this Worker's URL.

## Why this exists
The site is a static export on GitHub Pages (no backend). An API key placed in
client code — or baked into the static build from a GitHub Actions secret —
would be **publicly visible**. A runtime server (this Worker) is the only safe
place for the key.

## Option A — Deploy manually (simplest)

```bash
cd worker
npm i -g wrangler            # or: npx wrangler ...
wrangler login              # opens browser, authorizes Cloudflare
wrangler secret put GROQ_API_KEY   # paste your Groq key when prompted
wrangler deploy
```

`wrangler deploy` prints the Worker URL, e.g.
`https://ask-gustavo.<your-subdomain>.workers.dev`.

## Option B — Deploy from GitHub Actions (key stored as a GitHub secret)

This is the safe way to "keep the key in GitHub": it is used only at **deploy
time** to set the Worker's runtime secret — it never reaches the client bundle.

Add these in the repo: **Settings → Secrets and variables → Actions**
- Secret `GROQ_API_KEY` — your Groq key
- Secret `CLOUDFLARE_API_TOKEN` — a Cloudflare token with "Edit Workers" perms
- Secret `CLOUDFLARE_ACCOUNT_ID` — your Cloudflare account id

Then run the **Deploy AI Worker** workflow (Actions tab → Run workflow). See
`.github/workflows/deploy-worker.yml`.

## Wire the site to the Worker
Once you have the Worker URL, set a repo **variable** (not secret) so the site
build knows where to send requests:
- **Settings → Secrets and variables → Actions → Variables** → `AI_PROXY_URL` =
  the Worker URL.

The Pages deploy workflow passes it as `NEXT_PUBLIC_AI_PROXY_URL`. With it set,
the terminal uses Groq by default; without it, the terminal falls back to the
in-browser model (WebLLM) via the `/local` command.

## Local dev
```bash
cd worker
echo 'GROQ_API_KEY = "your-key"' > .dev.vars   # gitignored
wrangler dev
```
