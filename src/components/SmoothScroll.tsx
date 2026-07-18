import { useEffect, ReactNode } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Detect touch devices to disable Lenis (fixes mobile/tablet scrolling)
function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  );
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    // On touch devices, use native scrolling — Lenis hijacks touch scroll and breaks it
    if (isTouchDevice()) {
      // Still sync ScrollTrigger with native scroll
      ScrollTrigger.defaults({ scroller: window });
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    (window as any).lenis = lenis;

    // Synchronize Lenis scrolling with GSAP ScrollTrigger
    // REMOVED: gsap.globalTimeline.timeScale manipulation that was causing
    // all GSAP animations to stutter during fast scrolling
    lenis.on('scroll', () => {
      ScrollTrigger.update();
    });

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      delete (window as any).lenis;
    };
  }, []);

  return <>{children}</>;
}
