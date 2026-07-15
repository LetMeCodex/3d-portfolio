import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function HomeIntro() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const handRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const lineH1Ref = useRef<HTMLDivElement>(null);
  const lineH2Ref = useRef<HTMLDivElement>(null);
  const lineV1Ref = useRef<HTMLDivElement>(null);
  const lineV2Ref = useRef<HTMLDivElement>(null);

  // Mouse hover state for floating technical widgets
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const compassRef = useRef<HTMLDivElement>(null);
  const spiralRef = useRef<HTMLDivElement>(null);

  const part1 = "Hello, I'm ".split("");
  const part2 = "Disha Jain".split("");
  const sentence = "A creative developer specializing in high-fidelity interfaces, fluid motion design, and engineering products that feel alive.";
  const words = sentence.split(" ");

  useEffect(() => {
    // 1. Technical Drafting Lines self-drawing animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      }
    });

    tl.fromTo(lineH1Ref.current, { scaleX: 0 }, { scaleX: 1, duration: 1.0, ease: 'power3.out' })
      .fromTo(lineH2Ref.current, { scaleX: 0 }, { scaleX: 1, duration: 1.0, ease: 'power3.out' }, '<0.2')
      .fromTo(lineV1Ref.current, { scaleY: 0 }, { scaleY: 1, duration: 1.0, ease: 'power3.out' }, '<0.2')
      .fromTo(lineV2Ref.current, { scaleY: 0 }, { scaleY: 1, duration: 1.0, ease: 'power3.out' }, '<0.2');

    // 2. Character-by-character elastic scatter reveal for the big name title
    if (nameRef.current) {
      const chars = nameRef.current.querySelectorAll('.name-char');
      gsap.fromTo(chars,
        {
          opacity: 0,
          y: () => Math.random() * 100 - 50,
          x: () => Math.random() * 30 - 15,
          scale: 0.3,
          rotate: () => Math.random() * 60 - 30
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          rotate: 0,
          duration: 1.1,
          stagger: {
            each: 0.03,
            from: "random"
          },
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
          onComplete: () => {
            // Pop the waving hand emoji
            if (handRef.current) {
              gsap.to(handRef.current, {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                ease: "back.out(2)"
              });
            }
          }
        }
      );
    }

    // 3. Word-by-word typewriter slide-up stagger reveal for the description
    if (headlineRef.current) {
      gsap.fromTo(headlineRef.current.children,
        { y: 60, opacity: 0, rotate: 1.5 },
        {
          y: 0,
          opacity: 1,
          rotate: 0,
          stagger: 0.04,
          duration: 0.9,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }

    // 4. Coordinate tracker tracking mouse move for magnetic reaction
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      setMousePos({ x: clientX, y: clientY });

      // Apply subtle magnetic repulsion/attraction to SVGs
      if (compassRef.current && spiralRef.current) {
        const compassRect = compassRef.current.getBoundingClientRect();
        const spiralRect = spiralRef.current.getBoundingClientRect();

        const cx1 = compassRect.left + compassRect.width / 2;
        const cy1 = compassRect.top + compassRect.height / 2;
        const dist1 = Math.hypot(clientX - cx1, clientY - cy1);

        const cx2 = spiralRect.left + spiralRect.width / 2;
        const cy2 = spiralRect.top + spiralRect.height / 2;
        const dist2 = Math.hypot(clientX - cx2, clientY - cy2);

        // Repel within 250px proximity
        if (dist1 < 250) {
          const force = (250 - dist1) / 10;
          const angle = Math.atan2(cy1 - clientY, cx1 - clientX);
          gsap.to(compassRef.current, {
            x: Math.cos(angle) * force,
            y: Math.sin(angle) * force,
            rotate: 15 + force * 2,
            duration: 0.6,
            ease: 'power2.out'
          });
        } else {
          gsap.to(compassRef.current, { x: 0, y: 0, rotate: 15, duration: 1 });
        }

        if (dist2 < 250) {
          const force = (250 - dist2) / 10;
          const angle = Math.atan2(cy2 - clientY, cx2 - clientX);
          gsap.to(spiralRef.current, {
            x: Math.cos(angle) * force,
            y: Math.sin(angle) * force,
            rotate: -20 - force * 2,
            duration: 0.6,
            ease: 'power2.out'
          });
        } else {
          gsap.to(spiralRef.current, { x: 0, y: 0, rotate: -20, duration: 1 });
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative min-h-[100vh] w-full flex flex-col items-center justify-center overflow-hidden px-8 pt-32 pb-40 bg-transparent select-none z-10"
    >
      {/* ─── Architectural Drafting Lines overlaying this section ─── */}
      {/* Horizontal Top Guide Line */}
      <div 
        ref={lineH1Ref} 
        className="absolute top-16 left-[10%] right-[10%] h-[1px] bg-[#1c2135]/10 origin-left"
      >
        <span className="absolute left-0 -top-3 font-mono text-[7px] text-black/20">GRID_REF: [H-01]</span>
        <span className="absolute right-0 -top-3 font-mono text-[7px] text-black/20">0,0.48px</span>
      </div>

      {/* Horizontal Bottom Guide Line */}
      <div 
        ref={lineH2Ref} 
        className="absolute bottom-20 left-[10%] right-[10%] h-[1px] bg-[#1c2135]/10 origin-right"
      >
        <span className="absolute left-0 -bottom-3.5 font-mono text-[7px] text-black/20">GRID_REF: [H-02]</span>
        <span className="absolute right-0 -bottom-3.5 font-mono text-[7px] text-black/20">X_CALIBRATED</span>
      </div>

      {/* Vertical Left Guide Line */}
      <div 
        ref={lineV1Ref} 
        className="absolute top-8 bottom-8 left-[10%] w-[1px] bg-[#1c2135]/10 origin-top"
      >
        <span className="absolute top-0 -left-6 font-mono text-[7px] text-black/20 rotate-[-90deg] origin-top-left">AXIS_Y1</span>
      </div>

      {/* Vertical Right Guide Line */}
      <div 
        ref={lineV2Ref} 
        className="absolute top-8 bottom-8 right-[10%] w-[1px] bg-[#1c2135]/10 origin-bottom"
      >
        <span className="absolute bottom-0 -right-2 font-mono text-[7px] text-black/20 rotate-[90deg] origin-bottom-right">AXIS_Y2</span>
      </div>

      {/* Corner Intersection Crosshairs */}
      <div className="absolute top-[60px] left-[9.7%] font-mono text-[10px] text-[#1c2135]/20 font-bold pointer-events-none">+</div>
      <div className="absolute top-[60px] right-[9.7%] font-mono text-[10px] text-[#1c2135]/20 font-bold pointer-events-none">+</div>
      <div className="absolute bottom-[75px] left-[9.7%] font-mono text-[10px] text-[#1c2135]/20 font-bold pointer-events-none">+</div>
      <div className="absolute bottom-[75px] right-[9.7%] font-mono text-[10px] text-[#1c2135]/20 font-bold pointer-events-none">+</div>

      {/* Floating CAD Widget Left: Compass / Protractor */}
      <div 
        ref={compassRef} 
        className="absolute left-[3%] top-[30%] hidden xl:block rotate-[15deg] pointer-events-none filter drop-shadow-sm select-none"
        style={{ transformOrigin: 'center center' }}
      >
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" className="text-[#1c2135]/15">
          <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
          <path d="M 50 5 L 50 95 M 5 50 L 95 50" stroke="currentColor" strokeWidth="0.5" />
          <path d="M 50 50 L 80 20" stroke="currentColor" strokeWidth="1" />
          <path d="M 75 20 A 35 35 0 0 0 50 15" stroke="#E58B88" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="3" fill="#1c2135" />
        </svg>
        <div className="text-[6px] font-mono text-center text-black/20 mt-1">PROTRACTOR_MD-08</div>
      </div>

      {/* Floating CAD Widget Right: Vector Spiral Helix */}
      <div 
        ref={spiralRef} 
        className="absolute right-[3%] bottom-[25%] hidden xl:block rotate-[-20deg] pointer-events-none filter drop-shadow-sm select-none"
        style={{ transformOrigin: 'center center' }}
      >
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" className="text-[#1c2135]/15">
          {/* Fibonacci style nested spiral */}
          <path d="M 50 50 A 5 5 0 0 1 55 50 A 10 10 0 0 1 45 50 A 15 15 0 0 1 60 50 A 20 20 0 0 1 40 50 A 25 25 0 0 1 65 50 A 30 30 0 0 1 35 50" stroke="currentColor" strokeWidth="0.75" />
          <circle cx="50" cy="50" r="1.5" fill="#B2BEE2" />
          <line x1="50" y1="50" x2="35" y2="50" stroke="#B2BEE2" strokeWidth="1" />
        </svg>
        <div className="text-[6px] font-mono text-center text-black/20 mt-1">HELIX_V_CALIBRATOR</div>
      </div>

      {/* Main Content Layout */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
        
        {/* Large, Eye-Catching Greeting Headline */}
        <h1 
          ref={nameRef} 
          className="font-display font-medium text-3xl sm:text-4xl md:text-5xl lg:text-[3rem] xl:text-[3.6rem] text-[#1c2135] mb-8 tracking-tight flex flex-wrap justify-center items-center select-none leading-none gap-x-2"
        >
          <span className="flex">
            {part1.map((char, index) => (
              <span key={index} className="name-char inline-block origin-center" style={{ opacity: 0 }}>
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
          <span className="font-premium-serif text-[#8A7FE8] flex italic font-light">
            {part2.map((char, index) => (
              <span key={index} className="name-char inline-block origin-center" style={{ opacity: 0 }}>
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
          <motion.span 
            ref={handRef}
            animate={{ rotate: [0, -18, 18, -18, 18, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 1.2, ease: "easeInOut" }}
            style={{ display: "inline-block", transformOrigin: "80% 80%", opacity: 0, scale: 0 }}
            className="text-[1.8rem] sm:text-[2.2rem] md:text-[2.6rem] lg:text-[3.2rem] -mt-2 ml-2"
          >
            👋
          </motion.span>
        </h1>

        {/* Masterpiece Split-Word Calligraphy Headline */}
        <h2 
          ref={headlineRef}
          className="font-display font-semibold text-3xl sm:text-4xl md:text-[2.8rem] lg:text-[3.6rem] xl:text-[4.2rem] text-[#1c2135] leading-[1.15] tracking-tight max-w-[90%] md:max-w-[85%] flex flex-wrap justify-center gap-x-3 gap-y-2.5 overflow-hidden py-2 px-4"
        >
          {words.map((word, i) => (
            <span 
              key={i} 
              className="inline-block origin-bottom-left"
              style={{ opacity: 0 }} // initially hidden for GSAP to reveal
            >
              {word}
            </span>
          ))}
        </h2>

        {/* Coordinates status label bottom */}
        <div className="mt-12 flex gap-4 font-mono text-[7px] text-black/25 uppercase tracking-wider">
          <span>SCALE: 1.000</span>
          <span>•</span>
          <span>CURSOR: [{mousePos.x}, {mousePos.y}]</span>
          <span>•</span>
          <span>SYSTEM: READY</span>
        </div>
      </div>
    </div>
  );
}
