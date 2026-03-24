/* ============================================================
   JOYFULJOY AFRICAN HAIR BRAIDING SALON — script.js
   ============================================================ */

(function () {
  'use strict';

  /* ===== STICKY HEADER ===== */
  const header = document.getElementById('site-header');

  function handleHeaderScroll() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* ===== MOBILE NAVIGATION ===== */
  const hamburger  = document.getElementById('hamburger');
  const mobileNav  = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-cta');

  function openMenu() {
    hamburger.classList.add('active');
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    const isOpen = mobileNav.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (
      mobileNav.classList.contains('open') &&
      !mobileNav.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      closeMenu();
    }
  });

  /* ===== SMOOTH SCROLL FOR ANCHOR LINKS ===== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerHeight = header.offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 8;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    });
  });

  /* ===== INTERSECTION OBSERVER — REVEAL ON SCROLL ===== */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ===== COUNTER ANIMATION ===== */
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');

  function animateCounter(el) {
    const target   = parseFloat(el.getAttribute('data-count'));
    const decimal  = el.getAttribute('data-decimal') || '';
    const duration = 1800;
    const start    = performance.now();

    function step(timestamp) {
      const elapsed  = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = eased * target;

      if (decimal) {
        el.textContent = current.toFixed(1);
      } else {
        el.textContent = Math.floor(current);
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = decimal ? target + decimal : target;
      }
    }

    requestAnimationFrame(step);
  }

  const statsSection = document.getElementById('stats');

  const statsObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          statNumbers.forEach(animateCounter);
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  /* ===== BACK TO TOP ===== */
  const backToTop = document.getElementById('back-to-top');

  function handleBackToTop() {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleBackToTop, { passive: true });
  handleBackToTop();

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ===== ACTIVE NAV LINK ON SCROLL ===== */
  const sections    = document.querySelectorAll('main section[id]');
  const navLinks    = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    {
      threshold: 0.35,
      rootMargin: '-70px 0px 0px 0px'
    }
  );

  sections.forEach(function (section) {
    navObserver.observe(section);
  });

  /* ===== GALLERY LIGHTBOX (simple) ===== */
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(function (item) {
    item.addEventListener('click', function () {
      const img    = item.querySelector('.gallery-img');
      const label  = item.querySelector('.gallery-overlay span');
      if (!img) return;

      const overlay = document.createElement('div');
      overlay.className = 'lightbox-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', label ? label.textContent.trim() : 'Gallery image');

      overlay.innerHTML =
        '<div class="lightbox-inner">' +
          '<button class="lightbox-close" aria-label="Close">' +
            '<i class="fa-solid fa-xmark"></i>' +
          '</button>' +
          '<img src="' + img.src.replace(/w=\d+/, 'w=1400') + '" alt="' + img.alt + '" class="lightbox-img" />' +
          (label ? '<p class="lightbox-caption">' + label.textContent.trim() + '</p>' : '') +
        '</div>';

      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';

      requestAnimationFrame(function () {
        overlay.classList.add('lightbox-visible');
      });

      function closeLightbox() {
        overlay.classList.remove('lightbox-visible');
        setTimeout(function () {
          overlay.remove();
          document.body.style.overflow = '';
        }, 300);
      }

      overlay.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeLightbox();
      });
      document.addEventListener('keydown', function onKey(e) {
        if (e.key === 'Escape') { closeLightbox(); document.removeEventListener('keydown', onKey); }
      });
    });
  });

  /* Inject lightbox styles */
  const lightboxStyle = document.createElement('style');
  lightboxStyle.textContent =
    '.lightbox-overlay{' +
      'position:fixed;inset:0;z-index:9999;' +
      'background:rgba(26,16,12,0.92);' +
      'display:flex;align-items:center;justify-content:center;' +
      'padding:1rem;opacity:0;transition:opacity 0.3s ease;' +
      'backdrop-filter:blur(6px);cursor:zoom-out;' +
    '}' +
    '.lightbox-overlay.lightbox-visible{opacity:1;}' +
    '.lightbox-inner{' +
      'position:relative;max-width:90vw;max-height:90vh;cursor:default;' +
      'display:flex;flex-direction:column;align-items:center;gap:0.75rem;' +
    '}' +
    '.lightbox-img{' +
      'max-width:100%;max-height:80vh;border-radius:12px;' +
      'box-shadow:0 24px 80px rgba(0,0,0,0.5);object-fit:contain;' +
    '}' +
    '.lightbox-close{' +
      'position:absolute;top:-3rem;right:0;' +
      'background:rgba(255,255,255,0.12);color:#fff;border:none;' +
      'width:40px;height:40px;border-radius:50%;cursor:pointer;' +
      'font-size:1.1rem;display:flex;align-items:center;justify-content:center;' +
      'transition:background 0.2s;' +
    '}' +
    '.lightbox-close:hover{background:rgba(255,255,255,0.25);}' +
    '.lightbox-caption{' +
      'color:rgba(247,231,206,0.8);font-size:0.875rem;letter-spacing:0.06em;' +
      'text-transform:uppercase;font-weight:500;' +
    '}';

  document.head.appendChild(lightboxStyle);

  /* ===== ADD ACTIVE NAV LINK STYLE ===== */
  const activeStyle = document.createElement('style');
  activeStyle.textContent =
    '.nav-link.active{color:var(--accent);}' +
    '.nav-link.active::after{width:calc(100% - 1.7em);}';
  document.head.appendChild(activeStyle);

})();
