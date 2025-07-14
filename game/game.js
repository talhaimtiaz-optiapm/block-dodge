// Block Dodge - game.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');

// Images
const playerImg = new Image();
playerImg.src = 'https://img.icons8.com/ios-filled/50/4caf50/square.png';
const blockImg = new Image();
blockImg.src = 'https://img.icons8.com/ios-filled/50/e53935/block.png';
const bgImg = new Image();
bgImg.src = 'https://www.transparenttextures.com/patterns/diamond-upholstery.png'; // subtle pattern

// Game constants
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 20;
const PLAYER_SPEED = 6;
const BLOCK_WIDTH = 40;
const BLOCK_HEIGHT = 20;
const BLOCK_START_SPEED = 2;
const BLOCK_SPEED_INCREMENT = 0.2;
const BLOCK_SPAWN_INTERVAL = 1000; // ms
const DIFFICULTY_INTERVAL = 5000; // ms

// Game states
const STATE = {
  START: 'start',
  RUNNING: 'running',
  GAMEOVER: 'gameover',
};

let gameState = STATE.START;
let score = 0;
let highScore = 0;
let player, blocks, blockSpeed, lastBlockTime, lastDifficultyTime, keys;

class Player {
  constructor() {
    this.width = PLAYER_WIDTH;
    this.height = PLAYER_HEIGHT;
    this.x = (canvas.width - this.width) / 2;
    this.y = canvas.height - this.height - 10;
    this.color = '#4caf50';
  }
  move(dir) {
    this.x += dir * PLAYER_SPEED;
    this.x = Math.max(0, Math.min(canvas.width - this.width, this.x));
  }
  draw() {
    if (playerImg.complete) {
      ctx.drawImage(playerImg, this.x, this.y, this.width, this.height);
    } else {
      // fallback: modern gradient
      const grad = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y + this.height);
      grad.addColorStop(0, '#00e6d0');
      grad.addColorStop(1, '#4caf50');
      ctx.fillStyle = grad;
      ctx.shadowColor = '#00e6d0';
      ctx.shadowBlur = 12;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.shadowBlur = 0;
    }
  }
}

class Block {
  constructor(x, speed) {
    this.width = BLOCK_WIDTH;
    this.height = BLOCK_HEIGHT;
    this.x = x;
    this.y = -this.height;
    this.speed = speed;
    this.color = '#e53935';
  }
  update() {
    this.y += this.speed;
  }
  draw() {
    if (blockImg.complete) {
      ctx.drawImage(blockImg, this.x, this.y, this.width, this.height);
    } else {
      // fallback: modern gradient
      const grad = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y + this.height);
      grad.addColorStop(0, '#ff6a6a');
      grad.addColorStop(1, '#e53935');
      ctx.fillStyle = grad;
      ctx.shadowColor = '#e53935';
      ctx.shadowBlur = 10;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.shadowBlur = 0;
    }
  }
  isOffScreen() {
    return this.y > canvas.height;
  }
  collidesWith(player) {
    return (
      this.x < player.x + player.width &&
      this.x + this.width > player.x &&
      this.y < player.y + player.height &&
      this.y + this.height > player.y
    );
  }
}

function resetGame() {
  player = new Player();
  blocks = [];
  blockSpeed = BLOCK_START_SPEED;
  lastBlockTime = 0;
  lastDifficultyTime = 0;
  score = 0;
  keys = { left: false, right: false };
}

function showOverlay(text) {
  overlay.innerHTML = text;
  overlay.classList.remove('hidden');
}
function hideOverlay() {
  overlay.classList.add('hidden');
}

function drawScore() {
  ctx.save();
  ctx.fillStyle = '#fff';
  ctx.font = '20px "Segoe UI", Arial';
  ctx.shadowColor = '#00e6d0';
  ctx.shadowBlur = 8;
  ctx.fillText('Score: ' + score, 16, 36);
  ctx.fillText('High: ' + highScore, 16, 62);
  ctx.shadowBlur = 0;
  ctx.restore();
}

function drawBackground() {
  if (bgImg.complete) {
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
    ctx.restore();
  } else {
    // fallback: subtle gradient
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#232526');
    grad.addColorStop(1, '#414345');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function gameLoop(timestamp) {
  if (gameState !== STATE.RUNNING) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();

  // Move player
  if (keys.left) player.move(-1);
  if (keys.right) player.move(1);
astBlockTime > BLOCK_SPAWN_INTERVAL) {
    const x = Math.random() * (canvas.width - BLOCK_WIDTH);
    blocks.push(new Block(x, blockSpeed));
    lastBlockTime = timestamp;
  }

  // Increase difficulty
  if (!lastDifficultyTime) lastDifficultyTime = timestamp;
  if (timestamp - lastDifficultyTime > DIFFICULTY_INTERVAL) {
    blockSpeed += BLOCK_SPEED_INCREMENT;
    lastDifficultyTime = timestamp;
  }

  // Update and draw blocks
  for (let i = blocks.length - 1; i >= 0; i--) {
    blocks[i].update();
    blocks[i].draw();
    if (blocks[i].collidesWith(player)) {
      gameOver();
      return;
    }
    if (blocks[i].isOffScreen()) {
      blocks.splice(i, 1);
      score++;
      if (score > highScore) highScore = score;
    }
  }

  // Draw player
  player.draw();
  drawScore();

  requestAnimFrame(gameLoop); // BUG: should be requestAnimationFrame
}

function gameOver() {
  gameState = STATE.GAMEOVER;
  showOverlay(
function startGame() {
  resetGame();
  hideOverlay();
  gameState = STATE.RUNNING;
  requestAnimationFrame(gameLoop);
}

// Input handling
window.addEventListener('keydown', (e) => {
  if (gameState === STATE.START && e.code === 'Space') {
    startGame();
  } else if (gameState === STATE.GAMEOVER && e.code === 'Space') {
    startGame();
  } else if (gameState === STATE.RUNNING) {
    if (e.code === 'ArrowLeft') keys.left = true;
    if (e.code === 'ArrowRight') keys.right = true;
  }
});
window.addEventListener('keyup', (e) => {
  if (gameState === STATE.RUNNING) {
    if (e.code === 'ArrowLeft') keys.left = false;
    if (e.code === 'ArrowRight') keys.right = false;
  }
});

// Initial screen
function showStartScreen() {
  showOverlay('<div>Block 

// Save high score on game over
window.addEventListener('beforeunload', () => {
  localStorage.setItem('blockDodgeHighScore', highScore);
});

showStartScreen(); 