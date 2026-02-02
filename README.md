# Prosp

## OPENAI/RESEND API KEY - pnddle1@gmail.com

npm install
npx prisma generate
npx prisma migrate dev
npm run dev
curl http://localhost:3001/leads


# DATABASE_URL=postgresql://postgres.ibjsadtxyxoiuszoiipb:l2xPx2WqJzfARpaK@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/prosp
OPENAI_API_KEY=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
RESEND_API_KEY=re_d7TRqN8p_Avh99CAXGGMYpmQnhL9NGjNF

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


FUTURE: 1. feat: add BullMQ for async email sending
2. feat: add follow-up scheduling
3. chore: verify Resend domain and update sender
4. chore: switch AI generation from mock to OpenAI


Redis:
docker run -d \
  --name prosp-redis \
  -p 6379:6379 \
  redis:7

TEST:

npm run dev
npx ts-node-dev src/workers/email.worker.ts
after the curl command to create lead:
curl -X POST http://localhost:3001/emails/send/<LEAD_ID>
RUN  npx prisma studio to check the DB