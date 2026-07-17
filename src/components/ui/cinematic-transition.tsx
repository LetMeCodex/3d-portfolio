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
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive !== displayActive && !isAnimating.current) {
      isAnimating.current = true;

      const tl = gsap.timeline();

      // Lock scrolling during the transition
      document.body.style.overflow = 'hidden';

      // 1. Initial State Setup
      gsap.set(overlayRef.current, { display: 'block', opacity: 0 });
      gsap.set('.cad-corner', { strokeDashoffset: 200 });
      gsap.set('.cad-circle-outer', { strokeDashoffset: 1884 });
      gsap.set('.cad-circle-inner', { strokeDashoffset: 628 });
      gsap.set('.cad-grid', { opacity: 0 });
      gsap.set('.cad-text', { opacity: 0, y: 10 });

      // 2. Animate Entry (Blur + Zoom Page, Fade in CAD overlay)
      tl.to(pageContainerRef.current, {
        filter: 'blur(25px)',
        scale: 1.06,
        duration: 0.5,
        ease: 'power2.inOut'
      })
      .to(overlayRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out'
      }, 0.1)

      // 3. Snappy CAD Drawing Animations
      .to('.cad-corner', {
        strokeDashoffset: 0,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.05
      }, 0.2)
      .to('.cad-circle-outer', {
        strokeDashoffset: 0,
        duration: 0.6,
        ease: 'power2.out'
      }, 0.25)
      .to('.cad-circle-inner', {
        strokeDashoffset: 0,
        duration: 0.5,
        ease: 'power2.out'
      }, 0.3)
      .to('.cad-grid', {
        opacity: 0.2,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power1.out'
      }, 0.2)
      .to('.cad-text', {
        opacity: 0.7,
        y: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power2.out'
      }, 0.3)

      // 4. Midpoint: Screen is fully showing blueprint, swap DOM page content
      .call(() => {
        setDisplayActive(isActive);
      }, [], 0.65)

      // 5. Animate Exit (Zoom in new page, Unblur, Fade out CAD drawings)
      .to(pageContainerRef.current, {
        filter: 'blur(0px)',
        scale: 1,
        duration: 0.6,
        ease: 'power2.out'
      }, 0.7)
      .to('.cad-corner, .cad-circle-outer, .cad-circle-inner, .cad-text, .cad-grid', {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in'
      }, 0.7)
      .to(overlayRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut'
      }, 0.75)
      .call(() => {
        gsap.set(overlayRef.current, { display: 'none' });
        document.body.style.overflow = '';
        isAnimating.current = false;
      });
    }
  }, [isActive, displayActive]);

  return (
    <div className="relative w-full min-h-screen">
      
      {/* ── Active Page Content ── */}
      <div 
        ref={pageContainerRef} 
        className="relative w-full min-h-screen z-0 will-change-[transform,filter]"
        style={{ transformOrigin: 'center center' }}
      >
        {displayActive ? backComponent : children}
      </div>

      {/* ── The Masterpiece CAD Blueprint Transition Overlay ── */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 z-[9999] pointer-events-none hidden bg-[#111013]/95 backdrop-blur-md"
      >
        <svg 
          viewBox="0 0 1920 1080" 
          preserveAspectRatio="xMidYMid slice" 
          className="absolute inset-0 w-full h-full text-white pointer-events-none"
        >
          {/* Corner markers (CAD style crops) */}
          <path className="cad-line cad-corner" d="M 80 180 L 80 80 L 180 80" fill="none" stroke="#E58B88" strokeWidth="2.5" strokeDasharray="200" strokeDashoffset="200" />
          <path className="cad-line cad-corner" d="M 1840 180 L 1840 80 L 1740 80" fill="none" stroke="#E58B88" strokeWidth="2.5" strokeDasharray="200" strokeDashoffset="200" />
          <path className="cad-line cad-corner" d="M 80 900 L 80 1000 L 180 1000" fill="none" stroke="#E58B88" strokeWidth="2.5" strokeDasharray="200" strokeDashoffset="200" />
          <path className="cad-line cad-corner" d="M 1840 900 L 1840 1000 L 1740 1000" fill="none" stroke="#E58B88" strokeWidth="2.5" strokeDasharray="200" strokeDashoffset="200" />

          {/* Blueprint Grid Lines */}
          <line className="cad-line cad-grid" x1="0" y1="540" x2="1920" y2="540" stroke="rgba(229,139,136,0.15)" strokeWidth="1" strokeDasharray="6,6" />
          <line className="cad-line cad-grid" x1="960" y1="0" x2="960" y2="1080" stroke="rgba(229,139,136,0.15)" strokeWidth="1" strokeDasharray="6,6" />
          <line className="cad-line cad-grid" x1="0" y1="270" x2="1920" y2="270" stroke="rgba(229,139,136,0.06)" strokeWidth="0.75" strokeDasharray="4,4" />
          <line className="cad-line cad-grid" x1="0" y1="810" x2="1920" y2="810" stroke="rgba(229,139,136,0.06)" strokeWidth="0.75" strokeDasharray="4,4" />
          <line className="cad-line cad-grid" x1="480" y1="0" x2="480" y2="1080" stroke="rgba(229,139,136,0.06)" strokeWidth="0.75" strokeDasharray="4,4" />
          <line className="cad-line cad-grid" x1="1440" y1="0" x2="1440" y2="1080" stroke="rgba(229,139,136,0.06)" strokeWidth="0.75" strokeDasharray="4,4" />

          {/* Compass layout circles */}
          <circle className="cad-line cad-circle-outer" cx="960" cy="540" r="300" fill="none" stroke="#FEF6DD" strokeWidth="1.5" strokeDasharray="1884" strokeDashoffset="1884" opacity="0.3" />
          <circle className="cad-line cad-circle-inner" cx="960" cy="540" r="100" fill="none" stroke="#E58B88" strokeWidth="2" strokeDasharray="628" strokeDashoffset="628" opacity="0.5" />

          {/* Blueprint markings & tech specs */}
          <text x="110" y="120" className="cad-text font-mono text-[10px] fill-[#FEF6DD] font-bold tracking-[0.25em]">SYS_INIT // PAGE_ENGAGED</text>
          <text x="1810" y="120" className="cad-text font-mono text-[10px] fill-[#FEF6DD] font-bold tracking-[0.25em] text-right" style={{ textAnchor: 'end' }}>SCALE 1.00 // CALIBRATED</text>
          <text x="980" y="525" className="cad-text font-mono text-[9px] fill-[#E58B88] tracking-[0.3em] font-medium">COORD: [960.00, 540.00]</text>
          <text x="980" y="565" className="cad-text font-mono text-[9px] fill-[#FEF6DD]/70 tracking-[0.3em] font-medium">DRAFT_ID: [D_J_PORTFOLIO]</text>
        </svg>
      </div>

    </div>
  );
}

CinematicTransition.displayName = "CinematicTransition";
