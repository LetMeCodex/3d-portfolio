import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function CakeSpecial() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Elements to animate
    const plateGroup = '#plate-group';
    const cakeParts = ['#cake-base', '#cake-filling', '#cake-top-group', '.red-berry'];
    const whipCream = '.whip-cream-dollop';
    const cherry = '#cherry-group';

    // Initial State
    gsap.set([plateGroup, '#cake-group', cherry], { opacity: 0 });
    gsap.set(plateGroup, { scale: 0.8, transformOrigin: "center center" });
    gsap.set('.sauce-swirl', { strokeDasharray: 600, strokeDashoffset: 600 });
    gsap.set('.sauce-drop', { scale: 0, transformOrigin: "center" });
    gsap.set(cakeParts, { opacity: 0, y: 50 });
    gsap.set(whipCream, { scale: 0, opacity: 0, transformOrigin: "bottom center" });
    gsap.set(cherry, { scale: 0, transformOrigin: "bottom center" });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=2000",
          scrub: 1.5,
          pin: true,
          anticipatePin: 1,
        }
      });

      tl.fromTo(".cake-header", 
        { opacity: 0, y: -20, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 }
      );

      // 1. Reveal Plate first
      tl.to(plateGroup, { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.2)" });

      // 2. Plate Sauce Drawing
      tl.to('.sauce-swirl', { strokeDashoffset: 0, duration: 2.5, ease: "power2.inOut" }, "-=0.2")
        .to('.sauce-drop', { scale: 1, opacity: 1, stagger: 0.15, duration: 0.6, ease: "back.out(2)" }, "-=1.5");

      // 3. Reveal and Build Cake
      tl.to('#cake-group', { opacity: 1, duration: 0.1 }) // Make the group visible
        .to(cakeParts, { 
          opacity: 1, 
          y: 0, 
          stagger: 0.4, 
          duration: 1.2, 
          ease: "power4.out" 
        }, "-=0.1");

      // 4. Whip Cream Popping
      tl.to(whipCream, { 
        scale: 1, 
        opacity: 1, 
        stagger: 0.2, 
        duration: 0.8, 
        ease: "back.out(3)" 
      }, "-=0.8");

      // 5. Cherry Placement
      tl.to(cherry, { 
        scale: 1,
        opacity: 1, 
        duration: 1.2, 
        ease: "back.out(2)" 
      });

      tl.fromTo(textRef.current,
        { opacity: 0, y: 30, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.5, ease: "back.out(1.7)" },
        "-=0.5"
      );
    }, containerRef); // Scope to containerRef

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#F5F4F0] overflow-hidden flex flex-col items-center justify-center py-20 px-4"
    >
      <div className="cake-header mb-12 text-center opacity-0">
        <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-[#1c2135]/40 block mb-4">
          Patisserie Special
        </span>
        <h2 className="font-serif italic text-4xl md:text-5xl text-[#3d2111]">
          A Piece of Perfection
        </h2>
      </div>

      <div className="relative w-full max-w-[500px] aspect-square">
        <svg 
          ref={svgRef}
          viewBox="0 0 500 500" 
          className="w-full h-full drop-shadow-[0_50px_100px_rgba(0,0,0,0.1)]"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Plate Group */}
          <g id="plate-group">
            <ellipse cx="250" cy="400" rx="220" ry="90" fill="white" />
            <ellipse cx="250" cy="395" rx="215" ry="85" fill="#fcfcfc" stroke="#eeeeee" strokeWidth="1" />
            
            <path className="sauce-swirl sauce-detail" d="M140 420 Q250 490 440 420" stroke="#2a160b" strokeWidth="10" strokeLinecap="round" fill="none" />
            <circle className="sauce-drop sauce-detail" cx="120" cy="400" r="6" fill="#2a160b" />
            <circle className="sauce-drop sauce-detail" cx="110" cy="375" r="5" fill="#2a160b" />
            <circle className="sauce-drop sauce-detail" cx="115" cy="350" r="4" fill="#2a160b" />
          </g>

          {/* Cake Assembly Group */}
          <g id="cake-group" transform="translate(180, 180)">
            {/* Cake Sponge Layers */}
            <path id="cake-base" d="M0 180 L180 180 L180 120 L0 120 Z" fill="#5c341b" />
            <path id="cake-filling" d="M0 120 L180 120 L180 80 L0 80 Z" fill="#e5c1a0" />
            
            {/* Top Dark Chocolate Layer Group */}
            <g id="cake-top-group">
                <path d="M0 80 L180 80 L100 20 Z" fill="#3d2111" />
                <path d="M180 80 L180 180 L220 150 L220 50 L180 80" fill="#2d180d" />
                <path d="M180 80 L100 20 L140 -10 L220 50 L180 80" fill="#3d2111" />
                <g id="icing-stripes">
                    <path d="M40 70 L100 25" stroke="white" strokeWidth="3" opacity="0.8" />
                    <path d="M80 80 L140 35" stroke="white" strokeWidth="3" opacity="0.8" />
                </g>
            </g>

            {/* Whipped Cream Dollops */}
            <g className="whip-cream-dollops">
              <circle className="whip-cream-dollop" cx="100" cy="20" r="15" fill="white" />
              <circle className="whip-cream-dollop" cx="120" cy="10" r="15" fill="#f9f9f9" />
              <circle className="whip-cream-dollop" cx="145" cy="5" r="15" fill="white" />
              <circle className="whip-cream-dollop" cx="170" cy="15" r="15" fill="#f9f9f9" />
            </g>

            {/* Red berries on top */}
            <circle className="red-berry" cx="60" cy="70" r="4" fill="#b81c2c" />
            <circle className="red-berry" cx="90" cy="50" r="4" fill="#b81c2c" />
          </g>

          {/* Cherry resting on the plate swirl (PLACED LAST) */}
          <g id="cherry-group" transform="translate(380, 410)">
            <circle id="cherry-body" cx="0" cy="0" r="18" fill="#b81c2c" />
            <path id="cherry-stem" d="M0 -18 Q15 -70 50 -60" stroke="#4a2c2a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </g>
        </svg>
      </div>

      <div ref={textRef} className="mt-16 text-center space-y-4 opacity-0 px-6">
        <p className="font-serif italic text-2xl md:text-3xl text-[#3d2111] max-w-lg">
          "Life is short, eat the cake first—especially if it's this aesthetic."
        </p>
        <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#1c2135]/40">
          The ultimate patisserie experience 🍰✨
        </span>
      </div>
    </section>
  );
}
