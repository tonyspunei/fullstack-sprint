# LeadSync AI CRM

> Modular, AI-enhanced CRM system to manage, enrich, and execute outbound lead workflows.

LeadSync is a lightweight but powerful internal CRM system built for solopreneurs, growth consultants, and AI automation agencies. It allows you to store, enrich, and manage leads in a highly flexible UI — supporting AI-generated pitches, email validation, LinkedIn parsing, and any webhook-based enrichment flow.

---

## 🌐 Stack

- **Frontend**: SvelteKit + Tailwind
- **Backend**: Node.js + Express + MongoDB (Mongoose)
- **Infra**: Docker + GCP (Cloud Run or App Engine)
- **Auth**: Supabase or JWT + Bcrypt (to be decided)
- **Async Tasks**: Node job workers (bullmq optional)
- **External Enrichment**: Apify, Clay APIs, OpenAI, Hunter.io, LinkedIn scraping APIs

---

## 📦 Features

- [x] Lead upload via CSV or UI form
- [x] Full CRUD for leads
- [x] Authentication system
- [x] Campaign tagging
- [x] Custom Columns (manual, AI, enrichment)
- [x] Executable Columns:
  - GPT icebreaker, pitch, cta, ps, etc generation
  - Email verification
  - LinkedIn enrichment
  - Custom Webhook runner (Apify, Clay, Instantly, etc)
- [ ] Queued enrichment jobs
- [ ] Lead sync to tools (Instantly, GSheets)
- [ ] Export enriched CSV

---

## 📐 Data Models

### 🧑 `User`
- `_id`
- `email`
- `passwordHash`
- `orgId` (optional, for future multi-user)

### 🎯 `Campaign`
- `_id`
- `name`
- `userId`
- `createdAt`

### 📇 `Lead`
- `_id`
- `campaignId`
- `email`
- `name`
- `linkedinUrl`
- `customFields: { [fieldName]: any }`
- `createdAt`, `updatedAt`

### 🛠️ `EnrichmentTask`
- `_id`
- `leadId`
- `type` (e.g. 'pitch', 'verify', 'scrape')
- `status`: 'pending' | 'success' | 'error'
- `result`: `any`
- `meta`: `{ source, apiUsed, config }`
- `createdAt`, `updatedAt`

---

## 📋 Tasks / Milestones

### ✅ Week 1 (June 9–15)
- [ ] Scaffold repo & project folders
- [ ] Define and implement Mongoose schemas
- [ ] Build `/api/leads` CRUD endpoints
- [ ] CSV uploader → parse & store leads
- [ ] SvelteKit frontend: login page + table view
- [ ] UI to upload and view leads
- [ ] UI for column creation: type + parameters

### 🔁 Week 2
- [ ] Add enrichment task queue
- [ ] Integrate GPT for `pitch` column type
- [ ] Trigger enrichments on-demand or post-upload
- [ ] Add support for webhook-type enrichment

### 🧠 Week 3
- [ ] Add Supabase auth or local JWT auth
- [ ] Lead search, filtering, and tagging
- [ ] Export to CSV or sync with Instantly
- [ ] Polish UI, write docs, deploy on GCP

---

## 🧪 Dev Commands

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
