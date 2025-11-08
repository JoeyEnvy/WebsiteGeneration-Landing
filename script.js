// ==========================================================
// WEBSITE GENERATION LTD — FINAL script.js (v9.1 — LIVE)
// Contact Form: 100% WORKING | Validation | No Reload | Success UI
// + FIX: No scroll jump on submit — stays on form to show message
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
// CONTACT FORM — FINAL VERSION (Validation + No Reload + Success UI)
// + FIXED: No scroll to top — stays on form to show success message
// ========================================================================
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  const formStatus = document.getElementById("formStatus");
  const submitBtn = document.getElementById("submitBtn");
  const loader = document.getElementById("loader");
  const inputs = contactForm.querySelectorAll("input, textarea");

  // Reset validation styles
  const resetValidation = () => {
    inputs.forEach(input => {
      input.classList.remove("error");
    });
    formStatus.textContent = "";
  };

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // STOP RELOAD
    resetValidation();

    let hasError = false;

    // === VALIDATION ===
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    if (!name) {
      contactForm.name.classList.add("error");
      hasError = true;
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      contactForm.email.classList.add("error");
      hasError = true;
    }
    if (!message) {
      contactForm.message.classList.add("error");
      hasError = true;
    }

    if (hasError) {
      formStatus.textContent = "Please fill in all fields correctly.";
      formStatus.style.color = "#ff6b6b";
      return;
    }

    // === SUBMIT ===
    loader.style.display = "inline-block";
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    const scriptURL = "https://script.google.com/macros/s/AKfycbyYAFcjeDVfiCy63kEG62EAIm1ZycmPgAbgk0nPJ2uX5mo-hv9Gf135rY7iqm8yqEYBhw/exec";

    try {
      const response = await fetch(scriptURL, {
        method: "POST",
        body: new FormData(contactForm)
      });

      const text = await response.text();

      if (response.ok && text.trim() === "OK") {
        formStatus.textContent = "Thank you! We'll reply within 24 hours.";
        formStatus.style.color = "#00ff9d";
        contactForm.reset();

        // STAY ON FORM — SHOW SUCCESS MESSAGE
        contactForm.scrollIntoView({ behavior: "smooth", block: "center" });

        // Auto-clear after 8 seconds
        setTimeout(() => {
          formStatus.textContent = "";
        }, 8000);
      } else {
        throw new Error(text);
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

  // Optional: Real-time validation
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