import React, { useEffect, useRef, useState } from 'react';

export function SpotifyPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Load local full length MP3 audio file
    audioRef.current = new Audio('/we-fell-in-love-in-october.mp3');
    audioRef.current.loop = true;

    const handleTimeUpdate = () => {
      if (audioRef.current) {
        const current = audioRef.current.currentTime;
        const duration = audioRef.current.duration || 184; // Fallback to 184s (duration of girl in red song)
        setProgress((current / duration) * 100);
      }
    };

    const handleAudioEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    const audio = audioRef.current;
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleAudioEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleAudioEnded);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((err) => {
        console.error('Audio playback was prevented by browser security policies:', err);
      });
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative w-[340px] h-[96px] bg-[#0c0c0c]/95 border border-white/10 rounded-[1.2rem] p-3 flex gap-3 shadow-[0_20px_40px_rgba(0,0,0,0.4)] backdrop-blur-md overflow-hidden select-none">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounceVisualizer {
          0%, 100% { height: 3px; }
          50% { height: 14px; }
        }
        .visualizer-bar-1 { animation: bounceVisualizer 0.7s ease-in-out infinite; }
        .visualizer-bar-2 { animation: bounceVisualizer 0.5s ease-in-out infinite; }
        .visualizer-bar-3 { animation: bounceVisualizer 0.8s ease-in-out infinite; }
        .visualizer-bar-4 { animation: bounceVisualizer 0.6s ease-in-out infinite; }
      ` }} />

      {/* Album Cover Art */}
      <div className="relative w-18 h-18 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-900 border border-white/5">
        <img 
          src="/girl-in-red-album.webp" 
          alt="We Fell In Love In October Cover Art" 
          className={`w-full h-full object-cover transition-all duration-[2s] ${isPlaying ? 'scale-105' : 'scale-100'}`}
        />
      </div>

      {/* Track Information & Controls */}
      <div className="flex-1 flex flex-col justify-between min-w-0 pr-1 py-0.5">
        {/* Track details (top row) */}
        <div className="flex flex-col gap-0.5 min-w-0 relative pr-6">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-sans font-bold text-[14px] text-white tracking-wide truncate">
              we fell in love in october
            </span>
            {/* Visualizer bars */}
            {isPlaying && (
              <div className="flex items-end gap-[2px] h-3.5 pb-0.5 flex-shrink-0">
                <div className="w-[2.5px] bg-[#1DB954] rounded-full visualizer-bar-1" style={{ animationDelay: '0.1s' }} />
                <div className="w-[2.5px] bg-[#1DB954] rounded-full visualizer-bar-2" style={{ animationDelay: '0.3s' }} />
                <div className="w-[2.5px] bg-[#1DB954] rounded-full visualizer-bar-3" style={{ animationDelay: '0.2s' }} />
                <div className="w-[2.5px] bg-[#1DB954] rounded-full visualizer-bar-4" style={{ animationDelay: '0.4s' }} />
              </div>
            )}
          </div>
          <span className="font-sans text-[12px] text-neutral-400 font-medium truncate">
            girl in red
          </span>
        </div>

        {/* Action Controls & Badges (bottom row) */}
        <div className="flex items-center justify-between">
          {/* Preview Tag */}
          <div className="px-2 py-0.5 rounded bg-white/10 border border-white/5">
            <span className="font-mono text-[9px] uppercase tracking-wider font-bold text-white/90">Preview</span>
          </div>

          {/* Player controls */}
          <div className="flex items-center gap-4">
            {/* Add to library button (+ symbol inside circle) */}
            <button className="text-white/60 hover:text-white transition-colors duration-200 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            {/* More options button (...) */}
            <button className="text-white/60 hover:text-white transition-colors duration-200 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
            </button>

            {/* Play/Pause CTA Circular Trigger */}
            <button 
              onClick={togglePlay} 
              className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-transform duration-200 shadow-md focus:outline-none"
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5">
                  <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5 ml-0.5">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Spotify Top Right Logo */}
      <div className="absolute top-3.5 right-4.5 text-[#1DB954]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.893-.982-.336.075-.668-.135-.744-.47-.075-.336.136-.668.47-.744 3.856-.88 7.15-.51 9.822 1.13.295.178.387.563.205.859zm1.224-2.72c-.227.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.076-1.183-.412.125-.845-.108-.97-.52-.125-.413.108-.847.52-.97 3.665-1.11 8.24-.567 11.34 1.343.366.226.486.707.26 1.07zm.106-2.833C14.39 8.71 8.65 8.522 5.32 9.532c-.51.155-1.054-.13-1.21-.64-.155-.51.13-1.054.64-1.21 3.82-1.16 10.15-.94 14.2 1.47.46.27.61.86.34 1.32-.27.46-.86.61-1.32.34z"/>
        </svg>
      </div>

      {/* Progress timeline bar at the bottom */}
      <div className="absolute bottom-0 inset-x-0 h-[3px] bg-white/10">
        <div 
          className="h-full bg-[#1DB954] transition-all duration-100 ease-linear" 
          style={{ width: `${progress}%` }} 
        />
      </div>
    </div>
  );
}
