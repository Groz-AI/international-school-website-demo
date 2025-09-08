# Component Specifications (MVP)

## Header/Nav (sticky)
- Desktop: brand left, nav center, CTAs right (Apply, Book Tour), language toggle.
- Mobile: drawer with top language toggle; CTAs as buttons.
- Academics mega-menu: Early Years, Primary, Secondary.
- States: hover (8% darken), focus (2px gold outline + 2px offset), active.

## Hero
- Media: image 16:9/21:9 or video (muted/loop).
- Content max-width ~680px; gradient overlay; 3 CTAs.

## Stats Strip
- 3–4 items: numeral + label; 44px tap targets.

## Cards
- ProgramCard: 4:3 image, title, short copy, anchor.
- NewsCard: 4:3 image, date, category, title (clickable card).
- EventCard: date badge, title, location, Add to Calendar.
- PersonCard: 1:1 portrait, name, role.

## Testimonial Slider
- Swipe, keyboard navigable, aria-live polite; no autoplay.

## Accordion (FAQ)
- One open at a time; aria-expanded/controls; motion respects reduced-motion.

## Timeline (Admissions)
- Mobile vertical, desktop horizontal; numbered nodes; accent connectors.

## Forms (Enquiry/Contact)
- Fields: name, email, phone (intl), child’s grade, message, consent.
- Validation: required; email/phone formats; localized errors.
- Spam: honeypot + Turnstile/hCaptcha; server rate-limit.
- Success: inline confirmation + email to user; internal notification.

## Events + ICS
- Upcoming list; filters optional; ICS export button (download + GA4 event).

## Gallery
- Responsive grid; lightbox with captions; keyboard accessible.

## Footer
- Address + map, contacts, quick links, social, legal; © current year; language toggle.

## RTL/L10n
- Use logical properties; mirror icons/arrows; keep logos/social unflipped.
