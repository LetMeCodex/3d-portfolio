import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArchitecturalGrid } from './ui/ArchitecturalGrid';

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const globalDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Fit element to parent responsively
    const logoEl = document.querySelector('.logo-animation');
    const handleResize = () => {
      if (!logoEl || !containerRef.current) return;
      gsap.set(logoEl, { scale: 1 });
      const parentWidth = containerRef.current.offsetWidth;
      const logoWidth = 1000;
      // Cap scale at 0.65 on desktop, scale down on mobile with padding
      const padding = window.innerWidth < 640 ? 40 : 80;
      const ratio = Math.min((parentWidth - padding) / logoWidth, 0.65);
      gsap.set(logoEl, { scale: ratio });
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // 2. Set SVG path lengths for contour drawing animation
    const paths = document.querySelectorAll('.logo-letter .line');
    paths.forEach((path) => {
      const p = path as SVGPathElement;
      const length = p.getTotalLength();
      gsap.set(p, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });
    });

    // 3. Set initial positions
    gsap.set('.bounced', {
      y: 180,
      scaleX: 0.25,
      scaleY: 0.3,
      transformOrigin: '50% 100%',
    });
    gsap.set(dotRef.current, {
      x: 230,
      y: -400,
      opacity: 1,
      scale: 1,
    });
    gsap.set(globalDotRef.current, {
      display: 'none',
      scale: 1,
    });

    const tl = gsap.timeline();

    // Lock scrolling
    document.body.style.overflow = 'hidden';

    // 4. Bouncy squishy entrance for letters D, I, S, H, A
    tl.to('.bounced', {
      keyframes: [
        { y: -140, scaleX: 0.85, scaleY: 0.8, duration: 0.25, ease: 'sine.out' },
        { y: 8, scaleX: 1.15, scaleY: 0.35, duration: 0.15, ease: 'sine.in' },
        { y: 0, scaleX: 1, scaleY: 0.5, duration: 0.22, ease: 'sine.out' }
      ],
      stagger: 0.08
    }, 0.3)

    // 5. Staggered stroke drawing
    .to(paths, {
      strokeDashoffset: 0,
      duration: 1.1,
      ease: 'power2.out',
      stagger: 0.08
    }, 0.4)

    // 6. Dot falls down at x=230 and hits body of I
    .to(dotRef.current, {
      y: 100,
      duration: 0.4,
      ease: 'power2.in'
    }, 1.1)

    // 7. Impact: Squish dot and letter I
    .to(dotRef.current, {
      scaleY: 0.4,
      scaleX: 1.6,
      duration: 0.08,
      ease: 'none'
    })
    .to('.letter-i .bounced', {
      scaleY: 0.42,
      duration: 0.08,
      ease: 'none'
    }, '<')

    // 8. Bounce up: Dot rises to head position, I settles
    .to(dotRef.current, {
      y: 30,
      scaleY: 1,
      scaleX: 1,
      duration: 0.22,
      ease: 'power2.out'
    })
    .to('.letter-i .bounced', {
      scaleY: 0.5,
      duration: 0.22,
      ease: 'power2.out'
    }, '<')

    // 9. Wobble settle
    .to(dotRef.current, {
      keyframes: [
        { y: 35, duration: 0.08, ease: 'sine.in' },
        { y: 30, duration: 0.08, ease: 'sine.out' }
      ]
    })

    // 10. Handshake coordinate swap: capture exact viewport position of dot
    .call(() => {
      if (dotRef.current && globalDotRef.current) {
        const rect = dotRef.current.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        // Position global dot at exact coordinates relative to viewport
        gsap.set(globalDotRef.current, {
          left: x,
          top: y,
          xPercent: -50,
          yPercent: -50,
          display: 'block',
        });

        // Instantly hide the nested local dot
        gsap.set(dotRef.current, { opacity: 0 });
      }
    })

    // 11. Scale the unnested global dot to cover the entire screen
    .to(globalDotRef.current, {
      scale: 180,
      duration: 1.1,
      ease: 'power4.in',
    })

    // 12. Fade out container and complete preloading
    .to(containerRef.current, {
      opacity: 0,
      duration: 0.45,
      onComplete: () => {
        document.body.style.overflow = '';
        onComplete();
      }
    }, '-=0.2');

    return () => {
      window.removeEventListener('resize', handleResize);
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div 
      ref={containerRef} 
      className="preloader-container fixed inset-0 z-[99999] bg-[#111013] flex items-center justify-center overflow-hidden"
    >
      <ArchitecturalGrid />

      {/* Global dot used for unclipped screen expansion */}
      <div ref={globalDotRef} className="global-dot" />

      <style>{`
        .main-logo {
          position: relative;
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 600px;
        }

        .logo-animation-wrapper {
          position: relative;
          width: 100%;
          padding-bottom: 24%;
        }

        .logo-animation {
          pointer-events: none;
          overflow: visible;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: absolute;
          top: 50%;
          left: 50%;
          width: 1000px;
          height: 240px;
          margin: -120px 0 0 -500px;
          transform-origin: center center;
          transform: scale(0.65);
        }

        .anime-logo {
          overflow: visible;
          position: relative;
          display: flex;
          flex-direction: column;
          width: 1000px;
          height: 120px;
        }

        .anime-logo-signs {
          overflow: visible;
          display: flex;
          align-items: flex-end;
          position: relative;
          width: 100%;
          height: 512px;
          margin-top: -352px;
        }

        .logo-letter {
          display: flex;
          align-items: flex-end;
          overflow: hidden;
          height: 100%;
        }

        .bounced {
          transform-origin: 50% 100% 0px;
        }

        .logo-animation .dot {
          position: absolute;
          z-index: 10;
          top: 0;
          left: 0;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: #FAF8F5;
          margin: -12px 0 0 -12px;
          will-change: transform;
        }

        .global-dot {
          position: fixed;
          z-index: 100000;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: #FAF8F5;
          pointer-events: none;
          transform-origin: center center;
          will-change: transform;
        }

        .logo-animation svg {
          overflow: visible;
          fill: none;
        }

        .logo-animation .line {
          fill: none;
          stroke-linecap: round;
          stroke-width: 24;
          stroke: #FAF8F5;
        }
      `}</style>

      <div className="main-logo">
        <div className="logo-animation-wrapper">
          <div className="logo-animation">
            <div className="anime-logo">
              <div className="anime-logo-signs">
                
                {/* D */}
                <div className="logo-letter letter-d" style={{ width: '200px' }}>
                  <svg className="bounced" viewBox="0 0 200 240" width="200" height="240">
                    <path className="line" d="M50 220V20h50c35 0 70 20 70 70v60c0 50-35 70-70 70H50" />
                  </svg>
                </div>

                {/* I */}
                <div className="logo-letter letter-i" style={{ width: '60px' }}>
                  <svg className="bounced" viewBox="0 0 60 240" width="60" height="240">
                    <path className="line" d="M30 100v120" />
                  </svg>
                </div>

                {/* S */}
                <div className="logo-letter letter-s" style={{ width: '200px' }}>
                  <svg className="bounced" viewBox="0 0 200 240" width="200" height="240">
                    <path className="line" d="M160 30H70c-20 0-30 20-30 45s10 45 30 45h60c20 0 30 20 30 45s-10 45-30 45H40" />
                  </svg>
                </div>

                {/* H */}
                <div className="logo-letter letter-h" style={{ width: '200px' }}>
                  <svg className="bounced" viewBox="0 0 200 240" width="200" height="240">
                    <path className="line" d="M40 220V20M40 120h120M160 20v200" />
                  </svg>
                </div>

                {/* A */}
                <div className="logo-letter letter-a" style={{ width: '200px' }}>
                  <svg className="bounced" viewBox="0 0 200 240" width="200" height="240">
                    <path className="line" d="M30 20h130c9.996 0 10 40 10 60v140H41c-11.004 0-11-40-11-60s-.004-60 10-60h110" />
                  </svg>
                </div>

                {/* Local anim dot */}
                <div ref={dotRef} className="dot" />

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
