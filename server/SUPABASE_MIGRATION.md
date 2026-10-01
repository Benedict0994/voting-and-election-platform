# MongoDB → Supabase migration

The server has been changed to use Supabase/PostgreSQL instead of MongoDB/Mongoose.

## 1. Create/configure Supabase
1. Create a Supabase project.
2. Open the SQL Editor and run `supabase/schema.sql`.
3. In **Project Settings → API**, copy the project URL and the server-side service-role key.
4. Copy `.env.example` to `.env` and fill in the Supabase values.

> Never put `SUPABASE_SERVICE_ROLE_KEY` in the Vite/client `.env`. It belongs only on the Express server.

## 2. Install server dependencies
Run from `server/`:

```bash
npm install
```

`mongoose` has been removed and `@supabase/supabase-js` added.

## 3. What changed
- MongoDB startup connection → Supabase connectivity check.
- Mongoose Admin, AwardSpace, Candidate and Settings models → PostgreSQL tables.
- Embedded candidate `voteHistory` → relational `vote_history` table.
- Local `/uploads` candidate images → Supabase Storage bucket `candidate-images`.
- Existing API response field names are preserved where possible (`_id`, `awardSpace`, `voteHistory`, etc.) to reduce frontend changes.
- Existing JWT admin authentication remains in Express for this migration stage.

## 4. Existing MongoDB data
This code changes the application's database. It does **not** automatically copy existing MongoDB records into Supabase. If the old database contains production data, export it before switching production over and run a dedicated data migration.

## 5. Next voting-system stage
The current app still needs a proper transactional voting model. Do not implement public voting by directly editing the `candidates.votes` number. Add a `votes` ledger/table and perform vote recording/count updates atomically on the server/database, with the appropriate duplicate-vote/payment rules for the award.

## Transactional voting engine
Run the complete `supabase/schema.sql`. Voting now uses a `votes` ledger and atomic PostgreSQL `cast_vote` function. The default free-voting rule is one confirmed vote per browser voter token per category. Raw voter tokens and IPs are HMAC-hashed by the server. Candidate totals are no longer directly editable; corrections use `POST /api/candidates/:id/adjust-votes` with a non-zero `delta` and `reason`, creating an audit record. `GET /api/votes/audit` returns recent vote and adjustment records. Payment fields are included for a later server-verified paid-voting flow.

A browser token is useful for ordinary duplicate prevention but is not identity-grade one-person-one-vote protection because browser storage can be cleared. Strict identity voting should use verified voter authentication/OTP; paid voting should confirm votes only after server-side verification of a unique payment reference.
