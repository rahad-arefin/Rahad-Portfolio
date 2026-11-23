# How I built a zero-cost AI reporting pipeline for Google Ads and Meta Ads

By Rahad Arefin, growth marketing leader · Updated 2026-11-18 · AI and automation
Canonical: https://rahadarefin.com/insights/zero-cost-ai-reporting-pipeline.html

> **Short answer:** You do not need a paid data connector to automate ad reporting. A Google Ads Script in each account writes daily campaign data into one Google Sheet, Meta's official connector supplies Meta data, and an AI assistant such as Claude reads both to draft per-client reports. It is a one-time setup per account with no extra tool cost.

## The problem with paid connectors

Reporting across several ad accounts usually means paying for a connector that pulls Google Ads and Meta Ads data into one place. Pricing tends to scale with the number of data sources and accounts, and free tiers are often limited to a single source and a single account. Once you manage several clients, the bill grows fast, for data you already own.

I wanted per-client reporting across Google and Meta with no extra tool cost. Here is the setup.

## How the pipeline fits together

*Figure: Architecture: Google Ads accounts feed a Google Sheet hub through scripts, Meta Ads connects through its official connector, an AI assistant reads both and drafts reports, and a human reviews before clients see them. No paid connector anywhere in the chain. The only manual step left is the one that should stay manual: a person checking the numbers.*

Meta data comes in through Meta’s official connector, so the assistant sees both platforms side by side.

## Step 1: a script in each Google Ads account

Google Ads Scripts run inside your account for free. This one writes yesterday’s campaign performance into a tab named after the account. Paste your sheet link, preview it once, then schedule it to run daily.

```
function main() {
  const SHEET_URL = 'PASTE_YOUR_GOOGLE_SHEET_URL';
  const ss = SpreadsheetApp.openByUrl(SHEET_URL);
  const tab = AdsApp.currentAccount().getName();
  const sheet = ss.getSheetByName(tab) || ss.insertSheet(tab);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Date', 'Campaign', 'Cost', 'Clicks',
      'Impressions', 'Conversions', 'Conv. value']);
  }
  const rows = AdsApp.search(
    'SELECT segments.date, campaign.name, metrics.cost_micros, ' +
    'metrics.clicks, metrics.impressions, metrics.conversions, ' +
    'metrics.conversions_value FROM campaign ' +
    'WHERE segments.date DURING YESTERDAY');
  const out = [];
  while (rows.hasNext()) {
    const r = rows.next();
    out.push([r.segments.date, r.campaign.name,
      r.metrics.costMicros / 1e6, r.metrics.clicks,
      r.metrics.impressions, r.metrics.conversions,
      r.metrics.conversionsValue]);
  }
  if (out.length) {
    sheet.getRange(sheet.getLastRow() + 1, 1, out.length,
      out[0].length).setValues(out);
  }
}
```

## Step 2: structure the data hub

Keep the sheet boring and consistent. One tab per account, the same columns in the same order, and dates in one format. Consistency matters more than cleverness, because the AI assistant reads structure far better than it reads mess.

## Step 3: add Meta through the official connector

For Meta Ads, I use Meta’s official connector rather than a third-party tool. It gives the assistant direct, read-only access to the same campaign metrics, so both platforms can be compared in one conversation.

## Step 4: write prompts like a reporting brief

The quality of the report depends on the brief. A few that work well:

- “Compare the last 7 days with the previous 7 for each campaign and flag any cost per conversion change above 20%.”
- “Summarize spend pacing against the monthly budget for each account and list the campaigns at risk of under-delivering.”
- “Write a five-line update for the client: what changed, why it matters and what we will do next.”

## Step 5: guardrails before anything reaches a client

- Keep access read-only while reporting is the goal.
- Spot-check key numbers against the ad platform before sending.
- Follow your clients’ data policies on which tools may see their data.
- Have a human review every insight; the assistant drafts, you decide.

## What it changed

The pipeline replaced a paid connector and turned per-client reporting from a manual spreadsheet job into a reviewed draft. Combined with other automation, it is part of how my team removed about 30% of its manual workflows, so more time goes into decisions instead of copying numbers between tabs.

## Frequently asked questions

**Is this pipeline really free?**
There is no paid connector. Google Ads Scripts and Google Sheets are free, and Meta's official connector is free. You still need access to an AI assistant that can read your sheet, under whatever plan your organization already uses.

**Do I need to know how to code?**
Very little. The script below is short and only needs your sheet link pasted in. Most of the work is setting up the sheet structure and writing good reporting prompts.

**Can AI build or change campaigns with this setup?**
I start with read-only reporting. Drafting campaign changes can come later, always with a human reviewing and approving every change before it goes live.

---
About the author: Rahad Arefin is a growth marketing leader with 8+ years across the USA, Canada, UK, Australia and Bangladesh, $2.9M+ in ad spend managed and $24M+ in attributed revenue. Portfolio: https://rahadarefin.com/
