# Deploying on Dokploy with local storage

This guide deploys the Headshots app on [Dokploy](https://dokploy.com/) using:

- **Local storage volume** for uploaded training images (replaces Vercel Blob)
- **Self-hosted Supabase** for the database and auth (its own Dokploy stack)
- **Astria** (external) for AI training/inference

## Architecture at a glance

```
                 ┌──────────────────────────────┐
   Browser ────► │  Next.js app (this repo)      │
                 │  • uploads → /data/uploads     │◄── volume mount (local storage)
                 │  • serves  → /uploads/*        │
                 └───────┬───────────────┬────────┘
                         │               │
             image URLs  │               │  DB + auth
                         ▼               ▼
                 ┌──────────────┐  ┌──────────────────┐
                 │   Astria     │  │  Supabase stack   │◄── Postgres volume
                 │  (external)  │  │  (self-hosted)    │
                 └──────────────┘  └──────────────────┘
```

Two volumes are involved and they cannot be merged — file uploads and a
Postgres database are different kinds of storage:

| Volume | Lives in | Holds |
|--------|----------|-------|
| `uploads` | the app stack | uploaded training images (`/data/uploads`) |
| Supabase DB volume | the Supabase stack | Postgres data (users, models, credits, …) |

> **Important:** Astria downloads the training images from your app over the
> public internet. `DEPLOYMENT_URL` **must** be a publicly reachable HTTPS
> domain — `localhost` will not work.

---

## Prerequisites

- A running Dokploy instance
- A public domain (or subdomain) pointing at your Dokploy server
- An [Astria API key](https://www.astria.ai/users/edit#api)

---

## Step 1 — Deploy self-hosted Supabase

1. In Dokploy, create a new project (e.g. `headshots`).
2. Add a service using the **Supabase** template (Dokploy Templates → Supabase),
   or deploy the official [Supabase docker-compose](https://supabase.com/docs/guides/self-hosting/docker).
3. During setup, generate and save these secrets — you will need them for the app:
   - `ANON_KEY`      → app's `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SERVICE_ROLE_KEY` → app's `SUPABASE_SERVICE_ROLE_KEY`
   - The public URL of the Supabase API (Kong), e.g. `https://supabase.example.com`
     → app's `NEXT_PUBLIC_SUPABASE_URL`
4. Give Supabase its own domain and confirm Studio loads.

The Supabase stack brings its own Postgres volume, so its data persists across
redeploys automatically.

## Step 2 — Create the database schema

The app expects the tables `credits`, `images`, `models`, `samples`.

1. Open **Supabase Studio → SQL Editor**.
2. Run the contents of [`supabase/migrations/20231010160942_remote_schema.sql`](supabase/migrations/20231010160942_remote_schema.sql).
3. (Optional) Run [`supabase/seed.sql`](supabase/seed.sql) for seed data.

Verify the four tables and their RLS policies appear in the Table Editor.

## Step 3 — Configure auth (magic link)

In Supabase Studio → Authentication:

1. **Email Templates → Magic Link**, set the body to:
   ```html
   <h2>Magic Link</h2>
   <p>Follow this link to login:</p>
   <p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">Log In</a></p>
   ```
2. **URL Configuration**:
   - Site URL: `https://headshots.example.com` (your app domain)
   - Redirect URLs: `https://headshots.example.com/**`

---

## Step 4 — Deploy the app

1. In the same Dokploy project, create a new **Compose** service pointing at this
   repository. Dokploy will use [`docker-compose.yml`](docker-compose.yml).
2. In the service **Environment** tab, set every variable (see
   [`.env.local.example`](.env.local.example)). At minimum:

   ```env
   DEPLOYMENT_URL=https://headshots.example.com
   APP_WEBHOOK_SECRET=<any-random-url-safe-string>
   ASTRIA_API_KEY=<your-astria-key>
   ASTRIA_TEST_MODE=true
   PACK_QUERY_TYPE=both
   NEXT_PUBLIC_TUNE_TYPE=packs

   NEXT_PUBLIC_SUPABASE_URL=https://supabase.example.com
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

   NEXT_PUBLIC_STRIPE_IS_ENABLED=false
   NEXT_PUBLIC_ANNOUNCEMENT_ENABLED=false
   NEXT_PUBLIC_ANNOUNCEMENT_MESSAGE=""
   ```

   > `NEXT_PUBLIC_*` values are baked in at **build** time. The compose file
   > already forwards them as build args, so setting them in the Environment tab
   > is enough — just make sure they are present before the build runs.

3. Deploy. The first build compiles the Next.js standalone bundle.

## Step 5 — The storage volume

The compose file declares a named volume `uploads` mounted at `/data/uploads`.
That is your local storage — uploaded images persist there across redeploys.

To use a specific host directory instead (e.g. a dedicated disk), edit
`docker-compose.yml`:

```yaml
    volumes:
      - /srv/headshots/uploads:/data/uploads   # host path : container path
```

Make sure the host directory is writable by the container user (uid `1001`).

## Step 6 — Domain and verify

1. In the app service **Domains** tab, add `headshots.example.com` → container
   port `3000`, and enable HTTPS (Let's Encrypt).
2. Visit the domain, sign in with a magic link, and train a model with 4+ photos.
3. Confirm images are reachable at `https://headshots.example.com/uploads/<...>`
   — this is the URL Astria fetches.

---

## How storage works now

- Upload: the browser POSTs each file to `POST /astria/train-model/image-upload`,
  which writes it to `STORAGE_DIR/<userId>/<uuid>.<ext>` (the volume) and returns
  a public URL.
- Serve: `GET /uploads/<userId>/<file>` streams the file back from the volume.
  Filenames are random UUIDs under a per-user folder, so paths are unguessable.
- Astria: receives those public URLs as `image_urls` and downloads them to train.

The generated headshots themselves are hosted by Astria; only their URLs are
stored in Supabase (the `images` table).

## Backups

- **Images:** back up the `uploads` volume (or your host bind-mount directory).
- **Database:** back up the Supabase Postgres volume (or use `pg_dump`).
