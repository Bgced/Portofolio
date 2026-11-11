/* ============================================================
   PORTFOLIO CEDRIC KILIAN — SCRIPT.JS
   Seasonal Night Sky Mode: salju · hujan · semi · gugur · panas
   Base: langit malam gelap + bintang (selalu tampil)
   ============================================================ */

'use strict';

// ========== SEASONAL MODES ==========
const SEASONS = [
  {
    name: 'Musim Dingin',
    emoji: '❄️',
    key: 'winter',
    accent: '#a0c8ff',
    particles: 'snow',
  },
  {
    name: 'Musim Hujan',
    emoji: '🌧️',
    key: 'rain',
    accent: '#80c8ff',
    particles: 'rain',
  },
  {
    name: 'Musim Semi',
    emoji: '🌸',
    key: 'spring',
    accent: '#ffb3d9',
    particles: 'petals',
  },
  {
    name: 'Musim Gugur',
    emoji: '🍂',
    key: 'autumn',
    accent: '#ffb347',
    particles: 'leaves',
  },
  {
    name: 'Musim Panas',
    emoji: '☀️',
    key: 'summer',
    accent: '#ffd966',
    particles: 'fireflies',
  },
];

const SEASON_DURATION = 10_000; // ms per musim
let currentSeasonIndex = 0;
let starCtx, seasonCtx;
let stars = [];
let seasonParticles = [];
let linkDist = 100;
let animFrameId = null;
let seasonTimer = null;

// ========== CANVAS SETUP ==========
function setupCanvases() {
  const starsCanvas  = document.getElementById('bgStars');
  const seasonCanvas = document.getElementById('bgSeason');

  // Stars canvas selalu di bawah
  starCtx = starsCanvas.getContext('2d');
  seasonCtx = seasonCanvas.getContext('2d');
  resizeCanvas(starsCanvas);
  resizeCanvas(seasonCanvas);
  window.addEventListener('resize', () => {
    resizeCanvas(starsCanvas);
    resizeCanvas(seasonCanvas);
    initStars();
  });
}

function resizeCanvas(c) {
  c.width  = window.innerWidth;
  c.height = window.innerHeight;
}

// ========== STARS (always present, dark night sky base) ==========
function initStars() {
  stars = [];
  const count = Math.floor((window.innerWidth * window.innerHeight) / 6000);
  for (let i = 0; i < count; i++) {
    stars.push({
      x:      Math.random() * window.innerWidth,
      y:      Math.random() * window.innerHeight,
      r:      Math.random() * 1.4 + 0.3,
      alpha:  Math.random() * 0.7 + 0.3,
      twinkle: Math.random() * 0.015 + 0.004,
      angle:  Math.random() * Math.PI * 2,
    });
  }
}

function drawStars() {
  const ctx = starCtx;
  const W = ctx.canvas.width, H = ctx.canvas.height;
  ctx.clearRect(0, 0, W, H);

  // Background hitam
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  // Stars — crisp solid dots
  stars.forEach(s => {
    s.angle += s.twinkle;
    const a = s.alpha * (0.7 + 0.3 * Math.sin(s.angle));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200,230,255,${a.toFixed(3)})`;
    ctx.fill();
  });

  // Star connections — thinner and subtle
  if (linkDist > 5) drawStarConnections();
}

function drawStarConnections() {
  if (linkDist < 5) return;
  const ctx = starCtx;
  const threshold = (linkDist / 100) * 140;

  ctx.lineWidth = 0.4;
  ctx.globalAlpha = 0.18;
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const dx = stars[i].x - stars[j].x;
      const dy = stars[i].y - stars[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < threshold) {
        const alpha = (1 - dist / threshold) * (stars[i].alpha + stars[j].alpha) / 2;
        ctx.beginPath();
        ctx.moveTo(stars[i].x, stars[i].y);
        ctx.lineTo(stars[j].x, stars[j].y);
        ctx.strokeStyle = `rgba(0,200,255,${alpha.toFixed(3)})`;
        ctx.stroke();
      }
    }
  }
  ctx.globalAlpha = 1;
}

// ========== SEASON PARTICLES ==========
function initSeasonParticles() {
  const W = window.innerWidth, H = window.innerHeight;
  seasonParticles = [];

  const season = SEASONS[currentSeasonIndex];
  const count = 80;

  for (let i = 0; i < count; i++) {
    const p = makeParticle(season.particles, W, H, true);
    seasonParticles.push(p);
  }
}

function makeParticle(type, W, H, randomY = false) {
  const base = {
    x: Math.random() * W,
    y: randomY ? Math.random() * H : -20,
    vx: 0,
    vy: 0,
    alpha: 1,
    size: 2,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: 0,
    color: '#fff',
    type,
  };

  switch (type) {
    case 'snow':
      return {
        ...base,
        vy: Math.random() * 0.8 + 0.3,
        vx: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.4 + 0.2,
        color: '#e8f0ff',
      };

    case 'rain':
      return {
        ...base,
        vy: Math.random() * 6 + 5,
        vx: Math.random() * 1.5 - 0.75,
        size: Math.random() * 0.8 + 0.4,
        alpha: Math.random() * 0.2 + 0.1,
        color: '#80b8e8',
      };

    case 'petals':
      return {
        ...base,
        vy: Math.random() * 1.2 + 0.5,
        vx: Math.sin(Math.random() * Math.PI) * 0.8,
        size: Math.random() * 5 + 3,
        alpha: Math.random() * 0.4 + 0.2,
        rotSpeed: Math.random() * 0.03 - 0.015,
        color: Math.random() > 0.5 ? '#ffb3d9' : '#ffc0cb',
      };

    case 'leaves':
      return {
        ...base,
        vy: Math.random() * 1.5 + 0.6,
        vx: Math.random() * 1.5 - 0.75,
        size: Math.random() * 6 + 3,
        alpha: Math.random() * 0.5 + 0.15,
        rotSpeed: Math.random() * 0.04 - 0.02,
        color: Math.random() > 0.5
          ? (Math.random() > 0.5 ? '#e07020' : '#cc5500')
          : (Math.random() > 0.5 ? '#c8a000' : '#b05010'),
      };

    case 'fireflies':
      return {
        ...base,
        vy: Math.random() * 0.4 - 0.05,
        vx: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2 + 1,
        alpha: 0,
        alphaDir: 1,
        phase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.5 ? '#ffdd88' : '#ffffaa',
      };

    default:
      return base;
  }
}

function updateSeasonParticles(W, H) {
  seasonParticles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.rotSpeed;

    if (p.type === 'fireflies') {
      p.phase += 0.05;
      p.alpha = 0.3 + 0.7 * Math.abs(Math.sin(p.phase));
      // slow drift
      p.vx += (Math.random() - 0.5) * 0.08;
      p.vy += (Math.random() - 0.5) * 0.06;
      p.vx *= 0.99;
      p.vy *= 0.99;
    } else if (p.type === 'petals') {
      p.vx = Math.sin(p.y * 0.01 + Math.random() * 0.3) * 1.2;
    }

    // wrap
    if (p.y > H + 30) {
      const season = SEASONS[currentSeasonIndex];
      Object.assign(p, makeParticle(season.particles, W, H));
      p.y = -20;
    }
    if (p.x < -30) p.x = W + 30;
    if (p.x > W + 30) p.x = -30;
  });
}

function drawSeasonParticles() {
  const ctx = seasonCtx;
  const W = ctx.canvas.width, H = ctx.canvas.height;
  ctx.clearRect(0, 0, W, H);

  // Use 'lighter' blending so overlapping particles add up nicely
  ctx.globalCompositeOperation = 'lighter';

  seasonParticles.forEach(p => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));

    if (p.type === 'snow') {
      // Crisp snowflake — solid circle with thin bright ring
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      // Sharp ring
      ctx.strokeStyle = 'rgba(220,240,255,0.6)';
      ctx.lineWidth = 0.7;
      ctx.stroke();

    } else if (p.type === 'rain') {
      // Crisp rain streak
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.vx * 2.5, p.y + p.vy * 2.5);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.size;
      ctx.lineCap = 'round';
      ctx.stroke();

    } else if (p.type === 'petals') {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.55, p.size, 0, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      // Crisp petal vein
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.lineTo(0, p.size);
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 0.5;
      ctx.stroke();

    } else if (p.type === 'leaves') {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

    } else if (p.type === 'fireflies') {
      // Multi-layer glow: inner bright core, outer soft halo
      // outer halo
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(100,200,255,${p.alpha * 0.08})`;
      ctx.fill();
      // mid glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(150,230,255,${p.alpha * 0.25})`;
      ctx.fill();
      // bright core
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220,255,255,${p.alpha * 0.9})`;
      ctx.fill();
    }

    ctx.restore();
  });

  ctx.globalCompositeOperation = 'source-over';
}

// ========== ANIMATION LOOP ==========
function animate() {
  const W = window.innerWidth, H = window.innerHeight;

  drawStars();

  updateSeasonParticles(W, H);
  drawSeasonParticles();

  animFrameId = requestAnimationFrame(animate);
}

// ========== SEASON CYCLE ==========
function switchToSeason(index) {
  const prev = SEASONS[currentSeasonIndex];
  const next = SEASONS[index];
  currentSeasonIndex = index;

  // Update accent CSS var
  document.documentElement.style.setProperty('--season-accent', next.accent);

  // Swap particles
  seasonParticles = [];
  initSeasonParticles();

  // Update indicator
  updateSeasonIndicator(next);

  // Gentle crossfade via opacity handled by CSS transition on canvas
}

// Indicator element
let indicatorEl = null;

function buildSeasonIndicator() {
  if (indicatorEl) return;
  indicatorEl = document.createElement('div');
  indicatorEl.className = 'season-indicator';
  indicatorEl.innerHTML = `
    <span class="season-dot"></span>
    <span class="season-emoji" id="indEmoji">❄️</span>
    <span class="season-name" id="indName">Musim Dingin</span>
  `;
  document.body.appendChild(indicatorEl);
}

function updateSeasonIndicator(season) {
  if (!indicatorEl) return;
  document.getElementById('indEmoji').textContent = season.emoji;
  document.getElementById('indName').textContent = season.name;
}

function startSeasonCycle() {
  if (seasonTimer) clearInterval(seasonTimer);
  seasonTimer = setInterval(() => {
    const next = (currentSeasonIndex + 1) % SEASONS.length;
    switchToSeason(next);
  }, SEASON_DURATION);
}

// ========== SKILL SLIDER ==========
function setupSkillSlider() {
  const slider = document.getElementById('skillsSlider');
  if (!slider) return;
  const prev = document.getElementById('skillPrev');
  const next = document.getElementById('skillNext');
  const step = 240;
  if (prev) prev.addEventListener('click', () => { slider.scrollLeft -= step; });
  if (next) next.addEventListener('click', () => { slider.scrollLeft += step; });
}

// ========== DEMO SLIDER (linkDist) ==========
function setupDemoSlider() {
  const slider = document.getElementById('linkDistSlider');
  const valueEl = document.getElementById('linkDistValue');
  if (!slider) return;
  slider.addEventListener('input', () => {
    linkDist = parseInt(slider.value, 10);
    if (valueEl) valueEl.textContent = linkDist;
  });
}

// ========== LANGUAGE TOGGLE ==========
const translations = {
  id: {
    nav_about:'Tentang', nav_skills:'Skill', nav_projects:'Project',
    nav_journey:'Daily Driver', nav_insight:'Insight', nav_contact:'Kontak',
    hero_badge:'Open to work', hero_greeting:'Halo, nama saya',
    hero_desc:'Saya membangun aplikasi web yang bersih, cepat, dan user-friendly. Saat ini sedang menempuh kuliah di <strong>Universitas Negeri Yogyakarta</strong>, Jurusan <strong>Teknik Elektro</strong>.',
    btn_projects:'Lihat Project', btn_contact:'Hubungi Saya',
    skills_title:'Skill & Teknologi', slider_hint:'← Geser / drag / scroll bebas →',
    demo_label:'Mainin background-nya:',
    demo_hint:'Geser untuk atur seberapa jauh titik-titik saling terhubung — 0 = sendiri-sendiri, 100 = nyambung semua',
    journey_title:'Daily Driver', journey_intro:'Tools & setup yang saya pakai sehari-hari untuk coding, kuliah, dan produktivitas.',
    projects_title:'Project & Karya', projects_intro:'Project yang sudah saya buat + kumpulan pengetahuan yang saya dokumentasikan.',
    insight_title:'Insight & Pengetahuan', insight_intro:'Catatan dan pengetahuan yang saya pelajari — dibagikan supaya bermanfaat.',
    contact_title:'Hubungi Saya', contact_intro:'Tertarik bekerja sama atau punya pertanyaan? Jangan ragu untuk menghubungi saya!',
    feedback_title:'Punya kritik atau saran?', feedback_desc:'Web ini terus saya kembangkan — masukan kamu sangat berarti!',
    feedback_btn:'Kirim ke cekaell3@gmail.com',
    footer_built:'Dibuat oleh Cedric Kilian', footer_credit:'Didesain & dikembangkan oleh Cedric Kilian Lasmana',
  },
  en: {
    nav_about:'About', nav_skills:'Skills', nav_projects:'Projects',
    nav_journey:'Daily Driver', nav_insight:'Insight', nav_contact:'Contact',
    hero_badge:'Open to work', hero_greeting:"Hello, my name is",
    hero_desc:"I build clean, fast, user-friendly web applications. Currently studying at <strong>Universitas Negeri Yogyakarta</strong>, majoring in <strong>Electrical Engineering</strong>.",
    btn_projects:'View Projects', btn_contact:'Contact Me',
    skills_title:'Skills & Tech', slider_hint:'← Slide / drag / scroll freely →',
    demo_label:'Play with the background:',
    demo_hint:'Slide to control how far the dots connect — 0 = isolated, 100 = fully connected',
    journey_title:'Daily Driver', journey_intro:'Tools & setup I use every day for coding, study, and productivity.',
    projects_title:'Projects & Works', projects_intro:'Projects I have made + knowledge I documented.',
    insight_title:'Insight & Knowledge', insight_intro:'Notes and knowledge I learned — shared for good.',
    contact_title:'Contact Me', contact_intro:"Interested in collaborating or have a question? Don't hesitate to reach out!",
    feedback_title:'Have feedback or suggestions?', feedback_desc:'This site is always improving — your input means a lot!',
    feedback_btn:'Send to cekaell3@gmail.com',
    footer_built:'Built by Cedric Kilian', footer_credit:'Designed & developed by Cedric Kilian Lasmana',
  },
};

let currentLang = 'id';

function setupLangToggle() {
  const btn = document.getElementById('langToggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    currentLang = currentLang === 'id' ? 'en' : 'id';
    btn.textContent = currentLang.toUpperCase();
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (translations[currentLang][key]) {
        if (el.tagName === 'INPUT') {
          el.placeholder = translations[currentLang][key];
        } else {
          el.innerHTML = translations[currentLang][key];
        }
      }
    });
  });
}

// ========== THEME TOGGLE (dark/light) ==========
let darkMode = true;
function setupThemeToggle() {
  const btn = document.getElementById('themeToggle');
  const sun  = document.getElementById('sunIcon');
  const moon = document.getElementById('moonIcon');
  if (!btn) return;
  btn.addEventListener('click', () => {
    darkMode = !darkMode;
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    // Sembunyikan canvas night-sky di light mode biar background terang keliatan
    document.body.classList.toggle('light-mode', !darkMode);
    if (sun)  sun.style.display  = darkMode ? 'none'   : 'block';
    if (moon) moon.style.display = darkMode ? 'block'  : 'none';
  });
}

// ========== NAVIGATION ==========
function setupNav() {
  const nav = document.getElementById('navLinks');
  const ham = document.getElementById('hamburger');
  if (!ham || !nav) return;
  ham.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => nav.classList.remove('open'));
  });

  // Scroll spy
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 80) cur = sec.id;
    });
    nav.querySelectorAll('a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${cur}`);
    });
  });
}

// ========== BACK TO TOP ==========
function setupBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ========== SCROLL ANIMATIONS (IntersectionObserver) ==========
function setupScrollAnimations() {
  const targets = document.querySelectorAll(
    '.about-content, .timeline, .projects-grid, .insight-grid, .contact-content'
  );
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(t => {
    t.style.opacity = '0';
    t.style.transform = 'translateY(24px)';
    t.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    obs.observe(t);
  });
}

// ========== TYPING EFFECT (hero role) ==========
const TYPING_TEXTS_ID = [
  'Software Engineer & Web Developer',
  'Mahasiswa Teknik Elektro UNY',
  'Frontend Enthusiast',
  'Problem Solver',
];
const TYPING_TEXTS_EN = [
  'Software Engineer & Web Developer',
  'Electrical Engineering Student',
  'Frontend Enthusiast',
  'Problem Solver',
];
let typingIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeLoop() {
  const el = document.getElementById('typingText');
  if (!el) return;
  const texts = currentLang === 'en' ? TYPING_TEXTS_EN : TYPING_TEXTS_ID;
  const text = texts[typingIndex % texts.length];

  if (!isDeleting) {
    charIndex++;
    el.textContent = text.slice(0, charIndex);
    if (charIndex === text.length) {
      isDeleting = true;
      setTimeout(typeLoop, 2200); // pause sebelum hapus
      return;
    }
    setTimeout(typeLoop, 65);
  } else {
    charIndex--;
    el.textContent = text.slice(0, charIndex);
    if (charIndex === 0) {
      isDeleting = false;
      typingIndex++;
      setTimeout(typeLoop, 400);
      return;
    }
    setTimeout(typeLoop, 32);
  }
}

// ========== SCROLL PROGRESS BAR ==========
function setupScrollProgress() {
  const fill = document.getElementById('scrollProgress');
  if (!fill) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
    fill.style.width = pct + '%';
  }, { passive: true });
}

// ========== CUSTOM CURSOR GLOW ==========
function setupCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;
  let gx = 0, gy = 0, tx = 0, ty = 0;
  let rafId = null;

  window.addEventListener('mousemove', (e) => {
    tx = e.clientX; ty = e.clientY;
    glow.style.opacity = '1';
    if (!rafId) followCursor();
  }, { passive: true });

  function followCursor() {
    gx += (tx - gx) * 0.12;
    gy += (ty - gy) * 0.12;
    glow.style.transform = `translate(${gx - 160}px, ${gy - 160}px)`;
    if (Math.abs(tx - gx) > 0.5 || Math.abs(ty - gy) > 0.5) {
      rafId = requestAnimationFrame(followCursor);
    } else {
      rafId = null;
    }
  }

  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
}

// ========== 3D TILT CARDS ==========
function setupTiltCards() {
  const cards = document.querySelectorAll('.project-card, .skill-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;   // 0..1
      const py = (e.clientY - rect.top) / rect.height;   // 0..1
      const rotY = (px - 0.5) * 10;   // max 5 deg
      const rotX = (0.5 - py) * 10;
      card.classList.add('tilt-active');
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.classList.remove('tilt-active');
      card.style.transform = '';
    });
  });
}

// ========== THANK YOU TOAST (once per visitor) ==========
function showThankYouToast() {
  // Hanya sekali per browser
  if (localStorage.getItem('ck_visited')) return;
  localStorage.setItem('ck_visited', '1');

  const toast = document.createElement('div');
  toast.className = 'thank-you-toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
    <div>
      <p class="toast-title">Makasih udah mampir! 🙏</p>
      <p class="toast-sub">Kalo ada yang mau ditanyain, gas aja!</p>
    </div>
    <button class="toast-close" aria-label="Tutup">&times;</button>
  `;

  document.body.appendChild(toast);
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    toast.classList.remove('toast-visible');
    setTimeout(() => toast.remove(), 500);
  });

  // Animate in
  requestAnimationFrame(() => toast.classList.add('toast-visible'));

  // Auto remove setelah 6 detik
  setTimeout(() => {
    if (document.body.contains(toast)) {
      toast.classList.remove('toast-visible');
      setTimeout(() => toast.remove(), 500);
    }
  }, 6000);
}

// ========== PRELOADER ==========
function setupPreloader() {
  const pre = document.getElementById('preloader');
  if (!pre) return;
  window.addEventListener('load', () => {
    setTimeout(() => pre.classList.add('done'), 450);
  });
  // Fallback kalau load event kelewat
  setTimeout(() => pre.classList.add('done'), 2500);
}

// ========== INIT ==========
function init() {
  setupCanvases();
  initStars();
  initSeasonParticles();
  buildSeasonIndicator();
  updateSeasonIndicator(SEASONS[0]);

  animate();
  startSeasonCycle();

  setupSkillSlider();
  setupDemoSlider();
  setupLangToggle();
  setupThemeToggle();
  setupNav();
  setupBackToTop();
  setupScrollAnimations();
  setupScrollProgress();
  setupCursorGlow();
  setupTiltCards();
  setupPreloader();
  typeLoop();
  setTimeout(showThankYouToast, 1800); // muncul setelah preloader selesai
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
