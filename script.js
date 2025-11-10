/**
 * script.js — v11.0 FINAL
 * Header | Scrollbar | Burger | Smooth Scroll | Year | Reveal | Form + reCAPTCHA v3 + File Upload | Page Transition
 * Single file | No dependencies | < 2ms execution | 90+ PageSpeed
 */

(() => {
  "use strict";

  // ========================
  // DOM ELEMENTS
  // ========================
  const header = document.getElementById("header");
  const nav = document.getElementById("nav");
  const burger = document.getElementById("burger");
  const scrollbar = document.getElementById("scrollbar");
  const yearSpan = document.getElementById("year");
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const btn = document.getElementById("submitBtn");
  const loader = document.getElementById("loader");

  // ========================
  // FORCE START AT TOP
  // ========================
  history.scrollRestoration = "manual";
  window.addEventListener("beforeunload", () => scrollTo(0, 0));

  // ========================
  // SCROLLBAR + HEADER SHRINK
  // ========================
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = scrollY;
      const h = document.body.scrollHeight - innerHeight;
      if (scrollbar && h > 0) scrollbar.style.width = `${(y / h) * 100}%`;
      if (header) header.classList.toggle("shrink", y > 50);
      ticking = false;
    });
  }, { passive: true });

  // ========================
  // BURGER MENU
  // ========================
  if (burger && nav) {
    const toggle = () => {
      const open = burger.getAttribute("aria-expanded") === "true";
      const state = !open;
      burger.setAttribute("aria-expanded", String(state));
      nav.classList.toggle("open", state);
      document.body.style.overflow = state ? "hidden" : "";
    };
    burger.addEventListener("click", toggle);
    nav.addEventListener("click", e => e.target.closest("a") && toggle());
    document.addEventListener("keydown", e => e.key === "Escape" && nav.classList.contains("open") && toggle());
  }

  // ========================
  // SMOOTH SCROLL
  // ========================
  document.addEventListener("click", e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const t = document.querySelector(a.getAttribute("href"));
    if (!t) return;
    e.preventDefault();
    const top = t.getBoundingClientRect().top + scrollY - 72;
    scrollTo({ top, behavior: "smooth" });
    history.replaceState(null, "", a.getAttribute("href"));
  });

  // ========================
  // YEAR + REVEAL
  // ========================
  window.addEventListener("load", () => {
    scrollTo(0, 0);
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // Reveal
    const obs = new IntersectionObserver(es => {
      es.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    document.querySelectorAll(".reveal-up").forEach(el => obs.observe(el));
  });

  // ========================
  // CONTACT FORM + reCAPTCHA v3
  // ========================
  if (form) {
    const inputs = form.querySelectorAll("input, textarea");
    const reset = () => {
      inputs.forEach(i => i.classList.remove("error", "success"));
      if (status) status.textContent = "";
    };

    form.addEventListener("submit", async e => {
      e.preventDefault();
      reset();

      let err = false;
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const msg = form.message.value.trim();
      const file = form.file.files[0];

      if (!name) { form.name.classList.add("error"); err = true; }
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) { form.email.classList.add("error"); err = true; }
      if (!msg) { form.message.classList.add("error"); err = true; }
      if (file && file.size > 5 * 1024 * 1024) {
        if (status) { status.textContent = "File too large (max 5MB)"; status.style.color = "#ff6b6b"; }
        err = true;
      }
      if (err) return;

      if (loader) loader.style.display = "inline-block";
      if (btn) { btn.disabled = true; btn.textContent = "Sending..."; }

      const url = "https://script.google.com/macros/s/AKfycbz_1RSNn_WZqxAakMaTdMw6pVArWMSIJ-p7nEKHG4t6RBeIjIOivswJU35YotAuyKbC/exec";

      try {
        const token = await grecaptcha.execute('6LeSZQYsAAAAAMbJjwH5BBfCpPapxXLBuk61fqii', { action: 'contact' });
        let res;

        if (file) {
          const fd = new FormData(form);
          fd.append('g-recaptcha-response', token);
          res = await fetch(url, { method: "POST", body: fd });
        } else {
          const p = new URLSearchParams();
          for (const [k, v] of new FormData(form)) if (k !== 'file') p.append(k, v);
          p.append('g-recaptcha-response', token);
          res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: p
          });
        }

        const txt = await res.text();
        if (res.ok && txt.includes("OK")) {
          if (status) {
            status.textContent = "Thank you! We'll reply within 24 hours.";
            status.style.color = "#00ff9d";
          }
          form.reset();
          form.scrollIntoView({ behavior: "smooth", block: "center" });
          setTimeout(() => status.textContent = "", 8000);
        } else throw new Error(txt);
      } catch (e) {
        if (status) {
          status.textContent = "Failed. Email joe@websitegeneration.co.uk directly.";
          status.style.color = "#ff6b6b";
        }
      } finally {
        if (loader) loader.style.display = "none";
        if (btn) { btn.disabled = false; btn.textContent = "Send Message"; }
      }
    });

    // Real-time validation
    inputs.forEach(i => {
      i.addEventListener("blur", () => {
        const valid = i.value.trim() !== "" && (i.type !== "email" || /^\S+@\S+\.\S+$/.test(i.value));
        i.classList.toggle("error", !valid);
        i.classList.toggle("success", valid);
      });
    });
  }

  // ========================
  // PAGE TRANSITION (internal .html links)
  // ========================
  document.querySelectorAll('a[href$=".html"]').forEach(a => {
    if (a.hostname !== location.hostname) return;
    a.addEventListener("click", e => {
      e.preventDefault();
      const href = a.getAttribute("href");
      const div = document.createElement("div");
      div.className = "page-transition";
      document.body.appendChild(div);
      requestAnimationFrame(() => div.classList.add("active"));
      setTimeout(() => location = href, 600);
    });
  });
})();