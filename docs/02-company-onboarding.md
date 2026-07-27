# Company Onboarding

The complete commercial-to-go-live onboarding workflow.

> Converted from `Datok — Final End-to-End Architecture, Company Onboarding, Connector Implementation, and Dashboard Data Workflow (1).pdf`. Technical wording is preserved; PDF-only visual layouts are represented as Markdown-native diagrams or text blocks.

## 3. Complete Company Onboarding Workflow

### Phase 1 — Commercial Agreement

The company enters through:

- A pilot agreement

- Enterprise implementation

- Agency-managed account

- Self-service onboarding in a later phase Required discovery information:

- Company name

- Brands

- Business units

- Regions

- Marketing platforms

- Advertising accounts

- GA4 properties

- Affiliate networks

- Currency

- Reporting timezone

- Attribution expectations

- Executive KPIs

- Existing reporting process

- Customer stakeholders

### Phase 2 — Organization Creation

```text
Company accepted
↓
Datok organization created
↓
Organization owner assigned
↓
Default workspace settings created
↓
Reporting timezone and currency configured
```

Core organization record:

```text
Organization
- id
- name
- slug
- status
- primaryCurrency
- reportingTimezone
- fiscalYearStart
- defaultComparisonMode
- createdAt
```

### Phase 3 — Company Structure Configuration

The administrator defines:

- Brands

- Business units

- Regions

- Markets

- Sales channels

- Reporting groups For Red Wing:

```text
Red Wing Shoes
│
├── Red Wing
│ ├── Ecommerce Sales
│ ├── Dealer-Owned Stores
│ ├── Corporate-Owned Stores
│ └── Red Wing for Business
│
└── Irish Setter
└── Ecommerce Sales
```

Recommended data structure:

```text
Organization
└── Brand
└── Business Unit
└── External Accounts
```

### Phase 4 — User Invitation and Access Control

The organization owner invites:

- CEO

- CMO

- Marketing director

- Analyst

- Agency partner

- Business-unit manager

- Finance viewer Recommended roles:

#### Organization Owner

Full company control.

#### Executive

Executive dashboard, AI insights, reports, and alerts.

#### Marketing Admin

Connectors, mappings, campaign data, alerts, and reports.

#### Analyst

Detailed analytics and exports.

#### Business Unit Manager

Limited to assigned brands or units.

#### Viewer

Read-only approved dashboards. The access path is:

```text
User
↓
Organization Membership
↓
Role
↓
Business Unit Scope
↓
Authorized Dashboard Data
```

### Phase 5 — Data Source Connection

The administrator opens:

```text
Settings
↓
Data Sources
↓
Connect Provider
```

Flow:

```text
Select provider
↓
Start OAuth authorization
↓
Provider grants read-only access
↓
Datok securely stores encrypted authorization
↓
Available accounts are discovered
↓
Administrator selects approved accounts
↓
Connection test runs
↓
Account enters Connected state
```

Connection states:

- Not connected

- Authorization required

- Connected

- Syncing

- Healthy

- Delayed

- Token expired

- Permission error

- Rate limited

- Failed

- Disconnected

### Phase 6 — Account Mapping

Every external account must be mapped. Example:

```text
Google Ads Account 689-224-2477
↓
Brand: Red Wing
↓
Business Unit: Ecommerce Sales
↓
Channel: Paid Search
↓
Provider: Google Ads
```

Another example:

```text
GA4 Property 314837473
↓
Brand: Red Wing
↓
Business Unit: Ecommerce Sales
↓
Provides: Revenue, Orders, Sessions
```

Required mapping dimensions:

- Organization

- Brand

- Business unit

- Region

- Channel

- Subchannel

- External account

- Analytics property

- Currency

- Timezone

### Phase 7 — Metric Definition Approval

The customer confirms the business definitions. For the initial Red Wing model:

```text
Ecommerce Sales
= GA4 purchase revenue
Marketing Cost
= Vendor-reported advertising or affiliate cost
ROAS
= GA4-attributed sales / vendor cost
CPA
= Vendor cost / GA4-attributed orders
Conversion Rate
= GA4 orders / GA4 sessions
```

This stage must define:

- Revenue source

- Cost source

- Attribution model

- Conversion window

- Included channels

- Currency rules

- Refund handling

- Tax and shipping treatment

- Reporting timezone

- Comparison logic

### Phase 8 — Historical Import

After mapping:

```text
Connection activated
↓
Historical sync job created
↓
Data imported in date chunks
↓
Raw records stored
↓
Records normalized
↓
Mappings applied
↓
Daily facts generated
```

Recommended first import range:

- 12 months for MVP

- 24 months where year-over-year history is required

- Custom range for enterprise customers

### Phase 9 — Reconciliation

Datok totals are compared against:

- Google Ads totals

- GA4 totals

- Microsoft Ads totals

- Affiliate totals

- Existing company reports

- Finance-approved figures Reconciliation output should show:

```text
Source Total
Datok Total
Difference
Difference %
Status
Reason
```

Status:

- Matched

- Within tolerance

- Needs review

- Mapping issue

- Missing data

- Source discrepancy

### Phase 10 — Reporting Baseline Approval

The company approves:

- Mappings

- KPI formulas

- Attribution model

- Reconciled totals

- Dashboard filters

- Business-unit structure Only after this approval should Datok become the official executive reporting surface.

### Phase 11 — Go-Live

```text
Data validated
↓
Reporting baseline approved
↓
Scheduled sync enabled
↓
Executive dashboard activated
↓
Alerts enabled
↓
AI brief enabled
↓
Company enters production operation
```
