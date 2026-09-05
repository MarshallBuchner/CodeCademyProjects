# Check-in Reminders

Daily branded email (Resend) and optional SMS (Twilio) reminders for users who opt in.

## What it does

- Users manage preferences at `/reminders` (Dashboard → menu → **Reminders**)
- Email and/or SMS with explicit consent + time zone + preferred local hour
- Vercel Cron hits `/api/cron/reminders` every hour
- Skips anyone who already completed today’s check-in (in their time zone)
- Duplicate protection via `reminder_sends` unique `(user_id, channel, local_date)`

## 1. Run the Supabase migration

1. Supabase → **SQL Editor** → New query
2. Paste `supabase/reminders.sql`
3. **Run**

You should see tables:
- `reminder_settings`
- `reminder_sends`

## 2. Add Vercel environment variables

Vercel → QuitCurve → **Settings** → **Environment Variables** (Production):

| Name | Value |
|------|--------|
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → **service_role** (keep secret) |
| `CRON_SECRET` | Long random string (e.g. `openssl rand -hex 32`) |
| `RESEND_API_KEY` | Your Resend API key (`re_...`) |
| `REMINDER_FROM_EMAIL` | `QuitCurve <noreply@quitcurve.app>` |
| `NEXT_PUBLIC_SITE_URL` | `https://quitcurve.app` (if not already set) |

**Optional SMS:**

| Name | Value |
|------|--------|
| `TWILIO_ACCOUNT_SID` | Twilio Account SID |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token |
| `TWILIO_FROM_NUMBER` | Twilio phone number in E.164 (`+1...`) |

Redeploy after adding env vars.

## 3. Cron schedule

`vercel.json` schedules:

```json
{ "path": "/api/cron/reminders", "schedule": "0 * * * *" }
```

- Runs **hourly** so each user’s preferred local hour can match
- **Vercel Hobby** only allows **1 cron/day** — upgrade to Pro for hourly, or change the schedule to once daily (e.g. `"0 18 * * *"`) knowing only users whose local hour matches that UTC run will get reminders that day
- Cron requests include `Authorization: Bearer <CRON_SECRET>` automatically when `CRON_SECRET` is set

## 4. Manual test

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://quitcurve.app/api/cron/reminders
```

Example response:

```json
{ "ok": true, "scanned": 1, "emailed": 1, "smsed": 0, "skipped": 0, "errors": [] }
```

To force a send during testing: set your reminder hour to the **current hour in your time zone**, leave today’s check-in incomplete, then hit the endpoint.

## 5. User flow

1. Sign in at quitcurve.app
2. Dashboard → menu → **Reminders**
3. Enable email (and optionally SMS), set time zone + hour, accept consent
4. Save

## Security notes

- Never expose `SUPABASE_SERVICE_ROLE_KEY` or `CRON_SECRET` to the client
- Cron route returns `401` without a valid bearer token
- SMS is off unless Twilio env vars are present
