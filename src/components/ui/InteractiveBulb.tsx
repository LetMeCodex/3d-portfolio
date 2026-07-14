"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function InteractiveBulb() {
  const [isOn, setIsOn] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cordRef = useRef<HTMLDivElement>(null);
  const bulbRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (isOn) {
      gsap.to(root, {
        '--background': '#fbff13',
        '--foreground': '#000000',
        '--primary': '#000000',
        duration: 0.8,
        ease: "power2.inOut"
      });
    } else {
      gsap.to(root, {
        '--background': '#F5F4F0',
        '--foreground': '#1c2135',
        '--primary': '#B2BEE2',
        duration: 0.8,
        ease: "power2.inOut"
      });
    }
  }, [isOn]);

  const handleTug = () => {
    const clickAudio = new Audio('https://assets.codepen.io/605876/click.mp3');
    
    // Simple, bulletproof GSAP animation for the tug
    const tl = gsap.timeline();
    
    tl.to(cordRef.current, {
      y: 40,
      duration: 0.15,
      ease: "power2.out",
      onStart: () => {
        setIsOn(!isOn);
        clickAudio.play().catch(() => {});
      }
    })
    .to(cordRef.current, {
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1.2, 0.4)"
    });

    gsap.to(bulbRef.current, {
      y: 3,
      duration: 0.05,
      yoyo: true,
      repeat: 3
    });
  };

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[100] flex items-start justify-center">
      
      {/* Global Glow Overlay */}
      <div 
        className="absolute inset-0 transition-opacity duration-1000 pointer-events-none"
        style={{ 
          background: 'radial-gradient(circle at 50% 120px, rgba(251, 255, 19, 0.4) 0%, transparent 70%)',
          opacity: isOn ? 1 : 0,
          mixBlendMode: 'screen'
        }}
      />

      {/* The Bulb Component */}
      <div 
        ref={cordRef}
        onClick={handleTug}
        className="relative w-[150px] h-[450px] pointer-events-auto flex justify-center cursor-pointer active:scale-95 transition-transform"
      >
        <svg
          viewBox="0 0 200 450"
          className="w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top Support Cord */}
          <line x1="100" y1="-200" x2="100" y2="100" stroke="#444" strokeWidth="2" />

          {/* Bulb Assembly */}
          <g ref={bulbRef} transform="translate(100, 100)">
             {/* Realistic Glass Shade (Upward) */}
             <path 
                className="transition-all duration-700"
                d="M0,0 C30,0 45,-35 45,-60 C45,-90 25,-115 0,-115 C-25,-115 -45,-90 -45,-60 C-45,-35 -30,0 0,0" 
                fill={isOn ? "rgba(251, 255, 19, 0.95)" : "rgba(255,255,255,0.08)"}
                stroke={isOn ? "#000" : "#666"}
                strokeWidth="1.5"
                style={{ filter: isOn ? 'drop-shadow(0 0 25px rgba(251,255,19,0.7))' : 'none' }}
             />

             {/* Internal Filaments */}
             <path d="M-8,-35 L-10,-75 L0,-95 L10,-75 L8,-35" fill="none" stroke={isOn ? "#ffaa00" : "#444"} strokeWidth="1.5" />
             
             {/* Glass Shine */}
             <path d="M-22,-40 C-28,-55 -28,-75 -18,-90" fill="none" stroke="white" strokeWidth="3" opacity={isOn ? 0.3 : 0.05} strokeLinecap="round" />

             {/* Metallic Socket */}
             <g>
                <path d="M-15,0 L15,0 L12,25 L-12,25 Z" fill="#666" stroke="#444" strokeWidth="1" />
                <rect x="-12" y="5" width="24" height="2" fill="#555" />
                <rect x="-12" y="12" width="24" height="2" fill="#555" />
                <rect x="-12" y="19" width="24" height="2" fill="#555" />
             </g>
          </g>

          {/* Pull Cord */}
          <line 
            x1="100" y1="125" 
            x2="100" y2="300" 
            stroke="#555" 
            strokeWidth="3"
            strokeDasharray="4,4"
          />

          {/* The Visual Bead */}
          <circle 
            className="transition-colors duration-300"
            cx="100" cy="300" r="10" 
            fill={isOn ? "#000" : "#333"} 
            stroke={isOn ? "#fbff13" : "#fff"}
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
}
