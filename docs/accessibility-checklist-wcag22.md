# Accessibility Checklist (WCAG 2.2 AA)

- Landmarks: skip-to-content, header, main, footer.
- Keyboard: all interactive elements reachable; visible focus (2px gold outline + offset).
- Contrast: text meets AA; large text ≥ 3:1.
- Forms: labels, instructions, error text with role=alert; programmatic names.
- Media: alt text for images; captions or transcripts if needed.
- Motion: respect prefers-reduced-motion; avoid parallax.
- Language/dir: `lang` and `dir` attributes per locale.
- Components: Accordion ARIA; carousel aria-live=polite; focus trap in lightbox.
- Tables: fees table with headers and scope.
