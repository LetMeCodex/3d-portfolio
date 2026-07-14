import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { GooeyText } from './ui/gooey-text-morphing';

export function BrandSignature() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Endless majestic rotations
      gsap.to('.spin-slow', { rotation: 360, duration: 40, repeat: -1, ease: 'none', transformOrigin: 'center' });
      gsap.to('.spin-slow-reverse', { rotation: -360, duration: 30, repeat: -1, ease: 'none', transformOrigin: 'center' });
      
      // Beating inner core
      gsap.to('.pulse-glow', { 
        scale: 1.2, 
        opacity: 0.8, 
        duration: 3, 
        yoyo: true, 
        repeat: -1, 
        ease: 'sine.inOut' 
      });
      
      // Interactive hover timeline for the name
      const tl = gsap.timeline({ paused: true });
      tl.to('.underline-glow', { width: '100%', duration: 0.8, ease: 'power4.out', opacity: 1 });
      
      const el = containerRef.current;
      if (el) {
        el.addEventListener('mouseenter', () => tl.play());
        el.addEventListener('mouseleave', () => tl.reverse());
      }
      
      return () => {
        if (el) {
          el.removeEventListener('mouseenter', () => tl.play());
          el.removeEventListener('mouseleave', () => tl.reverse());
        }
      };
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="hidden md:flex items-center group cursor-pointer select-none">
      {/* Aesthetic Motif / Masterpiece Emblem */}
      <div className="relative flex items-center justify-center w-10 h-10 mr-4">
        {/* Ethereal background aura */}
        <div className="absolute inset-0 bg-white/5 rounded-full blur-[4px] group-hover:bg-[#FF69B4]/10 group-hover:blur-[8px] transition-all duration-1000"></div>
        
        {/* Outer Orbital Ring - Thinner for minimalism */}
        <div className="absolute inset-0 border-[0.5px] border-white/20 rounded-full spin-slow">
          <div className="absolute -top-[1px] left-[50%] -translate-x-1/2 w-[2px] h-[2px] bg-white rounded-full"></div>
        </div>
        
        {/* Inner dashed orbital ring */}
        <div className="absolute inset-[4px] border-[0.5px] border-white/10 rounded-full spin-slow-reverse border-dashed"></div>

        {/* Simplified Sacred Geometry Star */}
        <svg className="absolute w-[18px] h-[18px] text-white/40 spin-slow-reverse" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M50 0 L 55 45 L 100 50 L 55 55 L 50 100 L 45 55 L 0 50 L 45 45 Z" />
        </svg>

        {/* Central Beating Core */}
        <div className="absolute w-[2px] h-[2px] bg-white rounded-full pulse-glow shadow-[0_0_8px_1px_rgba(255,255,255,0.5)]"></div>
      </div>

      {/* Name Typography */}
      <div className="relative pt-1">
        <div className="h-[1.5rem] w-48 relative overflow-hidden">
          <GooeyText 
            texts={["DISHA JAIN", "CREATIVE DEV", "DISHA JAIN", "BASED IN INDIA"]}
            morphTime={1.5}
            cooldownTime={4}
            className="font-sans tracking-[0.2em] w-full h-full"
            textClassName="font-bold text-[0.85rem] text-white opacity-80 group-hover:opacity-100 transition-opacity duration-500 whitespace-nowrap"
          />
        </div>
        
        {/* Hover animated elegant line */}
        <div className="underline-glow absolute -bottom-1 left-0 w-0 h-[1px] bg-white/40 opacity-0"></div>
      </div>
    </div>
  );
}
