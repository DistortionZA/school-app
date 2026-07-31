# NoPanic Projects

Projects-first pilot for South African primary schools. The current build is a self-contained demo with teacher and parent preview modes, seeded Grade 5 projects, local state, and integration contracts ready for Supabase, WhatsApp, and the .NET sync agent.

## Run locally

```bash
npm install
npm run dev
```

## Current boundaries

- `src/App.tsx` contains the interactive pilot surface using seeded data.
- `supabase/schema.sql` defines the first relational model and tenant-aware entities.
- `src/integrations/contracts.ts` defines the cloud boundary for the sync agent and message provider.
- The real `.mdb` reader, provider credentials, and Supabase client are intentionally not connected until a school backup and approved messaging account are available.
