import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { Download } from 'lucide-react';
import { AnimatedCornerButton } from './ui/animated-corner-btn';

interface CVViewerProps {
  isActive: boolean;
  coords: { x: number; y: number };
  onClose: () => void;
}

export function CVViewer({ isActive, coords, onClose }: CVViewerProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const ripple1Ref = useRef<HTMLDivElement>(null);
  const ripple2Ref = useRef<HTMLDivElement>(null);
  const ripple3Ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isActive) {
      setShouldRender(true);
    } else {
      // Exit animation
      if (shouldRender && containerRef.current) {
        const tl = gsap.timeline({
          onComplete: () => setShouldRender(false)
        });
        
        tl.to(contentRef.current, { opacity: 0, scale: 0.95, duration: 0.5, ease: 'power2.inOut' })
          .to([ripple3Ref.current, ripple2Ref.current, ripple1Ref.current], {
             scale: 0,
             opacity: 0,
             duration: 0.8,
             stagger: 0.1,
             ease: 'power3.inOut'
          }, "-=0.3");
      }
    }
  }, [isActive, shouldRender]);

  useEffect(() => {
    if (isActive && shouldRender && containerRef.current) {
      // Enter animation
      const radius = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2) * 1.5;
      const tl = gsap.timeline();
      
      gsap.set([ripple1Ref.current, ripple2Ref.current, ripple3Ref.current], {
        scale: 0, opacity: 0, transformOrigin: 'center center'
      });
      gsap.set(contentRef.current, { opacity: 0, scale: 1.05 });

      tl.to(ripple1Ref.current, { scale: 1, opacity: 1, duration: 1.0, ease: 'expo.inOut' }, 0)
        .to(ripple2Ref.current, { scale: 1, opacity: 1, duration: 1.0, ease: 'expo.inOut' }, 0.1)
        .to(ripple3Ref.current, { scale: 1, opacity: 1, duration: 1.0, ease: 'expo.inOut' }, 0.2)
        .to(contentRef.current, { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }, 0.7);
    }
  }, [isActive, shouldRender]);

  if (!shouldRender) return null;

  const radius = typeof window !== 'undefined' ? Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2) * 1.5 : 2000;

  return (
    <div ref={containerRef} className="fixed inset-0 z-[200] overflow-hidden pointer-events-auto flex items-center justify-center">
      {/* Ripples */}
      <div 
        ref={ripple1Ref}
        className="absolute rounded-full pointer-events-none"
        style={{
          left: coords.x, top: coords.y,
          width: radius * 2, height: radius * 2,
          marginLeft: -radius, marginTop: -radius,
          background: 'radial-gradient(circle, #E58B88 0%, #D46A6A 100%)',
        }}
      />
      <div 
        ref={ripple2Ref}
        className="absolute rounded-full pointer-events-none"
        style={{
          left: coords.x, top: coords.y,
          width: radius * 2, height: radius * 2,
          marginLeft: -radius, marginTop: -radius,
          background: 'radial-gradient(circle, #FCFBFF 0%, #F5F2ED 100%)',
        }}
      />
      <div 
        ref={ripple3Ref}
        className="absolute rounded-full pointer-events-none bg-[#0a0a0a]"
        style={{
          left: coords.x, top: coords.y,
          width: radius * 2, height: radius * 2,
          marginLeft: -radius, marginTop: -radius,
        }}
      />

      {/* Content */}
      <div ref={contentRef} className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4 md:p-12">
        <div className="absolute top-8 left-8 z-[210]">
           <AnimatedCornerButton
             onClick={onClose}
             drawerTop="GO"
             drawerBottom="BACK"
             variant="light"
           >
             Return
           </AnimatedCornerButton>
        </div>

        <div className="absolute top-8 right-8 z-[210]">
           <a 
             href="/assets/disha-cv.png" 
             download="Disha_Jain_CV.png"
             className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md border border-white/20 transition-all group"
           >
              <Download size={18} className="group-hover:-translate-y-0.5 transition-transform" />
              <span className="font-mono text-xs uppercase tracking-widest font-bold">Download</span>
           </a>
        </div>

        {/* Image Container */}
        <div className="relative w-full max-w-5xl h-[85vh] rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
           <div className="absolute inset-0 bg-[#111] animate-pulse" />
           <img 
             src="/assets/disha-cv.png" 
             alt="Disha Jain CV" 
             className="relative z-10 w-full h-full object-contain bg-[#0a0a0a]"
           />
        </div>
      </div>
    </div>
  );
}
