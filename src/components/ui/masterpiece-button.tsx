import React from 'react';
import { motion } from 'motion/react';
import { cn } from "../../lib/utils";
import { ArrowUpRight } from 'lucide-react';

interface MasterpieceButtonProps {
  onClick: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  className?: string;
}

export function MasterpieceButton({ onClick, children, className }: MasterpieceButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "group relative flex items-center gap-6 pl-8 pr-3 py-3 bg-black text-white rounded-full overflow-hidden border border-white/20",
        "shadow-[0_30px_60px_rgba(0,0,0,0.15)] transition-all duration-700",
        "hover:border-white/60 hover:shadow-[0_40px_80px_rgba(0,0,0,0.25)]",
        className
      )}
    >
      {/* Elegant White Background Reveal */}
      <div className="absolute inset-0 bg-white translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none" />

      {/* Content */}
      <span className="relative z-10 font-mono text-[11px] uppercase tracking-[0.4em] font-bold text-white group-hover:text-black transition-colors duration-500 delay-100">
        {children}
      </span>
      
      {/* Arrow Circle */}
      <div className="relative z-10 w-12 h-12 rounded-full bg-white/10 group-hover:bg-black flex items-center justify-center transition-all duration-500 group-hover:rotate-45">
        <ArrowUpRight size={20} className="text-white" />
      </div>

      {/* Inner Shine Effect */}
      <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[30deg] group-hover:left-[150%] transition-all duration-[1.5s] ease-in-out z-20 pointer-events-none" />
    </motion.button>
  );
}
