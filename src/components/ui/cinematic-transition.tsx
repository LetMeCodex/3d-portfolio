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

  useEffect(() => {
    if (isActive !== displayActive && !isAnimating.current) {
      isAnimating.current = true;
      
      const tl = gsap.timeline();
      
      // Lock scrolling during the masterpiece transition
      document.body.style.overflow = 'hidden';

      // Reset columns to starting position (below screen) with curved pill tops
      gsap.set('.transition-col', {
        y: '100%',
        borderTopLeftRadius: '100px',
        borderTopRightRadius: '100px',
        borderBottomLeftRadius: '0px',
        borderBottomRightRadius: '0px',
        autoAlpha: 1 // Uses visibility + opacity instead of display: none
      });

      // 1. Sweep UP to cover screen
      tl.to('.col-layer-1', { y: '0%', borderTopLeftRadius: '0px', borderTopRightRadius: '0px', duration: 0.8, stagger: 0.05, ease: 'expo.inOut' }, 0)
        .to('.col-layer-2', { y: '0%', borderTopLeftRadius: '0px', borderTopRightRadius: '0px', duration: 0.8, stagger: 0.05, ease: 'expo.inOut' }, 0.1)
        .to('.col-layer-3', { y: '0%', borderTopLeftRadius: '0px', borderTopRightRadius: '0px', duration: 0.8, stagger: 0.05, ease: 'expo.inOut' }, 0.2);

      // 2. Mid-point: Screen is COMPLETELY covered by Layer 3. 
      // Instantly swap the DOM. No cross-fading, no lag!
      tl.call(() => {
        setDisplayActive(isActive);
        // Reset incoming page opacity instantly
        gsap.set(pageContainerRef.current, { opacity: 1 });
      }, [], 1.1);

      // 3. Sweep UP to leave screen (exit through the top) with curved bottoms
      tl.to('.col-layer-1', { y: '-100%', borderBottomLeftRadius: '100px', borderBottomRightRadius: '100px', duration: 0.8, stagger: 0.05, ease: 'expo.inOut' }, 1.2)
        .to('.col-layer-2', { y: '-100%', borderBottomLeftRadius: '100px', borderBottomRightRadius: '100px', duration: 0.8, stagger: 0.05, ease: 'expo.inOut' }, 1.3)
        .to('.col-layer-3', { y: '-100%', borderBottomLeftRadius: '100px', borderBottomRightRadius: '100px', duration: 0.8, stagger: 0.05, ease: 'expo.inOut' }, 1.4)
        .call(() => {
          gsap.set('.transition-col', { autoAlpha: 0 }); // Hide smoothly
          document.body.style.overflow = '';
          isAnimating.current = false;
        });
    }
  }, [isActive, displayActive]);

  // 5 elegant slices per layer
  const columns = [0, 1, 2, 3, 4];

  return (
    <div ref={containerRef} className="relative w-full min-h-screen">
      
      {/* ── Active Page Content ── */}
      <div ref={pageContainerRef} className="relative w-full min-h-screen z-0">
        {displayActive ? backComponent : children}
      </div>

      {/* ── The Masterpiece Curved Shutter Sweep (Fixed Overlay) ── */}
      
      {/* Layer 1: Charcoal Base */}
      <div className="fixed inset-0 z-[9997] pointer-events-none flex overflow-hidden">
        {columns.map(i => (
          <div key={`l1-${i}`} className="col-layer-1 transition-col flex-1 h-full bg-[#111111] will-change-transform opacity-0 invisible" style={{ transform: 'translateY(100%) scaleX(1.05)' }} />
        ))}
      </div>

      {/* Layer 2: Aesthetic Brand Pink */}
      <div className="fixed inset-0 z-[9998] pointer-events-none flex overflow-hidden">
        {columns.map(i => (
          <div key={`l2-${i}`} className="col-layer-2 transition-col flex-1 h-full bg-[#E58B88] will-change-transform opacity-0 invisible" style={{ transform: 'translateY(100%) scaleX(1.05)' }} />
        ))}
      </div>

      {/* Layer 3: Cinematic Obsidian Black */}
      <div className="fixed inset-0 z-[9999] pointer-events-none flex overflow-hidden">
        {columns.map(i => (
          <div key={`l3-${i}`} className="col-layer-3 transition-col flex-1 h-full bg-[#0a0a0a] will-change-transform opacity-0 invisible" style={{ transform: 'translateY(100%) scaleX(1.05)' }} />
        ))}
      </div>

    </div>
  );
}
