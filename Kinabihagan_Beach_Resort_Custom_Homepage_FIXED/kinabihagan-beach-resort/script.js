(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  // Loader + hero reveal
  const loader = document.querySelector('.loader');
  if (hasGsap && !reduced && loader) {
    gsap.timeline()
      .from('.loader-name', { y: 14, opacity: 0, duration: .6, ease: 'power3.out' })
      .from('.loader-sub', { y: 8, opacity: 0, duration: .45, ease: 'power2.out' }, '-=.32')
      .to('.loader-line span', { x: '0%', duration: .85, ease: 'power2.out' }, '-=.2')
      .to('.loader-content', { y: -10, opacity: 0, duration: .35, ease: 'power2.in' }, '-=.05')
      .to(loader, { yPercent: -100, duration: .85, ease: 'power4.inOut' })
      .from('.hero h1 .line-mask > span', { yPercent: 115, duration: 1.05, stagger: .1, ease: 'power4.out' }, '-=.45')
      .from('.hero .eyebrow, .hero-lede, .hero-actions', { y: 20, opacity: 0, duration: .7, stagger: .08, ease: 'power3.out' }, '-=.6')
      .from('.hero-foot > *', { y: 10, opacity: 0, duration: .5, stagger: .08, ease: 'power3.out' }, '-=.45');
  } else if (loader) {
    loader.style.display = 'none';
  }

  // Lenis smooth scroll
  let lenis = null;
  if (!reduced && typeof Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: .9 });
    if (hasGsap) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  // Header scroll state
  const header = document.querySelector('.site-header');
  const setScrolled = () => header.classList.toggle('scrolled', window.scrollY > 70);
  window.addEventListener('scroll', setScrolled, { passive: true });
  setScrolled();

  // Mobile menu
  const menuBtn = document.querySelector('.menu-button');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const open = !mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      mobileMenu.setAttribute('aria-hidden', String(!open));
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.classList.remove('menu-open');
      menuBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    }));
  }

  // Scroll animations
  if (hasGsap && !reduced) {
    gsap.to('.hero-media', {
      scale: 1.08, yPercent: 4, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    gsap.to('.final-bg', {
      scale: 1.08, yPercent: 5, ease: 'none',
      scrollTrigger: { trigger: '.final-cta', start: 'top bottom', end: 'bottom top', scrub: true }
    });
    gsap.utils.toArray('.reveal').forEach(el => {
      gsap.from(el, {
        y: 38, opacity: 0, duration: .85, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });
    gsap.utils.toArray('.reveal-image').forEach(el => {
      gsap.from(el, {
        clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'power4.inOut',
        scrollTrigger: { trigger: el, start: 'top 82%' }
      });
    });
  }

  // Swiper for cottages
  if (typeof Swiper !== 'undefined') {
    new Swiper('.stay-swiper', {
      slidesPerView: 1.08,
      spaceBetween: 16,
      speed: 850,
      grabCursor: true,
      breakpoints: {
        700: { slidesPerView: 1.65, spaceBetween: 22 },
        1000: { slidesPerView: 2.4, spaceBetween: 24 }
      },
      on: {
        progress(sw) {
          const bar = document.querySelector('.swiper-progress span');
          if (bar) {
            const p = Math.max(.25, 1 / sw.slides.length + Math.max(0, sw.progress) * .72);
            bar.style.width = Math.min(100, p * 100) + '%';
          }
        }
      }
    });
  }

  // Experience tabs
  document.querySelectorAll('.exp-row').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.exp-row').forEach(x => x.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.exp-photo').forEach(x => x.classList.remove('active'));
      document.querySelector('.exp-' + btn.dataset.exp)?.classList.add('active');
    });
  });

  // Magnetic buttons
  if (!reduced) {
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .08}px, ${(e.clientY - r.top - r.height / 2) * .12}px)`;
      });
      btn.addEventListener('mouseleave', () => btn.style.transform = 'translate(0,0)');
    });
  }
})();