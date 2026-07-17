import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';

gsap.registerPlugin(ScrollTrigger);

export function FoodieSpecial() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const paths = svgRef.current.querySelectorAll('path');
    
    // Initial state: Hidden strokes
    paths.forEach((path) => {
      const length = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        fill: 'transparent',
        stroke: '#1c2135',
        strokeWidth: 1.5,
      });
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=1500",
          scrub: true,
          pin: true,
          anticipatePin: 1,
        }
      });

      tl.fromTo(".pizza-header", 
        { opacity: 0, y: -20, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 },
        "start"
      );

      tl.to(paths, {
        strokeDashoffset: 0,
        duration: 2,
        ease: "power2.inOut",
        stagger: 0.1
      });

      tl.to(".pizza-crust", { fill: "#E5CF8E", stroke: "#93622C", duration: 1 }, "fill")
        .to(".pizza-main", { fill: "#F2D492", stroke: "#93622C", duration: 1 }, "fill")
        .to(".pizza-veggies", { fill: "#63813A", stroke: "#3d5024", duration: 1 }, "fill")
        .to(".pizza-pepperoni", { fill: "#B73917", stroke: "#7a260f", duration: 1 }, "fill")
        .to(".pizza-olives", { fill: "#16152D", stroke: "#000", duration: 1 }, "fill")
        .to(".pizza-toppings", { fill: "#BFB8A3", stroke: "#8a8475", duration: 1 }, "fill");

      tl.fromTo(textRef.current, 
        { opacity: 0, y: 30, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.5, ease: "back.out(1.7)" },
        "-=0.5"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#F5F4F0] overflow-hidden flex flex-col items-center justify-center py-12 px-4"
    >
      {/* Architectural Grid Background for consistency */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]" 
        style={{ 
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
          backgroundSize: '3rem 3rem'
        }} 
      />

      <div className="relative z-10 flex flex-col items-center max-w-4xl w-full">
        {/* Subtle Header */}
        <div className="pizza-header mb-8 text-center opacity-0">
            <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-[#1c2135]/40 block mb-4">
                Special Delivery
            </span>
            <h2 className="font-serif italic text-4xl md:text-5xl text-[#1c2135]">
                A Slice of Happiness
            </h2>
        </div>

        {/* The Animated Pizza SVG */}
        <div className="w-full max-w-[280px] md:max-w-[380px] aspect-square relative drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
            <svg 
                ref={svgRef}
                viewBox="0 0 293.6 338.7" 
                className="w-full h-full"
                preserveAspectRatio="xMidYMid meet"
            >
                <g>
                    <path className="pizza-crust" d="M268.2,201.3l-12.3,3l-80.2,19.2l-15.5,3.7l-89.7,21.4l-51.9,12.4L1,265.1l44.3-85.4l14.5-28l30.4-58.6l23.4-45.1l8.1-15.5l5.8-11.3L268.2,201.3z"/>
                    <path className="pizza-main" d="M257.1,205.8L120.4,30.9c-3.7-4.8-2.9-11.7,1.9-15.4l16.8-13.1c4.8-3.7,11.7-2.9,15.4,1.9l136.7,174.9c3.7,4.8,2.9,11.7-1.9,15.4l-16.8,13.1C267.8,211.5,260.9,210.6,257.1,205.8z"/>
                    <path className="pizza-veggies" d="M77.7,233.4l-11.8-8.2l18.8-27.2l11.8,8.2L77.7,233.4z"/>
                    <path className="pizza-veggies" d="M115.3,137.6l-6.7-12.7l29.2-15.4l6.7,12.7L115.3,137.6z"/>
                    <path className="pizza-veggies" d="M175.6,223.4l-15.5,3.7l4.1-19.4l14.1,3L175.6,223.4z"/>
                    <path className="pizza-pepperoni" d="M70.4,248.5l-51.9,12.4c-2.4-9.9,1-20.7,9.5-27.3c11.6-9.1,28.4-7,37.4,4.6C68,241.3,69.6,244.8,70.4,248.5z"/>
                    <path className="pizza-pepperoni" d="M217,206.1c-11.6,9.1-28.4,7-37.4-4.6s-7-28.4,4.6-37.4c11.6-9.1,28.4-7,37.4,4.6S228.6,197,217,206.1z"/>
                    <path className="pizza-pepperoni" d="M125.6,95.4c-10.8,8.4-26,7.3-35.3-2.2l23.4-45.1c6.3,1.1,12.3,4.4,16.5,9.9C139.2,69.5,137.2,86.3,125.6,95.4z"/>
                    <path className="pizza-olives" d="M81,159.2c-5.2-6.6-13.5-9.2-21.1-7.5l-14.5,28c0.7,1.8,1.7,3.5,2.9,5c7.1,9.1,20.1,10.7,29.2,3.6C86.4,181.3,88,168.2,81,159.2z M54.4,179.9c-4.4-5.6-3.4-13.7,2.2-18.1c5.6-4.4,13.7-3.4,18.1,2.2c4.4,5.6,3.4,13.7-2.2,18.1C66.9,186.5,58.8,185.5,54.4,179.9z"/>
                    <path className="pizza-toppings" d="M114.4,161.7c1.5-6,7-10.4,12.3-11.7c16.6-4.1,40.4,17.8,35.9,35.1c-1.2,4.5-5.1,10.9-11.6,12.1c-5.5,1-11.4-1.8-15.5-7c-2.4,2.7-4.8,5.4-7.2,8.1c-2.4,2.7-4.8,5.4-7.2,8.1c-4.6-3.8-9.1-7.6-13.7-11.4c4.9-5.8,9.7-11.6,14.6-17.4C114.6,172.2,112.7,168.7,114.4,161.7z"/>
                    <path className="pizza-crust" d="M50.7,253.2v62.7c0,5.4-4,9.7-9,9.7h0c-5,0-9-4.4-9-9.7v-24.3H18.1V329c0,5.4-4,9.7-9,9.7h0c-5,0-9-4.4-9-9.7l1-63.9L50.7,253.2z"/>
                </g>
            </svg>
        </div>

        {/* The Cute Message */}
        <div ref={textRef} className="mt-16 text-center space-y-6 px-6 opacity-0">
            <p className="font-serif italic text-2xl md:text-3xl text-[#E58B88] max-w-lg">
                "To the one whose love for pizza is only rivaled by her love for... well, more pizza."
            </p>
            <div className="flex flex-col items-center gap-6">
                <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#1c2135]/40">
                    My favorite foodie cutiee forever 🍕✨
                </span>
            </div>
        </div>
      </div>

      {/* Decorative Orbs for the vibe */}
      <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-[#E5CF8E]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-[#B73917]/5 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
