# Sessions

## 2026-09-28
- What was done
  - Scaffolded Next.js 16 app (TypeScript, Tailwind v4, shadcn/ui) and pushed to github.com/timothylok/whiskey-notes
  - Created Vercel project; provisioned Neon Postgres, Vercel Blob and Clerk via Marketplace
  - Built Drizzle schema (`whiskies`, `tasting_notes`) and applied first migration
  - Built pages: home feed, whiskey detail/new, add note, tasting note (with share buttons), edit note
  - Added server actions with auth + ownership checks, Blob photo uploads, OG share cards
  - Deployed to https://whiskey-notes.vercel.app; Git integration auto-deploys `main`
- What changed
  - Fixed shadcn font variable (`--font-sans` self-reference) in `globals.css`
  - Added bottle photo to tasting page
  - Rewrote README with stack; merged guidelines template into CLAUDE.md
- What's next
  - Test note edit/delete and cross-user ownership block with a second account
  - Set up Clerk production instance (needs custom domain) before public launch
