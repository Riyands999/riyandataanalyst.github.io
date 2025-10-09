// ---------- Background animation (optimized for mobile + glitch fix + enhancements) ----------
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
const colors = ['#00ffff', '#0077ff', '#00ccff', '#00ffaa'];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Detect mobile
let isMobile = window.innerWidth < 768;

// Particle count based on device
const totalParticles = isMobile ? 40 : 100;

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.speedX = Math.random() * 0.6 - 0.3;
    this.speedY = Math.random() * 0.6 - 0.3;
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 15;
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function connectLines() {
  const maxDistance = isMobile ? 80 : 120;
  for (let a = 0; a < particles.length; a++) {
    for (let b = a + 1; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const distance = dx * dx + dy * dy;
      if (distance < maxDistance * maxDistance) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,255,255,${1 - Math.sqrt(distance) / maxDistance})`;
        ctx.lineWidth = 0.4;
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}

// ---------- Decorative Charts (enhanced glow) ----------
function drawVerticalBarChart(x, y, w, h, progress) {
  ctx.save();
  ctx.translate(x, y);
  for (let i = 0; i < 5; i++) {
    const bh = Math.sin(progress + i) * (isMobile ? 25 : 50) + (isMobile ? 40 : 80);
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#00ffaa';
    ctx.fillStyle = '#00ffaa';
    ctx.fillRect(i * (w / 5 + (isMobile ? 7 : 15)), h - bh, w / 5, bh);
  }
  ctx.restore();
  ctx.shadowBlur = 0;
}

function drawHorizontalBarChart(x, y, w, h, progress) {
  ctx.save();
  ctx.translate(x, y);
  for (let i = 0; i < 4; i++) {
    const bw = Math.sin(progress + i) * (isMobile ? 40 : 80) + (isMobile ? 75 : 150);
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#0077ff';
    ctx.fillStyle = '#0077ff';
    ctx.fillRect(0, i * (h / 4 + (isMobile ? 7 : 15)), bw, h / 4);
  }
  ctx.restore();
  ctx.shadowBlur = 0;
}

function drawPieChart(x, y, r, progress) {
  ctx.save();
  ctx.translate(x, y);
  const slices = 4;
  const angleStep = (Math.PI * 2) / slices;
  const sliceColors = ['#00ffff', '#0077ff', '#00ffaa', '#00ccff'];
  for (let i = 0; i < slices; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(
      0,
      0,
      isMobile ? r / 2 : r,
      i * angleStep + progress / 2,
      (i + 1) * angleStep + progress / 2
    );
    ctx.shadowBlur = 25;
    ctx.shadowColor = sliceColors[i];
    ctx.fillStyle = sliceColors[i];
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(0, 0, (isMobile ? r : r) * 0.4, 0, Math.PI * 2);
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fill();
  ctx.restore();
  ctx.globalCompositeOperation = 'source-over';
  ctx.shadowBlur = 0;
}

// -------- Animation loop ----------
let particlesProgress = 0;
let lastTime = 0;
const fps = 45;

function animate(timestamp) {
  const delta = timestamp - lastTime;
  if (delta < 1000 / fps) {
    requestAnimationFrame(animate);
    return;
  }
  lastTime = timestamp;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.98)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => p.update() && p.draw());
  connectLines();

  particlesProgress += 0.02;

  if (isMobile) {
    drawHorizontalBarChart(canvas.width - 180, 60, 120, 60, particlesProgress);
    drawPieChart(canvas.width / 2, canvas.height / 2, 40, particlesProgress);
    drawVerticalBarChart(canvas.width - 180, canvas.height - 120, 120, 75, particlesProgress);
  } else {
    drawHorizontalBarChart(canvas.width - 350, 100, 250, 120, particlesProgress);
    drawPieChart(canvas.width / 2, canvas.height / 2, 80, particlesProgress);
    drawVerticalBarChart(canvas.width - 350, canvas.height - 250, 250, 150, particlesProgress);
  }

  requestAnimationFrame(animate);
}

particles = Array.from({ length: totalParticles }, () => new Particle());
requestAnimationFrame(animate);

// ---------- Scroll navigation ----------
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('main section');

function onScroll() {
  const scrollPos = window.scrollY + window.innerHeight / 2;
  sections.forEach((sec, idx) => {
    if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
      navButtons.forEach(b => b.classList.remove('active'));
      if (navButtons[idx]) navButtons[idx].classList.add('active');
      sec.classList.add('visible');
    } else {
      sec.classList.remove('visible');
    }
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('load', onScroll);

navButtons.forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(btn.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ---------- Explore button ----------
const exploreBtn = document.getElementById('exploreBtn');
if (exploreBtn) {
  exploreBtn.addEventListener('click', () => {
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
  });
}

// ---------- On-scroll animations ----------
function onScrollShow(selector, className = 'show', delay = 0) {
  const elements = document.querySelectorAll(selector);
  const trigger = window.innerHeight * 0.85;
  elements.forEach((el, i) => {
    if (el.getBoundingClientRect().top < trigger) {
      setTimeout(() => el.classList.add(className), i * delay);
    }
  });
}

window.addEventListener('scroll', () => {
  onScrollShow('.project-card');
  onScrollShow('.education-card');
}, { passive: true });

window.addEventListener('load', () => {
  onScrollShow('.project-card');
  onScrollShow('.education-card');
});

// ---------- Typing intro ----------
const introEl = document.getElementById('introParagraphs');
const paragraphs = [
  "Hi, I'm <span class='highlight-name'>Muhammad Riyan</span>, a Data Analyst with a passion for turning data into actionable insights.",
  "Data-Driven Solutions for Business Growth.",
  "As a Bachelor's graduate in Data Science, I specialize in data analysis, visualization, and business intelligence. With expertise in Python, SQL, Power BI, and Excel, I help organizations make informed decisions."
];

let pIndex = 0, cIndex = 0, accumulated = "";
const typingSpeed = 25, paragraphDelay = 400;

function typeParagraphs() {
  if (!introEl) return;
  if (pIndex < paragraphs.length) {
    const current = paragraphs[pIndex];
    if (cIndex < current.length) {
      if (current.charAt(cIndex) === '<') {
        const closeIdx = current.indexOf('>', cIndex);
        accumulated += current.slice(cIndex, closeIdx + 1);
        cIndex = closeIdx + 1;
      } else {
        accumulated += current.charAt(cIndex++);
      }
      introEl.innerHTML = accumulated;
      setTimeout(typeParagraphs, typingSpeed);
    } else {
      accumulated += "<br><br>";
      pIndex++; cIndex = 0;
      setTimeout(typeParagraphs, paragraphDelay);
    }
  }
}
window.addEventListener('load', () => setTimeout(typeParagraphs, 500));

// ---------- Dynamic Home Section Offset (fix for mobile desktop mode) ----------
function adjustHomeSection() {
  const introSection = document.querySelector('#home');
  const introParagraphs = document.getElementById('introParagraphs');
  const exploreBtn = document.getElementById('exploreBtn');
  if (!introSection || !introParagraphs || !exploreBtn) return;

  const vh = window.innerHeight;

  // Dynamic top offset: 15% from top for small screens, 25% for large screens
  const offset = window.innerWidth < 768 ? vh * 0.15 : vh * 0.25;

  introParagraphs.style.marginTop = offset + 'px';
  exploreBtn.style.marginTop = '20px';
}

window.addEventListener('resize', adjustHomeSection);
window.addEventListener('load', adjustHomeSection);

// ---------- About animation ----------
const aboutSection = document.querySelector('#about');
const aboutPhoto = document.querySelector('.about-photo');
const aboutCards = document.querySelectorAll('.highlight-box');

function showAboutOnScroll() {
  if (!aboutSection) return;
  const rect = aboutSection.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.82) {
    aboutPhoto.classList.add('visible');
    aboutCards.forEach((card, i) => {
      setTimeout(() => card.classList.add('visible'), i * 150);
    });
  }
}
window.addEventListener('scroll', showAboutOnScroll, { passive: true });
window.addEventListener('load', showAboutOnScroll);
