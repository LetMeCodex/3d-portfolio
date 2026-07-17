import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pizza, Dessert, ArrowRight, RotateCcw } from 'lucide-react';
import { FoodieSpecial } from './FoodieSpecial';
import { CakeSpecial } from './CakeSpecial';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function CulinaryJourney() {
  const [choice, setChoice] = useState<'none' | 'savory' | 'sweet'>('none');
  const containerRef = useRef<HTMLDivElement>(null);
  const choiceSectionRef = useRef<HTMLDivElement>(null);
  const circleBgRef = useRef<SVGCircleElement>(null);
  const circleMaskRef = useRef<SVGCircleElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Smooth ScrollTrigger Iris Zoom Transition (no pinning to prevent glitches)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: choiceSectionRef.current,
        start: 'top bottom',
        end: 'top top',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Grow circle from 0 to 2200px as section scrolls onto screen
          const r = self.progress * 2200;
          if (circleBgRef.current) {
            circleBgRef.current.setAttribute('r', String(r));
          }
          if (circleMaskRef.current) {
            circleMaskRef.current.setAttribute('r', String(r));
          }
          // Smoothly fade out overlay in the last 15% of progress
          if (overlayRef.current) {
            if (self.progress > 0.85) {
              const opacity = (1 - self.progress) / 0.15;
              overlayRef.current.style.opacity = String(opacity);
            } else {
              overlayRef.current.style.opacity = '1';
            }
          }
          // Dynamically toggle container background color to prevent subpixel bleed-through
          if (containerRef.current) {
            if (self.progress > 0.9) {
              containerRef.current.style.backgroundColor = '#F5F4F0';
            } else {
              containerRef.current.style.backgroundColor = '#111013';
            }
          }
        },
        onLeave: () => {
          if (overlayRef.current) {
            overlayRef.current.style.display = 'none';
          }
        },
        onEnterBack: () => {
          if (overlayRef.current) {
            overlayRef.current.style.display = 'block';
            overlayRef.current.style.opacity = '1';
          }
        }
      });
    }, choiceSectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    // Critical: Refresh triggers whenever a component is added to the DOM
    const refresh = () => {
      ScrollTrigger.refresh(true);
    };

    // Delay slightly to allow React to finish mounting the new component
    const timer = setTimeout(refresh, 100);
    const longTimer = setTimeout(refresh, 1000);

    return () => {
      clearTimeout(timer);
      clearTimeout(longTimer);
    };
  }, [choice]);

  const handleChoice = (selected: 'savory' | 'sweet') => {
    setChoice(selected);
    
    // Smoothly scroll down to the result after a brief mount delay
    setTimeout(() => {
      const resultElement = document.getElementById(`culinary-result`);
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full min-h-screen bg-[#111013]"
      style={{ isolation: 'isolate' }}
    >
      {/* Choice Section */}
      <section 
        ref={choiceSectionRef}
        className="relative z-30 w-full min-h-screen flex flex-col items-center justify-center px-4 py-20 bg-transparent"
      >
        <div className="text-center max-w-4xl w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "circOut" }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1c2135]/10 bg-white/50 backdrop-blur-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#1c2135]/60">Live Interaction</span>
            </div>
            
            <h2 className="font-serif italic text-6xl md:text-8xl text-[#1c2135] mb-8 leading-tight">
              Disha is <br/> 
              <span className="text-[#3d2111]">hungry.</span>
            </h2>
            
            <p className="font-sans text-lg text-[#1c2135]/50 max-w-lg mx-auto leading-relaxed italic">
              "The hardest part of the editorial day isn't the layout—it's the menu. Help her choose the perfect feature."
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-16 max-w-5xl mx-auto">
            {/* Savory Choice */}
            <motion.div
              layout
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleChoice('savory')}
              className={`group relative cursor-pointer overflow-hidden rounded-[2.5rem] p-10 border-2 transition-all duration-700 ${
                choice === 'savory' ? 'border-[#3d2111] bg-white shadow-2xl z-10' : 'border-transparent bg-white/40 hover:bg-white hover:shadow-xl'
              }`}
            >
              <div className="relative z-10 flex flex-col items-center text-center">
                <motion.div 
                  animate={choice === 'savory' ? { rotate: [0, 10, -10, 0] } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className={`p-7 rounded-3xl mb-8 transition-all duration-700 ${
                    choice === 'savory' ? 'bg-[#3d2111] text-white shadow-lg' : 'bg-white text-[#3d2111] shadow-md group-hover:shadow-lg'
                  }`}
                >
                  <Pizza size={48} strokeWidth={1.2} />
                </motion.div>
                <h3 className="font-serif italic text-4xl text-[#1c2135] mb-4">The Savory</h3>
                <p className="text-xs text-[#1c2135]/40 mb-8 uppercase tracking-[0.3em]">Signature Thin Crust</p>
                <div className={`flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest transition-all duration-500 ${
                  choice === 'savory' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0'
                }`}>
                  <span className="px-4 py-2 bg-[#1c2135] text-white rounded-full flex items-center gap-2">
                    Start Cooking <ArrowRight size={14} />
                  </span>
                </div>
              </div>
              
              <div className={`absolute -right-12 -bottom-12 transition-all duration-1000 ${
                choice === 'savory' ? 'opacity-10 scale-110' : 'opacity-[0.03] group-hover:opacity-10'
              }`}>
                <Pizza size={250} />
              </div>
            </motion.div>

            {/* Sweet Choice */}
            <motion.div
              layout
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleChoice('sweet')}
              className={`group relative cursor-pointer overflow-hidden rounded-[2.5rem] p-10 border-2 transition-all duration-700 ${
                choice === 'sweet' ? 'border-[#3d2111] bg-white shadow-2xl z-10' : 'border-transparent bg-white/40 hover:bg-white hover:shadow-xl'
              }`}
            >
              <div className="relative z-10 flex flex-col items-center text-center">
                <motion.div 
                  animate={choice === 'sweet' ? { rotate: [0, -10, 10, 0] } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className={`p-7 rounded-3xl mb-8 transition-all duration-700 ${
                    choice === 'sweet' ? 'bg-[#3d2111] text-white shadow-lg' : 'bg-white text-[#3d2111] shadow-md group-hover:shadow-lg'
                  }`}
                >
                  <Dessert size={48} strokeWidth={1.2} />
                </motion.div>
                <h3 className="font-serif italic text-4xl text-[#1c2135] mb-4">The Sweet</h3>
                <p className="text-xs text-[#1c2135]/40 mb-8 uppercase tracking-[0.3em]">Artisanal Ganache</p>
                <div className={`flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest transition-all duration-500 ${
                  choice === 'sweet' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0'
                }`}>
                  <span className="px-4 py-2 bg-[#1c2135] text-white rounded-full flex items-center gap-2">
                    Start Baking <ArrowRight size={14} />
                  </span>
                </div>
              </div>

              <div className={`absolute -right-12 -bottom-12 transition-all duration-1000 ${
                choice === 'sweet' ? 'opacity-10 scale-110' : 'opacity-[0.03] group-hover:opacity-10'
              }`}>
                <Dessert size={250} />
              </div>
            </motion.div>
          </div>

          <AnimatePresence>
            {choice !== 'none' && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setChoice('none');
                }}
                className="mt-16 flex items-center gap-2 mx-auto px-6 py-3 rounded-full bg-[#1c2135]/5 hover:bg-[#1c2135]/10 text-[#1c2135]/40 font-mono text-[10px] uppercase tracking-[0.2em] transition-all"
              >
                <RotateCcw size={12} /> Reset Choice
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Dark Cinematic Iris Overlay */}
        <div 
          ref={overlayRef}
          className="absolute inset-0 w-full h-full z-40 pointer-events-none"
          style={{ overflow: 'visible' }}
        >
          <svg 
            viewBox="0 0 1920 1080" 
            preserveAspectRatio="xMidYMid slice" 
            className="w-full h-full"
            style={{ overflow: 'visible' }}
          >
            <defs>
              <mask id="food-iris-mask">
                {/* White covers everything */}
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                {/* Circle mask starting at 0 radius */}
                <circle 
                  ref={circleMaskRef} 
                  cx="960" 
                  cy="540" 
                  r="0" 
                  fill="black" 
                />
              </mask>
            </defs>
            {/* Cream circle background expanding past the section fold */}
            <circle 
              ref={circleBgRef} 
              cx="960" 
              cy="540" 
              r="0" 
              fill="#F5F4F0" 
            />
            {/* Dark cover with hole masking */}
            <rect 
              x="0" 
              y="0" 
              width="100%" 
              height="100%" 
              fill="#111013" 
              mask="url(#food-iris-mask)" 
            />
          </svg>
        </div>
      </section>

      {/* Result Section */}
      <div id="culinary-result" className="relative z-20 bg-[#F5F4F0]">
        <AnimatePresence mode="wait">
          {choice === 'savory' && (
            <motion.div
              key="savory-special"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FoodieSpecial />
            </motion.div>
          )}
          {choice === 'sweet' && (
            <motion.div
              key="sweet-special"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CakeSpecial />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {choice !== 'none' && (
        <div className="w-full h-[20vh] flex flex-col items-center justify-center bg-[#F5F4F0] border-t border-[#1c2135]/5">
          <p className="font-serif italic text-2xl text-[#1c2135]/40">
            "Excellent choice."
          </p>
        </div>
      )}
    </div>
  );
}
