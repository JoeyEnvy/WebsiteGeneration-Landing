// =========================
// DOM ELEMENTS
// =========================
const header = document.getElementById("header");
const nav = document.getElementById("nav");
const burger = document.getElementById("burger");
const scrollbar = document.getElementById("scrollbar");
const yearSpan = document.getElementById("year");

// =========================
// SCROLLBAR + SHRINK HEADER
// =========================
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
  const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - window.innerHeight;
  const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (scrollbar) scrollbar.style.width = scrolled + "%";

  if (scrollTop > 60) header && header.classList.add("shrink");
  else header && header.classList.remove("shrink");
}, { passive: true });

// =========================
// BURGER MENU TOGGLE
// =========================
if (burger && nav) {
  burger.addEventListener("click", () => {
    const expanded = burger.getAttribute("aria-expanded") === "true";
    burger.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("open");
  });

  // Close nav on link click (mobile)
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    });
  });
}

// =========================
// SMOOTH SCROLL BEHAVIOUR
// =========================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// =========================
// REVEAL ON SCROLL
// =========================
const revealEls = document.querySelectorAll(".reveal-up");
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
);
revealEls.forEach(el => observer.observe(el));

// =========================
// YEAR AUTO UPDATE
// =========================
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

// =========================
/* CONTACT FORM HANDLER
   Replace scriptURL with your Google Apps Script endpoint.
   Keeps UI responsive and shows status messages.
*/
// =========================
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  const formStatus = document.getElementById("formStatus");
  const submitBtn = document.getElementById("submitBtn");
  contactForm.addEventListener("submit", async e => {
    e.preventDefault();
    if (formStatus) formStatus.textContent = "Sending...";
    if (submitBtn) submitBtn.disabled = true;

    const scriptURL = ""; // TODO: paste your Apps Script URL
    try {
      const res = await fetch(scriptURL || "/__no_endpoint__", {
        method: "POST",
        body: new FormData(contactForm),
      });
      if (res.ok) {
        if (formStatus) formStatus.textContent = "Message sent.";
        contactForm.reset();
      } else {
        if (formStatus) formStatus.textContent = "Error submitting form.";
      }
    } catch {
      if (formStatus) formStatus.textContent = "Network error.";
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}
