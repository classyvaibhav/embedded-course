// Scroll animations and interactive effects
(function() {
  'use strict';

  // Intersection Observer for scroll-reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Stagger children if container
        const children = entry.target.querySelectorAll('.stagger-child');
        children.forEach((child, i) => {
          child.style.transitionDelay = (i * 0.1) + 's';
          child.classList.add('revealed');
        });
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.scroll-reveal, .stagger-container').forEach(el => observer.observe(el));

  // Parallax on scroll
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const hero = document.querySelector('.hero-3d');
        if (hero) {
          hero.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
        // Stats counter animation
        document.querySelectorAll('.counter[data-target]').forEach(counter => {
          const rect = counter.getBoundingClientRect();
          if (rect.top < window.innerHeight && !counter.dataset.done) {
            counter.dataset.done = '1';
            animateCounter(counter);
          }
        });
        ticking = false;
      });
      ticking = true;
    }
  });

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1500;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // Magnetic hover effect on cards
  document.querySelectorAll('.card-3d').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -8;
      const rotateY = (x - centerX) / centerX * 8;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
      // Glow effect follows cursor
      const glowX = (x / rect.width) * 100;
      const glowY = (y / rect.height) * 100;
      card.style.setProperty('--glow-x', glowX + '%');
      card.style.setProperty('--glow-y', glowY + '%');
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
    });
  });

  // Typing effect for tagline
  const typingEl = document.querySelector('.typing-text');
  if (typingEl) {
    const texts = ['Arduino', 'ESP32', 'Sensors', 'IoT', 'PCB Design', 'Real Projects'];
    let textIndex = 0, charIndex = 0, isDeleting = false;
    function typeLoop() {
      const current = texts[textIndex];
      if (isDeleting) {
        typingEl.textContent = current.substring(0, charIndex--);
        if (charIndex < 0) { isDeleting = false; textIndex = (textIndex + 1) % texts.length; }
        setTimeout(typeLoop, 40);
      } else {
        typingEl.textContent = current.substring(0, charIndex++);
        if (charIndex > current.length) { isDeleting = true; setTimeout(typeLoop, 1800); }
        else setTimeout(typeLoop, 100);
      }
    }
    typeLoop();
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Navbar transparency on scroll
  const nav = document.querySelector('.nav-glass');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // Interactive curriculum timeline
  document.querySelectorAll('.timeline-node').forEach(node => {
    node.addEventListener('click', () => {
      document.querySelectorAll('.timeline-node').forEach(n => n.classList.remove('active'));
      node.classList.add('active');
      const detail = document.getElementById('timeline-detail');
      if (detail) {
        detail.innerHTML = node.dataset.detail || '';
        detail.style.opacity = '0';
        requestAnimationFrame(() => { detail.style.opacity = '1'; });
      }
    });
  });
})();
