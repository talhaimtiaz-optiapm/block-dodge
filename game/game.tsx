import React, { useEffect, useRef } from 'react';

// Intentionally introduce a type error and a reference error

const PLAYER_WIDTH: number = 50;
const PLAYER_HEIGHT: number = 20;
const PLAYER_SPEED: number = 6;
const BLOCK_WIDTH: number = 40;
const BLOCK_HEIGHT: number = 20;
const BLOCK_START_SPEED: number = 2;
const BLOCK_SPEED_INCREMENT: number = 0.2;
const BLOCK_SPAWN_INTERVAL: number = 1000; // ms
const DIFFICULTY_INTERVAL: number = 5000; // ms

interface Player {
  width: number;
  height: number;
  x: number;
  y: number;
  color: string;
}

interface Block {
  width: number;
  height: number;
  x: number;
  y: number;
  speed: number;
  color: string;
}

const BlockDodgeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const playerRef = useRef<Player>({
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    x: 175,
    y: 570,
    color: '#4caf50',
  });
  const blocksRef = useRef<Block[]>([]);
  const blockSpeedRef = useRef<number>(BLOCK_START_SPEED);
  const scoreRef = useRef<number>(0);
  const keysRef = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });

  // Intentionally introduce a type error
  // @ts-expect-error
  let bugType: number = 'this is a string';

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let lastBlockTime = 0;
    let lastDifficultyTime = 0;

    function drawPlayer(player: Player) {
      ctx.fillStyle = player.color;
      ctx.fillRect(player.x, player.y, player.width, player.height);
    }
    function drawBlock(block: Block) {
      ctx.fillStyle = block.color;
      ctx.fillRect(block.x, block.y, block.width, block.height);
    }
    function drawScore(score: number) {
      ctx.fillStyle = '#fff';
      ctx.font = '20px Arial';
      ctx.fillText('Score: ' + score, 10, 30);
    }

    function gameLoop(timestamp: number) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Move player
      if (keysRef.current.left) playerRef.current.x -= PLAYER_SPEED;
      if (keysRef.current.right) playerRef.current.x += PLAYER_SPEED;
      playerRef.current.x = Math.max(0, Math.min(canvas.width - playerRef.current.width, playerRef.current.x));

      // Spawn blocks
      if (!lastBlockTime) lastBlockTime = timestamp;
      if (timestamp - lastBlockTime > BLOCK_SPAWN_INTERVAL) {
        const x = Math.random() * (canvas.width - BLOCK_WIDTH);
        blocksRef.current.push({
          width: BLOCK_WIDTH,
          height: BLOCK_HEIGHT,
          x,
          y: -BLOCK_HEIGHT,
          speed: blockSpeedRef.current,
          color: '#e53935',
        });
        lastBlockTime = timestamp;
      }
      // Increase difficulty
      if (!lastDifficultyTime) lastDifficultyTime = timestamp;
      if (timestamp - lastDifficultyTime > DIFFICULTY_INTERVAL) {
        blockSpeedRef.current += BLOCK_SPEED_INCREMENT;
        lastDifficultyTime = timestamp;
      }
      // Update and draw blocks
      for (let i = blocksRef.current.length - 1; i >= 0; i--) {
        const block = blocksRef.current[i];
        block.y += block.speed;
        drawBlock(block);
        // Collision
        if (
          block.x < playerRef.current.x + playerRef.current.width &&
          block.x + block.width > playerRef.current.x &&
          block.y < playerRef.current.y + playerRef.current.height &&
          block.y + block.height > playerRef.current.y
        ) {
          // Intentionally call a function that does not exist
          nonExistentFunction();
        }
        if (block.y > canvas.height) {
          blocksRef.current.splice(i, 1);
          scoreRef.current++;
        }
      }
      drawPlayer(playerRef.current);
      drawScore(scoreRef.current);
      requestRef.current = requestAnimationFrame(gameLoop);
    }
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.code === 'ArrowLeft') keysRef.current.left = true;
      if (e.code === 'ArrowRight') keysRef.current.right = true;
    }
    function handleKeyUp(e: KeyboardEvent) {
      if (e.code === 'ArrowLeft') keysRef.current.left = false;
      if (e.code === 'ArrowRight') keysRef.current.right = false;
    }
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return <canvas ref={canvasRef} width={400} height={600} style={{ background: '#222', borderRadius: 12, border: '1.5px solid #fff' }} />;
};

export default BlockDodgeGame; 