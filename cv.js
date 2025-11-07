/* =====================================================================
   JOE MORT — VISUAL CV INTERACTIONS (cv.js) – FINAL VERSION
   • Hamburger WORKS
   • NO FAB
   • Toast on PDF + Web Version
   • Ripple + Scroll Reveal
   • Project card click
   • Header shrink
===================================================================== */
(() => {
  'use strict';

  const $ = (s, scope = document) => scope.querySelector(s);
  const $$ = (s, scope = document) => [...scope.querySelectorAll(s)];

  // ===== HAMBURGER MENU (FULLY WORKING) =====
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close on link/button click
    $$('#mobile-menu a, #mobile-menu button').forEach(el => {
      el.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ===== PDF PRINT (in header) =====
  $('#btn-pdf')?.addEventListener('click', () => {
    window.print();
  });

  // ===== WEB VERSION LINK (opens in new tab + toast) =====
  document.querySelector('a[href="https://websitegeneration.co.uk/cv"]')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.open('https://websitegeneration.co.uk/cv', '_blank', 'noopener,noreferrer');
    toast('Web version opened!');
  });

  // ===== TOAST UTILITY =====
  function toast(message, duration = 1800) {
    const existing = $('.toast');
    if (existing) existing.remove();

    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = message;
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    document.body.appendChild(el);

    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => {
      el.classList.remove('show');
      el.addEventListener('transitionend', () => el.remove(), { once: true });
    }, duration);
  }
  window.toast = toast;

  // ===== REVEAL ON SCROLL =====
  const reveals = $$('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optional: unobserve after reveal
        // observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  reveals.forEach(el => observer.observe(el));

  // ===== PROJECT CARD CLICK-THROUGH =====
  $$('.project-card').forEach(card => {
    const link = card.dataset.link;
    if (!link || link === '#') return;
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      window.open(link, '_blank', 'noopener,noreferrer');
    });
  });

  // ===== HEADER SHRINK (GPU-optimized) =====
  const header = $('#site-header');
  if (header) {
    let ticking = false;
    const threshold = 60;
    const update = () => {
      header.classList.toggle('shrink', window.scrollY > threshold);
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    });
    update(); // Initial check
  }

  // ===== RIPPLE EFFECT (buttons, links, cards) =====
  function addRipple(el) {
    if (!el) return;
    el.style.position = 'relative';
    el.style.overflow = 'hidden';
    el.addEventListener('click', (e) => {
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.8;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(0,191,255,.4), transparent 70%);
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        transform: scale(0);
        animation: ripple 0.65s ease-out forwards;
      `;
      el.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  }

  // Inject ripple keyframes once
  if (!document.getElementById('ripple-kf')) {
    const style = document.createElement('style');
    style.id = 'ripple-kf';
    style.textContent = `@keyframes ripple { to { transform: scale(1); opacity: 0; } }`;
    document.head.appendChild(style);
  }

  $$('.btn, a, .project-card, .link-grid a').forEach(addRipple);

})();