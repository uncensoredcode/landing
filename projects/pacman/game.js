const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlayTitle');
const overlayText = document.getElementById('overlayText');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const levelEl = document.getElementById('level');

// --- Constants ---
const TILE = 26;
const COLS = 28;
const ROWS = 28;
canvas.width = COLS * TILE;
canvas.height = ROWS * TILE;

const PAC_SPEED = 3;
const GHOST_SPEED = 2.5;
const GHOST_SCARED_SPEED = 1.3;
const SCARE_TIME = 7000;

// --- Map: 0=empty, 1=wall, 2=dot, 3=power pellet ---
const MAP_TEMPLATE = [
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,3,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,3,1],
[1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
[1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
[1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
[1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
[1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
[0,0,0,0,0,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,0,0,0,0,0],
[0,0,0,0,0,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,0,0,0,0,0],
[0,0,0,0,0,1,2,1,1,0,1,1,1,0,0,1,1,1,0,1,1,2,1,0,0,0,0,0],
[1,1,1,1,1,1,2,1,1,0,1,0,0,0,0,0,0,1,0,1,1,2,1,1,1,1,1,1],
[0,0,0,0,0,0,2,0,0,0,1,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,0,0],
[0,0,0,0,0,0,2,0,0,0,1,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,0,0],
[0,0,0,0,0,0,2,0,0,0,1,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,0,0],
[1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
[0,0,0,0,0,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,0,0,0,0,0],
[0,0,0,0,0,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,0,0,0,0,0],
[0,0,0,0,0,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,0,0,0,0,0],
[1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
[1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
[1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
[1,3,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,3,1],
[1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
[1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
[1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
[1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
[1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

let map = [];
let totalDots = 0;
let dotsEaten = 0;

function resetMap() {
  map = MAP_TEMPLATE.map(row => [...row]);
  totalDots = 0; dotsEaten = 0;
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (map[r][c] === 2 || map[r][c] === 3) totalDots++;
}

// --- State ---
let state = 'ready'; // ready|playing|paused|won|dead|over
let score = 0, lives = 3, level = 1;
let scareTimer = null;
let scareCombo = 0;
let frame = 0;
let prevTime = 0;
let modeTimer = 0; // scatter/chase cycling
let currentMode = 'scatter';
const MODE_TIMES = [7000, 20000, 7000, 20000, 5000]; // scatter,chase,scatter,chase,then permanent chase
let modeIndex = 0;

// --- Directions (as [dx, dy]) ---
const U = [0,-1], D=[0,1], L=[-1,0], R=[1,0];
const DIRS = {U,D,L,R};
const ALL_DIRS = [U,D,L,R];
const OPP = {[U.toString()]:D,[D.toString()]:U,[L.toString()]:R,[R.toString()]:L};

function opp(d) {
  const s = d.toString();
  return OPP[s] || D;
}

// --- Pac-Man ---
let pac = {x:14*TILE, y:21*TILE, dir:L, nextDir:L};

function resetPac() {
  pac.x = 14*TILE; pac.y = 21*TILE; pac.dir = L; pac.nextDir = L;
}

// --- Ghosts ---
const GHOST_DEFS = [
  {name:'blinky', color:'#ff0000', cx:14, cy:11},
  {name:'pinky',  color:'#ffb8ff', cx:12, cy:14},
  {name:'inky',   color:'#00ffff', cx:16, cy:14},
  {name:'clyde',  color:'#ffb852', cx:14, cy:14}
];

let ghosts = [];

function initGhosts() {
  ghosts = GHOST_DEFS.map((g,i) => ({
    ...g,
    x: g.cx * TILE, y: g.cy * TILE,
    dir: U,
    mode: 'scatter', // scatter|chase|scared|eaten|home
    inHouse: i !== 0,
    releaseTime: i===0 ? 0 : (i===1 ? 3000 : i===2 ? 8000 : 12000)
  }));
}

function resetGhosts() {
  GHOST_DEFS.forEach((g,i) => {
    ghosts[i].x = g.cx * TILE;
    ghosts[i].y = g.cy * TILE;
    ghosts[i].dir = U;
    ghosts[i].mode = 'scatter';
    ghosts[i].inHouse = i !== 0;
    ghosts[i].releaseTime = i===0 ? 0 : (i===1 ? 3000 : i===2 ? 8000 : 12000);
  });
}

// --- Helpers ---
function tileAt(c,r) {
  if (r<0||r>=ROWS||c<0||c>=COLS) return 0;
  return map[r][c];
}
function isWall(c,r) { return tileAt(c,r) === 1; }

function posToTile(ex,ey) {
  return {c: Math.floor((ex+TILE/2)/TILE), r: Math.floor((ey+TILE/2)/TILE)};
}

function canGo(ex, ey, dir) {
  // Check the tile immediately ahead of entity center
  const cx = ex + TILE/2 + dir[0] * (TILE/2 + 1);
  const cy = ey + TILE/2 + dir[1] * (TILE/2 + 1);
  const tc = Math.floor(cx / TILE);
  const tr = Math.floor(cy / TILE);
  if (tc < 0 || tc >= COLS) return true; // tunnel allowed
  if (tr < 0 || tr >= ROWS) return false;
  return !isWall(tc, tr);
}

function atTileCenter(ent, tol) {
  const cx = ent.x + TILE/2;
  const cy = ent.y + TILE/2;
  const t = posToTile(ent.x, ent.y);
  const tcx = t.c * TILE + TILE/2;
  const tcy = t.r * TILE + TILE/2;
  return Math.abs(cx-tcx)<tol && Math.abs(cy-tcy)<tol;
}

function dist(a,b) { return Math.hypot(a.c-b.c, a.r-b.r); }

// --- Ghost AI ---
function ghostTarget(g) {
  const pt = posToTile(pac.x, pac.y);
  if (g.mode === 'scared') return {c:Math.random()*COLS, r:Math.random()*ROWS};
  if (g.mode === 'eaten') return {c:14, r:11};
  // Use global scatter/chase mode for non-scared ghosts
  const effMode = (g.mode === 'scatter' || g.mode === 'chase') ? currentMode : g.mode;
  if (effMode === 'scatter') {
    switch(g.name){
      case 'blinky':return{c:COLS-3,r:0};case'pinky':return{c:2,r:0};
      case'inky':return{c:COLS-1,r:ROWS-1};case'clyde':return{c:0,r:ROWS-1};
    }
  }
  switch(g.name){
    case'blinky':return pt;
    case'pinky':return{c:pt.c+pac.dir[0]*4, r:pt.r+pac.dir[1]*4};
    case'inky':{
      const ahead={c:pt.c+pac.dir[0]*2, r:pt.r+pac.dir[1]*2};
      const bt=posToTile(ghosts[0].x,ghosts[0].y);
      return{c:ahead.c+(ahead.c-bt.c), r:ahead.r+(ahead.r-bt.r)};
    }
    case'clyde':{
      const gt=posToTile(g.x,g.y);
      return dist(gt,pt)>8 ? pt : {c:0,r:ROWS-1};
    }
  }
  return pt;
}

function pickGhostDir(g) {
  const t = posToTile(g.x, g.y);
  const target = ghostTarget(g);
  let valid = ALL_DIRS.filter(d => {
    if (d.toString() === g.dir.toString()) return true; // always allow current
    if (d.toString() === opp(g.dir).toString()) return false;
    const nc = t.c+d[0], nr=t.r+d[1];
    if (nc<0||nc>=COLS) return true;
    if (nr<0||nr>=ROWS) return false;
    return !isWall(nc,nr);
  });
  if (valid.length <= 1) {
    // only current or reverse available - try reverse too
    valid = ALL_DIRS.filter(d => {
      const nc=t.c+d[0], nr=t.r+d[1];
      if (nc<0||nc>=COLS) return true;
      if (nr<0||nr>=ROWS) return false;
      return !isWall(nc,nr);
    });
  }
  if (valid.length === 0) valid = [opp(g.dir)];
  let best = valid[0];
  let bestD = Infinity;
  for (const d of valid) {
    const dd = ((t.c+d[0])-target.c)**2 + ((t.r+d[1])-target.r)**2;
    if(dd < bestD){bestD=dd;best=d;}
  }
  return best;
}

// --- Update ---
function updatePac(dt) {
  if (canGo(pac.x, pac.y, pac.nextDir))
    pac.dir = pac.nextDir;
  
  // Always attempt to move in current direction
  if (canGo(pac.x, pac.y, pac.dir)) {
    pac.x += pac.dir[0] * PAC_SPEED;
    pac.y += pac.dir[1] * PAC_SPEED;
    
    // Snap to nearest tile on perpendicular axis
    const nearestCol = Math.round(pac.x / TILE);
    const nearestRow = Math.round(pac.y / TILE);
    if (pac.dir[0] !== 0) {
      // Moving horizontal — lock Y to nearest row
      pac.y = nearestRow * TILE;
    }
    if (pac.dir[1] !== 0) {
      // Moving vertical — lock X to nearest col
      pac.x = nearestCol * TILE;
    }
  }
  // If blocked, stay put — don't stop, just keep trying current dir
  // (player must turn or back up)
  // tunnel
  if (pac.x < -TILE) pac.x = canvas.width;
  if (pac.x > canvas.width) pac.x = -TILE;
  
  // eat
  const t = posToTile(pac.x, pac.y);
  if (t.r >= 0 && t.r < ROWS && t.c >= 0 && t.c < COLS) {
    if (map[t.r][t.c] === 2) {
      map[t.r][t.c] = 0; score+=10; dotsEaten++; ui();
      if(window.sfxEatDot)sfxEatDot();
    } else if (map[t.r][t.c] === 3) {
      map[t.r][t.c] = 0; score+=50; dotsEaten++; startScare(); ui();
      if(window.sfxPowerPellet)sfxPowerPellet();
    }
  }
  if (dotsEaten >= totalDots) { state='won'; showO('LEVEL COMPLETE!','Score: '+score+'<br>SPACE for next level'); }
}

function updateGhosts(dt) {
  // Cycle scatter/chase modes
  modeTimer += dt * 1000;
  if (modeIndex < MODE_TIMES.length && modeTimer >= MODE_TIMES[modeIndex]) {
    modeTimer -= MODE_TIMES[modeIndex];
    modeIndex++;
    currentMode = (modeIndex % 2 === 0) ? 'scatter' : 'chase';
    // Reverse ghost directions on mode switch
    ghosts.forEach(g => { if (!g.inHouse && g.mode !== 'scared' && g.mode !== 'eaten') g.dir = opp(g.dir); });
  }

  for (const g of ghosts) {
    // === IN HOUSE: move up toward exit door ===
    if (g.inHouse) {
      g.releaseTime -= dt * 1000;
      const doorY = 11 * TILE + TILE/2;
      if (g.y > doorY + 2) {
        g.dir = U;
        g.y -= 2;
      } else if (g.releaseTime <= 0) {
        g.inHouse = false;
        g.mode = 'scatter';
        g.x = 14 * TILE;
        g.y = 10 * TILE;
        g.dir = L;
      }
      continue;
    }
    
    // === EATEN: speed back to ghost house ===
    if (g.mode === 'eaten') {
      const targetX = 14 * TILE, targetY = 14 * TILE;
      const spd = GHOST_SPEED * 3.5;
      const t = posToTile(g.x, g.y);
      let bestDir = g.dir;
      let bestDist = Infinity;
      for (const d of ALL_DIRS) {
        if (d.toString() === opp(g.dir).toString()) continue;
        const nc = t.c + d[0], nr = t.r + d[1];
        if (nc < 0 || nc >= COLS) { bestDir = d; break; }
        if (nr < 0 || nr >= ROWS) continue;
        if (isWall(nc, nr)) continue;
        const dist = (nc - 14)**2 + (nr - 14)**2;
        if (dist < bestDist) { bestDist = dist; bestDir = d; }
      }
      if (!canGo(g.x, g.y, bestDir)) {
        for (const d of ALL_DIRS) { if (canGo(g.x, g.y, d)) { bestDir = d; break; } }
      }
      g.dir = bestDir;
      if (canGo(g.x, g.y, g.dir)) { g.x += g.dir[0] * spd; g.y += g.dir[1] * spd; }
      if (Math.abs(g.x - targetX) < 25 && Math.abs(g.y - targetY) < 25) {
        g.mode = 'scatter';
        g.inHouse = true;
        g.releaseTime = 500;
        const def = GHOST_DEFS.find(d => d.name === g.name);
        g.x = def.cx * TILE; g.y = def.cy * TILE; g.dir = U;
      }
      if (g.x < -TILE) g.x = canvas.width;
      if (g.x > canvas.width) g.x = -TILE;
      continue;
    }
    
    const spd = g.mode === 'scared' ? GHOST_SCARED_SPEED :
                g.mode === 'eaten' ? GHOST_SPEED * 2 : GHOST_SPEED;
    
    // If we can move in current direction, do it
    if (canGo(g.x, g.y, g.dir)) {
      g.x += g.dir[0] * spd;
      g.y += g.dir[1] * spd;
      
      // Snap to nearest tile on perpendicular axis
      const nc = Math.round(g.x / TILE);
      const nr = Math.round(g.y / TILE);
      if (g.dir[0] !== 0) {
        g.y = nr * TILE;
      }
      if (g.dir[1] !== 0) {
        g.x = nc * TILE;
      }
    } else {
      // BLOCKED — always pick a new valid direction immediately
      g.dir = pickGhostDir(g);
      // Move in the new direction
      if (canGo(g.x, g.y, g.dir)) {
        g.x += g.dir[0] * spd;
        g.y += g.dir[1] * spd;
      }
      // If STILL blocked (shouldn't happen), try any direction
      else {
        for (const d of ALL_DIRS) {
          if (canGo(g.x, g.y, d)) {
            g.dir = d;
            g.x += d[0] * spd;
            g.y += d[1] * spd;
            break;
          }
        }
      }
    }
    
    // At intersections, re-evaluate direction toward target
    if (atTileCenter(g, 5)) {
      g.dir = pickGhostDir(g);
    }
    
    // Tunnel wrap
    if (g.x < -TILE) g.x = canvas.width;
    if (g.x > canvas.width) g.x = -TILE;
  }
}

function checkCollisions() {
  const pcx=pac.x+TILE/2, pcy=pac.y+TILE/2;
  for (const g of ghosts) {
    if (g.inHouse) continue;
    if (g.mode==='eaten'&&Math.abs(g.x-14*TILE)<20) continue;
    const gcx=g.x+TILE/2, gcy=g.y+TILE/2;
    if (Math.hypot(pcx-gcx,pcy-gcy) < TILE*0.7) {
      if(g.mode==='scared'){
        g.mode='eaten'; scareCombo++; score+=200*scareCombo; ui();
        if(window.sfxEatGhost)sfxEatGhost();
      } else if(g.mode!=='eaten') { 
        if(window.stopBGM)stopBGM();
        if(window.stopScaredBGM)stopScaredBGM();
        if(window.sfxDeath)sfxDeath();
        die(); return;
      }
    }
  }
}

function startScare() {
  scareCombo=0;
  ghosts.forEach(g=>{if(!g.inHouse&&g.mode!=='eaten'){g.mode='scared';g.dir=opp(g.dir);}});
  if(window.stopBGM)stopBGM();
  if(window.startScaredBGM)startScaredBGM();
  if(scareTimer)clearTimeout(scareTimer);
  scareTimer=setTimeout(()=>{
    ghosts.forEach(g=>{if(g.mode==='scared')g.mode='chase';});
    if(window.stopScaredBGM)stopScaredBGM();
    if(window.startBGM)startBGM();
    scareTimer=null;
  },SCARE_TIME);
}

function die() {
  lives--; ui();
  if(lives<=0){state='over';showO('GAME OVER','Score: '+score+'<br>SPACE to restart');if(window.sfxGameOver)sfxGameOver();}
  else{state='dead';showO('YOU DIED!','Lives: '+lives+'<br>SPACE to continue');}
}

function nextLevel(){level++;resetMap();resetPac();resetGhosts();modeTimer=0;modeIndex=0;currentMode='scatter';state='playing';hideO();ui();if(window.sfxLevelComplete)sfxLevelComplete();}
function restart(){score=0;lives=3;level=1;resetMap();resetPac();initGhosts();modeTimer=0;modeIndex=0;currentMode='scatter';state='playing';hideO();ui();if(window.startBGM)startBGM();}
function resumeAfterDeath(){resetPac();resetGhosts();state='playing';hideO();if(window.startBGM)startBGM();}

function ui(){scoreEl.textContent=score;levelEl.textContent=level;
  livesEl.textContent=Array(lives).fill('\u2764\uFE0F').join('')||'\uD83D\uDC80';
}
function showO(t,text){overlayTitle.textContent=t;overlayText.innerHTML=text;overlay.classList.remove('hidden');}
function hideO(){overlay.classList.add('hidden');}

// --- Draw ---
function drawMap(){
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){
    const cell=map[r][c], x=c*TILE, y=r*TILE;
    if(cell===1){ctx.fillStyle='#2121de';ctx.fillRect(x+1,y+1,TILE-2,TILE-2);}
    else if(cell===2){ctx.fillStyle='#ffb897';ctx.beginPath();ctx.arc(x+TILE/2,y+TILE/2,2,0,6.28);ctx.fill();}
    else if(cell===3){ctx.fillStyle='#ffb897';ctx.beginPath();ctx.arc(x+TILE/2,y+TILE/2,5+Math.sin(frame*0.08)*1.5,0,6.28);ctx.fill();}
  }}

function drawPac(){
  const cx=pac.x+TILE/2, cy=pac.y+TILE/2, rad=TILE/2-1;
  let ang=0;
  if(pac.dir===R)ang=0;else if(pac.dir===D)ang=1.57;else if(pac.dir===L)ang=3.14;else ang=-1.57;
  const mouth=0.08+0.06*Math.sin(frame*0.35);
  ctx.save();ctx.translate(cx,cy);ctx.rotate(ang);
  ctx.fillStyle='#ffff00';ctx.beginPath();ctx.arc(0,0,rad,mouth*6.28,-mouth*6.28);ctx.lineTo(0,0);ctx.fill();ctx.restore();
}

function drawGhost(g){
  const cx=g.x+TILE/2, cy=g.y+TILE/2, rad=TILE/2-1;
  let col=g.color;
  if(g.mode==='scared'){col=(frame%20<10)?'#fff':'2121de';}
  else if(g.mode==='eaten'){drawEyes(cx,cy,g.dir,true);return;}
  ctx.fillStyle=col;ctx.beginPath();
  ctx.arc(cx,cy-rad*.15,rad,3.14,0,false);ctx.lineTo(cx+rad,cy+rad);
  for(let i=0;i<3;i++){const wx=cx+rad-(i+1)*(rad*2/3);ctx.quadraticCurveTo(wx+rad/3,cy+rad-4,wx,cy+rad);}
  ctx.closePath();ctx.fill();drawEyes(cx,cy,g.dir,false);
}

function drawEyes(cx,cy,d,only){
  const ox=4, oy=-2, er=only?4:3, pr=only?2:1.5;
  let px=0,py=0;
  if(d===L)px=-1.5;if(d===R)px=1.5;if(d===U)py=-1.5;if(d===D)py=1.5;
  ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(cx-ox,cy+oy,er,0,6.28);ctx.fill();ctx.beginPath();ctx.arc(cx+ox,cy+oy,er,0,6.28);ctx.fill();
  ctx.fillStyle='#2121de';ctx.beginPath();ctx.arc(cx-ox+px,cy+oy+py,pr,0,6.28);ctx.fill();ctx.beginPath();ctx.arc(cx+ox+px,cy+oy+py,pr,0,6.28);ctx.fill();
}

// --- Loop ---
function loop(ts){
  const dt = prevTime?Math.min((ts-prevTime)/1000,0.05):0.016;
  prevTime=ts; frame++;
  ctx.fillStyle='#000';ctx.fillRect(0,0,canvas.width,canvas.height);
  drawMap();
  if(state==='playing'){updatePac(dt);updateGhosts(dt);checkCollisions();}
  ghosts.forEach(g=>{if(!g.inHouse)drawGhost(g);});
  drawPac();
  requestAnimationFrame(loop);
}

// --- Input ---
document.addEventListener('keydown',e=>{
  if(state==='ready'&&(e.code==='Space'||e.key===' ')){restart();e.preventDefault();return;}
  if((state==='over'||state==='won')&&(e.code==='Space'||e.key===' ')){state==='won'?nextLevel():restart();e.preventDefault();return;}
  if(state==='dead'&&(e.code==='Space'||e.key===' ')){resumeAfterDeath();e.preventDefault();return;}
  if(e.code==='KeyP'||e.code==='Escape'){
    if(state==='playing'){state='paused';showO('PAUSED','P or ESC to resume');}
    else if(state==='paused'){state='playing';hideO();}
    return;
  }
  if(state!=='playing')return;
  switch(e.code){
    case'ArrowUp':pac.nextDir=U;break;
    case'ArrowDown':pac.nextDir=D;break;
    case'ArrowLeft':pac.nextDir=L;break;
    case'ArrowRight':pac.nextDir=R;break;
  }
  if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) e.preventDefault();
});

let tx=0,ty=0;
canvas.addEventListener('touchstart',e=>{tx=e.touches[0].clientX;ty=e.touches[0].clientY;
  if(state==='ready'||state==='over'){restart();e.preventDefault();return;}
  if(state==='won'){nextLevel();e.preventDefault();return;}
  if(state==='dead'){resumeAfterDeath();e.preventDefault();return;}
  if(state==='paused'){state='playing';hideO();}
},{passive:false});
canvas.addEventListener('touchmove',e=>{
  if(state!=='playing')return;e.preventDefault();
  const dx=e.touches[0].clientX-tx, dy=e.touches[0].clientY-ty;
  if(Math.abs(dx)>20||Math.abs(dy)>20){
    pac.nextDir=Math.abs(dx)>Math.abs(dy)?(dx>0?R:L):(dy>0?D:U);
    tx=e.touches[0].clientX;ty=e.touches[0].clientY;
  }
},{passive:false});

overlay.addEventListener('click',()=>{
  if(state==='ready'||state==='over')restart();
  else if(state==='won')nextLevel();
  else if(state==='dead')resumeAfterDeath();
  else if(state==='paused'){state='playing';hideO();}
});

// --- Init ---
resetMap();initGhosts();ui();showO('PAC-MAN','Press SPACE or tap to start');requestAnimationFrame(loop);