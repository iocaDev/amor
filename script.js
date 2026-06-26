/* =============================================
   PARTÍCULAS DE FUNDO (corações flutuando)
   ============================================= */
const emojis = ['💕', '🌸', '✨', '💗', '🌷', '💖', '🎀', '🌺'];

function criarParticula() {
  const p = document.createElement('span');
  p.className = 'particle';
  p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  p.style.left = Math.random() * 100 + 'vw';
  p.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
  const dur = 5 + Math.random() * 8;
  p.style.animationDuration = dur + 's';
  p.style.animationDelay = -Math.random() * dur + 's';
  document.getElementById('particles-container').appendChild(p);
}

for (let i = 0; i < 22; i++) criarParticula();


/* =============================================
   BOTÃO "NÃO" — ESCAPAR DO CURSOR / TOQUE
   ============================================= */
const btnNao = document.getElementById('btn-nao');
const card   = document.getElementById('main-card');

// Inicializa a posição central do botão (relativa ao card)
let naoX = 0;
let naoY = 0;
let escapesCount = 0;

// Coloca o botão com position:absolute dentro do card
// e define a posição inicial
function initNao() {
  const cardRect = card.getBoundingClientRect();
  const btnRect  = btnNao.getBoundingClientRect();

  // posição inicial relativa ao card
  naoX = btnRect.left - cardRect.left;
  naoY = btnRect.top  - cardRect.top;

  btnNao.style.left = naoX + 'px';
  btnNao.style.top  = naoY + 'px';
}

window.addEventListener('load', () => {
  // Precisa de um frame para o layout estar pronto
  requestAnimationFrame(initNao);
});

function escapar(btn) {
  escapesCount++;

  const cardRect = card.getBoundingClientRect();
  const btnW     = btn.offsetWidth;
  const btnH     = btn.offsetHeight;

  const maxX = cardRect.width  - btnW;
  const maxY = cardRect.height - btnH;

  // Tenta 10 posições e escolhe a que fica mais longe da atual
  let bestX = naoX, bestY = naoY, bestDist = 0;

  for (let i = 0; i < 10; i++) {
    const candidateX = Math.random() * maxX;
    const candidateY = Math.random() * maxY;
    const dx = candidateX - naoX;
    const dy = candidateY - naoY;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist > bestDist) {
      bestDist = dist;
      bestX = candidateX;
      bestY = candidateY;
    }
  }

  naoX = bestX;
  naoY = bestY;

  btn.style.left = naoX + 'px';
  btn.style.top  = naoY + 'px';

  // A cada 5 fugas mostra uma mensagem diferente
  const msgs = ['Não 🙈', 'Não vai dar 😅', 'Nem pensa! 🙅', 'Jammais! 🤭', 'Impossível! 🫣'];
  btn.textContent = msgs[escapesCount % msgs.length];
}


/* =============================================
   BOTÃO "SIM" — CONFETES E OVERLAY
   ============================================= */
function handleSim() {
  document.getElementById('overlay-sim').classList.add('show');
  lancarConfetes();
  lancarBexigas();
}

// ---------- CONFETES ----------
const canvas = document.getElementById('confetti-canvas');
const ctx    = canvas.getContext('2d');

canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
});

const COLORS = ['#f06292','#f48fb1','#ff80ab','#ff4081','#ffab40','#fff176','#b2ff59','#80deea','#ce93d8'];

class Confete {
  constructor() { this.reset(); }
  reset() {
    this.x     = Math.random() * canvas.width;
    this.y     = -20;
    this.w     = 8 + Math.random() * 10;
    this.h     = 4 + Math.random() * 6;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.rot   = Math.random() * Math.PI * 2;
    this.vx    = (Math.random() - 0.5) * 4;
    this.vy    = 2 + Math.random() * 4;
    this.vr    = (Math.random() - 0.5) * 0.2;
    this.alive = true;
  }
  update() {
    this.x   += this.vx;
    this.y   += this.vy;
    this.rot += this.vr;
    if (this.y > canvas.height + 20) this.alive = false;
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.w/2, -this.h/2, this.w, this.h);
    ctx.restore();
  }
}

let confetes = [];
let animFrame;
let spawnCount = 0;
const MAX_SPAWN = 300;

function lancarConfetes() {
  confetes = [];
  spawnCount = 0;
  if (animFrame) cancelAnimationFrame(animFrame);
  loopConfetes();
}

function loopConfetes() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Spawna novos confetes por 3 segundos
  if (spawnCount < MAX_SPAWN) {
    for (let i = 0; i < 5; i++) confetes.push(new Confete());
    spawnCount += 5;
  }

  confetes.forEach(c => { c.update(); c.draw(); });
  confetes = confetes.filter(c => c.alive);

  if (confetes.length > 0 || spawnCount < MAX_SPAWN) {
    animFrame = requestAnimationFrame(loopConfetes);
  }
}

// ---------- BEXIGAS / BALÕES EMOJI ----------
const BEXIGAS = ['🎈','🎊','🎉','💕','🎀','✨','🥳'];

function lancarBexigas() {
  for (let i = 0; i < 28; i++) {
    setTimeout(() => criarBexiga(), i * 90);
  }
}

function criarBexiga() {
  const el = document.createElement('div');
  el.textContent = BEXIGAS[Math.floor(Math.random() * BEXIGAS.length)];
  el.style.cssText = `
    position: fixed;
    font-size: ${1.6 + Math.random() * 2}rem;
    left: ${Math.random() * 100}vw;
    bottom: -60px;
    z-index: 300;
    pointer-events: none;
    animation: bexigaUp ${3 + Math.random() * 3}s ease-in forwards;
  `;
  document.body.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}

// Injeta keyframe dinamicamente
const style = document.createElement('style');
style.textContent = `
  @keyframes bexigaUp {
    0%   { transform: translateY(0) rotate(0deg);   opacity: 1; }
    100% { transform: translateY(-110vh) rotate(${Math.random() > .5 ? '' : '-'}30deg); opacity: 0; }
  }
`;
document.head.appendChild(style);
