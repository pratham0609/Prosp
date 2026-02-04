# Prosp

## OPENAI/RESEND API KEY - pnddle1@gmail.com
## All emails are sent to test inboxes owned by me
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
curl http://localhost:3001/leads


curl -X POST http://localhost:3001/emails/generate/8ddef7bc-7033-4c89-aebf-10f89f52fd48

curl -X POST http://localhost:3001/emails/send/8ddef7bc-7033-4c89-aebf-10f89f52fd48


curl -X POST http://localhost:3001/leads \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Ruchi",
    "lastName": "Test",
    "email": "pnddle1@gmail.com",
    "company": "IIIT-B",
    "role": "Student"
  }'

curl -X POST http://localhost:3001/leads \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Ruchi",
    "lastName": "Test",
    "email": "delivered@resend.dev",
    "company": "IIIT-B",
    "role": "Student"
  }'


## Redis:
docker run -d \
  --name prosp-redis \
  -p 6379:6379 \
  redis:7

## Postgres
docker run -d \
  --name prosp-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=prosp \
  -p 5432:5432 \
  postgres:15


## TEST:

npm run dev
npx ts-node-dev src/workers/email.worker.ts
after the curl command to create lead:
curl -X POST http://localhost:3001/emails/send/<LEAD_ID>
RUN  npx prisma studio to check the DB


## incase postgres throws error:
docker rm -f prosp-postgres
docker run -d \
  --name prosp-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=prosp \
  -p 5432:5432 \
  postgres:15

docker ps -a

# I've started using the card for Resend and OpenAI and will only send test emails to my own inboxes during development.

# UI

npx create-next-app@latest ui --ts --app --no-tailwind
cd ui
npm run dev

## Remaining:


Step 1 — Add “Add Lead” UI 
Unlocks real product flow
Makes demo self-contained
No dependencies

Step 2 — Verify Resend domain + sender
Makes emails feel real
Improves demo credibility

Step 3 — Switch AI mock → OpenAI
Easy once credits exist

Step 4 — Deploy

Step 5 — Loom demo

# FINAL TESTS
# STEP 1 — Start all services

## Terminal 1 (API)

cd api
npm run dev


## Terminal 2 (Worker)

cd api
npx ts-node-dev src/workers/email.worker.ts


## Terminal 3 (UI)

cd ui
npm run dev

# STEP 2 — Add a fresh lead (UI)

In the browser (http://localhost:3000):

Add a brand-new lead (important: new email).

Expected UI state:

Status: NEW

# STEP 3 — Click “Send Email” (UI)

Click Send Email for that lead.

Expected backend behavior:

Initial draft auto-generated

Initial email job enqueued

Follow-up job scheduled (10s delay)

Expected logs:

API: /emails/send/:leadId → 200

Worker: INITIAL email processed

Expected UI state:

Status: EMAIL SENT

# STEP 4 — Immediately click “Simulate Reply” (UI)

Before 10 seconds pass, click Simulate Reply.

Expected backend behavior:

repliedAt is set on Lead

Verify quickly:

npx prisma studio


Check:

Lead.repliedAt ≠ null

Expected UI state:

Status: REPLIED

# STEP 5 — Wait 15 seconds

Let the delayed job fire.

Expected Results (PASS criteria)
Worker behavior

In worker logs, should see NO email send for FOLLOW_UP.

If added a log (optional), it would look like:

Skipped follow-up: lead already replied

Email behavior

You receive ONLY ONE email (the initial one)

No follow-up email arrives

Database behavior

In Prisma Studio:

EmailSend table contains:

1 row with type = INITIAL

NO row with type = FOLLOW_UP
