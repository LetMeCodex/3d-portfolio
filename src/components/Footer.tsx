import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Instagram, Twitter, Facebook, Linkedin, Github, Mail, ArrowUp } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Logo } from './ui/Logo';
import { SocialCards } from './ui/social-cards';
import { HandDrawnDoodle } from './ui/HandDrawnDoodle';
import PixelSkyBackground from './ui/PixelSkyBackground';

gsap.registerPlugin(ScrollTrigger);

interface FooterProps {
  onOpenResume?: (e: React.MouseEvent) => void;
}

export function Footer({ onOpenResume }: FooterProps) {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [localTime, setLocalTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const formatter = new Intl.DateTimeFormat('en-US', options);
      setLocalTime(formatter.format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!footerRef.current) return;
    const rect = footerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (!footerRef.current) return;

    // Refresh ScrollTrigger when page layout height changes (e.g. after preloader ends on the Homepage)
    const observer = new ResizeObserver(() => {
      ScrollTrigger.refresh();
    });
    observer.observe(document.body);

    const isHomepage = onOpenResume !== undefined;

    const ctx = gsap.context(() => {
      
      // --- INDIVIDUAL ELEMENT ANIMATIONS ---
      
      // Branding "DI"
      gsap.from(".branding-di", {
        x: -300,
        opacity: 0,
        rotation: -10,
        scrollTrigger: {
          trigger: footerRef.current,
          start: isHomepage ? "top 80%" : () => ScrollTrigger.maxScroll(window) * 0.7, 
          end: isHomepage ? "top 30%" : () => ScrollTrigger.maxScroll(window) * 0.95,
          scrub: 0.15,
        }
      });

      // Branding "SHA"
      gsap.from(".branding-sha", {
        x: 300,
        opacity: 0,
        rotation: 10,
        scrollTrigger: {
          trigger: footerRef.current,
          start: isHomepage ? "top 80%" : () => ScrollTrigger.maxScroll(window) * 0.7,
          end: isHomepage ? "top 30%" : () => ScrollTrigger.maxScroll(window) * 0.95,
          scrub: 0.15,
        }
      });

      // Character Entrance
      gsap.fromTo(".character-img", 
        { scale: 0.7, opacity: 0, y: 120 },
        { 
          scale: 1, 
          opacity: 1, 
          y: 0,
          scrollTrigger: {
            trigger: footerRef.current,
            start: isHomepage ? "top 75%" : () => ScrollTrigger.maxScroll(window) * 0.7,
            end: isHomepage ? "top 25%" : () => ScrollTrigger.maxScroll(window),
            scrub: true,
          }
        }
      );

      // Bottom UI Elements
      gsap.from(".footer-ui-elements", {
        y: 50,
        opacity: 0,
        scrollTrigger: {
          trigger: footerRef.current,
          start: isHomepage ? "top 40%" : () => ScrollTrigger.maxScroll(window) * 0.8,
          end: isHomepage ? "top 10%" : () => ScrollTrigger.maxScroll(window),
          scrub: true,
        }
      });

    }, footerRef);

    return () => {
      observer.disconnect();
      ctx.revert();
    };
  }, [onOpenResume]);

  return (
    /* 
       The "Revealing" Effect: 
       We use a fixed/sticky position strategy or a clip-path reveal.
       Since we don't control the parent layout, a clip-path reveal is the most robust 
       way to "reveal" the footer from underneath the previous section.
    */
    <footer 
      id="contact"
      ref={footerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="sticky bottom-0 w-full bg-black min-h-screen overflow-hidden z-10"
    >
      {/* The Animated Pixel Background Canvas */}
      <PixelSkyBackground mouseX={mousePos.x} mouseY={mousePos.y} />
      
      {/* SVG Chroma Key Filter */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="chromakey-green-final-v4">
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    -1 1.6 -1 0 -0.15"
            result="green-mask"
          />
          <feComponentTransfer in="green-mask" result="alpha">
             <feFuncA type="linear" slope="-18" intercept="1.8" />
          </feComponentTransfer>
          <feComposite in="SourceGraphic" in2="alpha" operator="in" />
        </filter>
      </svg>

      {/* Background Decorative Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Main Content Layer */}
      <div className="footer-content-parallax relative w-full min-h-screen flex flex-col items-center justify-center">
        
        {/* --- CONTENT LAYER --- */}
        <div className="relative z-10 w-full max-w-[1800px] px-10 h-full flex items-center justify-between pointer-events-none">
          {/* Cute 3D Animated Professional 7-Color Rainbow Arc */}
          <div className="absolute inset-x-0 bottom-[24%] top-[1%] pointer-events-none select-none" style={{ zIndex: 1 }}>
            <svg className="w-full h-full" viewBox="0 0 800 600" fill="none" preserveAspectRatio="none">
              <defs>
                <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                  <stop offset="60%" stopColor="#FFF4DD" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#9FA8FF" stopOpacity="0.3" />
                </linearGradient>
              </defs>

              <style dangerouslySetInnerHTML={{ __html: `
                @keyframes shimmerFlow {
                  0% { stroke-dashoffset: 600; }
                  100% { stroke-dashoffset: 0; }
                }
                @keyframes tubeGlow {
                  0%, 100% { opacity: 0.5; filter: drop-shadow(0 0 2px var(--glow)) drop-shadow(0 0 6px var(--glow)); }
                  50% { opacity: 0.65; filter: drop-shadow(0 0 6px var(--glow)) drop-shadow(0 0 15px var(--glow)); }
                }
                @keyframes floatCloudLeft {
                  0%, 100% { transform: translate3d(0, 0, 0); }
                  50% { transform: translate3d(-4px, -6px, 0); }
                }
                @keyframes floatCloudRight {
                  0%, 100% { transform: translate3d(0, 0, 0); }
                  50% { transform: translate3d(4px, -5px, 0); }
                }
                .rainbow-tube {
                  animation: tubeGlow 4s ease-in-out infinite;
                }
                .rainbow-specular {
                  stroke-dasharray: 40 160;
                  animation: shimmerFlow 6s linear infinite;
                }
                .floating-cloud-left {
                  animation: floatCloudLeft 7s ease-in-out infinite;
                }
                .floating-cloud-right {
                  animation: floatCloudRight 8s ease-in-out infinite;
                }
              `}} />

              {/* Main Glowing Pastel Colors (Softer, lower opacity, no black outlines to blend seamlessly) */}
              <g opacity="0.85">
                <path d="M 180,280 Q 360,-160 540,280" className="rainbow-tube" stroke="#F87171" strokeWidth="15" strokeLinecap="round" style={{ '--glow': '#F87171' } as React.CSSProperties} opacity="0.45" />
                <path d="M 185,285 Q 360,-135 535,285" className="rainbow-tube" stroke="#FB923C" strokeWidth="15" strokeLinecap="round" style={{ '--glow': '#FB923C' } as React.CSSProperties} opacity="0.45" />
                <path d="M 190,290 Q 360,-110 530,290" className="rainbow-tube" stroke="#FDE047" strokeWidth="15" strokeLinecap="round" style={{ '--glow': '#FDE047' } as React.CSSProperties} opacity="0.45" />
                <path d="M 195,295 Q 360,-85  525,295" className="rainbow-tube" stroke="#4ADE80" strokeWidth="15" strokeLinecap="round" style={{ '--glow': '#4ADE80' } as React.CSSProperties} opacity="0.45" />
                <path d="M 200,300 Q 360,-60  520,300" className="rainbow-tube" stroke="#60A5FA" strokeWidth="15" strokeLinecap="round" style={{ '--glow': '#60A5FA' } as React.CSSProperties} opacity="0.45" />
                <path d="M 205,305 Q 360,-35  515,305" className="rainbow-tube" stroke="#818CF8" strokeWidth="15" strokeLinecap="round" style={{ '--glow': '#818CF8' } as React.CSSProperties} opacity="0.45" />
                <path d="M 210,310 Q 360,-10  510,310" className="rainbow-tube" stroke="#C084FC" strokeWidth="15" strokeLinecap="round" style={{ '--glow': '#C084FC' } as React.CSSProperties} opacity="0.45" />
              </g>

              {/* Glossy Specular Reflection Highlights (3D Glass neon effect, thinner and softer) */}
              <g opacity="0.6">
                <path d="M 180,280 Q 360,-160 540,280" className="rainbow-specular" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
                <path d="M 185,285 Q 360,-135 535,285" className="rainbow-specular" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
                <path d="M 190,290 Q 360,-110 530,290" className="rainbow-specular" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
                <path d="M 195,295 Q 360,-85  525,295" className="rainbow-specular" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
                <path d="M 200,300 Q 360,-60  520,300" className="rainbow-specular" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
                <path d="M 205,305 Q 360,-35  515,305" className="rainbow-specular" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
                <path d="M 210,310 Q 360,-10  510,310" className="rainbow-specular" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
              </g>

              {/* Soft Puffy Clouds at Left and Right ends to hide the cuts (Expanded & shifted for complete concealment) */}
              <g className="floating-cloud-left" filter="drop-shadow(0 8px 16px rgba(28,33,53,0.06))">
                <ellipse cx="160" cy="285" rx="28" ry="22" fill="url(#cloudGrad)" />
                <ellipse cx="195" cy="275" rx="38" ry="30" fill="url(#cloudGrad)" />
                <ellipse cx="230" cy="285" rx="32" ry="24" fill="url(#cloudGrad)" />
                <ellipse cx="175" cy="300" rx="38" ry="16" fill="url(#cloudGrad)" />
                <ellipse cx="210" cy="300" rx="38" ry="16" fill="url(#cloudGrad)" />
              </g>

              <g className="floating-cloud-right" filter="drop-shadow(0 8px 16px rgba(28,33,53,0.06))">
                <ellipse cx="490" cy="285" rx="32" ry="24" fill="url(#cloudGrad)" />
                <ellipse cx="525" cy="275" rx="38" ry="30" fill="url(#cloudGrad)" />
                <ellipse cx="560" cy="285" rx="28" ry="22" fill="url(#cloudGrad)" />
                <ellipse cx="510" cy="300" rx="38" ry="16" fill="url(#cloudGrad)" />
                <ellipse cx="545" cy="300" rx="38" ry="16" fill="url(#cloudGrad)" />
              </g>
            </svg>
          </div>


          {/* Left Side: "DI" */}
          <div className="flex flex-col items-start gap-0 branding-di pointer-events-auto relative" style={{ zIndex: 10 }}>
             <h2 
               className="text-[22vw] font-black leading-[0.8] tracking-tighter uppercase text-[#1C2135] select-none"
               style={{ textShadow: '3px 3px 0px #FEF6DD, 6px 6px 15px rgba(28,33,53,0.18)' }}
             >
                DI
             </h2>
          </div>

          {/* Center: The Character */}
          <div className="flex-1 flex justify-center items-center h-full relative" style={{ zIndex: 10 }}>
            <div className="relative h-[85vh] flex items-center justify-center z-20 character-img">
               <div className="absolute w-[80%] h-[80%] bg-gradient-to-tr from-[#FFB7B2]/20 to-[#FFDAC1]/25 blur-[120px] rounded-full z-[-1]" />
               <img 
                 src="/assets/disha-character-final.png" 
                 alt="Disha Character" 
                 className="h-full w-auto object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.8)]"
                 style={{ 
                   filter: 'url(#chromakey-green-final-v4) brightness(1.02)',
                   WebkitFilter: 'url(#chromakey-green-final-v4) brightness(1.02)'
                 }}
               />
            </div>
          </div>

          {/* Right Side: "SHA" */}
          <div className="flex flex-col items-end gap-0 branding-sha pointer-events-auto relative" style={{ zIndex: 10 }}>
             <h2 
               className="text-[22vw] font-black leading-[0.8] tracking-tighter uppercase text-[#1C2135] select-none flex justify-end"
               style={{ textShadow: '3px 3px 0px #FEF6DD, 6px 6px 15px rgba(28,33,53,0.18)' }}
             >
                SHA
             </h2>
          </div>

        </div>

        {/* UI Elements - Creative CAD Status & Control Console */}
        <div className="footer-ui-elements absolute inset-x-0 bottom-0 z-30 w-full pointer-events-none pb-6 px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto bg-[#1C2135]/80 backdrop-blur-xl border border-white/15 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.4)] pointer-events-auto overflow-hidden">
            
            {/* The CAD Grid Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 text-[#FEF6DD] font-mono text-[9px] uppercase tracking-[0.25em]">
              
              {/* Left Column: SYSTEM COORDINATES */}
              <div className="p-5 flex flex-col gap-2 relative">
                <div className="absolute top-2 left-3 text-[7px] text-white/30 font-bold">SYS_LOC: [01]</div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[#FEF6DD]/50">LOCATION:</span>
                  <span className="font-semibold text-white">JAIPUR, IN</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#FEF6DD]/50">COORDINATE:</span>
                  <span className="text-white/80">26.9124° N / 75.7873° E</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#FEF6DD]/50">LOCAL TIME:</span>
                  <span className="text-[#E58B88] font-bold tracking-wider">{localTime || "12:00:00 AM"}</span>
                </div>
              </div>

              {/* Center Column: STATUS MONITOR */}
              <div className="p-5 flex flex-col gap-2 justify-center relative">
                <div className="absolute top-2 left-3 text-[7px] text-white/30 font-bold">SYS_STATUS: [02]</div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[#FEF6DD]/50">DESIGNER STATUS:</span>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                    <span className="text-emerald-400 font-bold">ACTIVE & HIRABLE</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#FEF6DD]/50">DESIGN SYSTEM:</span>
                  <span className="text-white/80">DISHA_PORTFOLIO_V2.0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#FEF6DD]/50">COPYRIGHT:</span>
                  <span className="text-white/80">© 2026 DISHA JAIN</span>
                </div>
              </div>

              {/* Right Column: SYSTEM ACTIONS */}
              <div className="p-5 flex flex-col gap-3 justify-center relative">
                <div className="absolute top-2 left-3 text-[7px] text-white/30 font-bold">SYS_INPUT: [03]</div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[#FEF6DD]/50">SOCIALS:</span>
                  <div className="flex items-center gap-4">
                    <a href="https://linkedin.com/in/disha-jain-94016b333" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#E58B88] transition-colors duration-300">LKD</a>
                    <a href="https://github.com/dishajain27-ai" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#E58B88] transition-colors duration-300">GTHB</a>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#FEF6DD]/50">COMMANDS:</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => window.location.href = 'mailto:Jain.disha2712@gmail.com'} className="hover:text-[#E58B88] text-white transition-colors duration-300">INQUIRE</button>
                    <span className="text-white/20">|</span>
                    <button onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-[#E58B88] text-white transition-colors duration-300">PROCESS</button>
                    <span className="text-white/20">|</span>
                    <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-[#E58B88] text-white transition-colors duration-300">VIBE</button>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[#FEF6DD]/50">QUALIFICATION:</span>
                  <div className="relative group">
                    <button 
                      onClick={(e) => onOpenResume ? onOpenResume(e) : window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="px-4 py-1.5 rounded-full border border-[#FEF6DD]/30 hover:border-[#E58B88] hover:bg-[#E58B88]/10 text-[#FEF6DD] hover:text-[#E58B88] text-[8px] font-black uppercase tracking-[0.25em] cursor-pointer transition-all duration-300"
                    >
                      OPEN RESUME
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}
