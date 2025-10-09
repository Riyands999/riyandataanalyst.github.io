// ---------- Background animation (optimized for mobile + glitch fix) ----------
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

// Reduce particle count on mobile devices
const isMobile = window.innerWidth < 768;
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

// ---------- Decorative Charts ----------
function drawVerticalBarChart(x, y, w, h, progress, mobile = false) {
  const scale = mobile ? 0.2 : 1; // much smaller on mobile
  ctx.save();
  ctx.translate(x, y);
  for (let i = 0; i < 5; i++) {
    const bh = (Math.sin(progress + i) * 50 + 80) * scale;
    ctx.fillStyle = '#00ffaa';
    ctx.fillRect(i * ((w * scale) / 5 + 10), h - bh, (w * scale) / 5, bh);
  }
  ctx.restore();
}

function drawHorizontalBarChart(x, y, w, h, progress, mobile = false) {
  const scale = mobile ? 0.2 : 1; // much smaller on mobile
  ctx.save();
  ctx.translate(x, y);
  for (let i = 0; i < 4; i++) {
    const bw = (Math.sin(progress + i) * 80 + 150) * scale;
    ctx.fillStyle = '#0077ff';
    ctx.fillRect(0, i * ((h / 4 + 10) * scale), bw, (h / 4) * scale);
  }
  ctx.restore();
}

function drawPieChart(x, y, r, progress, mobile = false) {
  const scale = mobile ? 0.2 : 1; // much smaller on mobile
  ctx.save();
  ctx.translate(x, y);
  const slices = 4;
  const angleStep = (Math.PI * 2) / slices;
  for (let i = 0; i < slices; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, r * scale, i * angleStep + progress / 2, (i + 1) * angleStep + progress / 2);
    ctx.fillStyle = ['#00ffff', '#0077ff', '#00ffaa', '#00ccff'][i];
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.4 * scale, 0, Math.PI * 2);
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fill();
  ctx.restore();
  ctx.globalCompositeOperation = 'source-over';
}

// -------- Animation loop (with FPS control) ----------
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

  particles.forEach(p => { p.update(); p.draw(); });
  connectLines();

  particlesProgress += 0.02;

  if (isMobile) {
    // Subtle small charts for mobile
    drawHorizontalBarChart(canvas.width - 100, 40, 100, 50, particlesProgress, true);
    drawPieChart(canvas.width / 2, canvas.height / 2, 30, particlesProgress, true);
    drawVerticalBarChart(canvas.width - 100, canvas.height - 80, 100, 50, particlesProgress, true);
  } else {
    // Original desktop charts
    drawHorizontalBarChart(canvas.width - 350, 100, 250, 120, particlesProgress);
    drawPieChart(canvas.width / 2, canvas.height / 2, 80, particlesProgress);
    drawVerticalBarChart(canvas.width - 350, canvas.height - 250, 250, 150, particlesProgress);
  }

  requestAnimationFrame(animate);
}

particles = Array.from({ length: totalParticles }, () => new Particle());
requestAnimationFrame(animate);
