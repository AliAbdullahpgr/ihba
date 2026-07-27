# Platform Operations and Delivery

Jobs, security, testing, deployment, delivery sequencing, and the final operating workflow.

> Converted from `Datok — Final End-to-End Architecture, Company Onboarding, Connector Implementation, and Dashboard Data Workflow (1).pdf`. Technical wording is preserved; PDF-only visual layouts are represented as Markdown-native diagrams or text blocks.

## 16. Background Job Architecture

Provider synchronization must not happen inside page requests.

```text
Scheduler
↓
Sync Job Queue
↓
Provider Worker
↓
Raw Storage
↓
Normalization Worker
↓
Mapping Worker
↓
Aggregation Worker
↓
Alert Worker
↓
Dashboard Cache Refresh
↓
AI Insight Worker
```

Requirements:

- Idempotent jobs

- Retry policy

- Exponential backoff

- Dead-letter handling

- Sync checkpoints

- Organization context

- Concurrency limits

- Provider rate-limit handling

- Observability

## 17. Security Requirements

### Authentication

- Auth.js

- Secure credential login

- Google OAuth readiness

- Strong password hashing

- Secure session cookies

### Tenant isolation

Every query filters by:

```text
organizationId
```

and where needed:

```text
businessUnitId
```

### Connector credentials

- Encrypt tokens at rest

- Never expose tokens to frontend

- Refresh tokens server-side

- Revoke on disconnect

- Store minimal provider permissions

### Access control

- Role checks

- Business-unit scope checks

- Export permissions

- Connector-management permissions

- Report permissions

### Future controls

- MFA

- Rate limiting

- Audit logs

- Sentry monitoring

- Security alerts

- Token rotation

## 18. Testing Strategy

### Connector tests

- OAuth callback

- Token refresh

- Account discovery

- Pagination

- Rate limiting

- Retry behavior

- Invalid credentials

- Partial API failure

- Duplicate record prevention

### Normalization tests

- Provider field mapping

- Currency conversion rules

- Date normalization

- Campaign mapping

- Business-unit mapping

- Null and missing values

### KPI tests

- ROAS

- CPA

- CTR

- Conversion rate

- Zero division

- Missing source data

- Mixed currency rejection

### Tenant tests

- Cross-company isolation

- Role restrictions

- Business-unit access

- Export restrictions

### Dashboard tests

- Date filters

- Comparisons

- Channel aggregation

- Campaign drill-down

- Data freshness

- Empty state

- Error state Shell

## 19. Production Deployment Workflow

```text
feature/*
↓
dev-development
↓
staging
↓
main
↓
Vercel Production
```

Before promotion:

```text
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm exec prisma migrate deploy
```

Production architecture currently includes:

- Next.js 16

- React

- TypeScript

- Prisma

- Neon PostgreSQL

- Vercel

- Auth.js

- pnpm

## 20. Recommended Delivery Order

### Phase 1 — Foundation

Completed:

- SaaS structure

- Authentication

- Database

- Multi-tenancy foundation

- Demo environment

- Dashboard modules

- Vercel deployment

### Phase 2 — Company Operations

Build:

- Organization onboarding

- User invitations

- Roles

- Brands

- Business units

- Account mapping

- Metric definition setup

### Phase 3 — First Connectors

Recommended order: 1. GA4 2. Google Ads 3. Microsoft Ads 4. AvantLink 5. Rakuten GA4 and Google Ads should come first because they unlock the primary live executive KPIs.

### Phase 4 — Live Red Wing Dashboard

Activate:

- Ecommerce sales

- Marketing cost

- ROAS

- Orders

- CPA

- Conversion rate

- Performance trend

- Channel table

- Business-unit summaries

- Data freshness

### Phase 5 — Reports and Alerts

- PDF

- Excel

- Scheduled email reports

- Threshold alerts

- Data health alerts

### Phase 6 — AI Executive Intelligence

- Executive brief

- Root-cause analysis

- Risks and opportunities

- Ask the Data

- Recommendations

### Phase 7 — Enterprise Product

- Self-service onboarding

- Agency mode

- White-label dashboards

- Billing

- Usage limits

- Multi-client management

### Phase 8 — Marketing Operating System

- Creative assets

- Campaign planning

- Approvals

- Marketing calendar

- Change tracking

- Forecasting

- Controlled campaign actions

## 21. Final Operating Workflow

```text
1. Company is onboarded
2. Brands, business units, users, roles, currency, and timezone are
configured
3. Marketing and analytics platforms are securely connected
4. External accounts are selected and mapped
5. Historical data is imported
6. Raw provider responses are preserved
7. Data is normalized into Datok’s canonical marketing model
8. Data-quality and reconciliation checks are completed
9. The company approves the reporting baseline
10. The KPI engine calculates official metrics
11. Dashboard modules present executive and operational views
12. Alerts identify important risks and changes
13. AI receives verified evidence and explains performance
14. Reports are exported or scheduled
15. Background jobs continuously refresh the data
16. Leadership uses Datok to understand what happened, why it
happened, and what to do next
```

## Final Product Statement

Datok is a secure, multi-tenant Executive Marketing Intelligence Platform that connects advertising, analytics, ecommerce, and affiliate systems; converts fragmented data into one trusted marketing model; calculates official KPIs in a centralized engine; distributes those metrics across executive dashboards, reports, and alerts; and uses AI to provide grounded explanations and actionable recommendations.
