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
