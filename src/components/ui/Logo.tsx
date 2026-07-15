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
      const dpr = window.devicePixelRatio || 1;
      
      // Set the buffer size matching Retina/High-DPI displays
      canvas.width = img.width * dpr;
      canvas.height = img.height * dpr;
      
      // Keep canvas display styling standard
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      
      // Scale ctx to draw at high DPI
      ctx.scale(dpr, dpr);
      ctx.drawImage(img, 0, 0, img.width, img.height);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Smooth linear-alpha keying with edge-boosting to sharpen borders
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Luminance-based brightness
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        
        const minBright = 90;  // Solid ink threshold
        const maxBright = 242; // Transparent background threshold
        
        if (brightness >= maxBright) {
          data[i + 3] = 0; // Fully transparent
        } else if (brightness <= minBright) {
          // Color exactly to brand ink navy #1C2135
          data[i] = 28;
          data[i + 1] = 33;
          data[i + 2] = 53;
          data[i + 3] = 255;
        } else {
          // Linear interpolation for transparency
          const ratio = (brightness - minBright) / (maxBright - minBright);
          
          // Color pixels with brand ink navy #1C2135
          data[i] = 28;
          data[i + 1] = 33;
          data[i + 2] = 53;
          
          // Apply power curve (exponent < 1) to boost border opacity and sharpen edges
          const alpha = Math.pow(1 - ratio, 0.45);
          data[i + 3] = Math.round(alpha * 255);
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
        {/* The high-DPI antialiased signature canvas */}
        <canvas 
          ref={canvasRef}
          className="w-full h-full object-contain pointer-events-none"
        />
      </div>
    </div>
  );
}
