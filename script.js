// ── Password gate ────────────────────────────────────
(function () {
  const KEY  = 'mila-auth';
  const PASS = 'Zabaki';

  if (localStorage.getItem(KEY) === '1') return;

  const strings = {
    en: {
      badge:       'Under Development',
      heading:     'We\'re Working on Something Special',
      sub:         'IZVEIDO is currently under construction. Check back soon — something beautiful is on the way.',
      label:       'Enter password to preview',
      placeholder: 'Password',
      error:       'Incorrect password.',
    },
    lv: {
      badge:       'Izstrādes stadijā',
      heading:     'Mēs strādājam pie kaut kā īpaša',
      sub:         'IZVEIDO pašlaik tiek veidota. Drīzumā atgriezieties — kaut kas skaists ir ceļā.',
      label:       'Ievadiet paroli priekšskatījumam',
      placeholder: 'Parole',
      error:       'Nepareiza parole.',
    },
  };

  let gateLang = localStorage.getItem('mila-lang') || 'en';

  const gate = document.createElement('div');
  gate.id = 'pw-gate';
  gate.innerHTML = `
    <button id="pw-lang" class="pw-lang-btn"></button>
    <div class="pw-box">
      <img src="logo.png" alt="IZVEIDO" class="pw-logo" />
      <span id="pw-badge" class="pw-badge"></span>
      <h1 id="pw-heading" class="pw-heading"></h1>
      <p  id="pw-sub"     class="pw-sub"></p>
      <p  id="pw-label"   class="pw-label"></p>
      <div class="pw-field-wrap">
        <input id="pw-input" type="password" autocomplete="current-password" />
        <button id="pw-submit">→</button>
      </div>
      <p id="pw-error" class="pw-error"></p>
    </div>
  `;
  document.body.appendChild(gate);
  document.body.classList.add('pw-locked');

  function renderGateLang() {
    const s = strings[gateLang];
    document.getElementById('pw-lang').textContent    = gateLang === 'en' ? 'LV' : 'EN';
    document.getElementById('pw-badge').textContent   = s.badge;
    document.getElementById('pw-heading').textContent = s.heading;
    document.getElementById('pw-sub').textContent     = s.sub;
    document.getElementById('pw-label').textContent   = s.label;
    document.getElementById('pw-input').placeholder   = s.placeholder;
    const err = document.getElementById('pw-error');
    if (err.textContent) err.textContent = s.error;
  }
  renderGateLang();

  document.getElementById('pw-lang').addEventListener('click', () => {
    gateLang = gateLang === 'en' ? 'lv' : 'en';
    renderGateLang();
  });

  const input = document.getElementById('pw-input');
  const error = document.getElementById('pw-error');

  function attempt() {
    if (input.value === PASS) {
      localStorage.setItem(KEY, '1');
      gate.classList.add('pw-fade-out');
      setTimeout(() => {
        gate.remove();
        document.body.classList.remove('pw-locked');
      }, 500);
    } else {
      error.textContent = strings[gateLang].error;
      input.value = '';
      input.classList.add('pw-shake');
      setTimeout(() => input.classList.remove('pw-shake'), 500);
    }
  }

  document.getElementById('pw-submit').addEventListener('click', attempt);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') attempt(); });
  setTimeout(() => input.focus(), 100);
}());

// ── Hero logo: tilt + coin flip ──────────────────────
const logoWrap    = document.getElementById('hero-logo-wrap');
const logoFlipper = document.getElementById('logo-flipper');
const logoQuoteEl = document.getElementById('logo-quote');

const quotes = [
  '"Every mark tells a story."',
  '"Crafted with care, kept forever."',
  '"Details make the difference."',
  '"Your story, engraved."',
  '"A gift that lasts a lifetime."',
  '"Precision is the finest art."',
];
let quoteIndex = 0;
let isFlipped   = false;
let flipTimer   = null;

if (logoWrap && logoFlipper) {
  logoWrap.addEventListener('mousemove', e => {
    if (isFlipped) return;
    const rect = logoWrap.getBoundingClientRect();
    const dx   = (e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2);
    const dy   = (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2);
    logoFlipper.style.transition = 'transform .08s linear';
    logoFlipper.style.transform  = `rotateX(${dy * -16}deg) rotateY(${dx * 16}deg) scale(1.05)`;
  });

  logoWrap.addEventListener('mouseleave', () => {
    if (isFlipped) return;
    logoFlipper.style.transition = 'transform .55s cubic-bezier(.34,1.56,.64,1)';
    logoFlipper.style.transform  = '';
    setTimeout(() => { if (!isFlipped) logoFlipper.style.transition = ''; }, 580);
  });

  logoWrap.addEventListener('click', () => {
    if (isFlipped) return;
    isFlipped = true;
    clearTimeout(flipTimer);

    if (logoQuoteEl) {
      logoQuoteEl.textContent = quotes[quoteIndex % quotes.length];
      quoteIndex++;
    }

    logoFlipper.style.transition = 'transform .18s ease';
    logoFlipper.style.transform  = 'scale(1)';

    setTimeout(() => {
      logoFlipper.style.transition = 'transform .7s cubic-bezier(.4,0,.2,1)';
      logoFlipper.style.transform  = 'rotateY(180deg)';
    }, 160);

    flipTimer = setTimeout(() => {
      logoFlipper.style.transition = 'transform .6s cubic-bezier(.4,0,.2,1)';
      logoFlipper.style.transform  = 'rotateY(0deg)';
      setTimeout(() => {
        logoFlipper.style.transition = '';
        logoFlipper.style.transform  = '';
        isFlipped = false;
      }, 620);
    }, 3600);
  });
}

// ── Language switcher ────────────────────────────────
const langMeta = {
  en: { flag: '🇬🇧', code: 'EN' },
  lv: { flag: '🇱🇻', code: 'LV' },
  ru: { flag: '🇷🇺', code: 'RU' },
};

function swapText(lang) {
  document.querySelectorAll('[data-en]').forEach(el => {
    el.textContent = el.dataset[lang] || el.dataset.en;
  });
  document.querySelectorAll('[data-en-ph]').forEach(el => {
    const key = lang + 'Ph';
    el.placeholder = el.dataset[key] || el.dataset.enPh;
  });
  // Update dropdown trigger
  const codeEl = document.querySelector('#lang-trigger .lang-code');
  if (codeEl) {
    const m = langMeta[lang] || langMeta.en;
    codeEl.textContent = m.code;
  }
  // Mark active item
  document.querySelectorAll('.lang-list [data-lang]').forEach(li => {
    li.classList.toggle('active', li.dataset.lang === lang);
  });
  document.documentElement.lang = lang;
  localStorage.setItem('mila-lang', lang);
}

function applyLang(lang, animate) {
  if (!animate) { swapText(lang); return; }

  const els = document.querySelectorAll('[data-en], [data-en-ph]');
  els.forEach(el => {
    el.style.transition = 'opacity .15s ease';
    el.style.opacity    = '0';
  });

  setTimeout(() => {
    swapText(lang);
    els.forEach(el => {
      el.style.transition = 'opacity .2s ease';
      el.style.opacity    = '1';
    });
    setTimeout(() => {
      els.forEach(el => { el.style.transition = ''; el.style.opacity = ''; });
    }, 220);
  }, 160);
}

// Language dropdown
const langDropdown = document.getElementById('lang-dropdown');
const langTrigger  = document.getElementById('lang-trigger');
if (langDropdown && langTrigger) {
  langTrigger.addEventListener('click', e => {
    e.stopPropagation();
    langDropdown.classList.toggle('open');
  });
  langDropdown.querySelectorAll('.lang-list [data-lang]').forEach(li => {
    li.addEventListener('click', () => {
      langDropdown.classList.remove('open');
      applyLang(li.dataset.lang, true);
    });
  });
  document.addEventListener('click', e => {
    if (!langDropdown.contains(e.target)) langDropdown.classList.remove('open');
  });
}

// Apply saved language on page load (no animation)
applyLang(localStorage.getItem('mila-lang') || 'en', false);

// ── Nav shrink on scroll ─────────────────────────────
const nav = document.querySelector('nav');
const scrollHint = document.querySelector('.scroll-hint');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
  if (scrollHint) {
    const fade = Math.max(0, 1 - window.scrollY / 80);
    scrollHint.style.opacity = fade * 0.6;
  }
});

// Active nav link
document.querySelectorAll('nav ul a').forEach(link => {
  if (link.href === location.href) link.classList.add('active');
});

// ── Mobile hamburger ─────────────────────────────────
const toggle = document.querySelector('.nav-toggle');
const menu   = document.querySelector('nav ul');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    menu.classList.toggle('open');
  });
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      menu.classList.remove('open');
    });
  });
}

// ── Scroll-reveal ────────────────────────────────────
const observer = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── Custom select dropdown ───────────────────────────
function initCustomSelect(container) {
  const trigger = container.querySelector('.select-trigger');
  const list    = container.querySelector('.select-list');
  const valueEl = container.querySelector('.select-value');
  const hidden  = container.querySelector('input[type="hidden"]');
  const items   = list.querySelectorAll('li');

  trigger.addEventListener('click', () => {
    const isOpen = container.classList.toggle('open');
    trigger.setAttribute('aria-expanded', String(isOpen));
  });

  items.forEach(item => {
    item.addEventListener('click', () => {
      const lang = localStorage.getItem('mila-lang') || 'en';
      valueEl.textContent = item.dataset[lang] || item.dataset.en;
      valueEl.dataset.en  = item.dataset.en;
      valueEl.dataset.lv  = item.dataset.lv;
      valueEl.dataset.ru  = item.dataset.ru;
      if (hidden) hidden.value = item.dataset.value;
      items.forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      container.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', e => {
    if (!container.contains(e.target)) {
      container.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    }
  });
}

document.querySelectorAll('.custom-select').forEach(initCustomSelect);

// ── Contact form ─────────────────────────────────────
if (typeof emailjs !== 'undefined') {
  emailjs.init({ publicKey: 'jo1m3O9Y8p6aBTEnZ' });
}

const form      = document.getElementById('contact-form');
const success   = document.getElementById('form-success');
const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const lang = localStorage.getItem('mila-lang') || 'en';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = lang === 'lv' ? 'Sūta…' : lang === 'ru' ? 'Отправка…' : 'Sending…';
    }

    const fd = new FormData(form);
    const params = {
      from_name:  fd.get('from_name')  || '',
      from_email: fd.get('from_email') || '',
      email:      fd.get('from_email') || '',
      phone:      fd.get('phone')      || '—',
      service:    fd.get('service')    || '—',
      message:    fd.get('message')    || '',
    };

    Promise.all([
      emailjs.send('service_du9bcx2', 'template_g99doym', params),
      emailjs.send('service_du9bcx2', 'template_jq2wfs5', params),
    ]).then(() => {
        form.style.display = 'none';
        if (success) {
          success.textContent = success.dataset[lang] || success.dataset.en;
          success.style.display = 'block';
        }
      })
      .catch(err => {
        console.error('EmailJS error:', err);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = lang === 'lv'
            ? 'Kļūda — mēģiniet vēlreiz'
            : lang === 'ru'
            ? 'Ошибка — попробуйте снова'
            : 'Error — please try again';
          setTimeout(() => {
            submitBtn.textContent = lang === 'lv'
              ? 'Nosūtīt ziņojumu'
              : lang === 'ru'
              ? 'Отправить сообщение'
              : 'Send Message';
          }, 3000);
        }
      });
  });
}

// ── Lightbox ─────────────────────────────────────────
const lightbox         = document.getElementById('lightbox');
const lightboxInner    = document.getElementById('lightbox-inner');
const lightboxDownload = document.getElementById('lightbox-download');

if (lightbox && lightboxInner) {
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      lightboxInner.innerHTML = '';
      const img = item.querySelector('img');
      const ph  = item.querySelector('.g-ph');

      if (img) {
        const el = document.createElement('img');
        el.src = img.src; el.alt = img.alt || '';
        lightboxInner.appendChild(el);
        if (lightboxDownload) {
          lightboxDownload._imgSrc  = img.src;
          lightboxDownload._imgName = img.alt || 'mila-engraving';
          lightboxDownload.classList.remove('hidden');
        }
      } else if (ph) {
        const clone = ph.cloneNode(true);
        clone.style.aspectRatio = '';
        lightboxInner.appendChild(clone);
        if (lightboxDownload) lightboxDownload.classList.add('hidden');
        const lang = localStorage.getItem('mila-lang') || 'en';
        clone.querySelectorAll('[data-en]').forEach(el => {
          el.textContent = el.dataset[lang] || el.dataset.en;
        });
      }

      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  if (lightboxDownload) {
    lightboxDownload.addEventListener('click', e => {
      e.preventDefault();
      const src  = lightboxDownload._imgSrc;
      const name = lightboxDownload._imgName;
      if (!src) return;
      fetch(src)
        .then(r => r.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob);
          const a   = document.createElement('a');
          a.href     = url;
          a.download = name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(url), 100);
        })
        .catch(() => window.open(src, '_blank'));
    });
  }

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };
  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
}

// ── Gallery parallax ─────────────────────────────────
(function () {
  const tracks   = document.querySelectorAll('.gallery-track[data-speed]');
  if (!tracks.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(max-width: 768px)').matches) return;

  let ticking = false;
  function tick() {
    const vh = window.innerHeight;
    tracks.forEach(track => {
      const r = track.getBoundingClientRect();
      if (r.top < vh + 120 && r.bottom > -120) {
        const speed  = parseFloat(track.dataset.speed);
        const dist   = r.top + r.height / 2 - vh / 2;
        track.style.transform = `translateY(${dist * -speed}px)`;
      }
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(tick); ticking = true; }
  }, { passive: true });
}());

// ── Service card accordion (mobile) ──────────────────
(function () {
  const cards = document.querySelectorAll('.service-card');
  if (!cards.length) return;

  function initAccordion() {
    if (!window.matchMedia('(max-width: 768px)').matches) return;
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const isOpen = card.classList.contains('open');
        cards.forEach(c => c.classList.remove('open'));
        if (!isOpen) card.classList.add('open');
      });
    });
  }
  initAccordion();
}());

// ── Page fade-out on navigation ──────────────────────
document.addEventListener('click', e => {
  const link = e.target.closest('a[href]');
  if (!link) return;

  const href = link.getAttribute('href');
  if (!href) return;

  // Skip pure hash-only links (same-page anchors)
  if (href.startsWith('#')) return;

  // Skip external / mailto / tel
  try {
    const url = new URL(href, location.href);
    if (url.origin !== location.origin) return;
    // Skip if same page and only hash differs
    if (url.pathname === location.pathname && !url.search) return;
  } catch { return; }

  e.preventDefault();
  document.body.classList.add('is-leaving');
  setTimeout(() => { window.location.href = href; }, 290);
});

// ── Copy contact details to clipboard ────────────────
document.querySelectorAll('.contact-detail[data-copy]').forEach(el => {
  const textEl = el.querySelector('span:last-child');
  const original = textEl.textContent;

  el.addEventListener('click', () => {
    navigator.clipboard.writeText(el.dataset.copy).then(() => {
      textEl.textContent = 'Copied!';
      el.classList.add('copied');
      setTimeout(() => {
        textEl.textContent = original;
        el.classList.remove('copied');
      }, 1800);
    });
  });
});
