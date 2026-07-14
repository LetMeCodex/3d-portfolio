import React from 'react';
import { motion, AnimatePresence } from "motion/react";

interface BookPageTransitionProps {
  children: React.ReactNode;
  isFlipped: boolean;
  backComponent: React.ReactNode;
}

export function BookPageTransition({ children, isFlipped, backComponent }: BookPageTransitionProps) {
  return (
    <div className="relative w-full min-h-screen" style={{ perspective: '2000px' }}>
      <AnimatePresence initial={false} mode="wait">
        {!isFlipped ? (
          <motion.div
            key="home"
            className="w-full min-h-screen"
            style={{ 
              backfaceVisibility: 'hidden',
              transformOrigin: 'left center',
              transformStyle: 'preserve-3d'
            }}
            initial={{ rotateY: 90, opacity: 0, scale: 0.95 }}
            animate={{ rotateY: 0, opacity: 1, scale: 1 }}
            exit={{ rotateY: -90, opacity: 0, scale: 0.95 }}
            transition={{ 
              rotateY: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.5, ease: 'easeInOut' },
              scale: { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
            }}
          >
            {children}
          </motion.div>
        ) : (
          <motion.div
            key="resume"
            className="w-full min-h-screen"
            style={{ 
              backfaceVisibility: 'hidden',
              transformOrigin: 'right center',
              transformStyle: 'preserve-3d'
            }}
            initial={{ rotateY: -90, opacity: 0, scale: 0.95 }}
            animate={{ rotateY: 0, opacity: 1, scale: 1 }}
            exit={{ rotateY: 90, opacity: 0, scale: 0.95 }}
            transition={{ 
              rotateY: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.5, ease: 'easeInOut' },
              scale: { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
            }}
          >
            {backComponent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
