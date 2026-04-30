// Hero logo 3D tilt on mouse move
const logoWrap = document.getElementById('hero-logo-wrap');
const logoImg  = document.getElementById('hero-logo');
if (logoWrap && logoImg) {
  logoWrap.addEventListener('mousemove', e => {
    const rect  = logoWrap.getBoundingClientRect();
    const dx    = (e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2);
    const dy    = (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2);
    logoImg.style.transform = `rotateX(${dy * -18}deg) rotateY(${dx * 18}deg) scale(1.06)`;
  });
  logoWrap.addEventListener('mouseenter', () => {
    logoImg.style.transition = 'transform .08s linear, filter .3s';
  });
  logoWrap.addEventListener('mouseleave', () => {
    logoImg.style.transition = 'transform .6s cubic-bezier(.34,1.56,.64,1), filter .3s';
    logoImg.style.transform  = 'rotateX(0deg) rotateY(0deg) scale(1)';
    setTimeout(() => { logoImg.style.transition = ''; }, 650);
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

  const wrapper = document.querySelector('.page-wrapper');
  const nav     = document.querySelector('nav');

  [wrapper, nav].forEach(el => {
    if (el) { el.style.transition = 'opacity .14s ease'; el.style.opacity = '0'; }
  });

  setTimeout(() => {
    swapText(lang);
    [wrapper, nav].forEach(el => {
      if (el) { el.style.opacity = '1'; }
    });
    setTimeout(() => {
      [wrapper, nav].forEach(el => {
        if (el) { el.style.transition = ''; }
      });
    }, 160);
  }, 140);
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
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
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
const form    = document.getElementById('contact-form');
const success = document.getElementById('form-success');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    form.style.display = 'none';
    if (success) {
      const lang = localStorage.getItem('mila-lang') || 'en';
      success.textContent = lang === 'lv' ? success.dataset.lv : success.dataset.en;
      success.style.display = 'block';
    }
  });
}

// ── Lightbox ─────────────────────────────────────────
const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
if (lightbox) {
  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };
  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
}
