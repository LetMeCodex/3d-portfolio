import React from 'react';

interface AestheticTextRevealProps {
  text: string;
  revealText: string;
  className?: string;
}

export function AestheticTextReveal({ text, revealText, className = "" }: AestheticTextRevealProps) {
  return (
    <div 
      className={`story-reveal-text group relative inline-block cursor-crosshair overflow-hidden ${className}`}
      style={{
        color: '#F5F4F0',
        transition: 'color cubic-bezier(.1,.5,.5,1) 0.6s'
      }}
    >
      {text}
      
      {/* Overlay Span with Clipping */}
      <span 
        className="absolute inset-0 w-full h-full bg-[#E84855] text-[#0D0D0D] flex flex-col justify-center px-0 z-10 pointer-events-none"
        style={{
          clipPath: 'polygon(0 50%, 100% 50%, 100% 50%, 0 50%)',
          transformOrigin: 'center',
          transition: 'all cubic-bezier(.1,.5,.5,1) 0.5s',
          whiteSpace: 'nowrap'
        }}
      >
        {revealText}
      </span>

      <style dangerouslySetInnerHTML={{ __html: `
        .story-reveal-text:hover > span {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%) !important;
        }
      `}} />
    </div>
  );
}
