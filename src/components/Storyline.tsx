"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const storyData = [
  { text: "TEXT EFFECT", span: "WOAH" },
  { text: "GSAP", span: "AND CLIPPING" },
  { text: "CRAZYYY", span: "CRAZYYY" },
  { text: "PORTFOLIO", span: "DEVELOPER" },
  { text: "DISHA JAIN", span: "LET'S CONNECT" },
];

export function Storyline() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const textElements = gsap.utils.toArray('.story-reveal-text');

      textElements.forEach((text: any) => {
        gsap.to(text, {
          backgroundSize: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: text,
            start: 'top 85%',
            end: 'top 50%',
            scrub: true,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="storyline" 
      className="relative w-full py-32 px-6 md:px-12 bg-[#050505] overflow-hidden"
    >
      <div ref={containerRef} className="max-w-7xl mx-auto flex flex-col items-start justify-center min-h-[150vh]">
        
        {/* Aesthetic Label */}
        <div className="flex items-center gap-6 mb-24 md:mb-32">
          <span className="h-[1px] w-16 bg-[#fbff13]/40 block rounded-full"></span>
          <p className="font-mono text-sm uppercase tracking-[0.4em] font-medium text-white/40">
            Evolution & Story
          </p>
        </div>

        {/* The Animated Text Rows */}
        <div className="flex flex-col w-full gap-2 md:gap-4">
          {storyData.map((item, index) => (
            <div 
              key={index} 
              className="story-reveal-text group relative w-full py-8 md:py-12 border-b border-white/5 cursor-crosshair overflow-hidden"
              style={{
                fontSize: 'clamp(3rem, 10vw, 10rem)',
                letterSpacing: '-.02em',
                lineHeight: '100%',
                color: 'rgba(255, 255, 255, 0.05)',
                backgroundImage: 'linear-gradient(to right, white, white)',
                backgroundRepeat: 'no-repeat',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                backgroundSize: '0%',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                transition: 'background-size cubic-bezier(.1,.5,.5,1) 0.6s'
              }}
            >
              {item.text}
              
              {/* Overlay Span with Clipping */}
              <span 
                className="absolute inset-0 w-full h-full bg-[#fbff13] text-[#0D0D0D] flex flex-col justify-center px-0 z-10 pointer-events-none"
                style={{
                  clipPath: 'polygon(0 50%, 100% 50%, 100% 50%, 0 50%)',
                  transformOrigin: 'center',
                  transition: 'all cubic-bezier(.1,.5,.5,1) 0.5s',
                }}
              >
                <span className="group-hover:clip-reveal transition-all">
                   {item.span}
                </span>
              </span>

              {/* Hover Logic Style Injection */}
              <style dangerouslySetInnerHTML={{ __html: `
                .story-reveal-text:hover > span {
                  clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%) !important;
                }
              `}} />
            </div>
          ))}
        </div>

        {/* Narrative Footer */}
        <div className="mt-32 max-w-2xl">
          <p className="text-white/40 font-sans text-xl leading-relaxed font-light">
            Merging the logical precision of code with the emotional resonance of visual design to build high-fidelity digital experiences.
          </p>
        </div>

      </div>
    </section>
  );
}
