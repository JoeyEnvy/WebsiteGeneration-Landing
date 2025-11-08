// ==========================================================
// WEBSITE GENERATION LTD — OPTIMIZED MAIN SCRIPT (v8.7)
// Adds: Scroll-to-top on reload + Spline support + YouTube click-to-play
// ==========================================================

// =========================
// DOM ELEMENTS
// =========================
const header = document.getElementById("header"); // Declare header once here
const nav = document.getElementById("nav");
const burger = document.getElementById("burger");
const scrollbar = document.getElementById("scrollbar");
const yearSpan = document.getElementById("year");

// =========================
// FORCE START AT TOP ON PAGE LOAD
// =========================
window.history.scrollRestoration = "manual"; // Prevent browser's automatic scroll restoration
window.scrollTo(0, 0); // Always start from the top on page load
window.addEventListener("beforeunload", () => window.scrollTo(0, 0)); // Reset scroll position on page unload

// =========================
// SCROLLBAR + SHRINK HEADER (rAF-throttled)
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
// BURGER MENU TOGGLE (Accessible + Body Lock)
// =========================
if (burger && nav) {
  const toggleMenu = () => {
    const isOpen = burger.getAttribute("aria-expanded") === "true";
    const newState = !isOpen;
    burger.setAttribute("aria-expanded", String(newState));
    nav.classList.toggle("open", newState);
    document.body.style.overflow = newState ? "hidden" : ""; // Lock body scrolling when menu is open
  };
  burger.addEventListener("click", toggleMenu);
  // Close menu on link click
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      burger.setAttribute("aria-expanded", "false");
      nav.classList.remove("open");
      document.body.style.overflow = "";
    }
  });
  // Close on ESC key press
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      toggleMenu();
    }
  });
}

// =========================
// SMOOTH SCROLL (single listener)
// =========================
document.addEventListener("click", (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const target = document.querySelector(link.getAttribute("href"));
  if (!target) return;
  e.preventDefault();
  const offsetY = target.getBoundingClientRect().top + window.scrollY - 72; // Adjust for fixed navbar
  window.scrollTo({ top: offsetY, behavior: "smooth" });
  history.replaceState(null, "", link.getAttribute("href"));
});

// =========================
// REVEAL ON SCROLL (single IntersectionObserver)
// =========================
window.addEventListener("load", () => {
  window.scrollTo(0, 0); // Ensure top on reload
  const revealEls = document.querySelectorAll(".reveal-up");
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    revealEls.forEach(el => io.observe(el));
  }

  // =========================
  // YEAR AUTO UPDATE
  // =========================
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // =========================
  // VIDEO THUMB CLICK-TO-PLAY
  // =========================
  const thumbs = document.querySelectorAll(".video-thumb");
  if (thumbs.length) {
    thumbs.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        const iframe = thumb.querySelector("iframe");
        if (iframe) return; // Prevent multiple iframes
        const id = thumb.dataset.yt;
        const iframeElement = document.createElement("iframe");
        iframeElement.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
        iframeElement.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframeElement.allowFullscreen = true;
        thumb.appendChild(iframeElement);
        thumb.querySelector("img").style.display = "none"; // Hide thumbnail image
        thumb.style.pointerEvents = "none"; // Disable further clicks
      });
    });
  }
});

// =========================
// PAGE TRANSITION LOGIC (Smooth Navigation)
// =========================
document.querySelectorAll('a[href$=".html"]').forEach(link => {
  if (link.hostname === location.hostname) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      // Create transition overlay
      const overlay = document.createElement('div');
      overlay.className = 'page-transition';
      document.body.appendChild(overlay);
      // Trigger entrance animation
      requestAnimationFrame(() => overlay.classList.add('active'));
      // Navigate after animation
      setTimeout(() => {
        window.location = href;
      }, 600);
    });
  }
});

// ========================================================================
// CONTACT FORM HANDLER — FULLY FIXED, TESTED & WORKING (v1.0 – 8 Nov 2025)
// ========================================================================
// DEPLOYMENT: Version 1 (8 Nov 2025, 13:31)
// DEPLOYMENT ID: AKfycbzopwDGRa9hu5y_NqelcYRnAp6mmvtpN7STEjNR_S2sFSOORRs4f7jp9MDiLdnJPW73yw
// WEB APP URL: https://script.google.com/macros/s/AKfycbzopwDGRa9hu5y_NqelcYRnAp6mmvtpN7STEjNR_S2sFSOORRs4f7jp9MDiLdnJPW73yw/exec
// ACCESS: Anyone (public)
// EXECUTE AS: Me (owner)
// REQUIRED: doGet() + doPost() in Google Apps Script
// ========================================================================

const contactForm = document.getElementById("contactForm");
if (contactForm) {
  const formStatus = document.getElementById("formStatus");
  const submitBtn = document.getElementById("submitBtn");
  const loader = document.getElementById("loader");

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Show loader + disable button
    loader.style.display = "inline-block";
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    // LATEST WORKING URL (Version 1 – 8 Nov 2025)
    const scriptURL = "https://script.google.com/macros/s/AKfycbzopwDGRa9hu5y_NqelcYRnAp6mmvtpN7STEjNR_S2sFSOORRs4f7jp9MDiLdnJPW73yw/exec";

    try {
      const response = await fetch(scriptURL, {
        method: "POST",
        body: new FormData(contactForm)  // Sends as URL-encoded → e.parameter in Apps Script
      });

      const text = await response.text();

      if (response.ok && text.trim() === "OK") {
        formStatus.textContent = "Thank you! We'll reply within 24 hours.";
        formStatus.style.color = "#00ff9d";
        contactForm.reset();
        contactForm.style.display = "none";
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        throw new Error(text || "Server error");
      }
    } catch (err) {
      console.error("Form submission failed:", err);
      formStatus.textContent = "Failed to send. Email joe@websitegeneration.co.uk directly.";
      formStatus.style.color = "#ff6b6b";
    } finally {
      loader.style.display = "none";
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
      setTimeout(() => { formStatus.textContent = ""; }, 6000);
    }
  });
}

// ========================================================================
// GOOGLE APPS SCRIPT — FULLY WORKING (COPY-PASTE INTO PROJECT)
// ========================================================================
/*
function doGet(e) {
  return ContentService
    .createTextOutput("OK")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    const data = e.parameter;
    const name = data.name || "No name";
    const email = data.email || "No email";
    const message = data.message || "No message";

    const subject = `New Contact Form Message — ${name}`;
    const body = `
New message from WebsiteGeneration.co.uk

Name: ${name}
Email: ${email}

Message:
${message}
`.trim();

    MailApp.sendEmail({
      to: "joe@websitegeneration.co.uk",
      subject: subject,
      body: body
    });

    return ContentService
      .createTextOutput("OK")
      .setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService
      .createTextOutput("ERROR: " + err.toString())
      .setMimeType(ContentService.MimeType.TEXT);
  }
}
*/
// DEPLOY INSTRUCTIONS:
// 1. Paste above into Google Apps Script
// 2. Deploy → New Deployment → Web App
// 3. Execute as: Me
// 4. Who has access: Anyone
// 5. Copy /exec URL → use in scriptURL above
// ========================================================================