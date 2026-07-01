// ========================================
// Ballard CrossFit — Main JS
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initScrollAnimations();
  initSignupModal();
  initCoachLightbox();
  initGalleryLightbox();
});

// ---- Navbar scroll effect ----
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ---- Mobile menu ----
function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    menu.classList.toggle('active');
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      menu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// ---- Smooth scroll for anchor links ----
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navHeight = document.getElementById('navbar').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

// ---- Scroll animations (fade in on scroll) ----
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.pillar, .program-card, .coach-card, .testimonial-card, .membership-feature').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });
}

// ---- Signup Modal ----
function initSignupModal() {
  const modal = document.getElementById('signupModal');
  const screens = modal.querySelectorAll('.modal-screen');
  const steps = modal.querySelectorAll('.modal-step');
  let currentScreen = 1;
  let selectedPath = '';
  let selectedPlan = '';
  let selectedUrl = '';

  function showScreen(n) {
    currentScreen = n;
    screens.forEach(s => s.classList.remove('active'));
    document.getElementById('screen' + n).classList.add('active');
    steps.forEach(s => {
      const step = parseInt(s.dataset.step);
      s.classList.toggle('active', step === n);
      s.classList.toggle('completed', step < n);
    });
  }

  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    showScreen(1);
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.getElementById('signupBtn').addEventListener('click', openModal);
  document.getElementById('modalClose').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // Screen 1: choose path
  modal.querySelectorAll('.modal-option').forEach(opt => {
    opt.addEventListener('click', () => {
      selectedPath = opt.dataset.path;
      const titles = { trial: 'Try a class', punchcard: 'Choose your punch card', membership: 'Choose your plan' };
      document.getElementById('screen2Title').textContent = titles[selectedPath];
      modal.querySelectorAll('.modal-plan-group').forEach(g => {
        g.style.display = g.dataset.group === selectedPath ? 'block' : 'none';
      });
      showScreen(2);
    });
  });

  // Screen 2: choose plan
  modal.querySelectorAll('.modal-plan').forEach(plan => {
    plan.addEventListener('click', () => {
      selectedPlan = plan.dataset.name;
      selectedUrl = plan.dataset.url;
      document.getElementById('confirmPlan').textContent = selectedPlan;
      document.getElementById('confirmLink').href = selectedUrl;
      showScreen(3);
    });
  });

  // Back buttons
  document.getElementById('backTo1').addEventListener('click', () => showScreen(1));
  document.getElementById('backTo2').addEventListener('click', () => showScreen(2));
}

// ---- Coach Photo Lightbox ----
function initCoachLightbox() {
  const overlay = document.createElement('div');
  overlay.className = 'coach-lightbox-overlay';
  overlay.innerHTML = '<button class="lightbox-close" aria-label="Close">&times;</button><img class="lightbox-img" src="" alt="">';
  document.body.appendChild(overlay);

  const img = overlay.querySelector('.lightbox-img');
  const close = overlay.querySelector('.lightbox-close');

  document.querySelectorAll('.coach-photo img').forEach(photo => {
    photo.style.cursor = 'pointer';
    photo.addEventListener('click', () => {
      img.src = photo.src;
      img.alt = photo.alt;
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  close.addEventListener('click', closeLightbox);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closeLightbox();
  });
}

// ---- Gym Gallery Lightbox ----
function initGalleryLightbox() {
  const overlay = document.getElementById('lightbox');
  if (!overlay) return;
  const img = document.getElementById('lightboxImg');
  const photos = Array.from(document.querySelectorAll('.gym-gallery img'));
  let current = 0;

  function show(i) {
    current = i;
    img.src = photos[i].src;
    img.alt = photos[i].alt;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  photos.forEach((photo, i) => {
    photo.addEventListener('click', () => show(i));
  });

  document.getElementById('lightboxClose').addEventListener('click', close);
  document.getElementById('lightboxPrev').addEventListener('click', () => show((current - 1 + photos.length) % photos.length));
  document.getElementById('lightboxNext').addEventListener('click', () => show((current + 1) % photos.length));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show((current - 1 + photos.length) % photos.length);
    if (e.key === 'ArrowRight') show((current + 1) % photos.length);
  });
}

// Fade-in CSS injected via JS to avoid FOUC if JS is slow
const style = document.createElement('style');
style.textContent = `
  .fade-in {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .fade-in.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);
