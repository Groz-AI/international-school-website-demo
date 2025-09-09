document.addEventListener('DOMContentLoaded', () => {
  // Load GA4 if configured
  const loadGA4 = (id) => {
    if (!id || window.gtag) return;
    const s1 = document.createElement('script');
    s1.async = true;
    s1.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(s1);
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', id);
  };

  const tryLoadConfig = async () => {
    // Support both /prototype/* pages and root index.html
    const candidates = ['prototype/config.json', '../config.json', './config.json'];
    for (const path of candidates) {
      try {
        const res = await fetch(path, { cache: 'no-store' });
        if (res.ok) {
          const cfg = await res.json();
          if (cfg && cfg.gaMeasurementId) {
            loadGA4(cfg.gaMeasurementId);
            break;
          }
        }
      } catch { /* ignore */ }
    }
  };
  tryLoadConfig();
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Inject favicon, manifest, theme color, and preconnects
  const ensureHeadLink = (rel, attrs = {}) => {
    if ([...document.head.querySelectorAll(`link[rel="${rel}"]`)].length) return;
    const l = document.createElement('link');
    l.rel = rel;
    Object.entries(attrs).forEach(([k,v]) => l.setAttribute(k, v));
    document.head.appendChild(l);
  };
  const ensureMeta = (name, content) => {
    let m = document.head.querySelector(`meta[name="${name}"]`);
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', name); document.head.appendChild(m); }
    m.setAttribute('content', content);
  };
  const fromRoot = !location.pathname.includes('/prototype/');
  const iconPath = fromRoot ? 'prototype/assets/favicon.svg' : '../assets/favicon.svg';
  const manifestPath = fromRoot ? 'prototype/site.webmanifest' : '../site.webmanifest';
  ensureHeadLink('icon', { href: iconPath, type: 'image/svg+xml' });
  ensureHeadLink('manifest', { href: manifestPath });
  ensureMeta('theme-color', '#0C3B5E');
  // Fonts preconnect (best-effort, harmless if already present)
  const pre1 = document.createElement('link'); pre1.rel = 'preconnect'; pre1.href = 'https://fonts.googleapis.com'; document.head.appendChild(pre1);
  const pre2 = document.createElement('link'); pre2.rel = 'preconnect'; pre2.href = 'https://fonts.gstatic.com'; pre2.crossOrigin = 'anonymous'; document.head.appendChild(pre2);

  const openBtn = document.getElementById('menuOpen');
  const closeBtn = document.getElementById('menuClose');
  const nav = document.getElementById('mobileNav');
  const backdrop = document.getElementById('backdrop');
  const langToggles = document.querySelectorAll('.lang-toggle');
  const navLinks = document.querySelectorAll('.mobile-nav a[href]');

  const open = () => {
    if (!nav || !backdrop) return;
    nav.classList.add('open');
    backdrop.classList.add('open');
    nav.setAttribute('aria-hidden', 'false');
    backdrop.setAttribute('aria-hidden', 'false');
  };

  const close = () => {
    if (!nav || !backdrop) return;
    nav.classList.remove('open');
    backdrop.classList.remove('open');
    nav.setAttribute('aria-hidden', 'true');
    backdrop.setAttribute('aria-hidden', 'true');
  };

  // Ensure closed on load, especially when switching locales
  close();

  openBtn && openBtn.addEventListener('click', open);
  closeBtn && closeBtn.addEventListener('click', close);
  backdrop && backdrop.addEventListener('click', close);
  navLinks.forEach(a => a.addEventListener('click', close));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  // Close drawer when resizing to desktop to prevent duplicate header appearance
  const closeOnDesktop = () => {
    if (window.innerWidth >= 768) {
      close();
    }
  };
  window.addEventListener('resize', closeOnDesktop);
  window.addEventListener('orientationchange', closeOnDesktop);

  // Close before navigating via language toggle to avoid transient overlay
  langToggles.forEach((el) => {
    el.addEventListener('click', () => {
      close();
    });
  });

  // Prototype-only form handling: validate and show thank-you state
  const forms = document.querySelectorAll('form[data-proto]');
  forms.forEach((form) => {
    const errorEl = form.querySelector('.form-error');
    const successEl = form.parentElement.querySelector('.form-success');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (errorEl) errorEl.textContent = '';

      const required = form.querySelectorAll('[required]');
      let firstInvalid = null;
      for (const field of required) {
        const type = (field.getAttribute('type') || field.tagName).toLowerCase();
        let valid = true;
        const value = (field.value || '').trim();
        if (type === 'checkbox') {
          valid = field.checked;
        } else if (type === 'email') {
          valid = /.+@.+\..+/.test(value);
        } else if (type === 'tel') {
          valid = value.length >= 7; // simple length check for prototype
        } else {
          valid = value.length > 0;
        }
        if (!valid) {
          firstInvalid = firstInvalid || field;
        }
      }

      if (firstInvalid) {
        if (errorEl) errorEl.textContent = (document.documentElement.lang === 'ar')
          ? 'يرجى إكمال الحقول المطلوبة'
          : 'Please complete the required fields';
        firstInvalid.focus();
        return;
      }

      // Simulate success state for prototype
      form.classList.add('hidden');
      if (successEl) successEl.classList.remove('hidden');

      // Fire GA4-style event if gtag is available
      const isContact = form.closest('section')?.querySelector('h2')?.textContent?.toLowerCase().includes('contact') ||
                        document.documentElement.lang === 'ar' && form.closest('section')?.querySelector('h2')?.textContent?.includes('تواصل');
      const eventName = isContact ? 'contact_submit' : 'enquiry_submit';
      const params = {
        page_locale: document.documentElement.lang || 'en',
        form_id: form.id || (isContact ? 'contact' : 'enquiry'),
        source: 'prototype'
      };
      if (window.gtag) window.gtag('event', eventName, params);
    });
  });

  // Client-side ICS export for demo
  const icsButtons = document.querySelectorAll('[data-ics]');
  icsButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-ics-id') || 'event';
      const title = btn.getAttribute('data-ics-title') || 'School Event';
      const start = btn.getAttribute('data-ics-start'); // e.g., 20251020T160000Z
      const end = btn.getAttribute('data-ics-end');
      const location = btn.getAttribute('data-ics-location') || '';
      const description = btn.getAttribute('data-ics-description') || '';
      const url = btn.getAttribute('data-ics-url') || window.location.href;
      const now = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, 'Z');

      const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//International School Egypt//Events//EN',
        'BEGIN:VEVENT',
        `UID:${id}@school.eg`,
        `DTSTAMP:${now}`,
        start ? `DTSTART:${start}` : '',
        end ? `DTEND:${end}` : '',
        `SUMMARY:${title}`,
        `LOCATION:${location}`,
        `DESCRIPTION:${description} - More: ${url}`,
        'END:VEVENT',
        'END:VCALENDAR'
      ].filter(Boolean).join('\r\n');

      const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${id}.ics`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      if (window.gtag) {
        window.gtag('event', 'add_to_calendar', {
          page_locale: document.documentElement.lang || 'en',
          event_id: id
        });
      }
    });
  });

  // Track Calendly clicks (tour booking CTA)
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    try {
      const href = a.getAttribute('href') || '';
      if (/calendly\.com/.test(href)) {
        if (window.gtag) {
          window.gtag('event', 'tour_booking_click', {
            page_locale: document.documentElement.lang || 'en',
            source: 'prototype'
          });
        }
      }
    } catch { /* ignore */ }
  });

  // Scroll reveal animations
  const revealEls = [];
  document.querySelectorAll('.reveal, .card, .stat, section .card, section .stat').forEach((el) => {
    if (!el.classList.contains('reveal')) el.classList.add('reveal');
    revealEls.push(el);
  });
  const io = ('IntersectionObserver' in window) ? new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('inview');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 }) : null;
  if (io) revealEls.forEach(el => io.observe(el)); else revealEls.forEach(el => el.classList.add('inview'));

  // Animated counters
  const counterEls = document.querySelectorAll('.stat .num, [data-count]');
  const startCount = (el) => {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    const text = (el.getAttribute('data-count') || el.textContent || '').trim();
    const m = text.match(/^([^0-9]*)([0-9]+)([^0-9%+]*)/);
    const prefix = m ? m[1] : '';
    const target = m ? parseInt(m[2], 10) : parseInt(text, 10) || 0;
    const suffix = m ? (m[3] || '') : '';
    const duration = 900;
    const startTime = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t;
      const val = Math.floor(target * eased);
      el.textContent = `${prefix}${val}${suffix}`;
      if (t < 1) requestAnimationFrame(step); else el.textContent = `${prefix}${target}${suffix}`;
    };
    requestAnimationFrame(step);
  };
  if (io) {
    counterEls.forEach((el) => io.observe(el));
  } else {
    counterEls.forEach(startCount);
  }

  // Hero parallax-lite
  const hero = document.querySelector('.hero .content');
  if (hero) {
    let ticking = false;
    const onScroll = () => {
      const y = window.scrollY;
      const offset = Math.min(40, y * 0.15);
      hero.style.transform = `translateY(${offset}px)`;
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });
  }

  // Language toggle: smooth page transition
  langToggles.forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href) return;
      e.preventDefault();
      if (!document.body.classList.contains('page-transition')) {
        document.body.classList.add('page-transition');
      }
      setTimeout(() => { window.location.href = href; }, 120);
    });
  });

  // Button ripple
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const span = document.createElement('span');
    span.className = 'ripple';
    const size = Math.max(rect.width, rect.height);
    span.style.width = span.style.height = `${size}px`;
    span.style.left = `${e.clientX - rect.left - size/2}px`;
    span.style.top = `${e.clientY - rect.top - size/2}px`;
    btn.appendChild(span);
    span.addEventListener('animationend', () => span.remove());
  });

  // Lazy-load non-critical images
  document.querySelectorAll('img').forEach((img) => {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
    if (!img.hasAttribute('decoding')) {
      img.setAttribute('decoding', 'async');
    }
    img.classList.add('img-fade');
    const onLoad = () => img.classList.add('loaded');
    if (img.complete && img.naturalWidth > 0) onLoad(); else img.addEventListener('load', onLoad, { once: true });
  });
});
