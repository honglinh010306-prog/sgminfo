/* ═══════════════════════════════════════════════════
   VNet Network — main.js
   Interactions · Animations · Counter · Form
═══════════════════════════════════════════════════ */

'use strict';

/* ── 1. Header scroll effect ───────────────────────── */
const header = document.getElementById('header');

const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
  updateActiveNav();
};

window.addEventListener('scroll', onScroll, { passive: true });

/* ── 2. Mobile hamburger ───────────────────────────── */
const hamburger = document.getElementById('hamburger');
const nav       = document.getElementById('nav');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  nav.classList.toggle('open');
  document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
});

// Close nav when a link is clicked
nav.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    nav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close nav when clicking outside
document.addEventListener('click', e => {
  if (nav.classList.contains('open') &&
      !nav.contains(e.target) &&
      !hamburger.contains(e.target)) {
    hamburger.classList.remove('open');
    nav.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ── 3. Active nav link on scroll ─────────────────── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav__link');

function updateActiveNav() {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav__link[href="#${id}"]`);
      if (active) active.classList.add('active');
    }
  });
}

/* ── 4. Scroll-reveal (lightweight AOS replacement) ─ */
const aosEls = document.querySelectorAll('[data-aos]');

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        revealObserver.unobserve(entry.target); // animate once
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

aosEls.forEach(el => revealObserver.observe(el));

/* ── 5. Animated counter ───────────────────────────── */
const stats = document.querySelectorAll('.stat[data-target]');

function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const suffix   = el.dataset.suffix || '';
  const numEl    = el.querySelector('.counter');
  const duration = 2000; // ms
  const start    = performance.now();

  const step = now => {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out-expo
    const ease     = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current  = Math.floor(ease * target);

    // Handle suffixes like "M+"
    if (suffix.startsWith('M')) {
      numEl.textContent = current + suffix;
    } else {
      numEl.textContent = current + suffix;
    }

    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);

stats.forEach(stat => counterObserver.observe(stat));

/* ── 6. Parallax blobs on mouse move ──────────────── */
const hero  = document.querySelector('.hero');
const blobs = document.querySelectorAll('.blob');

if (hero && window.matchMedia('(min-width: 768px)').matches) {
  hero.addEventListener('mousemove', e => {
    const { left, top, width, height } = hero.getBoundingClientRect();
    const cx = (e.clientX - left) / width  - 0.5;  // -0.5 → 0.5
    const cy = (e.clientY - top)  / height - 0.5;

    blobs.forEach((blob, i) => {
      const depth = (i + 1) * 18;
      blob.style.transform = `translate(${cx * depth}px, ${cy * depth}px)`;
    });
  });

  hero.addEventListener('mouseleave', () => {
    blobs.forEach(blob => {
      blob.style.transform = '';
    });
  });
}

/* ── 7. Smooth scroll — chỉ cho anchor nội trang (#...) ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href   = anchor.getAttribute('href');
    // Bỏ qua nếu chỉ là "#" hoặc link trang khác
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = header.offsetHeight + 16;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── 8. Join form submission ───────────────────────── */
const joinForm = document.getElementById('joinForm');
const toast    = document.getElementById('toast');
let   toastTimer;

function showToast() {
  clearTimeout(toastTimer);
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 4000);
}

if (joinForm) {
  joinForm.addEventListener('submit', e => {
    e.preventDefault();

    // Visual loading state
    const btn = joinForm.querySelector('button[type="submit"]');
    const origText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="ri-loader-4-line" style="animation:spin .7s linear infinite"></i> Đang gửi...';

    // Simulate async send (replace with real API call)
    setTimeout(() => {
      btn.disabled  = false;
      btn.innerHTML = origText;
      joinForm.reset();
      showToast();
    }, 1400);
  });
}

/* Add spin keyframe for the loader icon */
const spinStyle = document.createElement('style');
spinStyle.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(spinStyle);

/* ── 9. Creator card tilt effect ──────────────────── */
const creatorCards = document.querySelectorAll('.creator-card:not(.creator-card--placeholder)');

creatorCards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const { left, top, width, height } = card.getBoundingClientRect();
    const x  = (e.clientX - left) / width  - 0.5;
    const y  = (e.clientY - top)  / height - 0.5;
    card.style.transform = `translateY(-5px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── 10. Stats section entrance ───────────────────── */
// Stats also get the reveal animation
const statsSection = document.querySelector('.stats');
if (statsSection) {
  const statsReveal = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        statsSection.style.opacity = '1';
        statsReveal.disconnect();
      }
    },
    { threshold: 0.2 }
  );
  statsSection.style.opacity = '0';
  statsSection.style.transition = 'opacity .6s ease';
  statsReveal.observe(statsSection);
}

/* ── 11. Scroll progress bar ──────────────────────── */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 0%;
  background: linear-gradient(90deg, #E8192C, #FF8C42);
  z-index: 9999;
  transition: width .1s linear;
  pointer-events: none;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  progressBar.style.width = ((scrolled / maxScroll) * 100).toFixed(1) + '%';
}, { passive: true });

/* ── 12. Initialise on DOMContentLoaded ───────────── */
document.addEventListener('DOMContentLoaded', () => {
  onScroll(); // Set initial states
});

/* ── 13. Creator Popup ────────────────────────────── */
const popup        = document.getElementById('creatorPopup');
const popupOverlay = document.getElementById('popupOverlay');
const popupClose   = document.getElementById('popupClose');

if (popup) {
  const popupImg      = document.getElementById('popupImg');
  const popupImgPh    = document.getElementById('popupImgPh');
  const popupName     = document.getElementById('popupName');
  const popupFollowers= document.getElementById('popupFollowers');
  const popupPlatform = document.getElementById('popupPlatform');
  const popupDesc     = document.getElementById('popupDesc');
  const popupLink     = document.getElementById('popupLink');
  const popupSocials  = document.getElementById('popupSocials');

  // Mở popup khi click creator card
  document.querySelectorAll('.creator-card').forEach(card => {
    card.addEventListener('click', () => {
      const name      = card.dataset.name      || 'Creator';
      const followers = card.dataset.followers || '0';
      const platform  = card.dataset.platform  || 'TikTok';
      const desc      = card.dataset.desc      || 'Thông tin kênh sẽ được cập nhật sớm.';
      const link      = card.dataset.link      || '#';
      const img       = card.dataset.img       || '';
      const fb        = card.dataset.fb        || '';

      // Gán dữ liệu
      popupName.textContent      = name;
      popupFollowers.textContent = followers;
      popupDesc.textContent      = desc;
      popupLink.href             = link;

      // Platform icon
      const iconMap = {
        tiktok:    'ri-tiktok-fill',
        youtube:   'ri-youtube-fill',
        facebook:  'ri-facebook-fill',
        instagram: 'ri-instagram-fill',
      };
      const key  = platform.toLowerCase();
      const icon = iconMap[key] || 'ri-global-line';
      popupPlatform.innerHTML = `<i class="${icon}"></i> <span>${platform}</span>`;

      // Social buttons
      let socialsHTML = '';
      if (link && link !== '#') {
        const mainIcon = iconMap[key] || 'ri-global-line';
        socialsHTML += `<a class="popup-social-btn popup-social-btn--tiktok" href="${link}" target="_blank" rel="noopener"><i class="${mainIcon}"></i> ${platform}</a>`;
      }
      if (fb && fb !== '#') {
        socialsHTML += `<a class="popup-social-btn popup-social-btn--facebook" href="${fb}" target="_blank" rel="noopener"><i class="ri-facebook-fill"></i> Facebook</a>`;
      }
      if (popupSocials) popupSocials.innerHTML = socialsHTML;

      // Ảnh
      if (img) {
        popupImg.src = img;
        popupImg.alt = name;
        popupImg.style.display  = 'block';
        popupImgPh.classList.remove('visible');
      } else {
        popupImg.style.display  = 'none';
        popupImgPh.classList.add('visible');
      }

      // Mở
      popup.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Đóng popup
  const closePopup = () => {
    popup.classList.remove('open');
    document.body.style.overflow = '';
  };

  popupClose.addEventListener('click', closePopup);
  popupOverlay.addEventListener('click', closePopup);

  // Đóng bằng phím Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && popup.classList.contains('open')) closePopup();
  });
}
