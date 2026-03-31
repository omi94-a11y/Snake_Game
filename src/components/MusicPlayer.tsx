import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';
import { motion } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Dreams",
    artist: "SynthAI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/neon1/200/200"
  },
  {
    id: 2,
    title: "Cyber Pulse",
    artist: "Binary Beats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/neon2/200/200"
  },
  {
    id: 3,
    title: "Digital Horizon",
    artist: "Data Drift",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/neon3/200/200"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleTrackEnd = () => {
    skipForward();
  };

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl w-full max-w-[400px] border-neon-purple/30">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />

      <div className="flex items-center gap-4 mb-6">
        <motion.div 
          key={currentTrack.id}
          initial={{ rotate: -10, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          className="relative w-20 h-20 rounded-lg overflow-hidden border border-neon-purple/50 shadow-[0_0_15px_rgba(188,19,254,0.3)]"
        >
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {isPlaying && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <Music className="text-neon-purple w-6 h-6" />
              </motion.div>
            </div>
          )}
        </motion.div>

        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg text-neon-purple neon-text-purple truncate">
            {currentTrack.title}
          </h3>
          <p className="text-xs text-white/60 font-mono uppercase tracking-widest">
            {currentTrack.artist}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-1 bg-white/10 rounded-full mb-6 overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-neon-purple shadow-[0_0_10px_#bc13fe]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button 
          onClick={skipBack}
          className="p-2 text-white/60 hover:text-neon-purple transition-colors"
        >
          <SkipBack size={24} />
        </button>

        <button 
          onClick={togglePlay}
          className="w-14 h-14 rounded-full bg-neon-purple flex items-center justify-center text-black hover:scale-105 transition-transform shadow-[0_0_20px_#bc13fe]"
        >
          {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
        </button>

        <button 
          onClick={skipForward}
          className="p-2 text-white/60 hover:text-neon-purple transition-colors"
        >
          <SkipForward size={24} />
        </button>

        <div className="flex items-center gap-2 text-white/40">
          <Volume2 size={16} />
          <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="w-2/3 h-full bg-white/40" />
          </div>
        </div>
      </div>
    </div>
  );
}
