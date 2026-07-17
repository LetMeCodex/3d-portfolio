import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lottie from 'lottie-react';
import { Motion3DCanvas } from './ui/Motion3DCanvas';

gsap.registerPlugin(ScrollTrigger);

interface HomeIntroProps {
  onOpenAbout?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function HomeIntro({ onOpenAbout }: HomeIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const lottieRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const buttonWrapperRef = useRef<HTMLDivElement>(null);
  const arrowPathRef = useRef<SVGPathElement>(null);
  const lineH1Ref = useRef<HTMLDivElement>(null);
  const lineH2Ref = useRef<HTMLDivElement>(null);
  const lineV1Ref = useRef<HTMLDivElement>(null);
  const lineV2Ref = useRef<HTMLDivElement>(null);

  // Mouse hover state for floating technical widgets
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const compassRef = useRef<HTMLDivElement>(null);
  const spiralRef = useRef<HTMLDivElement>(null);

  // Lottie Animation state
  const [animationData, setAnimationData] = useState<any>(null);

  const part1 = "Hello, I'm ".split("");
  const part2 = "Disha Jain".split("");
  
  // Tagline segments for Bato-style scroll reveals
  const segments = [
    { text: "A creative ", isSpecial: false },
    { 
      text: "developer", 
      isSpecial: true, 
      img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=400&auto=format&fit=crop"
    },
    { text: " specializing in high-fidelity ", isSpecial: false },
    { 
      text: "interfaces,", 
      isSpecial: true, 
      img: "/about-leakmap.png"
    },
    { text: " fluid ", isSpecial: false },
    { 
      text: "motion", 
      isSpecial: true, 
      is3D: true
    },
    { text: " design, and engineering products that feel ", isSpecial: false },
    { 
      text: "alive.", 
      isSpecial: true, 
      img: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=400&auto=format&fit=crop"
    }
  ];

  useEffect(() => {
    // Dynamically fetch Lottie file
    fetch('/Female%20Character%20Waving.json')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Not in public folder');
      })
      .then((data) => setAnimationData(data))
      .catch(() => {
        // Try fallback location using a variable to prevent compile-time type errors
        const assetPath = '../assets/Female Character Waving.json';
        import(/* @vite-ignore */ assetPath)
          .then((module) => {
            setAnimationData(module.default || module);
          })
          .catch((e) => {
            console.log('Lottie Female Character Waving.json file not loaded yet:', e);
          });
      });
  }, []);

  useEffect(() => {
    // 1. Technical Drafting Lines self-drawing animation (starts at top 80% and plays on every entry)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'restart reverse restart reverse',
      }
    });

    tl.fromTo(lineH1Ref.current, { scaleX: 0 }, { scaleX: 1, duration: 1.0, ease: 'power3.out' })
      .fromTo(lineH2Ref.current, { scaleX: 0 }, { scaleX: 1, duration: 1.0, ease: 'power3.out' }, '<0.2')
      .fromTo(lineV1Ref.current, { scaleY: 0 }, { scaleY: 1, duration: 1.0, ease: 'power3.out' }, '<0.2')
      .fromTo(lineV2Ref.current, { scaleY: 0 }, { scaleY: 1, duration: 1.0, ease: 'power3.out' }, '<0.2');

    // 2. Coordinated GSAP scroll timeline for name title entry
    const textTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        toggleActions: 'restart reverse restart reverse',
      }
    });

    // Step A: Character-by-character elastic scatter reveal for greeting title
    if (nameRef.current) {
      const chars = nameRef.current.querySelectorAll('.name-char, .disha-char');
      textTimeline.fromTo(chars,
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
          duration: 1.0,
          stagger: {
            each: 0.03,
            from: "random"
          },
          ease: "back.out(1.8)"
        }
      );
    }

    // Step B: Pop the Lottie Character animation (starts slightly before the name finishes scattering)
    if (lottieRef.current) {
      textTimeline.fromTo(lottieRef.current,
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.8)"
        },
        "-=0.3"
      );
    }

    // Step B2: Pop the Avatar Circular Image (simultaneously with Lottie)
    if (avatarRef.current) {
      textTimeline.fromTo(avatarRef.current,
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.8)"
        },
        "<"
      );
    }

    // Step C: Scale-reveal the "What I Bring to the Table?" badge
    if (badgeRef.current) {
      textTimeline.fromTo(badgeRef.current,
        {
          opacity: 0,
          scaleX: 0.4,
          y: 20
        },
        {
          opacity: 1,
          scaleX: 1,
          y: 0,
          duration: 0.6,
          ease: "back.out(1.5)"
        },
        "-=0.2"
      );
    }

    // Step D: Buttery smooth stagger color reveal for all description characters on scroll
    if (headlineRef.current) {
      const scrollChars = headlineRef.current.querySelectorAll('.scroll-char');
      if (scrollChars.length > 0) {
        gsap.fromTo(scrollChars,
          { color: "rgba(28, 33, 53, 0.25)" },
          {
            color: "#E35F38", // Warm theme orange color
            stagger: 0.015,
            scrollTrigger: {
              trigger: headlineRef.current,
              start: "top 88%",
              end: "bottom 38%",
              scrub: true,
            }
          }
        );
      }
    }

    // Step E: Word image reveal slides tied directly to scroll (scrubbed for absolute fluid timing)
    if (containerRef.current) {
      const specialWords = containerRef.current.querySelectorAll('.text-animation__word');
      specialWords.forEach((word) => {
        const wrapper = word.querySelector('.text-animation__image-wrapper');
        const revealLeft = word.querySelector('.text-animation__reveal.left');
        const revealRight = word.querySelector('.text-animation__reveal.right');
        const wordText = word.querySelector('.text-animation__word-text');

        if (wrapper && revealLeft && revealRight) {
          gsap.set(wrapper, { width: 0 });
          gsap.set([revealLeft, revealRight], { xPercent: 0 });

          const wordTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: word,
              start: "top 92%", // triggers slightly before center to reveal
              end: "top 62%",   // opens fully as user scrolls past
              scrub: true,
            }
          });

          wordTimeline.to(wrapper, { width: "12vw", ease: "power2.out" }, 0)
            .to(revealLeft, { xPercent: -100, ease: "power2.out" }, 0)
            .to(revealRight, { xPercent: 100, ease: "power2.out" }, 0);
          
          if (wordText) {
            wordTimeline.to(wordText, { color: "#E35F38", ease: "power2.out" }, 0);
          }
        }
      });
    }

    // Step F: Fade in button wrapper and draw curly arrow
    if (buttonWrapperRef.current) {
      textTimeline.fromTo(buttonWrapperRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "back.out(1.5)"
        },
        "-=0.4"
      );
    }

    if (arrowPathRef.current) {
      textTimeline.fromTo(arrowPathRef.current,
        { strokeDashoffset: 100 },
        {
          strokeDashoffset: 0,
          duration: 0.9,
          ease: "power2.out"
        },
        "-=0.5"
      );
    }

    // 3. Dynamic Color Palette Shift on Scroll (Coordinated buttery smooth scrubs)
    if (containerRef.current) {
      const dishaChars = containerRef.current.querySelectorAll('.disha-char');
      const accentDots = containerRef.current.querySelectorAll('.accent-dot');
      const taglineTexts = containerRef.current.querySelectorAll('.tagline-text');
      const cadSvgs = containerRef.current.querySelectorAll('.cad-svg');
      const gridLines = containerRef.current.querySelectorAll('.grid-line');
      const gridTexts = containerRef.current.querySelectorAll('.grid-text');
      const aboutButton = containerRef.current.querySelector('.about-button');

      // Container background color shift (Scrubbed)
      gsap.fromTo(containerRef.current,
        { backgroundColor: '#F5F4F0' },
        {
          backgroundColor: '#FAF5ED', // Cozy warm cream
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'bottom 40%',
            scrub: true,
          }
        }
      );

      // Text colors transition (disha-char & tagline-text) (Scrubbed)
      gsap.fromTo([dishaChars, taglineTexts],
        { color: '#8A7FE8' },
        {
          color: '#E35F38', // Claude aesthetic warm orange
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'bottom 40%',
            scrub: true,
          }
        }
      );

      // Accent dots background color transition (Scrubbed)
      gsap.fromTo(accentDots,
        { backgroundColor: '#8A7FE8' },
        {
          backgroundColor: '#E35F38',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'bottom 40%',
            scrub: true,
          }
        }
      );

      // Custom button accent variable shift (Scrubbed)
      if (aboutButton) {
        gsap.fromTo(aboutButton,
          { '--btn-accent': '#8A7FE8' },
          {
            '--btn-accent': '#E35F38',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
              end: 'bottom 40%',
              scrub: true,
            }
          }
        );
      }

      // CAD vector stroke lines shift (Scrubbed)
      gsap.fromTo(cadSvgs,
        { color: 'rgba(28, 33, 53, 0.15)' },
        {
          color: 'rgba(227, 95, 56, 0.25)', // Claude orange soft stroke tint
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'bottom 40%',
            scrub: true,
          }
        }
      );

      // Grid dividers shift (Scrubbed)
      gsap.fromTo(gridLines,
        { backgroundColor: 'rgba(28, 33, 53, 0.1)' },
        {
          backgroundColor: 'rgba(227, 95, 56, 0.12)',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'bottom 40%',
            scrub: true,
          }
        }
      );

      // Grid metadata labels & crosshairs shift (Scrubbed)
      gsap.fromTo(gridTexts,
        { color: 'rgba(28, 33, 53, 0.2)' },
        {
          color: 'rgba(227, 95, 56, 0.35)',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'bottom 40%',
            scrub: true,
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
      className="relative min-h-[85vh] w-full flex flex-col items-center justify-center overflow-hidden px-8 pt-24 pb-16 bg-[#F5F4F0] select-none z-10 transition-colors duration-300"
    >
      {/* ─── Architectural Drafting Lines overlaying this section ─── */}
      {/* Horizontal Top Guide Line */}
      <div 
        ref={lineH1Ref} 
        className="absolute top-16 left-[10%] right-[10%] h-[1px] bg-[#1c2135]/10 origin-left grid-line"
      >
        <span className="absolute left-0 -top-3 font-mono text-[7px] text-[#1c2135]/20 grid-text">GRID_REF: [H-01]</span>
        <span className="absolute right-0 -top-3 font-mono text-[7px] text-[#1c2135]/20 grid-text">0,0.48px</span>
      </div>

      {/* Horizontal Bottom Guide Line */}
      <div 
        ref={lineH2Ref} 
        className="absolute bottom-20 left-[10%] right-[10%] h-[1px] bg-[#1c2135]/10 origin-right grid-line"
      >
        <span className="absolute left-0 -bottom-3.5 font-mono text-[7px] text-[#1c2135]/20 grid-text">GRID_REF: [H-02]</span>
        <span className="absolute right-0 -bottom-3.5 font-mono text-[7px] text-[#1c2135]/20 grid-text">X_CALIBRATED</span>
      </div>

      {/* Vertical Left Guide Line */}
      <div 
        ref={lineV1Ref} 
        className="absolute top-8 bottom-8 left-[10%] w-[1px] bg-[#1c2135]/10 origin-top grid-line"
      >
        <span className="absolute top-0 -left-6 font-mono text-[7px] text-[#1c2135]/20 rotate-[-90deg] origin-top-left grid-text">AXIS_Y1</span>
      </div>

      {/* Vertical Right Guide Line */}
      <div 
        ref={lineV2Ref} 
        className="absolute top-8 bottom-8 right-[10%] w-[1px] bg-[#1c2135]/10 origin-bottom grid-line"
      >
        <span className="absolute bottom-0 -right-2 font-mono text-[7px] text-[#1c2135]/20 rotate-[90deg] origin-bottom-right grid-text">AXIS_Y2</span>
      </div>

      {/* Corner Intersection Crosshairs */}
      <div className="absolute top-[60px] left-[9.7%] font-mono text-[10px] text-[#1c2135]/20 font-bold pointer-events-none grid-text">+</div>
      <div className="absolute top-[60px] right-[9.7%] font-mono text-[10px] text-[#1c2135]/20 font-bold pointer-events-none grid-text">+</div>
      <div className="absolute bottom-[75px] left-[9.7%] font-mono text-[10px] text-[#1c2135]/20 font-bold pointer-events-none grid-text">+</div>
      <div className="absolute bottom-[75px] right-[9.7%] font-mono text-[10px] text-[#1c2135]/20 font-bold pointer-events-none grid-text">+</div>

      {/* Floating CAD Widget Left: Compass / Protractor */}
      <div 
        ref={compassRef} 
        className="absolute left-[3%] top-[30%] hidden xl:block rotate-[15deg] pointer-events-none filter drop-shadow-sm select-none"
        style={{ transformOrigin: 'center center' }}
      >
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" className="text-[#1c2135]/15 cad-svg">
          <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
          <path d="M 50 5 L 50 95 M 5 50 L 95 50" stroke="currentColor" strokeWidth="0.5" />
          <path d="M 50 50 L 80 20" stroke="currentColor" strokeWidth="1" />
          <path d="M 75 20 A 35 35 0 0 0 50 15" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="3" fill="currentColor" />
        </svg>
        <div className="text-[6px] font-mono text-center text-black/20 mt-1 grid-text">PROTRACTOR_MD-08</div>
      </div>

      {/* Floating CAD Widget Right: Vector Spiral Helix */}
      <div 
        ref={spiralRef} 
        className="absolute right-[3%] bottom-[25%] hidden xl:block rotate-[-20deg] pointer-events-none filter drop-shadow-sm select-none"
        style={{ transformOrigin: 'center center' }}
      >
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" className="text-[#1c2135]/15 cad-svg">
          {/* Fibonacci style nested spiral */}
          <path d="M 50 50 A 5 5 0 0 1 55 50 A 10 10 0 0 1 45 50 A 15 15 0 0 1 60 50 A 20 20 0 0 1 40 50 A 25 25 0 0 1 65 50 A 30 30 0 0 1 35 50" stroke="currentColor" strokeWidth="0.75" />
          <circle cx="50" cy="50" r="1.5" fill="currentColor" />
          <line x1="50" y1="50" x2="35" y2="50" stroke="currentColor" strokeWidth="1" />
        </svg>
        <div className="text-[6px] font-mono text-center text-black/20 mt-1 grid-text">HELIX_V_CALIBRATOR</div>
      </div>

      {/* Main Content Layout */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
        
        {/* Large, Eye-Catching Greeting Headline with inline Lottie */}
        <h1 
          ref={nameRef} 
          className="font-display font-medium text-3xl sm:text-4xl md:text-5xl lg:text-[3rem] xl:text-[3.6rem] text-[#1c2135] mb-8 tracking-tight flex flex-wrap justify-center items-center select-none leading-none gap-x-2 w-full"
        >
          {/* Circular Portrait Image */}
          <div 
            ref={avatarRef}
            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 inline-flex items-center justify-center flex-shrink-0 select-none overflow-hidden rounded-full border border-[#8A7FE8]/30 mr-2 md:mr-4 shadow-md bg-white"
            style={{ opacity: 0, transform: 'scale(0)' }}
          >
            <img 
              src="/disha-circle.png" 
              alt="Disha Jain Portrait" 
              className="w-full h-full object-cover"
            />
          </div>

          <span className="flex">
            {part1.map((char, index) => (
              <span key={index} className="name-char inline-block origin-center" style={{ opacity: 0 }}>
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
          <span className="font-premium-serif text-[#8A7FE8] flex italic font-light">
            {part2.map((char, index) => (
              <span key={index} className="disha-char inline-block origin-center" style={{ opacity: 0 }}>
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>

          {/* Inline Waving Character Lottie (Always rendered so GSAP can bind, content loaded conditionally) */}
          <div 
            ref={lottieRef}
            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 inline-flex items-center justify-center flex-shrink-0 select-none pointer-events-none ml-2 md:ml-4"
            style={{ opacity: 0, transform: 'scale(0)' }}
          >
            {animationData && (
              <Lottie animationData={animationData} loop={true} className="w-full h-full" />
            )}
          </div>
        </h1>

        {/* Philosophical Tagline Badge */}
        <div 
          ref={badgeRef}
          className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-10 opacity-0 select-none"
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#1c2135]/40 font-bold grid-text">
            [ PERSPECTIVE // 01 ]
          </span>
          <span className="hidden sm:inline w-1 h-1 rounded-full bg-[#8A7FE8] accent-dot" />
          <span className="font-premium-serif text-[15px] text-[#8A7FE8] italic font-light tracking-wide lowercase tagline-text">
            shaping digital matter into interactive poetry
          </span>
        </div>

        {/* Masterpiece Split-Word Calligraphy Headline with Bato-Style Text and Image reveal */}
        <h2 
          ref={headlineRef}
          className="font-display font-medium text-2xl sm:text-3xl md:text-[2.2rem] lg:text-[2.8rem] xl:text-[3.2rem] text-[#1c2135]/25 leading-[1.4] tracking-tight max-w-[95%] md:max-w-[85%] text-center mb-12 select-none flex flex-wrap justify-center items-center gap-x-2 gap-y-2"
        >
          {segments.map((seg, sIdx) => {
            if (seg.isSpecial) {
              return (
                <span key={sIdx} className="text-animation__word inline-flex items-center mx-1">
                  <span className="text-animation__blur">
                    <span className="text-animation__image-wrapper inline-block">
                      {seg.is3D ? (
                        <Motion3DCanvas />
                      ) : (
                        <img 
                          className="text-animation__animated-img" 
                          src={seg.img} 
                          alt={seg.text} 
                          loading="lazy" 
                        />
                      )}
                      <div className="text-animation__reveal left bg-[#FAF5ED]"></div>
                      <div className="text-animation__reveal right bg-[#FAF5ED]"></div>
                    </span>
                  </span>
                  <span className="text-animation__word-text text-[#1c2135]/25 transition-colors duration-300">
                    {seg.text.split("").map((char, cIdx) => (
                      <span key={cIdx} className="scroll-char inline-block">
                        {char}
                      </span>
                    ))}
                  </span>
                </span>
              );
            } else {
              return (
                <span key={sIdx} className="inline-flex flex-wrap">
                  {seg.text.split("").map((char, cIdx) => (
                    <span key={cIdx} className="scroll-char inline-block">
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
                </span>
              );
            }
          })}
        </h2>

        {/* Interactive 3D Tactile Button & Cursive Annotation Wrapper */}
        <div ref={buttonWrapperRef} className="relative inline-block mt-4 mb-2 opacity-0">
          {/* Cursive Annotation & Handwritten Arrow (Desktop only) */}
          <div className="absolute -left-48 -top-12 hidden lg:flex flex-col items-center rotate-[-12deg] pointer-events-none select-none">
            <span 
              style={{ fontFamily: '"Playwrite IS", cursive' }} 
              className="text-[11px] text-[#8A7FE8] tagline-text font-light whitespace-nowrap mb-1.5"
            >
              click to know more about me
            </span>
            {/* Hand-drawn curly arrow */}
            <svg width="60" height="40" viewBox="0 0 60 40" fill="none" className="text-[#8A7FE8] tagline-text opacity-80">
              <path 
                ref={arrowPathRef}
                d="M 5,5 C 20,5 30,35 45,25 C 50,20 48,15 45,15 C 40,15 38,22 48,32" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round"
                strokeDasharray="100"
                strokeDashoffset="100"
              />
              <path 
                d="M 42,28 L 48,32 L 46,24" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
          </div>

          {/* Nakampz Uiverse Button Design */}
          <button 
            onClick={onOpenAbout}
            className="about-button uiverse-about-btn select-none"
          >
            Explore Archives // About Me
          </button>
        </div>

        {/* Coordinates status label bottom */}
        <div className="mt-12 flex gap-4 font-mono text-[7px] text-[#1c2135]/30 uppercase tracking-wider grid-text">
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
