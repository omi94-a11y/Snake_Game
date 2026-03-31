import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Trophy, Volume2, VolumeX } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = 'UP';

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(150); // ms interval
  const [isMuted, setIsMuted] = useState(false);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize Audio Context on first interaction
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playEffect = (type: 'eat' | 'die') => {
    if (isMuted) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'eat') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    }
  };

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('snake-high-score');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  // Update high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snake-high-score', score.toString());
    }
  }, [score, highScore]);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, [snake]);

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = { ...prevSnake[0] };

      switch (direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Wall Wrapping
      if (head.x < 0) head.x = GRID_SIZE - 1;
      if (head.x >= GRID_SIZE) head.x = 0;
      if (head.y < 0) head.y = GRID_SIZE - 1;
      if (head.y >= GRID_SIZE) head.y = 0;

      // Check self-collision
      if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setIsGameOver(true);
        playEffect('die');
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Check food
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        playEffect('eat');
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood, isMuted]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      initAudio(); // Initialize on first key press
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    gameLoopRef.current = setInterval(moveSnake, speed);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, speed]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setIsGameOver(false);
    setScore(0);
    setIsPaused(false);
    setFood(generateFood());
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* Scoreboard */}
      <div className="flex flex-col gap-2 w-full max-w-[400px]">
        <div className="flex justify-between font-display text-sm">
          <div className="flex items-center gap-2 text-neon-blue neon-text-blue">
            <span className="opacity-50">SCORE:</span>
            <span>{score.toString().padStart(4, '0')}</span>
          </div>
          <div className="flex items-center gap-2 text-neon-purple neon-text-purple">
            <Trophy size={14} />
            <span className="opacity-50">BEST:</span>
            <span>{highScore.toString().padStart(4, '0')}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-neon-pink neon-text-pink text-[10px] font-display">
              {isPaused ? 'SYSTEM PAUSED' : 'SYSTEM ACTIVE'}
            </div>
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="text-white/40 hover:text-white transition-colors"
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>
          <div className="flex items-center gap-2 text-white/40 text-[10px] font-mono">
            <Settings size={12} />
            <span>SPEED: {Math.round(200 - speed)}</span>
          </div>
        </div>
      </div>

      <div 
        className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-black/50 border-2 border-neon-blue/30 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(0,242,255,0.1)]"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        <div className="scanline" />
        
        {/* Food */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-neon-pink rounded-full shadow-[0_0_10px_#ff00ff]"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
          }}
        />

        {/* Snake */}
        {snake.map((segment, i) => (
          <div
            key={i}
            className={`${i === 0 ? 'bg-neon-blue' : 'bg-neon-blue/60'} border border-black/20`}
            style={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
              boxShadow: i === 0 ? '0 0 10px #00f2ff' : 'none',
            }}
          />
        ))}

        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-10 p-6 text-center"
            >
              {isGameOver ? (
                <>
                  <h2 className="text-neon-pink text-4xl font-display mb-2 neon-text-pink">GAME OVER</h2>
                  <div className="mb-6 font-mono">
                    <p className="text-white/60 text-sm uppercase mb-1">Final Score</p>
                    <p className="text-3xl text-neon-blue neon-text-blue">{score}</p>
                    {score === highScore && score > 0 && (
                      <p className="text-neon-green text-[10px] mt-2 animate-bounce">NEW HIGH SCORE!</p>
                    )}
                  </div>
                  <button
                    onClick={resetGame}
                    className="px-8 py-3 border border-neon-blue text-neon-blue font-display hover:bg-neon-blue hover:text-black transition-all active:scale-95"
                  >
                    RESTART_CORE
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-neon-blue text-3xl font-display mb-6 neon-text-blue">PAUSED</h2>
                  
                  {/* Speed Control */}
                  <div className="w-full max-w-[200px] mb-8">
                    <label className="text-[10px] font-mono text-white/40 uppercase mb-4 block">Engine Speed</label>
                    <input 
                      type="range" 
                      min="50" 
                      max="180" 
                      step="10"
                      value={200 - speed}
                      onChange={(e) => setSpeed(200 - parseInt(e.target.value, 10))}
                      className="w-full accent-neon-blue bg-white/10 h-1 rounded-full appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[8px] font-mono text-white/20 mt-2">
                      <span>SLOW</span>
                      <span>FAST</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsPaused(false)}
                    className="px-8 py-3 border border-neon-green text-neon-green font-display hover:bg-neon-green hover:text-black transition-all active:scale-95"
                  >
                    RESUME_LINK
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-[10px] text-white/40 font-mono text-center leading-relaxed">
        [ ARROWS ] TO NAVIGATE<br />
        [ SPACE ] TO PAUSE & ADJUST SPEED
      </div>
    </div>
  );
}
