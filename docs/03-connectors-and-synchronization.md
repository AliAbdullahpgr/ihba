# Connectors and Synchronization

Connector contracts, lifecycle, persistence model, provider implementations, and synchronization.

> Converted from `Datok — Final End-to-End Architecture, Company Onboarding, Connector Implementation, and Dashboard Data Workflow (1).pdf`. Technical wording is preserved; PDF-only visual layouts are represented as Markdown-native diagrams or text blocks.

## 4. Connector Implementation Architecture

Every connector should follow one shared contract.

```typescript
interface MarketingConnector {
provider: ProviderType;
authorize(input: AuthorizationInput):
Promise<AuthorizationResult>;
refreshCredentials(connectionId: string): Promise<void>;
validateConnection(connectionId: string):
Promise<ConnectionHealth>;
listAccounts(connectionId: string): Promise<ExternalAccount[]>;
syncHistorical(input: HistoricalSyncInput): Promise<SyncResult>;
syncIncremental(input: IncrementalSyncInput):
Promise<SyncResult>;
normalize(input: RawProviderRecord[]):
Promise<NormalizedRecord[]>;
disconnect(connectionId: string): Promise<void>;
}
```

Each connector implementation remains provider-specific, while the downstream pipeline remains shared.

## 5. Connector Lifecycle

```text
Authorize
↓
Discover accounts
↓
Select accounts
↓
Store encrypted tokens
↓
Create connection
↓
Run historical import
↓
Normalize records
↓
Apply mapping
↓
Generate daily facts
↓
Calculate KPIs
↓
Run scheduled incremental sync
↓
Monitor connection health
```

## 6. Common Connector Database Model

### DataSourceConnection

```text
id
organizationId
provider
status
authorizationType
encryptedAccessToken
encryptedRefreshToken
tokenExpiresAt
lastSuccessfulSyncAt
lastAttemptedSyncAt
lastErrorCode
lastErrorMessage
createdAt
updatedAt
```

### ExternalAccount

```text
id
connectionId
externalAccountId
name
currency
timezone
status
metadata
```

### AccountMapping

```text
id
externalAccountId
organizationId
brandId
businessUnitId
channelId
subchannelId
effectiveFrom
effectiveTo
```

### SyncJob

```text
id
connectionId
externalAccountId
syncType
dateFrom
dateTo
status
cursor
recordsReceived
recordsAccepted
recordsRejected
startedAt
completedAt
error
```

### RawProviderRecord

```text
id
organizationId
provider
externalAccountId
entityType
externalId
sourceDate
payload
payloadHash
ingestedAt
```

## 7. Connector Implementation by Provider

### 7.1 Google Ads Connector

#### Data to retrieve

- Customer account

- Campaign

- Campaign status

- Campaign type

- Cost

- Clicks

- Impressions

- Conversions

- Conversion value

- Device

- Network

- Date

- Ad group

- Search terms where allowed

- Keyword data where allowed

#### Primary Datok use

- Marketing cost

- Clicks

- Impressions

- CTR

- CPC

- Campaign structure

- Budget pacing

- Search-term analysis

#### Dashboard modules

- Dashboard

- Performance

- Channels

- Campaigns

- Business Units

- Alerts

- AI Insights

- Reports

### 7.2 Google Analytics 4 Connector

#### Data to retrieve

- Purchase revenue

- Purchases or orders

- Sessions

- Users

- Traffic source

- Medium

- Campaign

- Landing page

- Device category

- Geography

- Ecommerce items

- Product revenue where available

#### Primary Datok use

- Official ecommerce revenue

- Orders

- Sessions

- Conversion rate

- Product performance

- Channel-attributed revenue

#### Dashboard modules

- Dashboard

- Performance

- Channels

- Campaigns

- Business Units

- AI Insights

- Reports

### 7.3 Microsoft Ads Connector

#### Data to retrieve

- Campaigns

- Spend

- Clicks

- Impressions

- Conversions

- Campaign type

- Device

- Search queries

- Keywords

- Date

#### Primary Datok use

- Paid search cost

- Clicks

- Impressions

- CTR

- CPC

- CPA

- ROAS when joined with GA4 revenue

#### Dashboard modules

- Dashboard

- Performance

- Channels

- Campaigns

- Business Units

- Alerts

- AI Insights

- Reports

### 7.4 AvantLink Connector

#### Data to retrieve

- Affiliate account

- Publisher or partner

- Clicks

- Transactions

- Commission

- Revenue if available

- Product

- Order

- Date

#### Primary Datok use

- Affiliate marketing cost

- Partner performance

- Commission efficiency

- Affiliate orders

- Revenue contribution

#### Dashboard modules

- Dashboard

- Performance

- Channels

- Campaigns or Affiliate detail

- Business Units

- Reports

- AI Insights

### 7.5 Rakuten Connector

#### Data to retrieve

- Network account

- Publisher

- Clicks

- Orders

- Sales

- Commission

- Transaction date

- Product or category where available

#### Primary Datok use

- Affiliate cost

- Partner performance

- Revenue contribution

- Commission analysis

- Network comparison

#### Dashboard modules

- Dashboard

- Performance

- Channels

- Affiliate detail

- Business Units

- Reports

- AI Insights

## 8. Historical and Incremental Synchronization

### Historical Sync

```text
Select account
↓
Determine supported history window
↓
Split into date chunks
↓
Queue chunk jobs
↓
Fetch provider records
↓
Store raw payloads
↓
Normalize
↓
Upsert canonical records
↓
Update progress
```

### Incremental Sync

Recommended schedule:

- Google Ads: every 1–4 hours

- GA4: every 1–4 hours, with daily reconciliation

- Microsoft Ads: every 1–4 hours

- Affiliate networks: several times daily or provider-dependent

- Full historical reconciliation: nightly or weekly Incremental jobs should use:

- Provider cursor

- Last successful date

- Updated timestamp

- Rolling correction window A rolling correction window is important because marketing platforms may revise recent conversion data. Example:

```text
Every sync:
- Fetch today
- Fetch yesterday
- Re-fetch previous 7–30 days where attribution may change
```

## 9. Raw Data Storage

Raw provider data must be retained before normalization. Example tables or storage categories:

```text
raw_google_ads
raw_ga4
raw_microsoft_ads
raw_avantlink
raw_rakuten
```

Benefits:

- Auditability

- Replay

- Debugging

- Reconciliation

- Provider schema-change recovery

- Historical correction Raw data must not be queried directly by executive dashboard pages.
