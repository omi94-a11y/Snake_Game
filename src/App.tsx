import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-blue/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-pink/10 rounded-full blur-[120px] pointer-events-none" />

      <header className="text-center z-10">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl md:text-6xl font-display font-bold tracking-tighter mb-2"
        >
          <span className="text-neon-blue neon-text-blue">NEON</span>
          <span className="text-white">_</span>
          <span className="text-neon-pink neon-text-pink">BEATS</span>
        </motion.h1>
        <p className="text-xs font-mono text-white/40 uppercase tracking-[0.5em]">
          Retro Gaming x Cyberpunk Audio
        </p>
      </header>

      <main className="flex flex-col lg:flex-row items-center justify-center gap-12 w-full max-w-6xl z-10">
        {/* Left/Top: Music Player */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full lg:w-auto"
        >
          <div className="mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse" />
            <span className="text-[10px] font-mono text-neon-purple uppercase tracking-widest">Audio System Online</span>
          </div>
          <MusicPlayer />
        </motion.div>

        {/* Center: Snake Game */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative"
        >
          <div className="absolute -top-6 left-0 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
            <span className="text-[10px] font-mono text-neon-blue uppercase tracking-widest">Neural Link Established</span>
          </div>
          <SnakeGame />
        </motion.div>

        {/* Right/Bottom: Stats/Info (Optional but adds to aesthetic) */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="hidden xl:flex flex-col gap-4 w-64"
        >
          <div className="glass-panel p-4 rounded-xl border-white/5">
            <h4 className="text-[10px] font-mono text-white/40 uppercase mb-2">System Status</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span>CPU LOAD</span>
                <span className="text-neon-green">14%</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="w-[14%] h-full bg-neon-green" />
              </div>
              <div className="flex justify-between text-[10px]">
                <span>LATENCY</span>
                <span className="text-neon-blue">0.4ms</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="w-[4%] h-full bg-neon-blue" />
              </div>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-xl border-white/5">
            <h4 className="text-[10px] font-mono text-white/40 uppercase mb-2">Global Highscore</h4>
            <div className="text-2xl font-display text-neon-pink neon-text-pink">
              99,420
            </div>
            <div className="text-[8px] font-mono text-white/20 mt-1">
              USER: X_CYBER_PUNK_X
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="mt-auto py-8 text-[10px] font-mono text-white/20 uppercase tracking-widest z-10">
        &copy; 2026 NEON_BEATS_OS // ALL RIGHTS RESERVED
      </footer>
    </div>
  );
}
