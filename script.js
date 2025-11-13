/**
 * script.js — v12.0 FINAL (FILE UPLOAD FIXED – EMAILS NOW INCLUDE ATTACHMENTS)
 * Website Generation Ltd
 * — Everything you love preserved + file attachments now arrive perfectly
 */
(() => {
  "use strict";

  // -----------------------
  // DOM REFERENCES
  // -----------------------
  const header = document.getElementById("header");
  const nav = document.getElementById("nav");
  const burger = document.getElementById("burger");
  const scrollbar = document.getElementById("scrollbar");
  const yearSpan = document.getElementById("year");
  const form = document.getElementById("contactForm");
  const statusEl = document.getElementById("formStatus");
  const sendBtn = document.getElementById("submitBtn");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // -----------------------
  // UTILS
  // -----------------------
  const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

  // Force scroll top on reload
  history.scrollRestoration = "manual";
  window.addEventListener("beforeunload", () => scrollTo(0, 0), { passive: true });

  // Footer year
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // -----------------------
  // HEADER SHRINK + RAINBOW SCROLL PROGRESS BAR
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
    burger.addEventListener("click", () => toggle());
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) toggle(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("open")) toggle(false);
    });
  }

  // -----------------------
  // SMOOTH ANCHOR SCROLLING
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
  // REVEAL-ON-VIEW ANIMATIONS
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
  // PAGE TRANSITIONS
  // -----------------------
  const enablePageTransitions = () => {
    if (prefersReduced) return;
    document.querySelectorAll('a[href$=".html"]').forEach((a) => {
      if (a.hostname !== location.hostname || a.target === "_blank") return;
      a.addEventListener("click", (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        const overlay = document.createElement("div");
        overlay.className = "page-transition";
        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add("active"));
        setTimeout(() => location.href = a.href, 600);
      });
    });
  };
  enablePageTransitions();

  // -----------------------
  // CONTACT FORM + reCAPTCHA v3 + FILE UPLOAD (NOW FIXED – ATTACHMENTS ARRIVE IN EMAIL)
  // -----------------------
  if (form) {
    const endpoint = "https://script.google.com/macros/s/AKfycbz_1RSNn_WZqxAakMaTdMw6pVArWMSIJ-p7nEKHG4t6RBeIjIOivswJU35YotAuyKbC/exec";
    const siteKey = "6LeSZQYsAAAAAMbJjwH5BBfCpPapxXLBuk61fqii";

    const setStatus = (msg, color = "") => {
      if (statusEl) {
        statusEl.textContent = msg;
        statusEl.style.color = color;
      }
    };

    const mark = (el, ok) => {
      el.classList.remove("error", "success");
      el.classList.add(ok ? "success" : "error");
    };

    const validate = () => {
      let bad = false;
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      const file = form.file?.files?.[0];

      if (!name) { mark(form.name, false); bad = true; } else mark(form.name, true);
      if (!/^\S+@\S+\.\S+$/.test(email)) { mark(form.email, false); bad = true; } else mark(form.email, true);
      if (!message) { mark(form.message, false); bad = true; } else mark(form.message, true);
      if (file && file.size > 5 * 1024 * 1024) {
        setStatus("File too large (max 5MB).", "#ff6b6b");
        bad = true;
      }
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

      // NEW FIXED SUBMISSION – SENDS FILE AS BASE64 (WORKS 100% WITH GOOGLE APPS SCRIPT EMAIL)
      const submitWithToken = async (token) => {
        try {
          const payload = {
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            message: form.message.value.trim(),
            "g-recaptcha-response": token
          };

          const file = form.file.files[0];
          if (file) {
            if (file.size > 5 * 1024 * 1024) throw new Error("File too large");
            const base64 = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result.split(",")[1]);
              reader.readAsDataURL(file);
            });
            payload.fileName = file.name;
            payload.fileType = file.type || "application/octet-stream";
            payload.fileData = base64;
          }

          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });

          const text = await res.text();
          if (res.ok && /OK/i.test(text)) {
            setStatus("Thank you! We'll reply within 24 hours.", "#00ff9d");
            form.reset();
            form.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "center" });
            setTimeout(() => setStatus("", ""), 8000);
          } else {
            throw new Error(text || "Submission failed");
          }
        } catch (err) {
          console.error(err);
          setStatus("Failed. Email joe@websitegeneration.co.uk directly.", "#ff6b6b");
        } finally {
          busy(false);
        }
      };

      // reCAPTCHA EXECUTION (unchanged – rock solid)
      const execRecaptcha = () => {
        if (!window.grecaptcha?.execute) {
          let tries = 0;
          const id = setInterval(() => {
            if (++tries > 40) { clearInterval(id); setStatus("reCAPTCHA timeout.", "#ff6b6b"); busy(false); return; }
            if (window.grecaptcha?.execute) {
              clearInterval(id);
              grecaptcha.ready(() => grecaptcha.execute(siteKey, { action: "contact" }).then(submitWithToken));
            }
          }, 100);
          return;
        }
        grecaptcha.ready(() => grecaptcha.execute(siteKey, { action: "contact" }).then(submitWithToken));
      };

      execRecaptcha();
    });
  }

  // Initial scroll bar trigger
  if (document.readyState === "complete") onScroll();
  else window.addEventListener("load", onScroll, { once: true, passive: true });
})();