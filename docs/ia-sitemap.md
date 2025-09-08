# IA & URL Mapping (EN/AR with hreflang)

Base locales:
- English: `/en/`
- Arabic (RTL): `/ar/`

## Primary pages
- Home: `/en/` ↔ `/ar/`
- About: `/en/about` ↔ `/ar/about`
- Academics: `/en/academics` ↔ `/ar/academics`
  - Anchors: `#early-years`, `#primary`, `#secondary`
- Admissions: `/en/admissions` ↔ `/ar/admissions`
  - Anchors: `#steps`, `#fees`, `#documents`, `#faqs`, `#enquire`, `#book-a-tour`
- Student Life: `/en/student-life` ↔ `/ar/student-life`
- News: `/en/news` ↔ `/ar/news`
  - Detail: `/en/news/{slug}` ↔ `/ar/news/{slug}`
- Events: `/en/events` ↔ `/ar/events`
  - Detail: `/en/events/{slug}` ↔ `/ar/events/{slug}`
- Contact: `/en/contact` ↔ `/ar/contact`

## Hreflang
Add pairs per page:
- `en-eg` ↔ `ar-eg`, plus `x-default` to English home.
