import React from 'react';
import { motion } from 'motion/react';

interface StickyNoteProps {
  children: React.ReactNode;
  className?: string;
  rotation?: number;
  colorTheme?: "yellow" | "pink" | "blue" | "white";
  dragConstraints?: any;
}

const themeColors = {
  yellow: { bg: "bg-[#FFDF6C]", perf: "bg-[#D4B54B]", text: "text-[#332E18]" },
  pink: { bg: "bg-[#FFC4D9]", perf: "bg-[#D4A3B5]", text: "text-[#4A2635]" },
  blue: { bg: "bg-[#C4E4FF]", perf: "bg-[#A3C4D4]", text: "text-[#263C4A]" },
  white: { bg: "bg-white", perf: "bg-black/10", text: "text-black" },
};

export function StickyNote({ 
  children, 
  className = "", 
  rotation = -2,
  colorTheme = "yellow",
  dragConstraints
}: StickyNoteProps) {
  
  const colors = themeColors[colorTheme] || themeColors.yellow;
  const hoverRotate = rotation > 0 ? rotation + 2 : rotation - 2;

  return (
    <motion.div
      drag
      dragConstraints={dragConstraints}
      whileHover={{ 
        scale: 1.05, 
        rotate: hoverRotate,
        cursor: "grab",
        boxShadow: "0 25px 40px -10px rgba(0,0,0,0.2), 0 10px 20px -10px rgba(0,0,0,0.1)"
      }}
      whileTap={{ scale: 1.1, cursor: "grabbing" }}
      initial={{ opacity: 0, scale: 0.8, rotate: rotation > 0 ? rotation - 5 : rotation + 5 }}
      whileInView={{ opacity: 1, scale: 1, rotate: rotation }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
      className={`relative ${colors.bg} shadow-[0_15px_35px_-5px_rgba(0,0,0,0.15),0_5px_15px_-5px_rgba(0,0,0,0.05)] p-8 md:p-10 w-64 md:w-[320px] rounded-sm select-none touch-none ${className}`}
      style={{ 
        transformOrigin: "center center",
      }}
    >
      {/* Tape/Pin/Perforations to show it's stuck */}
      <div className="absolute top-3 left-0 w-full flex justify-center gap-5 opacity-40 pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`w-5 h-2.5 ${colors.perf} opacity-50 rounded-[2px]`} />
        ))}
      </div>

      {/* Content */}
      <div className={`relative z-10 mt-4 font-sans text-[14px] md:text-[15px] ${colors.text} leading-[1.6] font-semibold tracking-tight text-left pointer-events-none`}>
        {children}
      </div>
    </motion.div>
  );
}
