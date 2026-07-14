import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { StickyNote } from './ui/StickyNote';
import { SocialCards } from './ui/SocialCards';
import { TicTacToe } from './TicTacToe';

const topRow = [
  "Figma", "•", "Brand Identity", "•", "Wireframing", "•", "User Research", "•",
  "Visual Design", "•", "Prototyping", "•", "Design Systems", "•", "Motion Design", "•",
  "Adobe Suite", "•", "Typography", "•", "Color Theory", "•", "UI Design", "•",
];

const bottomRow = [
  "Visual Storyteller", "✦", "Detail Obsessed", "✦", "Creative Thinker", "✦",
  "Aesthetic First", "✦", "Brand Strategist", "✦", "Pixel Perfect", "✦",
  "User Empathy", "✦", "Bold & Minimal", "✦", "Design Curator", "✦",
];

export function MarqueeDivider() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative w-full py-16 md:py-32 overflow-hidden select-none">
      
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-[#FCFBFF] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-[#FCFBFF] to-transparent z-10 pointer-events-none" />

      {/* Top row - scrolls left */}
      <div className="flex whitespace-nowrap mb-6 md:mb-8 marquee-left">
        {[...Array(4)].map((_, setIdx) => (
          <div key={setIdx} className="flex items-center shrink-0">
            {topRow.map((word, i) => (
              <span
                key={`${setIdx}-${i}`}
                className={`mx-3 md:mx-5 ${
                  word === "•" 
                    ? "text-[#E58B88] text-xl" 
                    : "font-heading-bold text-4xl md:text-6xl lg:text-7xl uppercase tracking-tight text-[#1c2135]/[0.06] hover:text-[#1c2135]/20 transition-colors duration-500 cursor-default"
                }`}
              >
                {word}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Center Statement & Aesthetic Annotations */}
      <div ref={containerRef} className="flex flex-col items-center justify-center gap-12 md:gap-16 py-12 md:py-16 relative z-20 w-full">
        
        {/* Interactive Sticky Notes */}
        <div className="relative w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-12 md:gap-0 px-6 min-h-[auto] md:min-h-[400px]">

          {/* Left Note - Pink */}
          <StickyNote
            colorTheme="pink"
            rotation={-6}
            className="z-20 md:absolute md:left-[2%] lg:left-[5%] md:top-[5%]"
            dragConstraints={containerRef}
          >
            Obsessed with micro-interactions. If it doesn't feel like magic, it's not done yet. ✨
          </StickyNote>

          {/* Center Note - Yellow */}
          <StickyNote
            colorTheme="yellow"
            rotation={1.5}
            className="z-30 md:relative"
            dragConstraints={containerRef}
          >
            I bridge the gap between engineering and aesthetics. Focused on pixel-perfect UIs, fluid interactions, and shipping products that feel alive. Always in a "build and explore" mode.
          </StickyNote>

          {/* Right Note - Blue */}
          <StickyNote
            colorTheme="blue"
            rotation={5}
            className="z-20 md:absolute md:right-[2%] lg:right-[5%] md:top-[5%]"
            dragConstraints={containerRef}
          >
            Frontend is my playground. I love turning complex logic into seamless, scalable web experiences. 🚀
          </StickyNote>

        </div>

        <div className="flex flex-col items-center gap-10 text-center max-w-4xl px-6 relative mt-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.15 } }
            }}
            className="flex flex-col gap-6"
          >
            {/* Main Headline Statement */}
            <h3 className="font-display text-3xl md:text-5xl lg:text-6xl font-light text-[#1c2135] leading-tight tracking-tight">
              <motion.span 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                }}
                className="block"
              >
                I sculpt digital spaces where
              </motion.span>
              
              <motion.span 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                }}
                className="block mt-2"
              >
                <span className="font-mono text-2xl md:text-4xl px-3 py-1 bg-white border border-[#E8E5F0] rounded-lg shadow-sm text-[#E58B88] inline-flex items-center gap-2 mr-3 font-medium select-none hover:scale-105 transition-transform duration-300">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin [animation-duration:10s]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.645-.869l.214-1.28Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  logic
                </span>
                meets <span className="font-serif italic font-semibold text-[#1c2135] relative group cursor-default">
                  refined aesthetics
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#B2BEE2] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </span>
              </motion.span>
            </h3>

            {/* Sub-Statement Description */}
            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="text-base md:text-lg text-[#7D82A1] font-mono leading-relaxed max-w-2xl mx-auto mt-4"
            >
              Bridging the space between <span className="text-[#1c2135] font-medium border-b border-[#E8E5F0] pb-0.5 hover:text-[#B2BEE2] transition-colors duration-300 cursor-default">high-fidelity code</span> and human-centered design to build products that feel <span className="font-serif italic text-[#1c2135] font-medium text-lg md:text-xl">alive</span>.
            </motion.p>

            {/* Micro Interaction SVG elements */}
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { delay: 0.5, duration: 1 } }
              }}
              className="flex justify-center gap-6 mt-6"
            >
              <div className="p-3 bg-white border border-[#E8E5F0] rounded-full shadow-sm hover:scale-110 transition-transform duration-300 cursor-help group">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#B2BEE2] group-hover:rotate-45 transition-transform duration-500">
                  <path d="M12 2 C 12 12, 12 12, 22 12 C 12 12, 12 12, 12 22 C 12 12, 12 12, 2 12 C 12 12, 12 12, 12 2Z" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="p-3 bg-white border border-[#E8E5F0] rounded-full shadow-sm hover:scale-110 transition-transform duration-300 cursor-help group">
                <svg width="20" height="20" viewBox="0 0 20 30" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#E58B88] group-hover:scale-x-[-1] transition-transform duration-500">
                  <path d="M10,2 Q18,2 18,10 Q18,18 10,18 Q2,18 2,10 Q2,5 15,15 Q25,25 10,28" strokeLinecap="round" />
                </svg>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Social Cards inserted in the free space */}
        <div className="absolute left-[5%] bottom-[10%] hidden lg:block hover:-rotate-3 transition-transform duration-500">
          <SocialCards />
        </div>

        {/* Tic-Tac-Toe Game inserted in the free space */}
        <div className="absolute right-[5%] bottom-[10%] hidden lg:block hover:rotate-3 transition-transform duration-500 z-30">
          <TicTacToe />
        </div>
      </div>

      {/* Bottom row - scrolls right */}
      <div className="flex whitespace-nowrap mt-6 md:mt-8 marquee-right">
        {[...Array(4)].map((_, setIdx) => (
          <div key={setIdx} className="flex items-center shrink-0">
            {bottomRow.map((word, i) => (
              <span
                key={`${setIdx}-${i}`}
                className={`mx-3 md:mx-5 ${
                  word === "✦" 
                    ? "text-[#B2BEE2] text-lg" 
                    : "font-display font-light text-3xl md:text-5xl lg:text-6xl tracking-tight text-[#1c2135]/[0.06] hover:text-[#1c2135]/20 transition-colors duration-500 cursor-default"
                }`}
              >
                {word}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
