"use client";

import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function ZoomRevealSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const textIRef = useRef<HTMLDivElement>(null);
  const textMakeRef = useRef<HTMLDivElement>(null);
  const textThingsRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(0);

  // 1. Preload images
  useEffect(() => {
    const totalFrames = 68;
    let loadedCount = 0;
    const tempImages: HTMLImageElement[] = [];

    const handleLoad = () => {
      loadedCount++;
      if (loadedCount === totalFrames) {
        setImagesLoaded(true);
        // Draw initial frame once all are loaded
        requestAnimationFrame(() => drawFrame(0));
      }
    };

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const numStr = String(i).padStart(3, '0');
      img.src = `/starting-animation/ezgif-frame-${numStr}.png`;
      img.onload = handleLoad;
      img.onerror = handleLoad; // fallback to avoid getting stuck
      tempImages.push(img);
    }

    imagesRef.current = tempImages;
  }, []);

  // 2. Canvas drawing logic (object-fit: cover)
  const drawFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = imagesRef.current[frameIndex];
    
    if (!canvas || !ctx || !img) return;

    const w = canvas.width;
    const h = canvas.height;
    const imgW = img.width;
    const imgH = img.height;

    if (imgW === 0 || imgH === 0) return;

    ctx.clearRect(0, 0, w, h);

    // Calculate aspect ratios
    const imgRatio = imgW / imgH;
    const canvasRatio = w / h;

    let sx = 0, sy = 0, sw = imgW, sh = imgH;

    if (canvasRatio > imgRatio) {
      // Canvas is wider than image (landscape view of portrait image)
      sh = imgW / canvasRatio;
      sy = (imgH - sh) / 2;
    } else {
      // Canvas is taller than image
      sw = imgH * canvasRatio;
      sx = (imgW - sw) / 2;
    }

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
    currentFrameRef.current = frameIndex;
  };

  // 3. Handle window resizes
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawFrame(currentFrameRef.current);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial setup

    return () => window.removeEventListener('resize', handleResize);
  }, [imagesLoaded]);

  // 4. GSAP ScrollTrigger timeline setup
  useLayoutEffect(() => {
    if (!imagesLoaded) return;

    const ctx = gsap.context(() => {
      const frameObj = { frame: 0 };
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 0.15, // Smooth, snappy scrub
          invalidateOnRefresh: true,
        }
      });

      // Animate mask circle radius to expand to fully cover screen
      tl.to(circleRef.current, {
        attr: { r: 1500 },
        ease: 'power2.inOut',
        duration: 1,
      }, 0)
      
      // Scrub video frames
      .to(frameObj, {
        frame: 67,
        snap: 'frame',
        ease: 'none',
        duration: 0.85,
        onUpdate: () => {
          drawFrame(Math.floor(frameObj.frame));
        }
      }, 0)

      // Smoothly fade canvas out at the very end to transition into the dark hackathon section
      .to(canvasRef.current, {
        opacity: 0,
        ease: 'power1.out',
        duration: 0.15,
      }, 0.85)

      // Animate text components (zoom out & fade)
      .to(textIRef.current, {
        x: -250,
        opacity: 0,
        scale: 0.8,
        ease: 'power1.inOut',
        duration: 0.5,
      }, 0)
      .to(textMakeRef.current, {
        x: -350,
        opacity: 0,
        scale: 0.85,
        ease: 'power1.inOut',
        duration: 0.5,
      }, 0)
      .to(textThingsRef.current, {
        x: 250,
        opacity: 0,
        scale: 0.8,
        ease: 'power1.inOut',
        duration: 0.5,
      }, 0)
      .to(hintRef.current, {
        opacity: 0,
        y: 30,
        ease: 'power1.inOut',
        duration: 0.3,
      }, 0);

    }, containerRef);

    ScrollTrigger.sort();
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [imagesLoaded]);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-screen bg-[#111013] overflow-hidden z-30"
      style={{ contentVisibility: 'auto' }}
    >
      {/* Background Frame-Scrubbing Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full object-cover z-10"
      />

      {/* SVG Mask Overlay */}
      <svg 
        viewBox="0 0 1920 1080" 
        preserveAspectRatio="xMidYMid slice" 
        className="absolute inset-0 w-full h-full z-20 pointer-events-none"
      >
        <defs>
          <mask id="zoom-reveal-mask">
            {/* White covers everything */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
             {/* Typographic center separator dot mask */}
             <circle 
               ref={circleRef} 
               cx="960" 
               cy="540" 
               r="8" 
               fill="black" 
             />
          </mask>
          
          {/* Subtle grid pattern matching website's architectural grid */}
          <pattern id="reveal-grid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M 64 0 L 0 0 0 64" fill="none" stroke="#1c2135" strokeWidth="0.5" opacity="0.04" />
          </pattern>
        </defs>

        {/* Cream solid background with mask applied */}
        <rect 
          x="0" 
          y="0" 
          width="100%" 
          height="100%" 
          fill="#FAF8F5" 
          mask="url(#zoom-reveal-mask)" 
        />

        {/* Architectural grid overlay with mask applied */}
        <rect 
          x="0" 
          y="0" 
          width="100%" 
          height="100%" 
          fill="url(#reveal-grid)" 
          mask="url(#zoom-reveal-mask)" 
        />

        {/* Decorative wobbly circle outline around the central mask lens (scales with expansion) */}
        {/* We keep this design wobbly and artistic */}
      </svg>

      {/* Creative Typography: I Make Things */}
      <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center font-serif text-[#1c2135]">
        
        {/* "I" - Top Left */}
        <div 
          ref={textIRef}
          className="absolute top-[20%] left-[8%] md:left-[15%] text-8xl md:text-[12rem] italic font-light select-none leading-none"
        >
          I
        </div>

        {/* "Make" - Left Middle */}
        <div 
          ref={textMakeRef}
          className="absolute top-[48%] left-[6%] md:left-[10%] text-6xl md:text-[8rem] font-sans font-black tracking-tighter uppercase select-none leading-none"
        >
          Make
        </div>

        {/* "Things." - Bottom Right */}
        <div 
          ref={textThingsRef}
          className="absolute bottom-[22%] right-[8%] md:right-[15%] text-7xl md:text-[10rem] italic font-light select-none leading-none"
        >
          Things.
        </div>

        {/* Small Scroll Indicator / Hint */}
        <div 
          ref={hintRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#1c2135]/50 flex flex-col items-center gap-2 select-none"
        >
          <span>Scroll to Open</span>
          <div className="w-[1px] h-8 bg-[#1c2135]/30 animate-pulse" />
        </div>
      </div>

      {/* Preloader overlay while frames are caching */}
      {!imagesLoaded && (
        <div className="absolute inset-0 bg-[#FAF8F5] z-[99] flex flex-col items-center justify-center gap-4">
          <div className="font-serif italic text-2xl text-[#1c2135]/70 animate-pulse">
            Assembling canvas frames...
          </div>
          <div className="w-48 h-[2px] bg-[#1c2135]/10 rounded-full overflow-hidden">
            <div className="w-full h-full bg-[#E84855] origin-left animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
}
