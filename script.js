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
    '.ecosystem-header, .ecosystem-intro-grid, .ecosystem-subtitle, .ecosystem-card, .ecosystem-legacy, ' +
    '.ventures-intro, .venture-card, .ventures-principles, .principle-card, .ventures-cta, ' +
    '.fashion-intro, .fashion-card, ' +
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

// ---- Venture Video Cover Hover & Autoplay Logic ----
function initVentureVideos() {
  const cards = document.querySelectorAll('.venture-card');
  
  cards.forEach(card => {
    const video = card.querySelector('.venture-video');
    if (!video) return;

    let isHovered = false;

    // Desktop hover handlers
    card.addEventListener('mouseenter', () => {
      isHovered = true;
      card.classList.add('video-playing');
      video.play().catch(err => {
        console.log("Video playback blocked: ", err);
      });
    });

    card.addEventListener('mouseleave', () => {
      isHovered = false;
      card.classList.remove('video-playing');
      video.pause();
      video.currentTime = 0; // Reset to frame 1 on mouseout
    });
  });

  // Mobile scroll observer: plays video when in the middle of the viewport
  if ('IntersectionObserver' in window) {
    const mobileObserver = new IntersectionObserver((entries) => {
      if (window.innerWidth > 1024) return; // Only trigger scroll autoplay on mobile
      
      entries.forEach(entry => {
        const card = entry.target;
        const video = card.querySelector('.venture-video');
        if (!video) return;

        if (entry.isIntersecting) {
          card.classList.add('video-playing');
          video.play().catch(err => {
            console.log("Mobile scroll autoplay blocked: ", err);
          });
        } else {
          card.classList.remove('video-playing');
          video.pause();
        }
      });
    }, {
      threshold: 0.25, // Trigger when 25% of the card is visible for fast mobile activation
      rootMargin: '-5% 0px -5% 0px'
    });

    cards.forEach(card => {
      if (card.querySelector('.venture-video')) {
        mobileObserver.observe(card);
      }
    });
  }
}

// ---- Celebrity Business Profile Modals ----
function initProfileModals() {
  const triggers = document.querySelectorAll('.profile-trigger');
  
  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const profileId = trigger.getAttribute('data-profile');
      const modal = document.getElementById(`profile-${profileId}`);
      if (modal) {
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('lightbox-open'); // reuse to lock scroll
      }
    });
  });

  const closeModals = () => {
    const openModals = document.querySelectorAll('.profile-modal.is-open');
    openModals.forEach(modal => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
    });
    // Only remove body lock if no other modals are open
    if (!document.querySelector('.profile-modal.is-open') && 
        !document.querySelector('.video-gallery-modal.is-open') && 
        !document.querySelector('.lightbox.is-open')) {
      document.body.classList.remove('lightbox-open');
    }
  };

  // Close triggers
  document.querySelectorAll('.profile-modal-close').forEach(btn => {
    btn.addEventListener('click', closeModals);
  });

  document.querySelectorAll('.profile-modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', closeModals);
  });

  // Listen to escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeModals();
    }
  });
}

// ---- Property Video Gallery Modals ----
const propertyVideos = {
  benin: {
    title: "Osaka Apartments & Tokyo Residences",
    subtitle: "Benin City · Architectural & Suite Showcases",
    videos: [
      {
        src: "video-assets/Tokyo Residences Benin 2.mp4",
        poster: "image-assets/Building 1.jpg",
        title: "Osaka Apartments Benin — Architectural Showcase",
        desc: "High-end exterior design, facade, and lounge areas created for premium travelers."
      },
      {
        src: "video-assets/Tokyo Residences benin 1.mp4",
        poster: "image-assets/Interrior 1.jpg",
        title: "Tokyo Residences Benin — Suite Overview",
        desc: "A tour of the completed premium serviced suites and luxury interiors in Benin City."
      }
    ]
  },
  abuja: {
    title: "Tokyo Residencies & Apartments",
    subtitle: "Abuja · Capital City Executive Presence",
    videos: [
      {
        src: "video-assets/Tokyo Apartments Abuja.mp4",
        poster: "image-assets/interrior 3.jpg",
        title: "Tokyo Apartments Abuja — Executive Walkthrough",
        desc: "Take an intimate walk through our executive suites in Nigeria's capital city."
      },
      {
        src: "video-assets/Tokyo apartments abuja .mp4",
        poster: "image-assets/Interrior 2.jpg",
        title: "Tokyo Apartments Abuja — Cinematic Overview",
        desc: "A stylized perspective on location, presence, and modern residences."
      }
    ]
  }
};

function initVideoGallery() {
  const modal = document.getElementById('video-gallery-modal');
  const modalTitle = document.getElementById('video-gallery-title');
  const modalSubtitle = document.getElementById('video-gallery-subtitle');
  const grid = document.getElementById('video-gallery-grid');
  const closeBtn = document.getElementById('video-gallery-close');
  const backdrop = document.getElementById('video-gallery-backdrop');

  if (!modal || !grid) return;

  function openGallery(city) {
    const data = propertyVideos[city];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalSubtitle.textContent = data.subtitle;
    
    // Clear and build grid
    grid.innerHTML = '';
    data.videos.forEach(vid => {
      const item = document.createElement('div');
      item.className = 'video-gallery-item';
      item.innerHTML = `
        <div class="video-gallery-player-wrap">
          <video class="video-gallery-player" controls playsinline preload="auto" poster="${vid.poster || ''}">
            <source src="${vid.src}" type="video/mp4">
          </video>
        </div>
        <div class="video-gallery-info">
          <h4 class="video-gallery-item-title">${vid.title}</h4>
          <p class="video-gallery-item-desc">${vid.desc}</p>
        </div>
      `;
      grid.appendChild(item);
    });

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
  }

  function closeGallery() {
    // Pause all playing videos inside modal
    modal.querySelectorAll('video').forEach(video => {
      video.pause();
    });
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    
    if (!document.querySelector('.profile-modal.is-open') && 
        !document.querySelector('.video-gallery-modal.is-open') && 
        !document.querySelector('.lightbox.is-open')) {
      document.body.classList.remove('lightbox-open');
    }
  }

  // Attach triggers to BOTH venture visuals and gallery buttons
  document.querySelectorAll('.venture-visual, .venture-gallery-btn').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      // Prevent double trigger if clicking button inside visual
      e.stopPropagation();
      e.preventDefault();
      
      // The visual itself can trigger it, or the button
      let city = trigger.getAttribute('data-gallery');
      if (!city) {
        // If clicked visual, find the button inside or check sibling/parent
        const btn = trigger.querySelector('.venture-gallery-btn') || trigger.closest('.venture-visual').querySelector('.venture-gallery-btn');
        if (btn) city = btn.getAttribute('data-gallery');
      }
      
      if (city) openGallery(city);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeGallery);
  if (backdrop) backdrop.addEventListener('click', closeGallery);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeGallery();
    }
  });
}

// ---- Splash Screen ----
function initSplashScreen() {
  const splash = document.getElementById('splash-screen');
  if (!splash) return;

  function dismissSplash() {
    if (splash.classList.contains('fade-out')) return;
    
    splash.classList.add('fade-out');
    document.body.classList.add('splash-done');
    
    // Clean up from the DOM after fade transition completes
    setTimeout(() => {
      splash.remove();
    }, 800);
  }

  // Listen for standard window load
  window.addEventListener('load', () => {
    setTimeout(dismissSplash, 1800);
  });

  // Safe fallback if load event is slow or already occurred
  setTimeout(dismissSplash, 3000);
}

// ---- Unified initialization ----
function initAll() {
  initSplashScreen();
  initReveal();
  initLightbox();
  initVentureVideos();
  initProfileModals();
  initVideoGallery();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}

