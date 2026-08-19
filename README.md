# Prosp – AI Outreach Demo (Mini-SaaS)

A standalone mini-SaaS that helps Sales Development Reps (SDRs) send AI-personalized outreach emails and automatically handle follow-ups without manual tracking.

This project demonstrates product thinking, reliable backend workflows, and real AI + email integration.

---

## Website:

- **Frontend (Vercel):**  
  https://prosp-prod.vercel.app

- **API (Render):**  
  https://prosp-api.onrender.com


- **Demo**
  
  [https://tinyurl.com/demo-prosp](https://1drv.ms/v/c/17632de23458fb95/IQAPVZUUVWaZSLVxQOAr6rIxAY7WXp_LGGiPSVBg_KA0nIM)
  

---

## Problem Statement

SDRs struggle to:
- Write personalized outreach at scale
- Remember to follow up days later
- Avoid sending follow-ups after a lead replies

This app solves that by:
- Using AI to generate human-like emails
- Automating follow-ups with background jobs
- Preventing race conditions when replies happen

---

## Core Features

### Lead Management
- Add leads via a simple UI
- Track lead status (`NEW`, `EMAIL SENT`, `REPLIED`)

### AI-Personalized Outreach
- Server-side AI generates short, natural outreach emails
- Designed to start conversations, not aggressively sell
- Safe fallback template if AI fails

### Automated Follow-Ups
- Initial email is sent immediately
- Follow-up is scheduled asynchronously
- Follow-up is skipped if the lead replies before it sends

### Background Processing
- Email sending and scheduling handled via Redis + BullMQ
- Worker runs independently of the API
- System survives restarts without losing jobs

### Real Email Delivery
- Emails are actually delivered using Resend
- No mock services

---

## Architecture Overview

<img width="1536" height="1024" alt="Architecture" src="https://github.com/user-attachments/assets/b05e55a4-7371-42fc-a119-aba3129b5425" />

### Key Design Decisions
- **API & Worker separated** for reliability
- **Redis-backed queue** to handle delays safely
- **Database as source of truth** to avoid race conditions
- **AI runs server-side** to avoid blocking UI

---

## Tech Stack

- **Frontend:** Next.js (Vercel)
- **API:** Fastify + TypeScript (Render)
- **Worker:** BullMQ + Redis (Render)
- **Database:** PostgreSQL
- **AI:** OpenAI
- **Email:** Resend

---

## Email Workflow

1. User clicks **Send Email**
2. API:
   - Generates AI email (if not already generated)
   - Saves drafts
   - Enqueues initial email job
3. Worker:
   - Sends initial email
   - Schedules follow-up job
4. If user clicks **Simulate Reply**:
   - Lead is marked replied
   - Follow-up job is skipped safely

---

## Testing Mode

For demo purposes:
- Follow-up delay is set to **10 seconds**
- Reply can be simulated via UI

---

## Demo Video

See the Loom walkthrough (≤ 5 minutes) explaining:
- Product flow
- Architecture decisions
- Reliability guarantees

---

## Notes

This project focuses on a polished core experience over feature bloat.  
UI polish items are intentionally kept minimal to prioritize correctness and reliability.

---
**Pratham Dandale**  
