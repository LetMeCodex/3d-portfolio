"use client";

import React, { useRef, useState, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AestheticTextReveal } from "./AestheticTextReveal";

gsap.registerPlugin(ScrollTrigger);

interface VideoScrollHeroProps {
  videoSrc?: string;
  enableAnimations?: boolean;
  className?: string;
  startScale?: number;
}

export function VideoScrollHero({
  videoSrc = "/assets/portfolio-video-4k.mp4.mp4",
  className = "",
  startScale = 0.45,
}: VideoScrollHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCenterBtn, setShowCenterBtn] = useState(true);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Cinematic Reveal Animation
      gsap.fromTo(videoWrapperRef.current, 
        {
          scale: startScale,
          borderRadius: "3rem",
        },
        {
          scale: 1,
          borderRadius: "0rem",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 78%", 
            end: "top 15%", // Finish faster for "one scroll" feel
            scrub: 1.2, 
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [startScale]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
      setShowCenterBtn(!isPlaying ? false : true);
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      
      {/* Scroll tracking height container */}
      <div ref={containerRef} className="relative h-[150vh] bg-transparent">
        
        {/* Sticky container that holds the video element while scrolling */}
        <div className="sticky top-0 w-full h-screen flex items-center justify-center z-10 overflow-hidden bg-transparent">
          <div
            ref={videoWrapperRef}
            className="relative flex items-center justify-center shadow-[0_50px_100px_rgba(0,0,0,0.3)] group z-10 cursor-pointer overflow-hidden"
            style={{
              width: "100vw",
              height: "100vh",
              transformOrigin: "center center",
            }}
            onMouseEnter={() => setShowCenterBtn(true)}
            onMouseLeave={() => isPlaying && setShowCenterBtn(false)}
            onClick={togglePlay}
          >
            {/* 
                Clean Video 
                Note: scale-125 and object-cover are used here to effectively 
                crop out the VEED watermark during high-fidelity playback.
            */}
            <video
              ref={videoRef}
              loop
              muted={isMuted}
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none will-change-transform video-hero-smooth"
              style={{
                transform: 'scale(1)',
                objectPosition: 'center',
              }}
            >
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>



            {/* Centered Play Button Overlay */}
            <AnimatePresence>
              {showCenterBtn && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 flex items-center justify-center z-20"
                >
                  <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-2xl transform hover:scale-110 transition-transform duration-500">
                     {isPlaying ? <Pause size={32} fill="currentColor" strokeWidth={0} /> : <Play size={32} fill="currentColor" strokeWidth={0} className="ml-2" />}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Aesthetic Unified Control Pill */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 rounded-[2rem] bg-[#1a1a1a]/50 backdrop-blur-md border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.3)] opacity-0 group-hover:opacity-100 transition-all duration-700 hover:bg-[#1a1a1a]/60 z-30">
              
              <button
                onClick={togglePlay}
                className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-white/20 transition-colors text-white cursor-pointer"
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? <Pause size={18} fill="currentColor" strokeWidth={0} /> : <Play size={18} fill="currentColor" strokeWidth={0} className="ml-1" />}
              </button>

              <div className="w-[1px] h-6 bg-white/20" /> {/* Divider */}

              <button
                onClick={toggleMute}
                className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-white/20 transition-colors text-white cursor-pointer"
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? <VolumeX size={18} strokeWidth={1.5} /> : <Volume2 size={18} strokeWidth={1.5} />}
              </button>

            </div>

          </div>
          
        </div>
      </div>

      {/* --- STORY / INFO SECTION --- */}
      <div className="relative w-full bg-[#050505] py-32 md:py-48 px-6 md:px-12 flex items-center justify-center overflow-hidden border-t border-white/10 z-20">
        
        {/* Very subtle architectural grid background like the screenshot */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03]" 
          style={{ 
            backgroundImage: `
              linear-gradient(to right, #ffffff 1px, transparent 1px),
              linear-gradient(to bottom, #ffffff 1px, transparent 1px)
            `,
            backgroundSize: '4rem 4rem',
            backgroundPosition: 'center center'
          }} 
        />
        
        <div className="relative z-10 w-full max-w-[1200px] mx-auto text-left flex flex-col gap-2">
          <AestheticTextReveal 
            text="THIS EDIT" 
            revealText="A REFLECTION OF ME" 
            className="text-[12vw] md:text-[8vw] font-black leading-none"
          />
          <AestheticTextReveal 
            text="POURING LOVE" 
            revealText="INTO EVERY FRAME" 
            className="text-[12vw] md:text-[8vw] font-black leading-none"
          />
          <AestheticTextReveal 
            text="TRUE ART" 
            revealText="BEGINS WITH THE 'I'" 
            className="text-[12vw] md:text-[8vw] font-black leading-none"
          />

          {/* Centered Aesthetic Signature */}
          <div className="mt-20 md:mt-32 self-center text-center">
            <AestheticTextReveal 
              text="CUTTIIEEE !!!" 
              revealText="GUNNUUU !!!" 
              className="text-[8vw] md:text-[5vw] font-black leading-none opacity-90"
            />
          </div>
        </div>
      </div>

    </div>
  );
}
