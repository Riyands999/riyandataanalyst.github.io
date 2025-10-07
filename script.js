// ---------- Background animation ----------
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
    ctx.shadowBlur = 20;
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function connectLines() {
  for (let a = 0; a < particles.length; a++) {
    for (let b = a; b < particles.length; b++) {
      let dx = particles[a].x - particles[b].x;
      let dy = particles[a].y - particles[b].y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,255,255,${1 - distance / 120})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}

// ---------- Charts (decorative) ----------
function drawVerticalBarChart(x, y, w, h, progress) {
  ctx.save();
  ctx.translate(x, y);
  for (let i = 0; i < 5; i++) {
    const bh = Math.sin(progress + i) * 50 + 80;
    ctx.fillStyle = '#00ffaa';
    ctx.shadowColor = '#00ffaa';
    ctx.shadowBlur = 20;
    ctx.fillRect(i * (w / 5 + 15), h - bh, w / 5, bh);
  }
  ctx.restore();
}

function drawHorizontalBarChart(x, y, w, h, progress) {
  ctx.save();
  ctx.translate(x, y);
  for (let i = 0; i < 4; i++) {
    const bw = Math.sin(progress + i) * 80 + 150;
    ctx.fillStyle = '#0077ff';
    ctx.shadowColor = '#0077ff';
    ctx.shadowBlur = 20;
    ctx.fillRect(0, i * (h / 4 + 15), bw, h / 4);
  }
  ctx.restore();
}

function drawPieChart(x, y, r, progress) {
  ctx.save();
  ctx.translate(x, y);
  const slices = 4;
  const angleStep = (Math.PI * 2) / slices;
  for (let i = 0; i < slices; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, r, i * angleStep + progress / 2, (i + 1) * angleStep + progress / 2);
    ctx.fillStyle = ['#00ffff', '#0077ff', '#00ffaa', '#00ccff'][i];
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 25;
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.4, 0, Math.PI * 2);
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fill();
  ctx.restore();
  ctx.globalCompositeOperation = 'source-over';
}

let particlesProgress = 0;
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  connectLines();
  particlesProgress += 0.02;

  // Top-right chart
  drawHorizontalBarChart(canvas.width - 350, 100, 250, 120, particlesProgress);
  // Center pie chart
  drawPieChart(canvas.width / 2, canvas.height / 2, 80, particlesProgress);
  // Bottom-right chart
  drawVerticalBarChart(canvas.width - 350, canvas.height - 250, 250, 150, particlesProgress);

  requestAnimationFrame(animate);
}
particles = Array.from({ length: 100 }, () => new Particle());
animate();

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
window.addEventListener('scroll', onScroll);
window.addEventListener('load', onScroll);

navButtons.forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(btn.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ---------- Explore button scroll ----------
const exploreBtn = document.getElementById('exploreBtn');
if (exploreBtn) {
  exploreBtn.addEventListener('click', () => {
    const proj = document.querySelector('#projects');
    if (proj) proj.scrollIntoView({ behavior: 'smooth' });
  });
}

// ---------- Animate Projects on Scroll ----------
const projectCards = document.querySelectorAll('.project-card');
function showProjectsOnScroll() {
  const triggerPoint = window.innerHeight * 0.85;
  projectCards.forEach(card => {
    const cardTop = card.getBoundingClientRect().top;
    if (cardTop < triggerPoint) {
      card.classList.add('show');
    }
  });
}
window.addEventListener('scroll', showProjectsOnScroll);
window.addEventListener('load', showProjectsOnScroll);

// ---------- Typing Paragraphs (one-time; supports injected <span> tag) ----------
const introEl = document.getElementById('introParagraphs');

const paragraphs = [
  "Hi, I'm <span class='highlight-name'>Muhammad Riyan</span>, a Data Analyst with a passion for turning data into actionable insights.",
  "Data-Driven Solutions for Business Growth.",
  "As a Bachelor's graduate in Data Science, I specialize in data analysis, visualization, and business intelligence. With expertise in Python, SQL, Power BI, and Excel, I help organizations make informed decisions."
];

let pIndex = 0;
let cIndex = 0;
let accumulated = "";
const typingSpeed = 28;          // ms per character
const paragraphDelay = 450;     // ms between paragraphs

function typeParagraphs() {
  if (!introEl) return;
  if (pIndex < paragraphs.length) {
    const current = paragraphs[pIndex];
    if (cIndex < current.length) {
      // If we are at an opening tag, append whole tag at once (keeps HTML valid)
      if (current.charAt(cIndex) === '<') {
        const closeIdx = current.indexOf('>', cIndex);
        if (closeIdx !== -1) {
          const tagText = current.slice(cIndex, closeIdx + 1);
          accumulated += tagText;
          cIndex = closeIdx + 1;
          introEl.innerHTML = accumulated;
          setTimeout(typeParagraphs, typingSpeed);
          return;
        }
      }
      // Normal character append
      accumulated += current.charAt(cIndex);
      cIndex++;
      introEl.innerHTML = accumulated;
      setTimeout(typeParagraphs, typingSpeed);
    } else {
      // finished current paragraph -> add two newlines
      accumulated += "\n\n";
      introEl.innerHTML = accumulated;
      pIndex++;
      cIndex = 0;
      setTimeout(typeParagraphs, paragraphDelay);
    }
  } else {
    // Done typing all paragraphs: remove cursor border
    introEl.classList.add('stop-blink');
  }
}

// Start typing after load so layout and canvas are ready
window.addEventListener('load', () => {
  setTimeout(() => {
    typeParagraphs();
  }, 650);
});

// ---------- Animate About Section Elements ----------
const aboutSection = document.querySelector('#about');
const aboutPhoto = document.querySelector('.about-photo');
const aboutCards = document.querySelectorAll('.highlight-box');

function showAboutOnScroll() {
  if (!aboutSection) return;
  const rect = aboutSection.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.82) {
    // show photo
    aboutPhoto.classList.add('visible');
    // stagger cards
    aboutCards.forEach((card, i) => {
      setTimeout(() => {
        card.classList.add('visible');
      }, i * 180);
    });
  }
}
window.addEventListener('scroll', showAboutOnScroll);
window.addEventListener('load', showAboutOnScroll);

// ---------- Resume view/download fallback (appended only) ----------
(function() {
  const resumeSection = document.querySelector('#resume');
  if (!resumeSection) return;

  const viewLink = resumeSection.querySelector('.resume-link.view');
  const downloadLink = resumeSection.querySelector('.resume-link.download');

  // viewLink uses native anchor target="_blank" so no JS needed
  // Download fallback — ensure reliable download on click
  if (downloadLink) {
    downloadLink.addEventListener('click', function (e) {
      // If browser honors download attribute, allow default
      // But we provide a fallback that programmatically triggers download
      // (useful for some cross-origin cases)
      const href = downloadLink.getAttribute('href');
      if (!href) return;
      try {
        const a = document.createElement('a');
        a.href = href;
        a.setAttribute('download', 'Muhammad_Riyan_Resume.pdf');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        e.preventDefault();
      } catch (err) {
        // If fallback fails, allow default behavior
      }
    });
  }
})();

// ---------- Animate Education on Scroll ----------
const educationCards = document.querySelectorAll('.education-card');
function showEducationOnScroll() {
  const triggerPoint = window.innerHeight * 0.85;
  educationCards.forEach(card => {
    const cardTop = card.getBoundingClientRect().top;
    if (cardTop < triggerPoint) {
      card.classList.add('show');
    }
  });
}
window.addEventListener('scroll', showEducationOnScroll);
window.addEventListener('load', showEducationOnScroll);
