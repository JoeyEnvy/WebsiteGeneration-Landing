// ==========================================================
// WEBSITE GENERATION LTD — FINAL script.js (v10.0 — LIVE)
// + FULL ORIGINAL FEATURES (header, nav, scroll, etc.)
// + Contact Form: File Upload + reCAPTCHA v3 + Dual Mode
// + Email to joe@... + Auto-Reply + Success Message
// + No reload | No jump | 100% Working
// ==========================================================

// =========================
// DOM ELEMENTS
// =========================
const header = document.getElementById("header");
const nav = document.getElementById("nav");
const burger = document.getElementById("burger");
const scrollbar = document.getElementById("scrollbar");
const yearSpan = document.getElementById("year");

// =========================
// FORCE START AT TOP
// =========================
window.history.scrollRestoration = "manual";
window.addEventListener("beforeunload", () => window.scrollTo(0, 0));

// =========================
// SCROLLBAR + SHRINK HEADER
// =========================
let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      if (scrollbar) {
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        scrollbar.style.width = totalHeight > 0 ? (scrollY / totalHeight) * 100 + "%" : "0";
      }
      if (header) {
        header.classList.toggle("shrink", scrollY > 50);
      }
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// =========================
// BURGER MENU
// =========================
if (burger && nav) {
  const toggleMenu = () => {
    const isOpen = burger.getAttribute("aria-expanded") === "true";
    const newState = !isOpen;
    burger.setAttribute("aria-expanded", String(newState));
    nav.classList.toggle("open", newState);
    document.body.style.overflow = newState ? "hidden" : "";
  };
  burger.addEventListener("click", toggleMenu);
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      burger.setAttribute("aria-expanded", "false");
      nav.classList.remove("open");
      document.body.style.overflow = "";
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      toggleMenu();
    }
  });
}

// =========================
// SMOOTH SCROLL
// =========================
document.addEventListener("click", (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const target = document.querySelector(link.getAttribute("href"));
  if (!target) return;
  e.preventDefault();
  const offsetY = target.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top: offsetY, behavior: "smooth" });
  history.replaceState(null, "", link.getAttribute("href"));
});

// =========================
// REVEAL + YEAR + YOUTUBE
// =========================
window.addEventListener("load", () => {
  window.scrollTo(0, 0);
  // Reveal
  const revealEls = document.querySelectorAll(".reveal-up");
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => io.observe(el));
  }
  // Year
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  // YouTube
  document.querySelectorAll(".video-thumb").forEach(thumb => {
    thumb.addEventListener("click", () => {
      if (thumb.querySelector("iframe")) return;
      const id = thumb.dataset.yt;
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      thumb.appendChild(iframe);
      thumb.querySelector("img").style.display = "none";
      thumb.style.pointerEvents = "none";
    });
  });
});

// =========================
// PAGE TRANSITION
// =========================
document.querySelectorAll('a[href$=".html"]').forEach(link => {
  if (link.hostname === location.hostname) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      const overlay = document.createElement('div');
      overlay.className = 'page-transition';
      document.body.appendChild(overlay);
      requestAnimationFrame(() => overlay.classList.add('active'));
      setTimeout(() => { window.location = href; }, 600);
    });
  }
});

// ========================================================================
// CONTACT FORM — FINAL v10.0 (WITH FILE UPLOAD + reCAPTCHA v3)
// + Dual Mode: FormData (file) OR URLSearchParams (no file)
// + reCAPTCHA v3 (Site Key: 6LeSZQYsAAAAAMbJjwH5BBfCpPapxXLBuk61fqii)
// + Success message | Auto-reply | No reload
// ========================================================================
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  const formStatus = document.getElementById("formStatus");
  const submitBtn = document.getElementById("submitBtn");
  const loader = document.getElementById("loader");
  const inputs = contactForm.querySelectorAll("input, textarea");

  const resetValidation = () => {
    inputs.forEach(input => input.classList.remove("error"));
    formStatus.textContent = "";
  };

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    resetValidation();
    let hasError = false;

    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();
    const fileInput = contactForm.file;
    const hasFile = fileInput && fileInput.files.length > 0;

    // === VALIDATION ===
    if (!name) { contactForm.name.classList.add("error"); hasError = true; }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) { contactForm.email.classList.add("error"); hasError = true; }
    if (!message) { contactForm.message.classList.add("error"); hasError = true; }
    if (hasFile && fileInput.files[0].size > 5 * 1024 * 1024) {
      formStatus.textContent = "File too large (max 5MB)"; formStatus.style.color = "#ff6b6b"; hasError = true;
    }
    if (hasError) return;

    loader.style.display = "inline-block";
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    const scriptURL = "https://script.google.com/macros/s/AKfycbxxwr7F-fW6pTPq1sXMOkR1GVk7rHs53IDdQpluEwi38KiGuPRzOb_VkZZXKjDBUOto0w/exec";

    try {
      // === reCAPTCHA v3: GET TOKEN (SITE KEY INCLUDED) ===
      const token = await grecaptcha.execute('6LeSZQYsAAAAAMbJjwH5BBfCpPapxXLBuk61fqii', { action: 'contact' });

      let response;
      if (hasFile) {
        // MODE 1: WITH FILE → FormData
        const formData = new FormData(contactForm);
        formData.append('g-recaptcha-response', token);
        response = await fetch(scriptURL, { method: "POST", body: formData });
      } else {
        // MODE 2: NO FILE → URLSearchParams
        const formData = new FormData(contactForm);
        const params = new URLSearchParams();
        for (const [k, v] of formData) if (k !== 'file') params.append(k, v);
        params.append('g-recaptcha-response', token);
        response = await fetch(scriptURL, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params
        });
      }

      const text = await response.text();
      console.log("RAW RESPONSE:", text); // DEBUG

      if (response.ok && text.includes("OK")) {
        formStatus.textContent = "Thank you! We'll reply within 24 hours.";
        formStatus.style.color = "#00ff9d";
        contactForm.reset();
        contactForm.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => formStatus.textContent = "", 8000);
      } else {
        throw new Error(`Server error: ${text}`);
      }
    } catch (err) {
      console.error("Form error:", err);
      formStatus.textContent = "Failed. Email joe@websitegeneration.co.uk directly.";
      formStatus.style.color = "#ff6b6b";
    } finally {
      loader.style.display = "none";
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  });

  // Real-time validation
  inputs.forEach(input => {
    input.addEventListener("blur", () => {
      if (input.value.trim() === "") {
        input.classList.add("error");
      } else {
        input.classList.remove("error");
      }
      if (input.type === "email" && input.value && !/^\S+@\S+\.\S+$/.test(input.value)) {
        input.classList.add("error");
      }
    });
  });
});