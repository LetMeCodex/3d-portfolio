import { useEffect, useRef, useState, ReactNode } from 'react';
import gsap from 'gsap';

interface CinematicTransitionProps {
  isActive: boolean;
  children: ReactNode;
  backComponent: ReactNode;
  coords?: { x: number; y: number };
}

export function CinematicTransition({ isActive, children, backComponent }: CinematicTransitionProps) {
  const [displayActive, setDisplayActive] = useState(isActive);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  const logoText = "Disha Jain";
  const logoChars = logoText.split("");

  useEffect(() => {
    if (isActive !== displayActive && !isAnimating.current) {
      isAnimating.current = true;
      
      const tl = gsap.timeline();
      
      // Lock scrolling during the transition
      document.body.style.overflow = 'hidden';

      // 1. Initial State Setup
      gsap.set('.preloader-transition-container', { display: 'block', opacity: 0 });
      gsap.set('.preloader-mask', { scale: 1, autoAlpha: 1 });
      gsap.set('.preloader-progress-bar', { autoAlpha: 1 });
      gsap.set('.preloader-bg', { scaleX: 0.1, autoAlpha: 1 });
      gsap.set('.logo-char', { opacity: 0, y: 15 });

      // 2. Animate Entry
      tl.to('.preloader-transition-container', {
        opacity: 1,
        duration: 0.35,
        ease: 'power2.out'
      })
      // Stagger logo text chars up
      .to('.logo-char', {
        opacity: 1,
        y: 0,
        stagger: 0.03,
        duration: 0.45,
        ease: 'power2.out'
      }, 0.1)
      // Progress bar loading animation
      .to('.preloader-bg', {
        scaleX: 1,
        duration: 1.0,
        ease: 'power2.inOut'
      }, 0.2)
      // DOM swap at the mid point
      .call(() => {
        setDisplayActive(isActive);
        // Instantly reset page opacity
        gsap.set(pageContainerRef.current, { opacity: 1 });
      }, [], 1.25)
      // Zoom out mask circle reveal
      .to('.preloader-mask', {
        scale: 8, // scale large enough to fully cover any viewport aspect ratio
        duration: 0.9,
        ease: 'expoScale(0.5, 7, power1.in)'
      }, 1.3)
      // Fade out background layers in sync
      .to('.preloader-bg, .preloader-logo, .preloader-progress-bar', {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut'
      }, 1.3)
      // Hide transition container completely
      .to('.preloader-transition-container', {
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
          gsap.set('.preloader-transition-container', { display: 'none' });
          document.body.style.overflow = '';
          isAnimating.current = false;
        }
      });
    }
  }, [isActive, displayActive]);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen">
      
      {/* ── Active Page Content ── */}
      <div ref={pageContainerRef} className="relative w-full min-h-screen z-0">
        {displayActive ? backComponent : children}
      </div>

      {/* ── The Masterpiece Camera Shutter Mask Transition ── */}
      <div className="preloader-transition-container fixed inset-0 z-[9999] pointer-events-none hidden" style={{ zIndex: 9999 }}>
        <style>{`
          .preloader-mask {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            width: 100%;
            background-color: #1C1917;
            -webkit-mask: linear-gradient(#fff, #fff), url('https://ik.imagekit.io/kg2nszxjp/ironstride-preloader/preloader-mask.svg') center/40% no-repeat;
            -webkit-mask-composite: destination-out;
            mask: linear-gradient(#fff, #fff), url('https://ik.imagekit.io/kg2nszxjp/ironstride-preloader/preloader-mask.svg') center/40% no-repeat;
            mask-composite: subtract;
            transform-origin: center center;
            will-change: transform;
            z-index: 10001;
          }
          
          .preloader-progress-bar {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background-color: #2D2925;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .preloader-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background-color: #ffffff;
            transform-origin: left center;
            z-index: 9999;
          }

          .preloader-logo {
            z-index: 10002;
            position: relative;
            mix-blend-mode: difference;
          }
        `}</style>

        {/* Solid white scaling bar */}
        <div className="preloader-bg" />

        {/* Shutter logo mask overlay */}
        <div className="preloader-mask" />

        {/* Black container enclosing the logo text */}
        <div className="preloader-progress-bar">
          <div className="preloader-logo">
            <p className="logo-text text-white font-serif font-semibold italic text-5xl md:text-7xl tracking-wider select-none">
              {logoChars.map((char, index) => (
                <span key={index} className="logo-char inline-block">
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

CinematicTransition.displayName = "CinematicTransition";
