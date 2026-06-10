/* ============================================================
   INKWELL — Personal Blog
   main.js | Core JavaScript
   ============================================================ */

// ─── Dark Mode Toggle ───────────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const themeLabel  = document.getElementById('themeLabel');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('inkwell-theme', theme);
  if (themeIcon)  themeIcon.textContent  = theme === 'dark' ? '☀️' : '🌙';
  if (themeLabel) themeLabel.textContent = theme === 'dark' ? 'Light' : 'Dark';
}

// Load saved or system preference on page load
(function initTheme() {
  const saved  = localStorage.getItem('inkwell-theme');
  const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  applyTheme(saved || system);
})();

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

// ─── Mobile Navigation Hamburger ────────────────────────────
const hamburger = document.getElementById('navHamburger');
const navLinks  = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    hamburger.textContent = isOpen ? '✕' : '☰';
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.textContent = '☰';
    });
  });
}

// ─── Active Nav Link ─────────────────────────────────────────
(function setActiveLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === currentPage) link.classList.add('active');
  });
})();

// ─── Scroll Reveal ───────────────────────────────────────────
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children slightly
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', initScrollReveal);

// ─── Blog Category Filter ────────────────────────────────────
(function initFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.card[data-category]');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.filter;
      cards.forEach(card => {
        const show = cat === 'all' || card.dataset.category === cat;
        card.style.display = show ? '' : 'none';
        // Re-trigger reveal animation
        if (show) {
          card.classList.remove('visible');
          setTimeout(() => card.classList.add('visible'), 50);
        }
      });
    });
  });
})();

// ─── Reading Progress Bar (Blog articles) ───────────────────
(function initReadingProgress() {
  const bar = document.getElementById('readingProgress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const doc   = document.documentElement;
    const total = doc.scrollHeight - doc.clientHeight;
    const pct   = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = pct + '%';
  });
})();

// ─── Contact Form Handling ───────────────────────────────────
(function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const fields = form.querySelectorAll('[required]');
    let valid = true;
    fields.forEach(f => {
      if (!f.value.trim()) {
        f.style.borderColor = '#ef4444';
        valid = false;
      } else {
        f.style.borderColor = '';
      }
    });

    if (!valid) return;

    // Simulate form submission (replace with real endpoint or Formspree)
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled    = true;

    setTimeout(() => {
      form.style.display    = 'none';
      if (success) success.style.display = 'block';
    }, 1200);
  });
})();

// ─── Estimated Read Time ─────────────────────────────────────
(function calcReadTime() {
  const article = document.querySelector('.article-body');
  const badge   = document.getElementById('readTimeBadge');
  if (!article || !badge) return;

  const words = article.innerText.trim().split(/\s+/).length;
  const mins  = Math.max(1, Math.round(words / 200));
  badge.textContent = `${mins} min read`;
})();
