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

const SEASON_DURATION = 22_000; // ms per musim
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

  // Background gelap
  ctx.fillStyle = '#070710';
  ctx.fillRect(0, 0, W, H);

  // Stars
  stars.forEach(s => {
    s.angle += s.twinkle;
    const a = s.alpha * (0.65 + 0.35 * Math.sin(s.angle));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200,215,255,${a.toFixed(3)})`;
    ctx.fill();
  });
}

// ========== SEASON PARTICLES ==========
function initSeasonParticles() {
  const W = window.innerWidth, H = window.innerHeight;
  seasonParticles = [];

  const season = SEASONS[currentSeasonIndex];
  const count = 160;

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
        vy: Math.random() * 1.2 + 0.4,
        vx: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 3 + 1.5,
        alpha: Math.random() * 0.7 + 0.3,
        color: '#e8f0ff',
      };

    case 'rain':
      return {
        ...base,
        vy: Math.random() * 9 + 7,
        vx: Math.random() * 2 - 1,
        size: Math.random() * 1.5 + 0.8,
        alpha: Math.random() * 0.4 + 0.2,
        color: '#80b8e8',
      };

    case 'petals':
      return {
        ...base,
        vy: Math.random() * 1.8 + 0.8,
        vx: Math.sin(Math.random() * Math.PI) * 1.2,
        size: Math.random() * 7 + 4,
        alpha: Math.random() * 0.7 + 0.3,
        rotSpeed: Math.random() * 0.04 - 0.02,
        color: Math.random() > 0.5 ? '#ffb3d9' : '#ffc0cb',
      };

    case 'leaves':
      return {
        ...base,
        vy: Math.random() * 2 + 1,
        vx: Math.random() * 2 - 1,
        size: Math.random() * 8 + 5,
        alpha: Math.random() * 0.8 + 0.2,
        rotSpeed: Math.random() * 0.06 - 0.03,
        color: Math.random() > 0.5
          ? (Math.random() > 0.5 ? '#e07020' : '#cc5500')
          : (Math.random() > 0.5 ? '#c8a000' : '#b05010'),
      };

    case 'fireflies':
      return {
        ...base,
        vy: Math.random() * 0.6 - 0.1,
        vx: (Math.random() - 0.5) * 1.2,
        size: Math.random() * 3 + 1.5,
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

  seasonParticles.forEach(p => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));

    if (p.type === 'snow') {
      // snowflake dot
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      grad.addColorStop(0, p.color);
      grad.addColorStop(1, 'rgba(200,220,255,0)');
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

    } else if (p.type === 'rain') {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.vx * 2, p.y + p.vy * 2);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.size;
      ctx.lineCap = 'round';
      ctx.stroke();

    } else if (p.type === 'petals') {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

    } else if (p.type === 'leaves') {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      // vein line
      ctx.beginPath();
      ctx.moveTo(-p.size, 0);
      ctx.lineTo(p.size, 0);
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

    } else if (p.type === 'fireflies') {
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
      grad.addColorStop(0, p.color);
      grad.addColorStop(0.4, `rgba(255,230,100,${p.alpha * 0.5})`);
      grad.addColorStop(1, 'rgba(255,200,50,0)');
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    ctx.restore();
  });
}

// ========== STAR CONNECTIONS (particles link) ==========
function drawStarConnections() {
  if (linkDist < 5) return;
  const ctx = starCtx;
  const threshold = (linkDist / 100) * 160;

  ctx.lineWidth = 0.6;
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const dx = stars[i].x - stars[j].x;
      const dy = stars[i].y - stars[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < threshold) {
        const alpha = (1 - dist / threshold) * 0.22 * (stars[i].alpha + stars[j].alpha) / 2;
        ctx.beginPath();
        ctx.moveTo(stars[i].x, stars[i].y);
        ctx.lineTo(stars[j].x, stars[j].y);
        ctx.strokeStyle = `rgba(140,160,220,${alpha.toFixed(3)})`;
        ctx.stroke();
      }
    }
  }
}

// ========== ANIMATION LOOP ==========
function animate() {
  const W = window.innerWidth, H = window.innerHeight;

  drawStars();
  if (linkDist > 5) drawStarConnections();

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
    nav_journey:'Perjalanan', nav_insight:'Insight', nav_contact:'Kontak',
    hero_badge:'Open to work', hero_greeting:'Halo, nama saya',
    hero_desc:'Saya membangun aplikasi web yang bersih, cepat, dan user-friendly. Saat ini sedang menempuh kuliah di <strong>Universitas Negeri Yogyakarta</strong>, Jurusan <strong>Teknik Elektro</strong>.',
    btn_projects:'Lihat Project', btn_contact:'Hubungi Saya',
    skills_title:'Skill & Teknologi', slider_hint:'← Geser / drag / scroll bebas →',
    demo_label:'Mainin background-nya:',
    demo_hint:'Geser untuk atur seberapa jauh titik-titik saling terhubung — 0 = sendiri-sendiri, 100 = nyambung semua',
    games_title:'Game Favorit', games_intro:'Di luar coding, ini tempatku melepas penat.',
    journey_title:'Perjalanan Saya', journey_intro:'Langkah demi langkah — dari nol sampai sekarang.',
    projects_title:'Project & Karya', projects_intro:'Project yang sudah saya buat + kumpulan pengetahuan yang saya dokumentasikan.',
    insight_title:'Insight & Pengetahuan', insight_intro:'Catatan dan pengetahuan yang saya pelajari — dibagikan supaya bermanfaat.',
    contact_title:'Hubungi Saya', contact_intro:'Tertarik bekerja sama atau punya pertanyaan? Jangan ragu untuk menghubungi saya!',
    feedback_title:'Punya kritik atau saran?', feedback_desc:'Web ini terus saya kembangkan — masukan kamu sangat berarti!',
    feedback_btn:'Kirim ke cekaell3@gmail.com',
    footer_built:'Dibuat oleh Cedric Kilian', footer_credit:'Didesain & dikembangkan oleh Cedric Kilian Lasmana',
  },
  en: {
    nav_about:'About', nav_skills:'Skills', nav_projects:'Projects',
    nav_journey:'Journey', nav_insight:'Insight', nav_contact:'Contact',
    hero_badge:'Open to work', hero_greeting:"Hello, my name is",
    hero_desc:"I build clean, fast, user-friendly web applications. Currently studying at <strong>Universitas Negeri Yogyakarta</strong>, majoring in <strong>Electrical Engineering</strong>.",
    btn_projects:'View Projects', btn_contact:'Contact Me',
    skills_title:'Skills & Tech', slider_hint:'← Slide / drag / scroll freely →',
    demo_label:'Play with the background:',
    demo_hint:'Slide to control how far the dots connect — 0 = isolated, 100 = fully connected',
    games_title:'Favorite Games', games_intro:'Outside of coding, this is where I unwind.',
    journey_title:'My Journey', journey_intro:'Step by step — from zero to now.',
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
    '.about-content, .timeline, .games-grid, .projects-grid, .insight-grid, .contact-content'
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
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
