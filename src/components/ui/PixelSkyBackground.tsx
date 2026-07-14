import React, { useState, useEffect } from 'react';

interface PixelSkyBackgroundProps {
  mouseX: number; // range: -1 to 1
  mouseY: number; // range: -1 to 1
}

export default function PixelSkyBackground({ mouseX, mouseY }: PixelSkyBackgroundProps) {
  const [screenType, setScreenType] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 768) {
        setScreenType('mobile');
      } else if (w < 1024) {
        setScreenType('tablet');
      } else {
        setScreenType('desktop');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Parallax multipliers based on screen size:
  // Desktop: sky glow = 2px, distant clouds = 4px, mid clouds = 8px, fore = 12px, stars = -4px
  // Tablet: 40% reduction (scale = 0.6)
  // Mobile: disabled (scale = 0)
  let scaleFactor = 1.0;
  if (screenType === 'tablet') {
    scaleFactor = 0.6;
  } else if (screenType === 'mobile') {
    scaleFactor = 0;
  }

  const farSkyOffset = { x: mouseX * 2 * scaleFactor, y: mouseY * 2 * scaleFactor };
  const farCloudsOffset = { x: mouseX * 4 * scaleFactor, y: mouseY * 4 * scaleFactor };
  const midOffset = { x: mouseX * 8 * scaleFactor, y: mouseY * 8 * scaleFactor };
  const foreOffset = { x: mouseX * 12 * scaleFactor, y: mouseY * 12 * scaleFactor };
  const starsOffset = { x: mouseX * -4 * scaleFactor, y: mouseY * -4 * scaleFactor };

  // Rich, authentic galaxy constellation list (55 stars total)
  const stars = [
    // sparkles (rotating cross lens-flares)
    { cx: 120, cy: 80, type: 'sparkle', color: '#FFF35A', size: 3, delay: '0s', speed: '3.2s' },
    { cx: 340, cy: 150, type: 'sparkle', color: '#FFFFFF', size: 4, delay: '1.2s', speed: '4.2s' },
    { cx: 580, cy: 90, type: 'sparkle', color: '#C8CCFF', size: 3, delay: '0.8s', speed: '3.5s' },
    { cx: 820, cy: 180, type: 'sparkle', color: '#FFD2D2', size: 4, delay: '2.4s', speed: '4.8s' },
    { cx: 1040, cy: 110, type: 'sparkle', color: '#FFF35A', size: 3, delay: '1.6s', speed: '3.8s' },
    { cx: 1280, cy: 140, type: 'sparkle', color: '#FFFFFF', size: 4, delay: '0.5s', speed: '4.5s' },
    { cx: 220, cy: 220, type: 'sparkle', color: '#C8CCFF', size: 3, delay: '2.1s', speed: '3.2s' },
    { cx: 710, cy: 130, type: 'sparkle', color: '#FFF35A', size: 3, delay: '1.8s', speed: '4s' },
    { cx: 950, cy: 70, type: 'sparkle', color: '#FFFFFF', size: 4, delay: '0.2s', speed: '5s' },
    { cx: 1180, cy: 230, type: 'sparkle', color: '#FFD2D2', size: 3, delay: '3.1s', speed: '3.6s' },

    // diamonds (4-point star shapes)
    { cx: 70, cy: 190, type: 'diamond', color: '#FFFFFF', size: 4, delay: '0.4s', speed: '5.2s' },
    { cx: 250, cy: 110, type: 'diamond', color: '#C8CCFF', size: 3, delay: '2.5s', speed: '4.4s' },
    { cx: 480, cy: 70, type: 'diamond', color: '#FFF35A', size: 4, delay: '1.5s', speed: '3.9s' },
    { cx: 620, cy: 210, type: 'diamond', color: '#FFD2D2', size: 3, delay: '3.5s', speed: '4.7s' },
    { cx: 880, cy: 120, type: 'diamond', color: '#FFFFFF', size: 4, delay: '0.9s', speed: '5.5s' },
    { cx: 1120, cy: 160, type: 'diamond', color: '#C8CCFF', size: 3, delay: '2.2s', speed: '4.1s' },
    { cx: 1360, cy: 90, type: 'diamond', color: '#FFF35A', size: 4, delay: '1.7s', speed: '3.7s' },
    { cx: 180, cy: 130, type: 'diamond', color: '#FFFFFF', size: 3, delay: '0.7s', speed: '4.9s' },
    { cx: 410, cy: 240, type: 'diamond', color: '#C8CCFF', size: 4, delay: '2.8s', speed: '5.1s' },
    { cx: 790, cy: 100, type: 'diamond', color: '#FFF35A', size: 3, delay: '1.1s', speed: '4.3s' },
    { cx: 1010, cy: 220, type: 'diamond', color: '#FFD2D2', size: 4, delay: '3.3s', speed: '4.6s' },

    // glowing dots (circles)
    { cx: 40, cy: 100, type: 'dot', color: '#FFFFFF', size: 1.5, delay: '0.8s', speed: '2.8s' },
    { cx: 90, cy: 250, type: 'dot', color: '#C8CCFF', size: 1.2, delay: '1.4s', speed: '3.1s' },
    { cx: 150, cy: 60, type: 'dot', color: '#FFF35A', size: 1.5, delay: '2.9s', speed: '3.4s' },
    { cx: 280, cy: 180, type: 'dot', color: '#FFFFFF', size: 1.2, delay: '0.3s', speed: '2.5s' },
    { cx: 310, cy: 90, type: 'dot', color: '#FFD2D2', size: 1.8, delay: '1.9s', speed: '4s' },
    { cx: 380, cy: 130, type: 'dot', color: '#FFFFFF', size: 1.2, delay: '2.2s', speed: '3.3s' },
    { cx: 450, cy: 190, type: 'dot', color: '#C8CCFF', size: 1.5, delay: '0.6s', speed: '2.7s' },
    { cx: 520, cy: 110, type: 'dot', color: '#FFF35A', size: 1.2, delay: '3.1s', speed: '3.5s' },
    { cx: 550, cy: 260, type: 'dot', color: '#FFFFFF', size: 1.5, delay: '1.1s', speed: '3s' },
    { cx: 660, cy: 150, type: 'dot', color: '#FFD2D2', size: 1.2, delay: '2.7s', speed: '3.9s' },
    { cx: 690, cy: 60, type: 'dot', color: '#FFFFFF', size: 1.8, delay: '0.1s', speed: '4.2s' },
    { cx: 750, cy: 230, type: 'dot', color: '#C8CCFF', size: 1.2, delay: '1.7s', speed: '3.2s' },
    { cx: 850, cy: 80, type: 'dot', color: '#FFF35A', size: 1.5, delay: '2.3s', speed: '3.7s' },
    { cx: 900, cy: 270, type: 'dot', color: '#FFFFFF', size: 1.2, delay: '0.9s', speed: '2.9s' },
    { cx: 970, cy: 170, type: 'dot', color: '#FFD2D2', size: 1.5, delay: '3.6s', speed: '3.4s' },
    { cx: 1070, cy: 80, type: 'dot', color: '#FFFFFF', size: 1.2, delay: '1.5s', speed: '3.1s' },
    { cx: 1150, cy: 190, type: 'dot', color: '#C8CCFF', size: 1.8, delay: '2.6s', speed: '4.1s' },
    { cx: 1210, cy: 120, type: 'dot', color: '#FFF35A', size: 1.2, delay: '0.7s', speed: '3s' },
    { cx: 1250, cy: 240, type: 'dot', color: '#FFFFFF', size: 1.5, delay: '3.2s', speed: '3.6s' },
    { cx: 1310, cy: 70, type: 'dot', color: '#FFD2D2', size: 1.2, delay: '1.3s', speed: '2.6s' },
    { cx: 1390, cy: 160, type: 'dot', color: '#FFFFFF', size: 1.5, delay: '2.0s', speed: '3.8s' },
    { cx: 1420, cy: 220, type: 'dot', color: '#C8CCFF', size: 1.2, delay: '0.4s', speed: '3.3s' },
    { cx: 160, cy: 290, type: 'dot', color: '#FFFFFF', size: 1.2, delay: '2.4s', speed: '3.2s' },
    { cx: 290, cy: 280, type: 'dot', color: '#FFF35A', size: 1.5, delay: '1.8s', speed: '3.7s' },
    { cx: 490, cy: 300, type: 'dot', color: '#C8CCFF', size: 1.2, delay: '0.9s', speed: '2.9s' },
    { cx: 640, cy: 310, type: 'dot', color: '#FFFFFF', size: 1.5, delay: '3.5s', speed: '4.0s' },
    { cx: 770, cy: 290, type: 'dot', color: '#FFD2D2', size: 1.2, delay: '1.2s', speed: '3.1s' },
    { cx: 920, cy: 320, type: 'dot', color: '#FFFFFF', size: 1.5, delay: '2.7s', speed: '3.5s' },
    { cx: 1090, cy: 290, type: 'dot', color: '#C8CCFF', size: 1.2, delay: '0.5s', speed: '2.8s' },
    { cx: 1230, cy: 310, type: 'dot', color: '#FFF35A', size: 1.5, delay: '3.0s', speed: '4.2s' },
    { cx: 1350, cy: 280, type: 'dot', color: '#FFFFFF', size: 1.2, delay: '1.6s', speed: '3.3s' },
    { cx: 350, cy: 320, type: 'sparkle', color: '#FFFFFF', size: 3, delay: '2.8s', speed: '4.1s' },
    { cx: 850, cy: 330, type: 'diamond', color: '#C8CCFF', size: 3, delay: '1.3s', speed: '4.9s' },
    { cx: 1150, cy: 340, type: 'sparkle', color: '#FFF35A', size: 4, delay: '3.7s', speed: '3.6s' }
  ];
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
      <style>{`
        /* --- Color Variables --- */
        :root {
          --sky-top: #5578EA;
          --sky-mid: #6387F2;
          --sky-lower: #9FA8FF;
          
          --mid-lavender: #9FA8FF;
          --pale-lavender: #C8CCFF;
          --soft-white: #F7F4EF;
          
          --shadow-blue: #344A9A;
          --deep-shadow-navy: #263574;
          --highlight-blue: #D8DCFF;
          --star-yellow: #FFF35A;
        }

        /* --- Keyframe Animations --- */
        
        /* Ambient center glow pulsing (opacity 0.45 to 0.7) */
        @keyframes glowPulse {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 0.7; }
        }

        /* Soft ambient light pulse over sky gradient */
        @keyframes ambientLightPulse {
          0%, 100% { filter: brightness(1.0); }
          50% { filter: brightness(1.03); }
        }

        /* Seamless horizontal drift left */
        @keyframes driftLeft {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-1440px, 0, 0); }
        }

        /* Seamless horizontal drift right */
        @keyframes driftRight {
          from { transform: translate3d(-1440px, 0, 0); }
          to { transform: translate3d(0, 0, 0); }
        }

        /* Foreground cloud edges scale-breathing (1.0 to 1.012) */
        @keyframes breathe {
          0%, 100% { transform: scale(1.0); }
          50% { transform: scale(1.012); }
        }

        /* Middle ridge vertical breathing (2-3px vertical) */
        @keyframes ridgeVertical {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -2.5px, 0); }
        }

        /* Sparkle twinkling: rotates and scales with soft glow */
        @keyframes sparkleTwinkle {
          0%, 100% { transform: scale(0.4) rotate(0deg); opacity: 0.25; filter: drop-shadow(0 0 2px var(--glow-color, #FFF35A)); }
          50% { transform: scale(1.2) rotate(180deg); opacity: 1.0; filter: drop-shadow(0 0 10px var(--glow-color, #FFF35A)); }
        }

        /* Diamond shimmering: scales and glows */
        @keyframes diamondTwinkle {
          0%, 100% { transform: scale(0.5); opacity: 0.3; filter: drop-shadow(0 0 1px var(--glow-color, #FFFFFF)); }
          50% { transform: scale(1.25); opacity: 1.0; filter: drop-shadow(0 0 8px var(--glow-color, #FFFFFF)); }
        }

        /* White dot twinkling: pulsing scale and opacity */
        @keyframes dotTwinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.8); }
          50% { opacity: 0.95; transform: scale(1.3); }
        }

        /* --- Animation Classes --- */
        .animate-ambient-light {
          animation: ambientLightPulse 12s ease-in-out infinite;
        }
        .animate-glow-pulse {
          animation: glowPulse 12s ease-in-out infinite;
        }
        .animate-drift-left {
          animation: driftLeft 140s linear infinite;
        }
        .animate-drift-right {
          animation: driftRight 110s linear infinite;
        }
        .animate-breathe {
          animation: breathe 15s ease-in-out infinite;
          transform-origin: center bottom;
        }
        .animate-ridge-vertical {
          animation: ridgeVertical 10s ease-in-out infinite;
        }
        .animate-sparkle-twinkle {
          animation: sparkleTwinkle 3.5s ease-in-out infinite;
        }
        .animate-diamond-twinkle {
          animation: diamondTwinkle 4.5s ease-in-out infinite;
        }
        .animate-dot-twinkle {
          animation: dotTwinkle 3s ease-in-out infinite;
        }

        /* --- GPU Acceleration / will-change --- */
        .parallax-layer {
          transition: transform 0.5s cubic-bezier(0.1, 0.8, 0.25, 1);
          will-change: transform;
        }

        /* --- Accessibility: prefers-reduced-motion --- */
        @media (prefers-reduced-motion: reduce) {
          .animate-ambient-light,
          .animate-glow-pulse,
          .animate-drift-left,
          .animate-drift-right,
          .animate-breathe,
          .animate-ridge-vertical {
            animation: none !important;
            transform: none !important;
          }
          .yellow-star-g,
          .yellow-sparkle-ray,
          .pale-star-g,
          .white-dot-g {
            animation: none !important;
            transform: none !important;
          }
        }

        /* --- Shooting Star Animations (High-speed, realistic diagonal comets) --- */
        @keyframes shootStar {
          0% {
            transform: translate3d(0, 0, 0) rotate(30deg) scaleX(0);
            opacity: 0;
          }
          1% {
            transform: translate3d(0, 0, 0) rotate(30deg) scaleX(1);
            opacity: 1;
          }
          8% {
            transform: translate3d(300px, 173px, 0) rotate(30deg) scaleX(1.8);
            opacity: 1;
          }
          13% {
            transform: translate3d(450px, 260px, 0) rotate(30deg) scaleX(0.5);
            opacity: 0;
          }
          100% {
            transform: translate3d(450px, 260px, 0) rotate(30deg) scaleX(0);
            opacity: 0;
          }
        }
        .shooting-star-1, .shooting-star-2 {
          position: absolute;
          width: 180px; /* Long tail for aesthetic trail */
          height: 1.5px;
          background: linear-gradient(90deg, rgba(130, 140, 255, 0) 0%, rgba(255, 244, 221, 0.4) 65%, rgba(255, 255, 255, 1) 100%);
          filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.85));
          opacity: 0;
          pointer-events: none;
          transform-origin: right center; /* Scaling stretches the tail backward from the white head */
        }
        .shooting-star-1 {
          top: 8%;
          left: 15%;
          animation: shootStar 9s cubic-bezier(0.1, 0.8, 0.15, 1) infinite;
          animation-delay: 1.5s;
        }
        .shooting-star-2 {
          top: 22%;
          left: 50%;
          animation: shootStar 11s cubic-bezier(0.1, 0.8, 0.15, 1) infinite;
          animation-delay: 5.2s;
        }

        /* --- Moon Floating Animation --- */
        @keyframes moonFloat {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -7px, 0); }
        }
        .animate-moon-float {
          animation: moonFloat 8s ease-in-out infinite;
          transform-origin: 1220px 100px;
        }
      `}</style>

      {/* Layer 7: Cozy lofi noise/grain overlay (3.5% opacity, mix-blend-overlay) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-50 mix-blend-overlay opacity-30" style={{ pointerEvents: 'none' }}>
        <defs>
          <filter id="lofi-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.035 0" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#lofi-noise)" />
      </svg>

      {/* Layer 1 — Far Sky: 3-point Gradient with center-lower Pulsing sunset glow */}
      <div 
        className="absolute inset-0 z-0 parallax-layer animate-ambient-light" 
        style={{
          background: 'linear-gradient(to bottom, var(--sky-top) 0%, var(--sky-mid) 50%, var(--sky-lower) 100%)',
          transform: `translate3d(${farSkyOffset.x}px, ${farSkyOffset.y}px, 0)`
        }}
      >
        {/* Soft radial glow in the middle-lower center (Sunset Pink #F3B8D8 + Blue blend) */}
        <div 
          className="absolute inset-0 pointer-events-none mix-blend-screen animate-glow-pulse"
          style={{
            background: 'radial-gradient(circle at 50% 60%, rgba(243, 184, 216, 0.08) 0%, rgba(216, 220, 255, 0.35) 40%, transparent 68%)',
            willChange: 'opacity'
          }}
        />
      </div>


      {/* Layer 6 — Star Field: 55 Stars scattered in upper sky & animated shooting stars */}
      <div 
        className="absolute inset-0 z-10 parallax-layer"
        style={{
          transform: `translate3d(${starsOffset.x}px, ${starsOffset.y}px, 0)`
        }}
      >
        {/* Shooting Stars */}
        <div className="shooting-star-1" />
        <div className="shooting-star-2" />

        <svg className="w-full h-full" viewBox="0 0 1440 900" fill="none">
          <defs>
            <radialGradient id="moonGlowOuter" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEF6DD" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FEF6DD" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="moonGlowInner" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEF6DD" stopOpacity="1" />
              <stop offset="100%" stopColor="#FEF6DD" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="moonBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="65%" stopColor="#FEF6DD" />
              <stop offset="100%" stopColor="#EADBB3" />
            </linearGradient>
          </defs>

          {/* Glowing Lofi Cratered Full Moon (Shifted high and right to prevent crowding) */}
          <g className="animate-moon-float" style={{ transformOrigin: '1220px 100px' }}>
            {/* Soft ambient atmospheric glow layers */}
            <circle cx="1220" cy="100" r="75" fill="url(#moonGlowOuter)" opacity="0.16" />
            <circle cx="1220" cy="100" r="50" fill="url(#moonGlowInner)" opacity="0.32" />
            
            {/* Main Moon Sphere */}
            <circle cx="1220" cy="100" r="36" fill="url(#moonBodyGrad)" filter="drop-shadow(0 0 15px rgba(254, 246, 221, 0.55))" />
            
            {/* Crater Textures (Soft, organic, matching twilight shading) */}
            <circle cx="1204" cy="90" r="6.5" fill="#E4D3A2" opacity="0.35" />
            <circle cx="1208" cy="110" r="5" fill="#E4D3A2" opacity="0.35" />
            <circle cx="1230" cy="94" r="8" fill="#E4D3A2" opacity="0.35" />
            <circle cx="1223" cy="116" r="4.5" fill="#E4D3A2" opacity="0.35" />
            <circle cx="1216" cy="80" r="3.5" fill="#E4D3A2" opacity="0.3" />
            
            {/* Spherical Shadow overlay for realistic 3D depth */}
            <path d="M 1184,100 A 36,36 0 0,0 1256,100 A 36,36 0 0,1 1184,100" fill="#1C2135" opacity="0.08" />
          </g>

          {stars.map((star, idx) => {
            const glowColor = star.color;
            if (star.type === 'sparkle') {
              return (
                <g 
                  key={idx}
                  className="animate-sparkle-twinkle"
                  style={{
                    transformOrigin: `${star.cx}px ${star.cy}px`,
                    animationDelay: star.delay,
                    animationDuration: star.speed,
                    '--glow-color': glowColor
                  } as React.CSSProperties}
                >
                  {/* Cross-shaped lens flare */}
                  <line x1={star.cx - 6} y1={star.cy} x2={star.cx + 6} y2={star.cy} stroke={star.color} strokeWidth="1.5" />
                  <line x1={star.cx} y1={star.cy - 6} x2={star.cx} y2={star.cy + 6} stroke={star.color} strokeWidth="1.5" />
                  <circle cx={star.cx} cy={star.cy} r="1.5" fill="#FFFFFF" />
                </g>
              );
            } else if (star.type === 'diamond') {
              return (
                <g
                  key={idx}
                  className="animate-diamond-twinkle"
                  style={{
                    transformOrigin: `${star.cx}px ${star.cy}px`,
                    animationDelay: star.delay,
                    animationDuration: star.speed,
                    '--glow-color': glowColor
                  } as React.CSSProperties}
                >
                  <path 
                    d={`M ${star.cx} ${star.cy - star.size} L ${star.cx + 2} ${star.cy} L ${star.cx} ${star.cy + star.size} L ${star.cx - 2} ${star.cy} Z`}
                    fill={star.color}
                  />
                </g>
              );
            } else {
              return (
                <g
                  key={idx}
                  className="animate-dot-twinkle"
                  style={{
                    transformOrigin: `${star.cx}px ${star.cy}px`,
                    animationDelay: star.delay,
                    animationDuration: star.speed
                  } as React.CSSProperties}
                >
                  <circle cx={star.cx} cy={star.cy} r={star.size} fill={star.color} />
                </g>
              );
            }
          })}
        </svg>
      </div>

      {/* Layer 2 — Distant Pixel Haze: Very Soft, 12% Opacity Cloud Silhouettes with organic step contours (drift right-to-left) */}
      <div 
        className="absolute inset-0 z-20 parallax-layer"
        style={{
          transform: `translate3d(${farCloudsOffset.x}px, ${farCloudsOffset.y}px, 0)`
        }}
      >
        <div className="absolute bottom-[20%] w-[2880px] h-[300px] flex overflow-hidden animate-drift-left">
          <svg className="w-[1440px] h-full" fill="var(--pale-lavender)" opacity="0.12" viewBox="0 0 1440 300" preserveAspectRatio="none">
            <path d="M 0,300 V 180 H 60 V 160 H 120 V 150 H 200 V 170 H 260 V 150 H 340 V 130 H 440 V 140 H 520 V 160 H 600 V 180 H 700 V 150 H 800 V 130 H 900 V 110 H 980 V 120 H 1060 V 140 H 1180 V 150 H 1260 V 130 H 1340 V 160 H 1440 V 300 Z" />
          </svg>
          <svg className="w-[1440px] h-full" fill="var(--pale-lavender)" opacity="0.12" viewBox="0 0 1440 300" preserveAspectRatio="none">
            <path d="M 0,300 V 180 H 60 V 160 H 120 V 150 H 200 V 170 H 260 V 150 H 340 V 130 H 440 V 140 H 520 V 160 H 600 V 180 H 700 V 150 H 800 V 130 H 900 V 110 H 980 V 120 H 1060 V 140 H 1180 V 150 H 1260 V 130 H 1340 V 160 H 1440 V 300 Z" />
          </svg>
        </div>
      </div>

      {/* Subtle Atmospheric Lavender Fog near the horizon */}
      <div className="absolute inset-0 z-25 pointer-events-none">
        <div className="absolute bottom-[10%] w-[2880px] h-[220px] flex animate-drift-left opacity-10">
          <div 
            className="w-[1440px] h-full"
            style={{
              background: 'linear-gradient(to top, var(--pale-lavender) 0%, transparent 100%)',
            }}
          />
          <div 
            className="w-[1440px] h-full"
            style={{
              background: 'linear-gradient(to top, var(--pale-lavender) 0%, transparent 100%)',
            }}
          />
        </div>
      </div>

      {/* Layer 3 — Mid-cloud Layer A: Large lavender pixel clouds, organic step contours (drift left-to-right) */}
      <div 
        className="absolute inset-0 z-30 parallax-layer"
        style={{
          transform: `translate3d(${midOffset.x}px, ${midOffset.y}px, 0)`
        }}
      >
        <div className="absolute bottom-[10%] w-[2880px] h-[350px] flex overflow-hidden animate-drift-right">
          {/* First block of mid-clouds A */}
          <div className="w-[1440px] h-full relative">
            <svg className="absolute inset-0 w-full h-full" fill="none" viewBox="0 0 1440 350" preserveAspectRatio="none">
              <defs>
                <filter id="pixel-shadow-diorama" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="-4" dy="6" stdDeviation="0" flood-color="var(--deep-shadow-navy)" flood-opacity="0.22" />
                </filter>
              </defs>
              
              {/* Mid clouds shadows peeking out bottom-right (+2, +2) */}
              <path 
                d="M 0,350 V 160 H 80 V 140 H 150 V 120 H 220 V 100 H 290 V 110 H 360 V 130 H 420 V 150 H 490 V 170 H 560 V 140 H 640 V 120 H 720 V 95 H 800 V 110 H 870 V 130 H 940 V 110 H 1020 V 85 H 1100 V 100 H 1180 V 120 H 1260 V 145 H 1340 V 160 H 1440 V 350 Z" 
                fill="var(--shadow-blue)"
                transform="translate(2, 2)"
              />
              {/* Mid clouds highlights peeking out top-left (-2, -2) */}
              <path 
                d="M 0,350 V 160 H 80 V 140 H 150 V 120 H 220 V 100 H 290 V 110 H 360 V 130 H 420 V 150 H 490 V 170 H 560 V 140 H 640 V 120 H 720 V 95 H 800 V 110 H 870 V 130 H 940 V 110 H 1020 V 85 H 1100 V 100 H 1180 V 120 H 1260 V 145 H 1340 V 160 H 1440 V 350 Z" 
                fill="var(--highlight-blue)"
                transform="translate(-2, -2)"
              />
              {/* Main Cloud shape covering them at (0,0) */}
              <path 
                d="M 0,350 V 160 H 80 V 140 H 150 V 120 H 220 V 100 H 290 V 110 H 360 V 130 H 420 V 150 H 490 V 170 H 560 V 140 H 640 V 120 H 720 V 95 H 800 V 110 H 870 V 130 H 940 V 110 H 1020 V 85 H 1100 V 100 H 1180 V 120 H 1260 V 145 H 1340 V 160 H 1440 V 350 Z" 
                fill="var(--mid-lavender)"
                filter="url(#pixel-shadow-diorama)"
              />
            </svg>
            
            {/* Mid Floating Cloud Islands */}
            <svg className="absolute top-[12%] left-[25%] w-[130px] h-[50px]" viewBox="0 0 130 50">
              <path d="M 10,25 H 35 V 15 H 85 V 25 H 115 V 35 H 95 V 45 H 35 V 35 H 10 Z" fill="var(--shadow-blue)" transform="translate(2, 2)" />
              <path d="M 10,25 H 35 V 15 H 85 V 25 H 115 V 35 H 95 V 45 H 35 V 35 H 10 Z" fill="var(--highlight-blue)" transform="translate(-2, -2)" />
              <path d="M 10,25 H 35 V 15 H 85 V 25 H 115 V 35 H 95 V 45 H 35 V 35 H 10 Z" fill="var(--mid-lavender)" />
            </svg>
            <svg className="absolute top-[20%] right-[28%] w-[150px] h-[55px]" viewBox="0 0 150 55">
              <path d="M 20,25 H 45 V 15 H 95 V 25 H 130 V 35 H 110 V 45 H 45 V 35 H 20 Z" fill="var(--shadow-blue)" transform="translate(2, 2)" />
              <path d="M 20,25 H 45 V 15 H 95 V 25 H 130 V 35 H 110 V 45 H 45 V 35 H 20 Z" fill="var(--highlight-blue)" transform="translate(-2, -2)" />
              <path d="M 20,25 H 45 V 15 H 95 V 25 H 130 V 35 H 110 V 45 H 45 V 35 H 20 Z" fill="var(--mid-lavender)" />
            </svg>
          </div>

          {/* Second block of mid-clouds A (identical loop) */}
          <div className="w-[1440px] h-full relative">
            <svg className="absolute inset-0 w-full h-full" fill="none" viewBox="0 0 1440 350" preserveAspectRatio="none">
              <path 
                d="M 0,350 V 160 H 80 V 140 H 150 V 120 H 220 V 100 H 290 V 110 H 360 V 130 H 420 V 150 H 490 V 170 H 560 V 140 H 640 V 120 H 720 V 95 H 800 V 110 H 870 V 130 H 940 V 110 H 1020 V 85 H 1100 V 100 H 1180 V 120 H 1260 V 145 H 1340 V 160 H 1440 V 350 Z" 
                fill="var(--shadow-blue)"
                transform="translate(2, 2)"
              />
              <path 
                d="M 0,350 V 160 H 80 V 140 H 150 V 120 H 220 V 100 H 290 V 110 H 360 V 130 H 420 V 150 H 490 V 170 H 560 V 140 H 640 V 120 H 720 V 95 H 800 V 110 H 870 V 130 H 940 V 110 H 1020 V 85 H 1100 V 100 H 1180 V 120 H 1260 V 145 H 1340 V 160 H 1440 V 350 Z" 
                fill="var(--highlight-blue)"
                transform="translate(-2, -2)"
              />
              <path 
                d="M 0,350 V 160 H 80 V 140 H 150 V 120 H 220 V 100 H 290 V 110 H 360 V 130 H 420 V 150 H 490 V 170 H 560 V 140 H 640 V 120 H 720 V 95 H 800 V 110 H 870 V 130 H 940 V 110 H 1020 V 85 H 1100 V 100 H 1180 V 120 H 1260 V 145 H 1340 V 160 H 1440 V 350 Z" 
                fill="var(--mid-lavender)"
                filter="url(#pixel-shadow-diorama)"
              />
            </svg>
            <svg className="absolute top-[12%] left-[25%] w-[130px] h-[50px]" viewBox="0 0 130 50">
              <path d="M 10,25 H 35 V 15 H 85 V 25 H 115 V 35 H 95 V 45 H 35 V 35 H 10 Z" fill="var(--shadow-blue)" transform="translate(2, 2)" />
              <path d="M 10,25 H 35 V 15 H 85 V 25 H 115 V 35 H 95 V 45 H 35 V 35 H 10 Z" fill="var(--highlight-blue)" transform="translate(-2, -2)" />
              <path d="M 10,25 H 35 V 15 H 85 V 25 H 115 V 35 H 95 V 45 H 35 V 35 H 10 Z" fill="var(--mid-lavender)" />
            </svg>
            <svg className="absolute top-[20%] right-[28%] w-[150px] h-[55px]" viewBox="0 0 150 55">
              <path d="M 20,25 H 45 V 15 H 95 V 25 H 130 V 35 H 110 V 45 H 45 V 35 H 20 Z" fill="var(--shadow-blue)" transform="translate(2, 2)" />
              <path d="M 20,25 H 45 V 15 H 95 V 25 H 130 V 35 H 110 V 45 H 45 V 35 H 20 Z" fill="var(--highlight-blue)" transform="translate(-2, -2)" />
              <path d="M 20,25 H 45 V 15 H 95 V 25 H 130 V 35 H 110 V 45 H 45 V 35 H 20 Z" fill="var(--mid-lavender)" />
            </svg>
          </div>
        </div>
      </div>

      {/* Layer 3B — Mid-cloud Layer B: Faint lavender pixel clouds, opacity 20% (drifts left slowly) */}
      <div 
        className="absolute inset-0 z-32 parallax-layer animate-drift-left"
        style={{
          transform: `translate3d(${midOffset.x * 0.9}px, ${midOffset.y * 0.9}px, 0)`
        }}
      >
        <div className="absolute bottom-[8%] w-[2880px] h-[350px] flex overflow-hidden">
          <svg className="w-[1440px] h-full text=" fill="var(--pale-lavender)" opacity="0.2" viewBox="0 0 1440 350" preserveAspectRatio="none">
            <path d="M 0,350 V 180 H 100 V 155 H 190 V 135 H 300 V 150 H 400 V 170 H 500 V 145 H 600 V 125 H 700 V 110 H 780 V 130 H 880 V 155 H 980 V 135 H 1080 V 115 H 1180 V 130 H 1280 V 150 H 1440 V 350 Z" />
          </svg>
          <svg className="w-[1440px] h-full text=" fill="var(--pale-lavender)" opacity="0.2" viewBox="0 0 1440 350" preserveAspectRatio="none">
            <path d="M 0,350 V 180 H 100 V 155 H 190 V 135 H 300 V 150 H 400 V 170 H 500 V 145 H 600 V 125 H 700 V 110 H 780 V 130 H 880 V 155 H 980 V 135 H 1080 V 115 H 1180 V 130 H 1280 V 150 H 1440 V 350 Z" />
          </svg>
        </div>
      </div>

      {/* Layer 4 — Softer Middle Ridge: 3 overlapping layers, vertical breath wiggle (2.5px) */}
      <div 
        className="absolute inset-0 z-35 parallax-layer animate-ridge-vertical"
        style={{
          transform: `translate3d(${midOffset.x * 0.75}px, ${midOffset.y * 0.75}px, 0)`
        }}
      >
        {/* Layer 4A (Back ridge, opacity 0.4) */}
        <svg className="absolute bottom-[8%] w-full h-[22%] text=" fill="var(--shadow-blue)" opacity="0.4" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path d="M 0,200 V 120 H 140 V 100 H 290 V 115 H 460 V 130 H 600 V 110 H 750 V 90 H 900 V 110 H 1060 V 125 H 1220 V 100 H 1440 V 200 Z" />
        </svg>

        {/* Layer 4B (Mid ridge, opacity 0.6) */}
        <svg className="absolute bottom-[7%] w-full h-[21%] text=" fill="var(--shadow-blue)" opacity="0.6" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path d="M 0,200 V 130 H 100 V 110 H 240 V 125 H 400 V 140 H 540 V 120 H 690 V 100 H 830 V 115 H 980 V 130 H 1140 V 110 H 1300 V 125 H 1440 V 200 Z" />
        </svg>

        {/* Layer 4C (Front ridge, opacity 0.8, with highlight/shadow diorama contours) */}
        <svg className="absolute bottom-[6%] w-full h-[20%] text=" fill="none" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <defs>
            <filter id="pixel-shadow-ridge" x="-5%" y="-5%" width="110%" height="115%">
              <feDropShadow dx="0" dy="5" stdDeviation="0" flood-color="var(--deep-shadow-navy)" flood-opacity="0.3" />
            </filter>
          </defs>
          {/* Ridge Shadow peeking bottom-right (+2, +2) */}
          <path 
            d="M 0,200 V 140 H 80 V 120 H 200 V 135 H 320 V 150 H 460 V 130 H 600 V 110 H 740 V 125 H 880 V 140 H 1020 V 120 H 1180 V 135 H 1320 V 110 H 1440 V 200 Z" 
            fill="var(--deep-shadow-navy)"
            transform="translate(2, 2)"
          />
          {/* Ridge Highlight peeking top-left (-2, -2) */}
          <path 
            d="M 0,200 V 140 H 80 V 120 H 200 V 135 H 320 V 150 H 460 V 130 H 600 V 110 H 740 V 125 H 880 V 140 H 1020 V 120 H 1180 V 135 H 1320 V 110 H 1440 V 200 Z" 
            fill="var(--mid-lavender)"
            transform="translate(-2, -2)"
          />
          {/* Main Ridge layer */}
          <path 
            d="M 0,200 V 140 H 80 V 120 H 200 V 135 H 320 V 150 H 460 V 130 H 600 V 110 H 740 V 125 H 880 V 140 H 1020 V 120 H 1180 V 135 H 1320 V 110 H 1440 V 200 Z" 
            fill="var(--shadow-blue)"
            opacity="0.75"
            filter="url(#pixel-shadow-ridge)"
          />
        </svg>
      </div>

      {/* Soft lavender fog layer (atmospheric blending) */}
      <div 
        className="absolute left-1/4 right-1/4 bottom-[12%] h-[15%] pointer-events-none mix-blend-screen opacity-35"
        style={{
          background: 'linear-gradient(to top, var(--pale-lavender) 0%, transparent 100%)',
        }}
      />

      {/* Layer 5 — Foreground Clouds: Continuous U-shaped floor, scale-breathing (1.0 to 1.012) */}
      <div 
        className="absolute w-full bottom-0 left-0 right-0 h-[45vh] z-40 parallax-layer animate-breathe"
        style={{
          transformOrigin: 'center bottom'
        }}
      >
        <svg className="w-full h-full" viewBox="0 0 1440 450" preserveAspectRatio="none" fill="none">
          <defs>
            <linearGradient id="foreCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6E85E9" />
              <stop offset="40%" stopColor="#4A61C9" />
              <stop offset="100%" stopColor="#1C2135" />
            </linearGradient>
            <linearGradient id="foreCloudHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D8DCFF" />
              <stop offset="100%" stopColor="#9FA8FF" />
            </linearGradient>
            <linearGradient id="foreCloudShadow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#344A9A" />
              <stop offset="100%" stopColor="#1C2135" />
            </linearGradient>
          </defs>
          {/* Layer 5A: Deep shadow backdrop (#263574) shifted bottom-right (+6, +6) */}
          <path 
            d="M 0,450 V 110 H 60 V 150 H 120 V 200 H 180 V 260 H 240 V 320 H 300 V 380 H 380 V 410 H 520 V 430 H 700 V 410 H 920 V 430 H 1060 V 380 H 1120 V 320 H 1180 V 260 H 1240 V 200 H 1300 V 150 H 1360 V 110 H 1440 V 450 Z" 
            fill="var(--deep-shadow-navy)"
            opacity="0.45"
            transform="translate(6, 6)"
          />

          {/* Layer 5B: Pale Lavender shadow block layer (+3, +3) */}
          <path 
            d="M 0,450 V 110 H 60 V 150 H 120 V 200 H 180 V 260 H 240 V 320 H 300 V 380 H 380 V 410 H 520 V 430 H 700 V 410 H 920 V 430 H 1060 V 380 H 1120 V 320 H 1180 V 260 H 1240 V 200 H 1300 V 150 H 1360 V 110 H 1440 V 450 Z" 
            fill="var(--pale-lavender)"
            opacity="0.95"
            transform="translate(3, 3)"
          />

          {/* Layer 5C: Main cloud body (Twilight Blue to Deep Night Navy gradient) */}
          <path 
            d="M 0,450 V 110 H 60 V 150 H 120 V 200 H 180 V 260 H 240 V 320 H 300 V 380 H 380 V 410 H 520 V 430 H 700 V 410 H 920 V 430 H 1060 V 380 H 1120 V 320 H 1180 V 260 H 1240 V 200 H 1300 V 150 H 1360 V 110 H 1440 V 450 Z" 
            fill="url(#foreCloudGrad)"
          />

          {/* Layer 5D: Inner highlights (Soft Lavender highlight gradient) */}
          <path 
            d="M 0,450 V 125 H 50 V 165 H 110 V 215 H 170 V 275 H 230 V 335 H 290 V 390 H 380 V 420 H 520 V 440 H 700 V 420 H 920 V 440 H 1050 V 390 H 1110 V 335 H 1170 V 275 H 1230 V 215 H 1290 V 165 H 1350 V 125 H 1440 V 450 Z" 
            fill="url(#foreCloudHighlight)"
            opacity="0.85"
            transform="translate(-3, -3)"
          />

          {/* Layer 5E: Detailed side-facing shadow blocks along step rises (Soft shadow blue gradients) */}
          {/* Left cloud wall steps */}
          <rect x={50} y={110} width={10} height={40} fill="url(#foreCloudShadow)" />
          <rect x={110} y={150} width={10} height={50} fill="url(#foreCloudShadow)" />
          <rect x={170} y={200} width={10} height={60} fill="url(#foreCloudShadow)" />
          <rect x={230} y={260} width={10} height={60} fill="url(#foreCloudShadow)" />
          <rect x={290} y={320} width={10} height={60} fill="url(#foreCloudShadow)" />
          <rect x={370} y={380} width={10} height={30} fill="url(#foreCloudShadow)" />

          {/* Right cloud wall steps */}
          <rect x={1110} y={320} width={10} height={60} fill="url(#foreCloudShadow)" />
          <rect x={1170} y={260} width={10} height={60} fill="url(#foreCloudShadow)" />
          <rect x={1230} y={200} width={10} height={60} fill="url(#foreCloudShadow)" />
          <rect x={1290} y={150} width={10} height={50} fill="url(#foreCloudShadow)" />
          <rect x={1350} y={110} width={10} height={40} fill="url(#foreCloudShadow)" />
        </svg>
      </div>
    </div>
  );
}
