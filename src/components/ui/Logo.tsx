import React, { useEffect, useRef, useState } from 'react';
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
      
      // Smooth linear-alpha keying to blend antialiased calligraphic edges perfectly
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Luminance-based brightness
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        
        const minBright = 100; // Ink threshold (solid color below this)
        const maxBright = 230; // Background threshold (transparent above this)
        
        if (brightness >= maxBright) {
          data[i + 3] = 0; // Fully transparent
        } else if (brightness <= minBright) {
          // Color exactly to brand ink navy #1C2135 with full opacity
          data[i] = 28;
          data[i + 1] = 33;
          data[i + 2] = 53;
          data[i + 3] = 255;
        } else {
          // Linear interpolation for smooth alpha blending on edges
          const ratio = (brightness - minBright) / (maxBright - minBright);
          
          // Color pixels with brand ink navy #1C2135
          data[i] = 28;
          data[i + 1] = 33;
          data[i + 2] = 53;
          
          // Smooth alpha transition
          data[i + 3] = Math.round((1 - ratio) * 255);
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      setIsReady(true);
    };
  }, []);

  return (
    <div 
      className={cn("cursor-pointer select-none relative flex flex-col items-start", sizeMap[size], className)}
      style={{ opacity: isReady ? 1 : 0, transition: 'opacity 0.3s ease' }}
    >
      <div className="relative w-full aspect-[2/1]">
        {/* The antialiased signature canvas */}
        <canvas 
          ref={canvasRef}
          className="w-full h-full object-contain pointer-events-none"
        />
      </div>
    </div>
  );
}
