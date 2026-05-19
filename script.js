/* ===================================================
   OSASU IDAHOSA — J's LUXURY · INTERACTIVE LOGIC
   =================================================== */

// ---- Navbar scroll effect ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ---- Mobile hamburger toggle ----
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('mobile-open');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('mobile-open');
  });
});

// ---- Smooth scroll for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      window.scrollTo({
        top: target.offsetTop - offset,
        behavior: 'smooth'
      });
    }
  });
});

// ---- Scroll reveal animations ----
function initReveal() {
  const revealEls = document.querySelectorAll(
    '.about-text, .about-image, .venture-card, .gallery-item, .media-card, ' +
    '.quote-inner, .contact-left, .contact-form-wrap, .gallery-header, .media-header'
  );
  revealEls.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', initReveal);

// ---- Active nav link highlighting ----
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
});

// ---- Contact form handler ----
function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const success = document.getElementById('form-success');
  const btn = document.getElementById('btn-form-submit');

  btn.textContent = 'SENDING...';
  btn.disabled = true;

  // Simulate send
  setTimeout(() => {
    form.reset();
    success.style.display = 'block';
    btn.innerHTML = 'SEND MESSAGE <span>→</span>';
    btn.disabled = false;

    setTimeout(() => {
      success.style.display = 'none';
    }, 5000);
  }, 1200);
}
