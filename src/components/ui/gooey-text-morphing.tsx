"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { AnimatePresence, motion } from "motion/react";

interface GooeyTextProps {
  texts: string[];
  morphTime?: number;
  cooldownTime?: number;
  className?: string;
  textClassName?: string;
}

export function GooeyText({
  texts,
  morphTime = 1.2,
  cooldownTime = 2.5,
  className,
  textClassName
}: GooeyTextProps) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, (morphTime + cooldownTime) * 1000);
    
    return () => clearInterval(interval);
  }, [texts.length, morphTime, cooldownTime]);

  // Using a clean framer-motion blur crossfade to avoid SVG aliasing (pixelation)
  return (
    <div className={cn("relative flex items-center justify-start w-full h-full", className)}>
      <AnimatePresence>
        <motion.span
          key={index}
          initial={{ filter: "blur(12px)", opacity: 0, x: -5, scale: 0.98 }}
          animate={{ filter: "blur(0px)", opacity: 1, x: 0, scale: 1 }}
          exit={{ filter: "blur(12px)", opacity: 0, x: 5, scale: 1.02 }}
          transition={{ duration: morphTime, ease: "easeInOut" }}
          style={{ willChange: "filter, opacity, transform" }}
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 select-none text-left tracking-wider text-[#FF69B4]",
            textClassName
          )}
        >
          {texts[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
