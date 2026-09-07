// ---------- Sticky navbar background on scroll ----------
const navbar = document.getElementById('navbar');
const onScroll = () => {
  navbar.classList.toggle('is-scrolled', window.scrollY > 40);
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// ---------- Mobile hamburger menu ----------
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

function closeMenu() {
  hamburger.classList.remove('is-open');
  navLinks.classList.remove('is-open');
  hamburger.setAttribute('aria-expanded', 'false');
}

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  hamburger.classList.toggle('is-open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// ---------- Scroll reveal animations ----------
const revealEls = document.querySelectorAll('.reveal');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Stagger cascading children within card/stat grids for a cascading entrance.
document.querySelectorAll('.values__grid, .rules__grid, .impact__grid, .programs__tags').forEach(parent => {
  Array.from(parent.children).filter(el => el.classList.contains('reveal')).forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 90, 360)}ms`;
  });
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => observer.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
}

// ---------- Count-up stat numbers ----------
function animateCount(el) {
  const target = parseInt(el.dataset.countTo, 10);
  if (Number.isNaN(target)) return;
  const suffix = el.dataset.suffix || '';
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(tick);
}

const countEls = document.querySelectorAll('[data-count-to]');
if (!prefersReducedMotion && 'IntersectionObserver' in window && countEls.length) {
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  countEls.forEach(el => countObserver.observe(el));
}

// ---------- WhatsApp placeholder links ----------
// TODO: replace "#" below with your real WhatsApp group invite link.
const WHATSAPP_URL = 'https://chat.whatsapp.com/F7psUVP7ou67wy5PXskJBZ?mode=gi_t';
document.querySelectorAll('#whatsappLink, #whatsappIcon, .whatsapp-footer-link').forEach(el => {
  el.setAttribute('href', WHATSAPP_URL);
  if (WHATSAPP_URL === '#') {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Add your WhatsApp group invite link in js/main.js (WHATSAPP_URL) to activate this button.');
    });
  }
});

// ---------- Contact form ----------
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const message = document.getElementById('message').value.trim();

  // No backend is wired up yet — this opens a pre-filled email as a fallback.
  // Replace with a real form handler (e.g. Formspree, Netlify Forms) when ready.
  const subject = encodeURIComponent(`Message from ${name} via The Uplifted Woman site`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\n\nMessage:\n${message}`
  );

  window.location.href = `mailto:hello@theupliftedwoman.com?subject=${subject}&body=${body}`;
  formNote.textContent = "Opening your email app to send this message…";
  contactForm.reset();
});
