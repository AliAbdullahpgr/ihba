# Data Model, KPIs, and Quality

Canonical facts, source-of-truth rules, KPI formulas, and reconciliation.

> Converted from `Datok — Final End-to-End Architecture, Company Onboarding, Connector Implementation, and Dashboard Data Workflow (1).pdf`. Technical wording is preserved; PDF-only visual layouts are represented as Markdown-native diagrams or text blocks.

## 10. Canonical Marketing Data Model

Recommended canonical facts:

### DailyMarketingFact

```text
id
organizationId
brandId
businessUnitId
provider
channel
subchannel
externalAccountId
campaignId
date
currency
cost
revenue
orders
clicks
impressions
sessions
conversions
commission
updatedAt
```

### Campaign

```text
id
organizationId
provider
externalCampaignId
externalAccountId
name
status
campaignType
brandId
businessUnitId
channelId
startDate
endDate
```

### Channel

```text
Paid Search
Affiliate
Organic Search
Email
Paid Social
Marketplace
Other
```

### ProductFact

```text
date
productId
businessUnitId
revenue
orders
units
marketingCost
channel
campaignId
```

## 11. Source-of-Truth Rules

Datok must not mix provider revenue with official ecommerce revenue without labeling it. Recommended initial rules:

### Revenue truth

```text
GA4 purchase revenue
```

### Order truth

```text
GA4 purchase events or approved ecommerce order source
```

### Session truth

```text
GA4 sessions
```

### Advertising cost truth

```text
Original advertising platform
```

### Affiliate cost truth

```text
Original affiliate network commission or approved cost field
```

### Click and impression truth

```text
Original channel provider
```

This gives:

```text
Google Ads Cost
+
GA4 Google Ads-Attributed Revenue
↓
Google Ads ROAS
```

## 12. Central KPI Engine

All KPIs must be calculated in backend services.

### Core formulas

```text
ROAS
= Revenue / Marketing Cost
CPA
= Marketing Cost / Orders
CTR
= Clicks / Impressions
Conversion Rate
= Orders / Sessions
CPC
= Marketing Cost / Clicks
Average Order Value
= Revenue / Orders
```

The KPI engine should define:

```text
MetricDefinition
- key
- displayName
- description
- formula
- numeratorSource
- denominatorSource
- currencyBehavior
- zeroDivisionBehavior
- supportedDimensions
- attributionModel
- version
```

Frontend pages, exports, alerts, and AI must consume the same metric service.

## 13. Data Quality Workflow

```text
Raw data received
↓
Schema validation
↓
Duplicate detection
↓
Currency and timezone validation
↓
Mapping validation
↓
Missing-date detection
↓
Source-total reconciliation
↓
Data quality status assigned
```

Statuses:

- Healthy

- Warning

- Incomplete

- Delayed

- Mapping required

- Failed Every dashboard should display:

```text
Data through: July 26, 2026, 10:00 PM
Status: Healthy
```
