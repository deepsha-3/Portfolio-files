(function() {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let width, height, particles = [];
  const COUNT = 100;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2.2 + 0.6;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(192, 132, 252, ${this.opacity})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < COUNT; i++) particles.push(new Particle());
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const alpha = (1 - dist / 150) * 0.3;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(192, 132, 252, ${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(8, 10, 18, 0.08)';
    ctx.fillRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animate);
  }

  initParticles();
  animate();
  window.addEventListener('resize', () => { resize(); initParticles(); });
  const toggle = document.getElementById('themeToggle');
  const body = document.body;
  const currentTheme = localStorage.getItem('theme') || 'dark';
  if (currentTheme === 'light') body.classList.add('light');
  toggle.addEventListener('click', () => {
    body.classList.toggle('light');
    localStorage.setItem('theme', body.classList.contains('light') ? 'light' : 'dark');
  });

  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const toast = document.getElementById('toast');

  form.addEventListener('submit', async function(e) {
    e.preventDefault(); 
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> sending ...';
    submitBtn.disabled = true;
    status.innerHTML = '';

    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      });

      const result = await response.json();

      if (result.success) {
        status.innerHTML = '<i class="fas fa-check-circle" style="color:#c084fc;"></i> message sent successfully!';
        form.reset(); 

        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3500);
      } else {
        status.innerHTML = '<i class="fas fa-exclamation-circle" style="color:#f5a623;"></i> ' + (result.message || 'Something went wrong.');
      }
    } catch (error) {
      status.innerHTML = '<i class="fas fa-exclamation-circle" style="color:#f5a623;"></i> Network error. Please try again.';
    } finally {
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
    }
  });

  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });
  revealElements.forEach(el => observer.observe(el));

  window.addEventListener('load', () => {
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80) el.classList.add('active');
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === "#") return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  document.querySelectorAll('.read-more').forEach(btn => {
    btn.addEventListener('click', function() {
      const targetId = this.dataset.target;
      const extra = document.getElementById(targetId);
      if (extra) {
        extra.classList.toggle('show');
        this.innerHTML = extra.classList.contains('show') ? 'show less <i class="fas fa-arrow-up"></i>' : 'read more <i class="fas fa-arrow-right"></i>';
      }
    });
  });

  document.querySelectorAll('.view-more-activity').forEach(btn => {
    btn.addEventListener('click', function() {
      const targetId = this.dataset.target;
      const extra = document.getElementById(targetId);
      if (extra) {
        extra.classList.toggle('show');
        this.innerHTML = extra.classList.contains('show') ? 'view less <i class="fas fa-arrow-up"></i>' : 'view more <i class="fas fa-arrow-right"></i>';
      }
    });
  });

  document.querySelectorAll('.read-more-project').forEach(btn => {
    btn.addEventListener('click', function() {
      const targetId = this.dataset.target;
      const full = document.getElementById(targetId);
      if (full) {
        full.classList.toggle('show');
        this.innerHTML = full.classList.contains('show')
          ? 'show less <i class="fas fa-chevron-up"></i>'
          : 'read more <i class="fas fa-chevron-down"></i>';
      }
    });
  });

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || 'enlarged activity image';
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('show');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 300);
  }

  document.querySelectorAll('.activity-extra-images img').forEach(img => {
    img.addEventListener('click', function() {
      openLightbox(this.src, this.alt);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('show')) closeLightbox();
  });

})();