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
  // Tilt on mouse move
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

  // Coin flip on click
  logoWrap.addEventListener('click', () => {
    if (isFlipped) return;
    isFlipped = true;
    clearTimeout(flipTimer);

    // Set next quote
    if (logoQuoteEl) {
      logoQuoteEl.textContent = quotes[quoteIndex % quotes.length];
      quoteIndex++;
    }

    // Smoothly reset any tilt, then flip
    logoFlipper.style.transition = 'transform .18s ease';
    logoFlipper.style.transform  = 'scale(1)';

    setTimeout(() => {
      logoFlipper.style.transition = 'transform .7s cubic-bezier(.4,0,.2,1)';
      logoFlipper.style.transform  = 'rotateY(180deg)';
    }, 160);

    // Flip back after 3.5 s
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
function swapText(lang) {
  document.querySelectorAll('[data-en]').forEach(el => {
    el.textContent = lang === 'lv' ? el.dataset.lv : el.dataset.en;
  });
  document.querySelectorAll('[data-en-ph]').forEach(el => {
    el.placeholder = lang === 'lv' ? el.dataset.lvPh : el.dataset.enPh;
  });
  const btn = document.getElementById('lang-toggle');
  if (btn) btn.textContent = lang === 'lv' ? 'EN' : 'LV';
  document.documentElement.lang = lang === 'lv' ? 'lv' : 'en';
  localStorage.setItem('mila-lang', lang);
}

function applyLang(lang, animate) {
  if (!animate) { swapText(lang); return; }

  const els = document.querySelectorAll(
    '[data-en], [data-en-ph], #lang-toggle'
  );

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

const langBtn = document.getElementById('lang-toggle');
if (langBtn) {
  langBtn.addEventListener('click', () => {
    applyLang((localStorage.getItem('mila-lang') || 'en') === 'en' ? 'lv' : 'en', true);
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
      valueEl.textContent = lang === 'lv' ? item.dataset.lv : item.dataset.en;
      valueEl.dataset.en  = item.dataset.en;
      valueEl.dataset.lv  = item.dataset.lv;
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

    // Loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = lang === 'lv' ? 'Sūta…' : 'Sending…';
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
      emailjs.send('service_67troma', 'template_g99doym', params),
      emailjs.send('service_67troma', 'template_jq2wfs5', params),
    ]).then(() => {
        form.style.display = 'none';
        if (success) {
          success.textContent = lang === 'lv' ? success.dataset.lv : success.dataset.en;
          success.style.display = 'block';
        }
      })
      .catch(err => {
        console.error('EmailJS error:', err);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = lang === 'lv'
            ? 'Kļūda — mēģiniet vēlreiz'
            : 'Error — please try again';
          setTimeout(() => {
            submitBtn.textContent = lang === 'lv' ? 'Nosūtīt ziņojumu' : 'Send Message';
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
        // Re-apply language to cloned element
        const lang = localStorage.getItem('mila-lang') || 'en';
        clone.querySelectorAll('[data-en]').forEach(el => {
          el.textContent = lang === 'lv' ? el.dataset.lv : el.dataset.en;
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
