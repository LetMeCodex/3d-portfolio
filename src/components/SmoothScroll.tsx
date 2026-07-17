import { useEffect, ReactNode } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1, // Snappier scroll for better performance on mobile
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    });

    // Synchronize Lenis scrolling perfectly with GSAP ScrollTrigger physics & scale timescale based on velocity
    lenis.on('scroll', (e: any) => {
      ScrollTrigger.update();
      
      const speed = Math.abs(e.velocity || 0);
      // timescale ranges from 1.0 (normal) up to 2.5 (extremely fast scrolling)
      const targetScale = 1.0 + Math.min(speed * 0.18, 1.5);
      
      gsap.to(gsap.globalTimeline, {
        timeScale: targetScale,
        duration: 0.18,
        overwrite: 'auto'
      });
    });

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
