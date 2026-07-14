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
          scrub: 1.5,
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
          scrub: 1.5,
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
            scrub: 1,
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
          scrub: 1,
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

        {/* UI Elements - Floating Interactive Capsules */}
        <div className="footer-ui-elements absolute inset-x-0 bottom-0 z-30 pb-10 pointer-events-none px-6 md:px-12 lg:px-20">
          
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 pointer-events-none">
            
            {/* Left Capsule: Social Cards */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="flex items-center gap-4 bg-[#1C2135]/70 backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.25)] pointer-events-auto"
            >
              <SocialCards />
            </motion.div>

            {/* Center Capsule: Copyright Info */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="bg-[#1C2135]/70 backdrop-blur-xl border border-white/10 px-6 py-3.5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.25)] flex items-center justify-center pointer-events-auto"
            >
              <span className="text-[#FEF6DD]/60 text-[9px] uppercase tracking-[0.25em] font-mono select-none">
                &copy; 2026 DISHA JAIN
              </span>
            </motion.div>

            {/* Right Capsule: Quick Links + Resume Button */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="flex items-center gap-6 bg-[#1C2135]/70 backdrop-blur-xl border border-white/10 pl-6 pr-2.5 py-2.5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.25)] pointer-events-auto"
            >
              <ul className="flex gap-5 font-sans text-[10px] font-bold tracking-[0.2em] text-[#FEF6DD]/70 uppercase">
                <li onClick={() => window.location.href = 'mailto:Jain.disha2712@gmail.com'} className="hover:text-[#E84855] cursor-pointer transition-colors duration-300">Inquiry</li>
                <li onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-[#E84855] cursor-pointer transition-colors duration-300">Process</li>
                <li onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-[#E84855] cursor-pointer transition-colors duration-300">Vibe</li>
              </ul>
              <div className="h-4 w-px bg-white/20" />
              <div className="relative group">
                <motion.div 
                  onClick={(e) => onOpenResume ? onOpenResume(e) : window.scrollTo({ top: 0, behavior: 'smooth' })}
                  whileHover={{ scale: 1.05, backgroundColor: '#FEF6DD', color: '#1C2135', borderColor: '#FEF6DD' }}
                  className="flex items-center gap-3 px-6 py-2 rounded-full border border-[#FEF6DD]/30 bg-[#1C2135]/60 text-[#FEF6DD] text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer transition-all duration-300 backdrop-blur-md relative z-10"
                >
                  RESUME
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FEF6DD] transition-colors" />
                </motion.div>
                {/* Circle doodle around the button */}
                <HandDrawnDoodle 
                  type="circle" 
                  className="absolute inset-[-6px] text-[#FEF6DD]/20 scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
                  color="#FEF6DD"
                />
              </div>
            </motion.div>

          </div>
        </div>
      </div>

    </footer>
  );
}
