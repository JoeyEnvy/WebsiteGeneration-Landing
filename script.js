/**
 * script.js — v11.2 FINAL
 * Website Generation Ltd
 * -----------------------
 * Header shrink + scroll bar
 * Burger menu toggle (with ESC + overlay prevention)
 * Smooth anchor scroll
 * Reveal-on-view animations
 * reCAPTCHA v3 contact form (with file upload support)
 * Page transitions for internal .html links
 * Performance: single rAF, passive scroll
 */

(() => {
  "use strict";

  // -----------------------
  // DOM REFERENCES
  // -----------------------
  const header    = document.getElementById("header");
  const nav       = document.getElementById("nav");
  const burger    = document.getElementById("burger");
  const scrollbar = document.getElementById("scrollbar");
  const yearSpan  = document.getElementById("year");
  const form      = document.getElementById("contactForm");
  const statusEl  = document.getElementById("formStatus");
  const sendBtn   = document.getElementById("submitBtn");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // -----------------------
  // UTILS
  // -----------------------
  const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
  const isInternal = (a) => a.origin === location.origin;

  // Force scroll top on reload
  history.scrollRestoration = "manual";
  window.addEventListener("beforeunload", () => scrollTo(0, 0), { passive: true });

  // Footer year
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // -----------------------
  // HEADER SCROLL BEHAVIOR (Shrink + Scrollbar)
  // -----------------------
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY || 0;
      if (header) header.classList.toggle("shrink", y > 50);

      if (scrollbar) {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        const pct = h > 0 ? (y / h) * 100 : 0;
        scrollbar.style.width = pct.toFixed(3) + "%";
      }
      ticking = false;
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  // -----------------------
  // BURGER MENU TOGGLE
  // -----------------------
  if (burger && nav) {
    const toggle = (force) => {
      const open = force ?? !(burger.getAttribute("aria-expanded") === "true");
      burger.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("open", open);
      document.body.style.overflow = open ? "hidden" : "";
    };

    // open/close on click
    burger.addEventListener("click", () => toggle());

    // close when link clicked
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) toggle(false);
    });

    // close on ESC key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("open")) toggle(false);
    });
  }

  // -----------------------
  // SMOOTH SCROLLING (Anchor links)
  // -----------------------
  const getHeaderOffset = () => (header ? header.offsetHeight : 0);
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    const target = id && document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset() - 8;
    if (prefersReduced) window.scrollTo(0, top);
    else window.scrollTo({ top, behavior: "smooth" });
    history.replaceState(null, "", id);
  });

  // -----------------------
  // REVEAL-ON-VIEW (Fade/Slide up)
  // -----------------------
  window.addEventListener("load", () => {
    if (prefersReduced) return;
    const els = document.querySelectorAll(".reveal-up");
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    els.forEach((el) => io.observe(el));
  });

  // -----------------------
  // PAGE TRANSITION (fade out for internal .html)
  // -----------------------
  const enablePageTransitions = () => {
    if (prefersReduced) return;
    const links = document.querySelectorAll('a[href$=".html"]');
    links.forEach((a) => {
      try {
        const url = new URL(a.href, location.href);
        if (!isInternal(url)) return;
      } catch {
        return;
      }
      a.addEventListener("click", (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === "_blank") return;
        e.preventDefault();
        const href = a.getAttribute("href");
        const overlay = document.createElement("div");
        overlay.className = "page-transition";
        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add("active"));
        setTimeout(() => (location.href = href), 600);
      });
    });
  };
  enablePageTransitions();

  // -----------------------
  // CONTACT FORM + reCAPTCHA v3
  // -----------------------
  if (form) {
    const endpoint =
      "https://script.google.com/macros/s/AKfycbz_1RSNn_WZqxAakMaTdMw6pVArWMSIJ-p7nEKHG4t6RBeIjIOivswJU35YotAuyKbC/exec";
    const siteKey = "6LeSZQYsAAAAAMbJjwH5BBfCpPapxXLBuk61fqii";

    const setStatus = (msg, color) => {
      if (statusEl) {
        statusEl.textContent = msg;
        statusEl.style.color = color || "";
      }
    };
    const mark = (el, ok) => {
      el.classList.remove("error", "success");
      el.classList.add(ok ? "success" : "error");
    };

    const validate = () => {
      let bad = false;
      const name = form.name;
      const email = form.email;
      const message = form.message;
      const file = form.file?.files?.[0];
      if (!name.value.trim()) { mark(name, false); bad = true; } else mark(name, true);
      if (!/^\S+@\S+\.\S+$/.test(email.value.trim())) { mark(email, false); bad = true; } else mark(email, true);
      if (!message.value.trim()) { mark(message, false); bad = true; } else mark(message, true);
      if (file && file.size > 5 * 1024 * 1024) { setStatus("File too large (max 5MB).", "#ff6b6b"); bad = true; }
      return !bad;
    };

    const busy = (on) => {
      if (sendBtn) {
        sendBtn.disabled = on;
        sendBtn.textContent = on ? "Sending..." : "Send Message";
      }
    };

    form.querySelectorAll("input, textarea").forEach((i) => {
      i.addEventListener("blur", () => {
        const ok = i.value.trim() !== "" && (i.type !== "email" || /^\S+@\S+\.\S+$/.test(i.value.trim()));
        mark(i, ok);
      });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      setStatus("", "");
      if (!validate()) return;
      busy(true);

      const submitWithToken = async (token) => {
        try {
          const f = form.file?.files?.[0];
          let res;
          if (f) {
            const fd = new FormData(form);
            fd.append("g-recaptcha-response", token);
            res = await fetch(endpoint, { method: "POST", body: fd });
          } else {
            const params = new URLSearchParams();
            for (const [k, v] of new FormData(form)) if (k !== "file") params.append(k, v.toString());
            params.append("g-recaptcha-response", token);
            res = await fetch(endpoint, {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: params.toString(),
            });
          }
          const text = await res.text();
          if (res.ok && /OK/i.test(text)) {
            setStatus("Thank you! We'll reply within 24 hours.", "#00ff9d");
            form.reset();
            form.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "center" });
            setTimeout(() => setStatus("", ""), 8000);
          } else throw new Error(text || "Submission failed");
        } catch (err) {
          setStatus("Failed. Email joe@websitegeneration.co.uk directly.", "#ff6b6b");
        } finally {
          busy(false);
        }
      };

      const execRecaptcha = () => {
        if (!window.grecaptcha || !grecaptcha.execute) {
          let tries = 0;
          const id = setInterval(() => {
            tries++;
            if (window.grecaptcha && grecaptcha.execute) {
              clearInterval(id);
              grecaptcha.ready(() => grecaptcha.execute(siteKey, { action: "contact" }).then(submitWithToken));
            } else if (tries > 40) {
              clearInterval(id);
              setStatus("reCAPTCHA unavailable. Try again shortly.", "#ff6b6b");
              busy(false);
            }
          }, 100);
          return;
        }
        grecaptcha.ready(() => grecaptcha.execute(siteKey, { action: "contact" }).then(submitWithToken));
      };

      execRecaptcha();
    });
  }

  // -----------------------
  // INITIAL STATE
  // -----------------------
  if (document.readyState === "complete") onScroll();
  else window.addEventListener("load", onScroll, { once: true, passive: true });
})();
