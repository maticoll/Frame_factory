// ===== HEADER SCROLL EFFECT =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const nav       = document.getElementById('nav');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  nav.classList.toggle('open');
  document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
});

nav.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    nav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (nav.classList.contains('open')) {
      hamburger.classList.remove('active');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    }
    cerrarVisor();
  }
});

// ===== HERO CAROUSEL =====
const slides = document.querySelectorAll('.hero__slide');
const dots   = document.querySelectorAll('.hero__dot');
let currentSlide = 0;
let carouselTimer;

function goToSlide(n) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (n + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function nextSlide() { goToSlide(currentSlide + 1); }

function startCarousel() {
  carouselTimer = setInterval(nextSlide, 5000);
}

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    clearInterval(carouselTimer);
    goToSlide(i);
    startCarousel();
  });
});

startCarousel();

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== FADE-IN ON SCROLL =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
  '.upa-eco__card, .stat__card, .tipo__card, .galeria__item, .partner-logo, .catalogo__card, .color__item'
).forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity 0.5s ease ${i * 0.05}s, transform 0.5s ease ${i * 0.05}s`;
  observer.observe(el);
});

document.head.insertAdjacentHTML('beforeend',
  '<style>.visible { opacity: 1 !important; transform: translateY(0) !important; }</style>'
);

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start) + (target >= 100 ? '+' : '');
    if (start >= target) clearInterval(timer);
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      if (!isNaN(target)) animateCounter(el, target);
      statsObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat__num[data-target]').forEach(el => {
  statsObserver.observe(el);
});

// ===== ACTIVE NAV ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const id   = section.getAttribute('id');
    const link = document.querySelector(`.nav__link[href="#${id}"]`);
    if (!link) return;
    if (scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
      document.querySelectorAll('.nav__link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}, { passive: true });

// ===== CONTACT FORM =====
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Enviando...';
    btn.disabled = true;
    setTimeout(() => {
      form.innerHTML = `
        <div class="form__success">
          <h4>✓ ¡Consulta enviada!</h4>
          <p>Gracias por contactarnos. Te respondemos a la brevedad.</p>
        </div>`;
    }, 1200);
  });
}

// ===== PDF VISOR =====
function abrirVisor(pdfPath, titulo) {
  const modal    = document.getElementById('pdfModal');
  const frame    = document.getElementById('pdfFrame');
  const titleEl  = document.getElementById('pdfModalTitle');
  const dlLink   = document.getElementById('pdfDownloadLink');

  frame.src           = pdfPath;
  titleEl.textContent = titulo;
  dlLink.href         = pdfPath;
  dlLink.download     = pdfPath.split('/').pop();

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function cerrarVisor() {
  const modal = document.getElementById('pdfModal');
  const frame = document.getElementById('pdfFrame');
  if (!modal.classList.contains('open')) return;
  modal.classList.remove('open');
  frame.src = '';
  document.body.style.overflow = '';
}

// Expose globally (called from onclick in HTML)
window.abrirVisor  = abrirVisor;
window.cerrarVisor = cerrarVisor;

// ===== LAZY BACKGROUND IMAGES =====
const bgObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      el.style.backgroundImage = `url('${el.dataset.bg}')`;
      bgObserver.unobserve(el);
    }
  });
}, { rootMargin: '0px 0px 300px 0px' });

document.querySelectorAll('[data-bg]').forEach(el => bgObserver.observe(el));

// ===== PRODUCT IMAGE TABS =====
document.querySelectorAll('.producto__img-tab').forEach(tab => {
  tab.addEventListener('click', function() {
    const container = this.closest('.producto__imagen');
    const target = this.dataset.target;
    
    // Update tabs
    container.querySelectorAll('.producto__img-tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    
    // Update images
    container.querySelectorAll('.producto__img-item').forEach(img => img.classList.remove('active'));
    container.querySelector(`.producto__img-item[data-img="${target}"]`).classList.add('active');
  });
});
