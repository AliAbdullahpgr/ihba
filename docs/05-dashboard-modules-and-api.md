# Dashboard Modules and API

Dashboard module behavior, data flow, and service/API design.

> Converted from `Datok — Final End-to-End Architecture, Company Onboarding, Connector Implementation, and Dashboard Data Workflow (1).pdf`. Technical wording is preserved; PDF-only visual layouts are represented as Markdown-native diagrams or text blocks.

## 14. Dashboard Module Implementation

### 14.1 Executive Dashboard

#### Purpose

Give the CEO a 30-second understanding of company performance.

#### Primary KPIs

- Ecommerce Sales

- Marketing Cost

- ROAS

- Orders

- CPA

- Conversion Rate

#### Data sources

KPI Source Ecommerce Sales GA4 Marketing Cost Google Ads, Microsoft Ads, Affiliate ROAS KPI engine Orders GA4 CPA KPI engine Conversion Rate KPI engine using GA4

#### Supporting sections

- AI Executive Brief

- Performance trend

- Channel summary

- Business-unit summary

- Risks

- Opportunities

- Data health

- Recommended actions

#### Query flow

```text
Selected date range
↓
Selected organization and filters
↓
Metric service aggregates daily facts
↓
Comparison service calculates prior period and YoY
↓
Dashboard API returns KPI package
↓
AI service receives verified evidence package
```

### 14.2 Performance Module

#### Purpose

Show total marketing performance over time.

#### Displays

- Revenue trend

- Cost trend

- ROAS trend

- Orders

- CPA

- Conversion rate

- Current period vs prior period

- Current period vs prior year

#### Dimensions

- Date

- Channel

- Brand

- Business unit

- Region

- Device

- Campaign

#### Data sources

- GA4

- Advertising providers

- Affiliate providers

- KPI engine

### 14.3 Channels Module

#### Purpose

Compare channels consistently.

#### Rows

- Google Ads

- Microsoft Ads

- Affiliate

- Organic Search

- Email

- Future Meta

- Future Amazon

#### Metrics

- Cost

- Revenue

- Orders

- ROAS

- CPA

- Clicks

- Impressions

- Sessions

- Conversion rate

- Contribution to total revenue

#### Data flow

```text
DailyMarketingFact
↓
Group by channel
↓
Join official GA4 revenue attribution
↓
Calculate channel KPIs
↓
Sort and compare
```

### 14.4 Campaigns Module

#### Purpose

Allow detailed investigation.

#### Columns

- Campaign

- Provider

- Channel

- Status

- Business unit

- Cost

- Revenue

- Orders

- ROAS

- CPA

- CTR

- Conversion rate

- Period change

- Alert status

#### Drill-down

```text
Campaign
↓
Ad group
↓
Keyword or search term
↓
Landing page
↓
Device
↓
Product
```

#### Required joining logic

Campaign names across GA4 and advertising platforms may differ. Use:

- UTM parameters

- Campaign IDs

- Source/medium

- Mapping rules

- Approved manual aliases

### 14.5 Business Units Module

#### Purpose

Show performance by organizational structure.

#### Example cards

- Red Wing Ecommerce

- Dealer-Owned Stores

- Corporate-Owned Stores

- Red Wing for Business

- Irish Setter Ecommerce

#### Metrics

- Sales

- Cost

- ROAS

- Orders

- CPA

- Conversion rate

- Channel mix

- Trend

- Share of company performance

#### Data flow

```text
External account
↓
Account mapping
↓
Brand
↓
Business unit
↓
Aggregated daily facts
↓
Business-unit dashboard
```

### 14.6 AI Insights Module

#### Purpose

Explain verified performance.

#### AI pipeline

```text
Verified KPI package
↓
Comparison calculations
↓
Contribution analysis
↓
Anomaly detection
↓
Structured evidence object
↓
AI explanation
↓
Numeric consistency check
↓
Executive insight
```

#### AI output

- What changed?

- Why did it change?

- Largest positive contributor

- Largest negative contributor

- Business impact

- Confidence

- Recommended next action

- Link to supporting module The AI must never produce financial figures from its own arithmetic.

### 14.7 Reports Module

#### Report types

- Executive weekly report

- Monthly marketing report

- Channel report

- Campaign report

- Business-unit report

- Affiliate report

- Board summary

#### Workflow

```text
Choose template
↓
Select date range
↓
Select business units and channels
↓
Generate KPI dataset
↓
Generate approved narrative
↓
Preview
↓
Export PDF, Excel, or CSV
↓
Optionally schedule delivery
```

### 14.8 Alerts Module

#### Rule-based alerts

- ROAS below target

- CPA above target

- Spend over budget

- Revenue down by threshold

- Conversion rate decline

- Data not refreshed

- Connector failure

#### Statistical alerts

- Unusual cost increase

- Unexpected traffic drop

- Campaign outlier

- Affiliate anomaly

- Sudden channel underperformance

#### Alert record

```text
organizationId
metricKey
scopeType
scopeId
severity
reason
currentValue
expectedValue
detectedAt
status
assignedTo
```

### 14.9 Data Sources Module

#### Displays

- Provider

- Connected account

- Status

- Last successful sync

- Latest data date

- Token health

- Sync errors

- Records processed

- Business-unit mapping

- Reconnect action

#### Actions

- Connect

- Reauthorize

- Sync now

- View sync history

- Map accounts

- Disconnect

### 14.10 Settings Module

#### Sections

- General

- Organization

- Brands

- Business units

- Users

- Roles

- Metric definitions

- Attribution

- Currency

- Reporting timezone

- Data sources

- Alert thresholds

- Reporting preferences

## 15. Dashboard API Design

Recommended service hierarchy:

```text
UI
↓
Route Handler / Server Action
↓
Authentication
↓
Organization Authorization
↓
Dashboard Service
↓
Metric Service
↓
Prisma Repository
↓
PostgreSQL
```

Example endpoints:

```text
GET /api/dashboard/overview
GET /api/performance
GET /api/channels
GET /api/campaigns
GET /api/business-units
GET /api/alerts
GET /api/data-sources
GET /api/reports
POST /api/integrations/:provider/connect
POST /api/integrations/:provider/sync
```

Every request must resolve organization access server-side.
