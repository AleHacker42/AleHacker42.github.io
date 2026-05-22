/* ══════════════════════════════════════════════════════════════════════════
   Alejandro Hacker — site script
   ══════════════════════════════════════════════════════════════════════════ */

'use strict';

/* ─── STATE ──────────────────────────────────────────────────────────────── */
let currentLang = localStorage.getItem('lang') || 'en';

/* ─── LANGUAGE TOGGLE ────────────────────────────────────────────────────── */
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;

  document.querySelectorAll('.lang-en').forEach(el => {
    el.style.display = lang === 'en' ? '' : 'none';
  });
  document.querySelectorAll('.lang-es').forEach(el => {
    el.style.display = lang === 'es' ? '' : 'none';
  });

  document.getElementById('btn-en').classList.toggle('active', lang === 'en');
  document.getElementById('btn-es').classList.toggle('active', lang === 'es');
}

/* ─── MOBILE MENU ────────────────────────────────────────────────────────── */
function toggleMenu() {
  document.getElementById('navbar').classList.toggle('menu-open');
}

/* Close mobile menu when a nav link is clicked */
function bindMenuClose() {
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('navbar').classList.remove('menu-open');
    });
  });
}

/* ─── NAVBAR SCROLL STYLE ────────────────────────────────────────────────── */
function bindNavbarScroll() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ─── ACTIVE NAV LINK ────────────────────────────────────────────────────── */
function bindActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          link.classList.toggle('active', href === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}

/* ─── SCROLL ANIMATIONS ──────────────────────────────────────────────────── */
function bindScrollAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // fire once
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));
}

/* ─── STARFIELD CANVAS ───────────────────────────────────────────────────── */
function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  const STAR_COUNT = 280;
  const stars = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function seedStars() {
    stars.length = 0;
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x:      Math.random(),
        y:      Math.random(),
        r:      Math.random() * 1.4 + 0.25,
        base:   Math.random() * 0.7 + 0.15,
        speed:  Math.random() * 0.018 + 0.004,
        phase:  Math.random() * Math.PI * 2,
        /* ~10% of stars get a slight blue tint */
        blue:   Math.random() < 0.1,
      });
    }
  }

  let t = 0;
  let raf;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (const s of stars) {
      const alpha = s.base + (s.base * 0.6) * Math.sin(t * s.speed + s.phase);
      const x = s.x * W;
      const y = s.y * H;

      ctx.beginPath();
      ctx.arc(x, y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.blue
        ? `rgba(120, 210, 255, ${alpha})`
        : `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();
    }

    t++;
    raf = requestAnimationFrame(draw);
  }

  /* Pause animation when tab is hidden — saves CPU */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(draw);
    }
  });

  resize();
  seedStars();
  draw();

  window.addEventListener('resize', () => {
    resize();
  }, { passive: true });
}

/* ─── INIT ───────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  setLanguage(currentLang);   // apply saved/default language
  initStarfield();
  bindNavbarScroll();
  bindActiveNav();
  bindScrollAnimations();
  bindMenuClose();
});