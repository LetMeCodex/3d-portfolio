import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { AnimatedCornerButton } from "./ui/animated-corner-btn";
import { ArchitecturalGrid } from "./ui/ArchitecturalGrid";

/* ─────────────────────────────────────────────
   Constants & Utils
   ───────────────────────────────────────────── */
const BIRTH_DATE = new Date('2006-12-27T00:00:00');

function calculateAge() {
  const now = new Date();
  const diff = now.getTime() - BIRTH_DATE.getTime();
  const age = diff / (1000 * 60 * 60 * 24 * 365.25);
  return age.toFixed(8);
}

/* ─────────────────────────────────────────────
   Typewriter Text Component
   ───────────────────────────────────────────── */
function TypewriterText({ text, delay = 0, className = "" }: { text: string, delay?: number, className?: string }) {
  const words = text.split(" ");
  
  return (
    <div className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.6, 
            delay: delay + (i * 0.03),
            ease: "easeOut"
          }}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

const polaroids = [
  { id: 1, src: "", caption: "when i went to the awesome place and mets lots of fish", rotate: -8, top: "10%", left: "15%" },
  { id: 2, src: "", caption: "in poondi near kodaikanal where we somehow managed to get this close to the sheep...", rotate: 6, top: "45%", left: "5%" },
  { id: 3, src: "", caption: "in landour bakehouse eating tart and spinach pot pie (yum).", rotate: -4, top: "50%", left: "45%" },
  { id: 4, src: "", caption: "a beautiful memory from the mountains that feels like yesterday.", rotate: 12, top: "15%", left: "48%" },
];

function Polaroid({ data, dragRef }: { data: any, dragRef: React.RefObject<HTMLDivElement> }) {
  return (
    <motion.div
      drag
      dragConstraints={dragRef}
      whileDrag={{ scale: 1.05, zIndex: 100, rotate: 0, boxShadow: "0px 25px 50px -12px rgba(0,0,0,0.25)" }}
      initial={{ rotate: data.rotate }}
      whileHover={{ scale: 1.02, zIndex: 50 }}
      className="absolute bg-[#fcfbf9] p-3 pb-10 shadow-lg border border-gray-200 flex flex-col cursor-grab active:cursor-grabbing transition-shadow"
      style={{ width: '260px', top: data.top, left: data.left }}
    >
      <div className="w-full h-[200px] bg-[#ebebeb] overflow-hidden relative">
        {data.src ? (
          <img src={data.src} className="w-full h-full object-cover pointer-events-none" alt="Memory" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 font-mono text-xs border border-dashed border-gray-300">
            <span>[ paste image here ]</span>
          </div>
        )}
      </div>
      <p className="mt-4 font-mono text-[11px] text-center text-gray-700 pointer-events-none tracking-tight leading-relaxed px-2">
        {data.caption}
      </p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Main Page Component
   ───────────────────────────────────────────── */
interface AboutPageProps {
  onBack: (e: React.MouseEvent) => void;
}

export function AboutPage({ onBack }: AboutPageProps) {
  const [age, setAge] = useState(calculateAge());
  const containerRef = useRef(null);
  const polaroidAreaRef = useRef<HTMLDivElement>(null);

  // Staggered text reveal animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.015,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, rotate: 1 },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  const paragraph1 = [
    "I", "am", "Disha", "—", "a",
    <svg key="sparkle-1" width="16" height="16" viewBox="0 0 24 24" className="inline-block opacity-60 -mt-1 mr-1 hover:scale-125 transition-transform duration-300 align-middle" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2 C 12 12, 12 12, 22 12 C 12 12, 12 12, 12 22 C 12 12, 12 12, 2 12 C 12 12, 12 12, 12 2Z" strokeLinejoin="round" />
    </svg>,
    "creative", "developer", "navigating", "the", "beautiful", "overlap", "of", "code", "and", "aesthetic", "design.", "I", "don't", "believe", "logic", "and", "art", "should", "be", "separate.", "To", "me,",
    <span key="coding-card" className="border border-[#dcd9cf] px-3 py-1 bg-[#f3f1eb] rounded-sm shadow-[0_2px_8px_-3px_rgba(0,0,0,0.06)] inline-block text-[#4a4740] select-none hover:scale-105 transition-transform duration-300 align-middle font-mono font-semibold">
      coding
    </span>,
    "is", "the", "architecture", "and",
    <svg key="swirl-1" width="16" height="22" viewBox="0 0 20 30" className="inline-block -mt-2 mx-1 opacity-60 hover:rotate-12 transition-transform duration-300 align-middle" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10,2 Q18,2 18,10 Q18,18 10,18 Q2,18 2,10 Q2,5 15,15 Q25,25 10,28" strokeLinecap="round" />
    </svg>,
    <span key="designs-card" className="border border-[#dcd9cf] px-3 py-1 bg-[#f3f1eb] rounded-sm shadow-[0_2px_8px_-3px_rgba(0,0,0,0.06)] inline-block text-[#4a4740] select-none hover:scale-105 transition-transform duration-300 align-middle font-mono font-semibold">
      designs
    </span>,
    "are", "the", "soul.", "I", "love", "building", "digital", "canvases", "that", "tell", "a", "story,", "making", "sure", "every", "pixel", "feels", "alive", "and", "every", "transition", "is", "pure", "poetry."
  ];

  const paragraph2 = [
    "My", "journey", "is", "all", "about", "finding", "harmony", "in", "details.", "Whether", "I'm", "crafting", "immersive", "web", "layouts",
    <svg key="swirl-2" width="16" height="22" viewBox="0 0 20 30" className="inline-block -mt-2 mx-1 opacity-60 hover:rotate-12 transition-transform duration-300 align-middle" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10,2 Q18,2 18,10 Q18,18 10,18 Q2,18 2,10 Q2,5 15,15 Q25,25 10,28" strokeLinecap="round" />
    </svg>,
    "or", "designing", "a", "minimalist",
    <span key="story-card" className="border border-[#dcd9cf] px-3 py-1 bg-[#f3f1eb] rounded-sm shadow-[0_2px_8px_-3px_rgba(0,0,0,0.06)] inline-block text-[#4a4740] select-none hover:scale-105 transition-transform duration-300 align-middle font-mono font-semibold">
      storytelling
    </span>,
    "interface,", "I", "focus", "on", "creating", "a", "cozy,", "tactile", "feeling", "that", "makes", "people", "smile.", "Just", "like", "I", "express", "my", "emotions", "through",
    <span key="dancing-card" className="border border-[#dcd9cf] px-3 py-1 bg-[#f3f1eb] rounded-sm shadow-[0_2px_8px_-3px_rgba(0,0,0,0.06)] inline-block text-[#4a4740] select-none hover:scale-105 transition-transform duration-300 align-middle font-mono font-semibold">
      dancing
    </span>,
    "I", "translate", "rhythms", "into", "fluid,", "visual", "movements", "on", "the", "screen."
  ];

  const paragraph3 = [
    "When", "I'm", "not", "in", "front", "of", "my", "IDE,", "I", "chase", "simple", "offline", "joys",
    <svg key="sparkle-2" width="16" height="16" viewBox="0 0 24 24" className="inline-block opacity-60 mx-1 hover:scale-125 transition-transform duration-300 align-middle" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2 C 12 12, 12 12, 22 12 C 12 12, 12 12, 12 22 C 12 12, 12 12, 2 12 C 12 12, 12 12, 12 2Z" strokeLinejoin="round" />
    </svg>,
    "I", "love", "the", "warmth", "of",
    <span key="cooking-card" className="border border-[#dcd9cf] px-3 py-1 bg-[#f3f1eb] rounded-sm shadow-[0_2px_8px_-3px_rgba(0,0,0,0.06)] inline-block text-[#4a4740] select-none hover:scale-105 transition-transform duration-300 align-middle font-mono font-semibold">
      cooking
    </span>,
    "for", "the", "people", "I", "care", "about,", "the", "pure", "pleasure", "of",
    <span key="eating-card" className="border border-[#dcd9cf] px-3 py-1 bg-[#f3f1eb] rounded-sm shadow-[0_2px_8px_-3px_rgba(0,0,0,0.06)] inline-block text-[#4a4740] select-none hover:scale-105 transition-transform duration-300 align-middle font-mono font-semibold">
      eating
    </span>,
    "delicious", "food,", "and",
    <span key="travel-card" className="border border-[#dcd9cf] px-3 py-1 bg-[#f3f1eb] rounded-sm shadow-[0_2px_8px_-3px_rgba(0,0,0,0.06)] inline-block text-[#4a4740] select-none hover:scale-105 transition-transform duration-300 align-middle font-mono font-semibold">
      travelling
    </span>,
    "to", "quiet", "places", "to", "watch", "the", "sunset.", "But", "my", "absolute", "favorite", "superpower", "is",
    <span key="sleeping-card" className="border border-[#dcd9cf] px-3 py-1 bg-[#f3f1eb] rounded-sm shadow-[0_2px_8px_-3px_rgba(0,0,0,0.06)] inline-block text-[#4a4740] select-none hover:scale-105 transition-transform duration-300 align-middle font-mono font-semibold">
      sleeping
    </span>,
    "peacefully", "through", "rainy", "mornings.", "After", "all,", "those", "soft,", "dream-filled", "moments", "are", "where", "my", "best", "ideas", "begin."
  ];

  // Track vertical scroll for the entire 200vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Map vertical scroll to horizontal translation (0% to -50% because width is 200vw)
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const smoothX = useSpring(x, { stiffness: 100, damping: 30 });

  // Subtle vertical parallax for elements while scrolling
  const textY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const smoothTextY = useSpring(textY, { stiffness: 100, damping: 30 });
  const smoothImageY = useSpring(imageY, { stiffness: 100, damping: 30 });

  const scrollRef = useRef<HTMLDivElement>(null);

  // Effect to isolate scrollwheel events in text block when vertically scrollable
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (container.scrollHeight > container.clientHeight) {
        const isScrollingDown = e.deltaY > 0;
        const isScrollingUp = e.deltaY < 0;
        const canScrollDown = container.scrollTop < (container.scrollHeight - container.clientHeight - 2);
        const canScrollUp = container.scrollTop > 1;

        if ((isScrollingDown && canScrollDown) || (isScrollingUp && canScrollUp)) {
          container.scrollTop += e.deltaY;
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setAge(calculateAge());
    }, 100);
    return () => clearInterval(timer);
  }, []);


  return (
    <div ref={containerRef} className="h-[250vh] relative text-[#1a1a1a] font-mono selection:bg-[#ff4d4d33]">
      
      {/* Global Interactive Blueprint Grid */}
      <ArchitecturalGrid className="fixed inset-0 z-[-50]" />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;500;700;800&display=swap');
        
        .editorial-text {
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: clamp(1.5rem, 3.5vw, 2.5rem);
          line-height: 1.3;
          letter-spacing: -0.03em;
          color: #1a1a1a;
        }

        .portrait-container {
          position: absolute;
          right: -5vw;
          top: 0;
          height: 100vh;
          width: 65vw;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          pointer-events: none;
          z-index: 0;
        }

        .image-wrapper {
          position: relative;
          height: 110%;
          width: 100%;
          mask-image: radial-gradient(circle at 75% 50%, black 45%, transparent 80%);
          -webkit-mask-image: radial-gradient(circle at 75% 50%, black 45%, transparent 80%);
        }

        .portrait-image {
          height: 100%;
          width: 100%;
          object-fit: cover;
          object-position: 70% center;
          filter: contrast(1.1) brightness(1.05) saturate(1.1);
        }

        /* ── OVERLAYS TO REPLACE BAKED-IN TEXT ── */
        .baked-text-overlay {
          position: absolute;
          background: #222; 
          color: #fff;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: skewX(-5deg); 
          box-shadow: inset 0 0 5px rgba(0,0,0,0.8);
          border-radius: 2px;
          letter-spacing: 0.05em;
          z-index: 5;
        }

        .overlay-name { top: 57%; left: 34%; width: 18%; height: 3.5%; font-size: 1.2vw; }
        .overlay-height { top: 62.5%; left: 34%; width: 12%; height: 3.5%; font-size: 1vw; color: #ff4d4d; text-decoration: line-through; }
        .overlay-location { top: 68%; left: 34%; width: 14%; height: 3.5%; font-size: 1vw; }
        .overlay-birthday { top: 73.5%; left: 34%; width: 15%; height: 3.5%; font-size: 1.1vw; }

        .text-overlay {
          position: relative;
          z-index: 10;
          max-width: 55vw;
          margin-top: 15vh;
          margin-left: 8vw;
          color: #1c2135;
        }
        
        .highlight-text {
          color: #5ab1bb;
          mix-blend-mode: normal;
        }

        .bracket-link { 
          font-family: 'JetBrains Mono', monospace;
          color: #888; text-decoration: none; transition: all 0.2s ease; padding: 0 4px; background: none; border: none; cursor: pointer;
        }
        .bracket-link:hover { color: #ff4d4d; }
        .bracket-link.active { color: #1a1a1a; font-weight: bold; }

        /* Custom premium scrollbar styling */
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e3da;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #c3c1b8;
        }
      `}</style>

      {/* ── NAVIGATION BACK DOCK ── */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-8 left-8 z-[110]"
      >
        <AnimatedCornerButton
          onClick={(e) => onBack(e)}
          drawerTop="GO"
          drawerBottom="BACK"
          variant="light"
        >
          Return Home
        </AnimatedCornerButton>
      </motion.div>

      {/* ── HORIZONTAL SCROLL CONTAINER ── */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center bg-transparent">
        <motion.div 
          style={{ x: smoothX }} 
          className="flex h-screen w-[200vw] bg-transparent"
        >
          {/* SECTION 1: HERO */}
          <div className="relative w-screen h-screen shrink-0">
            
            {/* The Portrait Column */}
            <div className="portrait-container">
              <motion.div 
                style={{ y: smoothImageY }}
                className="image-wrapper"
                initial={{ 
                  clipPath: "circle(5% at 75% 50%)",
                  scale: 0.5,
                  rotate: -15,
                  opacity: 0
                }}
                whileInView={{ 
                  clipPath: "circle(150% at 75% 50%)",
                  scale: 1,
                  rotate: 0,
                  opacity: 1
                }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  duration: 2.5, 
                  ease: [0.16, 1, 0.3, 1], 
                  delay: 0.1
                }}
              >
                <img 
                  src="/DishaAboutMe_cutout.png"
                  alt="Disha Jain"
                  className="portrait-image"
                />
              </motion.div>
            </div>

            {/* The Overlapping Text Column */}
            <motion.div 
              style={{ y: smoothTextY }}
              className="text-overlay editorial-text"
            >
              <TypewriterText 
                text="I'm somewhere between software engineering and creative design, and I've stopped trying to pick a side." 
                delay={0.2}
                className="mb-8"
              />
              <TypewriterText 
                text="I believe that the best products are built at the intersection of logic and feeling. Design was where I started, but my engineering background shows up in how I think about systems." 
                delay={1.0}
                className="mb-8 opacity-90"
              />
              <TypewriterText 
                text="Driven by an aesthetic love for perfection in everything I do." 
                delay={2.0}
                className="opacity-90"
              />
              <div className="mt-12 text-sm font-mono text-[#5ab1bb] uppercase tracking-widest" style={{ mixBlendMode: 'normal' }}>
                [ disha jain / creative engineer ]
              </div>
            </motion.div>

          </div>

          {/* SECTION 2: LIFE STORY & MEMORIES */}
          <div className="relative w-screen h-screen shrink-0 flex flex-col md:flex-row items-center justify-center">
            
            {/* Left Column: Scattered Polaroids */}
            <div className="w-full md:w-1/2 h-[50vh] md:h-full relative flex items-center justify-center" ref={polaroidAreaRef}>
              {polaroids.map((data) => (
                <Polaroid key={data.id} data={data} dragRef={polaroidAreaRef} />
              ))}
            </div>

            {/* Right Column: Life Story */}
            <div className="w-full md:w-1/2 h-[50vh] md:h-full flex flex-col justify-center px-8 md:pr-[8vw] z-10">
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="max-w-[600px]"
              >
                <h2 className="text-4xl md:text-6xl font-sans font-extrabold text-[#1c2135] mb-10 tracking-tight">
                  About Me
                </h2>
                
                <div ref={scrollRef} className="space-y-6 font-mono text-[13px] md:text-[15px] text-[#4B5563] leading-loose md:leading-[2.5] tracking-normal max-h-[55vh] md:max-h-[65vh] overflow-y-auto pr-4 custom-scrollbar">
                  <motion.p 
                    variants={containerVariants} 
                    initial="hidden" 
                    whileInView="visible" 
                    viewport={{ once: false, margin: "-20px" }}
                  >
                    {paragraph1.map((item, idx) => (
                      <motion.span key={idx} variants={itemVariants} className="inline-block mr-1.5 align-middle">
                        {item}
                      </motion.span>
                    ))}
                  </motion.p>

                  <motion.p 
                    variants={containerVariants} 
                    initial="hidden" 
                    whileInView="visible" 
                    viewport={{ once: false, margin: "-20px" }}
                  >
                    {paragraph2.map((item, idx) => (
                      <motion.span key={idx} variants={itemVariants} className="inline-block mr-1.5 align-middle">
                        {item}
                      </motion.span>
                    ))}
                  </motion.p>

                  <motion.p 
                    variants={containerVariants} 
                    initial="hidden" 
                    whileInView="visible" 
                    viewport={{ once: false, margin: "-20px" }}
                  >
                    {paragraph3.map((item, idx) => (
                      <motion.span key={idx} variants={itemVariants} className="inline-block mr-1.5 align-middle">
                        {item}
                      </motion.span>
                    ))}
                  </motion.p>
                </div>
              </motion.div>
            </div>

          </div>

        </motion.div>
      </div>

    </div>
  );
}

AboutPage.displayName = 'AboutPage';
