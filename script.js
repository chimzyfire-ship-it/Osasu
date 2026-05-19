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
    '.about-hero, .about-text, .about-facts, .about-story, .about-image, .about-narrative, .about-quote-card, .about-cta, ' +
    '.ventures-intro, .venture-card, .ventures-principles, .principle-card, .ventures-cta, ' +
    '.gallery-item, .media-card, .quote-inner, .contact-left, .contact-form-wrap, .gallery-header, .media-header'
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

// ---- Gallery / media lightbox ----
function initLightbox() {
  const triggers = Array.from(document.querySelectorAll('.lightbox-trigger'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');

  if (!triggers.length || !lightbox || !lightboxImage || !lightboxCaption || !lightboxClose || !lightboxPrev || !lightboxNext || !lightboxBackdrop) {
    return;
  }

  let activeGroup = [];
  let activeIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  function updateLightbox() {
    const item = activeGroup[activeIndex];
    if (!item) return;

    lightboxImage.src = item.dataset.lightboxSrc || '';
    lightboxImage.alt = item.dataset.lightboxAlt || '';
    lightboxCaption.textContent = item.dataset.lightboxCaption || item.dataset.lightboxAlt || '';
    lightboxPrev.disabled = activeIndex === 0;
    lightboxNext.disabled = activeIndex === activeGroup.length - 1;
  }

  function openLightbox(trigger) {
    const groupName = trigger.dataset.lightboxGroup;
    activeGroup = triggers.filter(item => item.dataset.lightboxGroup === groupName);
    activeIndex = activeGroup.indexOf(trigger);
    updateLightbox();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    lightboxImage.src = '';
  }

  function showNext() {
    if (activeIndex < activeGroup.length - 1) {
      activeIndex += 1;
      updateLightbox();
    }
  }

  function showPrev() {
    if (activeIndex > 0) {
      activeIndex -= 1;
      updateLightbox();
    }
  }

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => openLightbox(trigger));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);
  lightboxNext.addEventListener('click', showNext);
  lightboxPrev.addEventListener('click', showPrev);

  lightbox.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (event) => {
    touchEndX = event.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;
    if (Math.abs(deltaX) < 45) return;
    if (deltaX < 0) showNext();
    if (deltaX > 0) showPrev();
  }, { passive: true });

  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowRight') showNext();
    if (event.key === 'ArrowLeft') showPrev();
  });
}

document.addEventListener('DOMContentLoaded', initLightbox);

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
