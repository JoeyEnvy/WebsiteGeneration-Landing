// ==========================================================
// WEBSITE GENERATION LTD — OPTIMIZED MAIN SCRIPT (v8.7)
// Adds: Scroll-to-top on reload + Spline support + YouTube click-to-play
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
// FORCE START AT TOP ON PAGE LOAD
// =========================
window.history.scrollRestoration = "manual";
window.scrollTo(0, 0);
window.addEventListener("beforeunload", () => window.scrollTo(0, 0));

// =========================
// SCROLLBAR + SHRINK HEADER (rAF-throttled)
// =========================
let ticking = false;
window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        if (scrollbar) {
          const h = document.body.scrollHeight - window.innerHeight;
          scrollbar.style.width = h > 0 ? (y / h) * 100 + "%" : "0";
        }
        if (header) header.classList.toggle("shrink", y > 50);
        ticking = false;
      });
      ticking = true;
    }
  },
  { passive: true }
);

// =========================
// BURGER MENU TOGGLE (Accessible + Body Lock)
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

  // Close on link click
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      burger.setAttribute("aria-expanded", "false");
      nav.classList.remove("open");
      document.body.style.overflow = "";
    }
  });

  // Close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) toggleMenu();
  });
}

// =========================
// SMOOTH SCROLL (single listener)
// =========================
document.addEventListener("click", (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const href = link.getAttribute("href");
  const target = href && href.length > 1 ? document.querySelector(href) : null;
  if (!target) return;
  e.preventDefault();
  const y = target.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top: y, behavior: "smooth" });
  history.replaceState(null, "", href);
});

// =========================
// REVEAL ON SCROLL (single IntersectionObserver)
// =========================
window.addEventListener("load", () => {
  // ensure always top on reload
  window.scrollTo(0, 0);

  const revealEls = document.querySelectorAll(".reveal-up");
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        }
      },
      { threshold: 0.1 }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  // =========================
  // YEAR AUTO UPDATE
  // =========================
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // =========================
  // CONTACT FORM HANDLER
  // =========================
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    const formStatus = document.getElementById("formStatus");
    const submitBtn = document.getElementById("submitBtn");

    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (formStatus) formStatus.textContent = "";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }

      const scriptURL =
        "https://script.google.com/macros/s/AKfycbyO0DP9Ld8FPbw29bK3osFLU_YxvRVeo1WGp9Iz2bCzpxHaaFuhBGqnDgpa-zFJ1ze6/exec";

      try {
        const response = await fetch(scriptURL, {
          method: "POST",
          body: new FormData(contactForm),
        });

        if (response.ok) {
          if (formStatus) {
            formStatus.textContent = "Message sent successfully!";
            formStatus.style.color = "#00ff9d";
          }
          contactForm.reset();
          window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to top after send
        } else {
          throw new Error("Server error");
        }
      } catch (err) {
        if (formStatus) {
          formStatus.textContent =
            err.message === "Failed to fetch"
              ? "Network error. Please try again."
              : "Failed to send message. Please try again.";
          formStatus.style.color = "#ff6b6b";
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send Message";
        }
        setTimeout(() => {
          if (formStatus) formStatus.textContent = "";
        }, 5000);
      }
    });
  }

  // =========================
  // VIDEO THUMB CLICK-TO-PLAY
  // =========================
  const thumbs = document.querySelectorAll(".video-thumb");
  if (thumbs.length) {
    thumbs.forEach((v) => {
      v.addEventListener("click", () => {
        const id = v.dataset.yt;
        const iframe = v.querySelector("iframe");
        iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
        iframe.style.display = "block";
        v.querySelector("img").style.display = "none";
        v.style.pointerEvents = "none";
      });
    });
  }
});
