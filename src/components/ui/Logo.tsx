import React from 'react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

import { useEffect, useRef, useState } from 'react';

export function Logo({ className, size = 'md' }: LogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);
  
  const sizeMap = {
    sm: 'w-[140px]',
    md: 'w-[220px]',
    lg: 'w-[280px]',
    xl: 'w-[400px]'
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = '/assets/logo.png';
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Loop through pixels and turn white/near-white to transparent
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Luminance-based threshold for perfect extraction
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        if (brightness > 200) {
          data[i + 3] = 0; // Set Alpha to 0
        } else {
          // Enhance the ink darkness for a premium feel
          data[i] = Math.max(0, r - 50);
          data[i+1] = Math.max(0, g - 50);
          data[i+2] = Math.max(0, b - 50);
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      setIsReady(true);
    };
  }, []);

  return (
    <div 
      className={cn("cursor-pointer select-none relative flex flex-col items-start", sizeMap[size], className)}
      style={{ opacity: isReady ? 1 : 0 }}
    >
      <div className="relative w-full aspect-[2/1]">
        {/* The "Digitized" Signature Canvas */}
        <canvas 
          ref={canvasRef}
          className="w-full h-full object-contain pointer-events-none"
        />

        {/* Underline Flourish - Kinetic brand touch */}
        <svg 
          viewBox="0 0 400 100" 
          className="absolute -bottom-4 left-0 w-full h-12 overflow-visible pointer-events-none"
        >
          <motion.path 
            d="M80 20 Q 200 -10 320 15" 
            fill="none" 
            stroke="#1D1D1F" 
            strokeWidth="2.5" 
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
          />
        </svg>
      </div>
    </div>
  );
}
