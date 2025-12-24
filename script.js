const canvas = document.getElementById('gl-canvas');
const ctx = canvas.getContext('2d');
const cursorOuter = document.getElementById('cursor-outer');
const cursorInner = document.getElementById('cursor-inner');
const pulsar = document.getElementById('pulsar');
const themeToggle = document.getElementById('theme-toggle');

let w, h;
let mPos = { x: 0, y: 0 };
let particles = [];
let isDark = true;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

// Theme toggle
themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  document.body.classList.toggle('light-mode');
  themeToggle.textContent = isDark ? '☀' : '🌙';
  
  // Reinitialize particles for new theme
  particles = [];
  for (let i = 0; i < 150; i++) particles.push(new Particle());
});

window.addEventListener('mousemove', e => {
  mPos.x = e.clientX;
  mPos.y = e.clientY;
  document.body.style.setProperty('--mouse-x', `${(e.clientX/w)*100}%`);
  document.body.style.setProperty('--mouse-y', `${(e.clientY/h)*100}%`);
});

let clickActive = false;
window.addEventListener('mousedown', () => {
  clickActive = true;
  cursorOuter.classList.add('active');
  cursorInner.classList.add('active');
});
window.addEventListener('mouseup', () => {
  clickActive = false;
  cursorOuter.classList.remove('active');
  cursorInner.classList.remove('active');
});

class Particle {
  constructor() {
    this.init();
  }
  init() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.life = Math.random() * 0.7 + 0.3;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    
    if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) {
      this.init();
    }
  }
  draw() {
    const alpha = isDark ? this.life * 0.6 : this.life * 0.4;
    const color = isDark ? 255 : 0;
    ctx.fillStyle = `rgba(${color}, ${color}, ${color}, ${alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.shadowBlur = 15;
    ctx.shadowColor = isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)';
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

for (let i = 0; i < 150; i++) particles.push(new Particle());

function draw() {
  const bgAlpha = isDark ? 0.15 : 0.2;
  const bgColor = isDark ? '0, 0, 0' : '248, 248, 248';
  ctx.fillStyle = `rgba(${bgColor}, ${bgAlpha})`;
  ctx.fillRect(0, 0, w, h);

  // Draw static grid
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)';
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 0.8;
  const step = 70;
  
  for (let i = 0; i < w; i += step) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, h);
    ctx.stroke();
  }

  for (let j = 0; j < h; j += step) {
    ctx.beginPath();
    ctx.moveTo(0, j);
    ctx.lineTo(w, j);
    ctx.stroke();
  }

  // Update and draw particles
  particles.forEach(p => {
    p.update();
    p.draw();
  });

  // Update cursor positions
  cursorOuter.style.left = `${mPos.x}px`;
  cursorOuter.style.top = `${mPos.y}px`;
  cursorInner.style.left = `${mPos.x}px`;
  cursorInner.style.top = `${mPos.y}px`;

  requestAnimationFrame(draw);
}

// Intersection Observer for sections
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(s => observer.observe(s));

function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// Mouse tracking for feature items
document.querySelectorAll('.feature-item').forEach(item => {
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    item.style.setProperty('--mouse-x', `${x}%`);
    item.style.setProperty('--mouse-y', `${y}%`);
  });
});

draw();
