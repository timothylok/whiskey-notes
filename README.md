# Whiskey Notes

A web app for logging whiskey tasting notes — nose, palate, finish and a 0–100 rating — with bottle photos and auto-generated social share cards.

**Live:** https://whiskey-notes.vercel.app

## Features

- Browse all whiskies and tasting notes (public, no sign-in needed)
- Sign in to add whiskies (with a bottle photo) and tasting notes
- Edit or delete your own notes
- Each note has a share page with a generated preview card for X, Facebook, iMessage, WhatsApp and more

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui |
| Database | Neon Postgres + Drizzle ORM |
| File storage | Vercel Blob |
| Auth | Clerk |
| Share cards | `next/og` (ImageResponse) |
| Validation | Zod |
| Hosting | Vercel (auto-deploy from `main`) |

## Local development

Requires Node 20+ and the [Vercel CLI](https://vercel.com/docs/cli).

```bash
npm install
vercel link                  # link to the Vercel project
vercel env pull .env.local   # DATABASE_URL, BLOB_READ_WRITE_TOKEN, Clerk keys
npm run db:migrate           # apply database migrations
npm run dev                  # http://localhost:3000
```

## Database changes

Edit `src/db/schema.ts`, then:

```bash
npm run db:generate
npm run db:migrate
```

## Deployment

Push to `main` — Vercel builds and deploys automatically.
