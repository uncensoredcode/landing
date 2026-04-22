// ============================================
// PAC-MAN - Classic Sound Effects (Web Audio API)
// ============================================

const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
let bgmOsc = null;
let bgmGain = null;
let bgmPlaying = false;

function getCtx() {
  if (!audioCtx) audioCtx = new AudioCtx();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

// --- Helper: play a tone ---
function playTone(freq, duration, type, volume, startTime) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type || 'square';
  osc.frequency.setValueAtTime(freq, startTime || ctx.currentTime);
  gain.gain.setValueAtTime(volume || 0.08, startTime || ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, (startTime || ctx.currentTime) + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startTime || ctx.currentTime);
  osc.stop((startTime || ctx.currentTime) + duration + 0.05);
}

// --- Wakka-Wakka (eating dot) ---
function sfxEatDot() {
  const ctx = getCtx();
  const t = ctx.currentTime;
  // Short blip that alternates pitch slightly
  const freq = (frame % 2 === 0) ? 590 : 490;
  playTone(freq, 0.06, 'square', 0.07, t);
}

// --- Power Pellet ---
function sfxPowerPellet() {
  const ctx = getCtx();
  const t = ctx.currentTime;
  // Descending 5-note fanfare
  [988, 784, 659, 523, 392].forEach((f, i) => {
    playTone(f, 0.1, 'square', 0.09, t + i * 0.06);
  });
}

// --- Eat Ghost ---
function sfxEatGhost() {
  const ctx = getCtx();
  const t = ctx.currentTime;
  // Ascending arpeggio
  [262, 330, 392, 523].forEach((f, i) => {
    playTone(f, 0.08, 'square', 0.1, t + i * 0.05);
  });
}

// --- Death ---
function sfxDeath() {
  const ctx = getCtx();
  const t = ctx.currentTime;
  // Descending sad sound
  for (let i = 0; i < 12; i++) {
    const f = 500 - (i * 40);
    playTone(Math.max(f, 80), 0.11, 'sawtooth', 0.08, t + i * 0.08);
  }
}

// --- Game Over ---
function sfxGameOver() {
  const ctx = getCtx();
  const t = ctx.currentTime;
  [392, 349, 330, 262].forEach((f, i) => {
    playTone(f, 0.3, 'triangle', 0.1, t + i * 0.25);
  });
}

// --- Level Complete ---
function sfxLevelComplete() {
  const ctx = getCtx();
  const t = ctx.currentTime;
  [523, 659, 784, 1047].forEach((f, i) => {
    playTone(f, 0.15, 'square', 0.09, t + i * 0.12);
  });
}

// --- Background Music (classic Pac-Man theme) ---
function startBGM() {
  if (bgmPlaying) return;
  bgmPlaying = true;
  
  const ctx = getCtx();
  bgmGain = ctx.createGain();
  bgmGain.gain.value = 0.04;
  bgmGain.connect(ctx.destination);
  
  // Classic Pac-Man melody notes (looping)
  const melody = [
    {f: 660, d: 0.10}, {f: 660, d: 0.14}, {f: 660, d: 0.14}, {f: 520, d: 0.18},
    {f: 400, d: 0.10}, {f: 520, d: 0.14}, {f: 400, d: 0.22}, {f: 440, d: 0.30},
    
    {f: 660, d: 0.10}, {f: 660, d: 0.14}, {f: 660, d: 0.14}, {f: 520, d: 0.18},
    {f: 400, d: 0.10}, {f: 520, d: 0.14}, {f: 600, d: 0.14}, {f: 520, d: 0.28},
    
    {f: 780, d: 0.20}, {f: 520, d: 0.16}, {f: 780, d: 0.16}, {f: 520, d: 0.16},
    {f: 880, d: 0.16}, {f: 780, d: 0.16}, {f: 660, d: 0.16}, {f: 520, d: 0.24},
    
    {f: 660, d: 0.10}, {f: 660, d: 0.14}, {f: 660, d: 0.14}, {f: 520, d: 0.18},
    {f: 400, d: 0.10}, {f: 520, d: 0.14}, {f: 600, d: 0.14}, {f: 520, d: 0.28},
  ];
  
  let noteIndex = 0;
  let noteTime = ctx.currentTime;
  
  function scheduleNote() {
    if (!bgmPlaying) return;
    
    const note = melody[noteIndex % melody.length];
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = note.f;
    g.gain.setValueAtTime(0.04, noteTime);
    g.gain.exponentialRampToValueAtTime(0.001, noteTime + note.d * 0.95);
    osc.connect(g);
    g.connect(bgmGain);
    osc.start(noteTime);
    osc.stop(noteTime + note.d + 0.02);
    
    noteTime += note.d;
    noteIndex++;
    
    // Schedule next note with lookahead
    const lookahead = 0.1;
    const delay = Math.max(1, Math.floor((noteTime - ctx.currentTime - lookahead) * 1000));
    setTimeout(scheduleNote, delay);
  }
  
  scheduleNote();
}

function stopBGM() {
  bgmPlaying = false;
  if (bgmGain) {
    try { bgmGain.disconnect(); } catch(e) {}
    bgmGain = null;
  }
}

// Scared mode BGM (lower pitch, slower)
let scaredBgmPlaying = false;
let scaredOscs = [];

function startScaredBGM() {
  stopBGM();
  scaredBgmPlaying = true;
  const ctx = getCtx();
  const gain = ctx.createGain();
  gain.gain.value = 0.03;
  gain.connect(ctx.destination);
  
  function playScaredNote() {
    if (!scaredBgmPlaying) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'square';
    // Alternating low pitches for spooky feel
    osc.frequency.value = (frame % 20 < 10) ? 220 : 200;
    g.gain.setValueAtTime(0.03, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(g);
    g.connect(gain);
    osc.start();
    osc.stop(ctx.currentTime + 0.17);
    setTimeout(playScaredNote, 160);
  }
  playScaredNote();
}

function stopScaredBGM() {
  scaredBgmPlaying = false;
}

// Export to global scope so game.js can call them
window.sfxEatDot = sfxEatDot;
window.sfxPowerPellet = sfxPowerPellet;
window.sfxEatGhost = sfxEatGhost;
window.sfxDeath = sfxDeath;
window.sfxGameOver = sfxGameOver;
window.sfxLevelComplete = sfxLevelComplete;
window.startBGM = startBGM;
window.stopBGM = stopBGM;
window.startScaredBGM = startScaredBGM;
window.stopScaredBGM = stopScaredBGM;