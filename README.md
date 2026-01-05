# Webflow Attribution Tracker

A lightweight JavaScript script that captures UTM parameters, GCLID, and referrer data from URLs and automatically populates Webflow form hidden fields with last-touch attribution.

## Features

- Tracks UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`)
- Captures Google Click ID (`gclid`)
- Records landing page, referrer, and initial referrer
- Last-touch attribution (updates to most recent campaign)
- 90-day data retention in localStorage
- Auto-fills hidden fields in all Webflow forms
- Supports dynamically loaded forms

## Installation

1. Copy the script from `webflow-attribution-tracker.js`
2. In your Webflow project, go to **Project Settings** → **Custom Code**
3. Paste the script in the **Footer Code** section (before `</body>` tag)
4. You want to add it to the **Footer Code** as you want the form to load first. Putting it in the **Head Code** is not advised
5. Publish your site

## Setup

Create hidden fields in your Webflow forms with these **Name** attributes:

| Field Name | Description |
|------------|-------------|
| `utm_source` | Traffic source (e.g., google, facebook) |
| `utm_medium` | Marketing medium (e.g., cpc, email) |
| `utm_campaign` | Campaign name |
| `utm_term` | Paid search keywords |
| `utm_content` | Ad variation for A/B testing |
| `gclid` | Google Click ID |
| `landing_page` | First page visited with attribution |
| `referrer` | Most recent referring URL |
| `initial_referrer` | Very first referring URL |

**In Webflow Designer:**
1. Add a **Hidden Field** element to your form
2. Set the **Name** field to match one of the parameters above (e.g., `utm_source`)
3. Optionally set the **ID** to the same value for fallback support
4. Repeat for each parameter you want to track

## How It Works

1. **Capture**: When a visitor arrives with UTM parameters, the script extracts and stores them in localStorage
2. **Store**: Data persists for 90 days across browsing sessions
3. **Update**: Last-touch attribution - if visitor returns with new UTM parameters, attribution updates to the latest campaign
4. **Populate**: Hidden fields in all forms are automatically filled with stored attribution data
5. **Submit**: When the form is submitted, attribution data is sent along with the form submission

## Example URL
```
https://yoursite.com/?utm_source=google&utm_medium=cpc&utm_campaign=spring_sale&gclid=123456
```

This will populate:
- `utm_source` → `google`
- `utm_medium` → `cpc`
- `utm_campaign` → `spring_sale`
- `gclid` → `123456`
- `landing_page` → `https://yoursite.com/?utm_source=google&utm_medium=cpc&utm_campaign=spring_sale&gclid=123456`

## Configuration

You can modify these constants at the top of the script:
```javascript
const STORE_KEY = "wf_attrib_v1";  // localStorage key name
const TTL_DAYS = 90;                // Data retention period in days
```

## Attribution Model

This script uses **last-touch attribution**:
- First visit with UTM params → stored
- Subsequent visits without UTM params → existing attribution preserved
- Return visit with new UTM params → attribution **updates** to new campaign
- `initial_referrer` is the only field that never changes (true first-touch)

## Browser Compatibility

- Modern browsers with ES6 support (Any browser after 2014 should do fine)
- Requires localStorage API
- Uses `URLSearchParams`, `MutationObserver`
