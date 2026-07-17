import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'motion/react';
import { useSeason } from '../context/SeasonContext';

const NAV_ITEMS = [
  { 
    title: "Home", 
    subtitle: "Back to start", 
    type: "scroll",
    target: "top",
    img: "https://images.unsplash.com/photo-1518731174-8b63e80dfaeb?q=80&w=400&auto=format&fit=crop" 
  },
  { 
    title: "Work", 
    subtitle: "Selected Projects", 
    type: "scroll",
    target: "work",
    img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=400&auto=format&fit=crop" 
  },
  { 
    title: "About", 
    subtitle: "The artist", 
    type: "action",
    action: "about",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop" 
  },
  { 
    title: "Resume", 
    subtitle: "Qualifications", 
    type: "action",
    action: "resume",
    img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=400&auto=format&fit=crop" 
  }
];

const curve: any = {
  initial: { d: "M0 0 L100 0 L100 0 Q50 0 0 0 Z" },
  enter: {
    d: [
      "M0 0 L100 0 L100 0 Q50 0 0 0 Z",
      "M0 0 L100 0 L100 60 Q50 100 0 60 Z",
      "M0 0 L100 0 L100 100 Q50 100 0 100 Z"
    ],
    transition: { duration: 1, ease: [0.76, 0, 0.24, 1] }
  },
  exit: {
    d: [
      "M0 0 L100 0 L100 100 Q50 100 0 100 Z",
      "M0 0 L100 0 L100 40 Q50 0 0 40 Z",
      "M0 0 L100 0 L100 0 Q50 0 0 0 Z"
    ],
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
  }
};

interface NavbarProps {
  onOpenResume: (e: React.MouseEvent) => void;
  onOpenAbout: (e: React.MouseEvent) => void;
}

export function Navbar({ onOpenResume, onOpenAbout }: NavbarProps) {
  const { season, toggleSeason } = useSeason();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  return (
    <>
      {/* Menu Toggle Button - Fixed in upper-right corner */}
      <div className="fixed top-6 right-6 md:top-8 md:right-8 z-[100] pointer-events-auto">
         <motion.button
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="relative w-[3.25rem] h-[3.25rem] bg-white border border-[#89CFF0] rounded-full flex flex-col justify-center items-center gap-[4px] text-black shadow-md overflow-hidden group mix-blend-normal cursor-pointer"
         >
            <motion.div 
              animate={{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 3 : 0 }}
              className="w-[18px] h-[2px] bg-[#E84855] rounded-full origin-center transition-all duration-300"
            />
            <motion.div 
              animate={{ opacity: isMenuOpen ? 0 : 1, x: isMenuOpen ? 10 : 0 }}
              className="w-[12px] h-[2px] bg-[#E84855] rounded-full self-start ml-[17px] transition-all duration-300 group-hover:w-[18px]"
            />
            <motion.div 
              animate={{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? -3 : 0 }}
              className="w-[18px] h-[2px] bg-[#E84855] rounded-full origin-center transition-all duration-300"
            />
         </motion.button>
      </div>

      {/* SVG Fluid Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-[90] overflow-y-auto pointer-events-auto no-scrollbar" onMouseMove={handleMouseMove}>
            
            {/* SVG Background */}
            <svg className="fixed inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100" overflow="visible">
               <motion.path 
                 variants={curve} 
                 initial="initial" 
                 animate="enter" 
                 exit="exit" 
                 fill="#F5F4F0"
               />
            </svg>

            {/* Menu Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { delay: 0 } }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="relative z-10 w-full min-h-screen flex flex-col justify-between max-w-[1200px] mx-auto px-6 lg:px-12 pt-28 pb-12"
            >
              <nav className="flex flex-col w-full max-w-[1000px] my-auto">
                {NAV_ITEMS.map((item, i) => (
                  <motion.div
                    key={item.title}
                    onClick={(e) => {
                      if (item.type === "scroll") {
                        if (item.target === "top") {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        } else {
                          const el = document.getElementById(item.target);
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }
                      } else if (item.type === "action") {
                        if (item.action === "about") {
                          onOpenAbout(e);
                        } else if (item.action === "resume") {
                          onOpenResume(e);
                        }
                      }
                      setIsMenuOpen(false);
                    }}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20, transition: { delay: 0.05 * i, duration: 0.3 } }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.8, type: "spring", bounce: 0.4 }}
                    className="group relative flex flex-col md:flex-row md:items-center justify-between w-full border-b-2 border-[#1c2135]/10 py-4 md:py-6 cursor-pointer overflow-hidden"
                  >
                    <div className="flex items-center gap-6 md:gap-12">
                      <span className="font-mono text-sm md:text-xl text-[#1c2135]/20 group-hover:text-[#89CFF0] transition-colors duration-300 font-bold tracking-widest hidden md:block">0{i + 1}</span>
                      <div className="relative">
                        <span className="block font-sans font-black uppercase text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] xl:text-[6.5rem] leading-[0.9] tracking-tighter text-[#1c2135] group-hover:text-transparent group-hover:[-webkit-text-stroke:2px_#E84855] transition-all duration-300 relative z-10">
                          {item.title}
                        </span>
                        {/* Decorative circle on hover */}
                        <div className="absolute top-1/2 -right-8 md:-right-12 -translate-y-1/2 w-4 md:w-6 h-4 md:h-6 bg-[#89CFF0] rounded-full opacity-0 group-hover:opacity-100 transform translate-x-10 group-hover:translate-x-0 transition-all duration-500 z-0"></div>
                      </div>
                    </div>
                    <span className="font-mono uppercase text-xs md:text-sm font-bold tracking-[0.2em] text-[#1c2135]/40 group-hover:text-[#1c2135] transition-colors duration-300 mt-4 md:mt-0 opacity-0 md:group-hover:opacity-100 transform md:translate-x-8 md:group-hover:translate-x-0">
                      {item.subtitle}
                    </span>
                  </motion.div>
                ))}
              </nav>

              {/* Footer of the menu */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { delay: 0 } }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="w-full flex flex-col md:flex-row justify-between items-center md:items-end pt-12 pb-4 mt-auto z-10"
              >
                 <div className="flex gap-6 md:gap-12">
                   {[
                     { name: 'LinkedIn', url: 'https://linkedin.com/in/disha-jain-94016b333' },
                     { name: 'Instagram', url: 'https://instagram.com/' },
                     { name: 'Email', url: 'mailto:Jain.disha2712@gmail.com' }
                   ].map(social => (
                     <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="font-mono uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold text-[#1c2135]/40 hover:text-[#E84855] hover:scale-110 transition-all duration-300 inline-block">
                       {social.name}
                     </a>
                   ))}
                 </div>

                 <button 
                   onClick={(e) => {
                     e.stopPropagation();
                     toggleSeason();
                   }}
                   className="mt-8 md:mt-0 flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 rounded-full border-2 border-[#89CFF0] hover:bg-[#89CFF0] hover:text-white transition-colors duration-500 group pointer-events-auto shadow-sm bg-white cursor-pointer"
                 >
                   <span className="font-mono text-[10px] md:text-xs text-black uppercase tracking-widest font-bold">
                     {season === 'summer' ? '🌧️ Make it Rain' : '🌸 Bring the Sakura'}
                   </span>
                 </button>
              </motion.div>
            </motion.div>

            {/* Cute Custom Cursor in Menu */}
            <motion.div 
              className="pointer-events-none fixed top-0 left-0 w-6 h-6 border-2 border-[#1c2135] rounded-full z-50 mix-blend-difference hidden md:flex items-center justify-center"
              style={{ x: mouseX, y: mouseY, translateX: "-50%", translateY: "-50%" }}
            >
               <div className="w-1.5 h-1.5 bg-[#1c2135] rounded-full" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
