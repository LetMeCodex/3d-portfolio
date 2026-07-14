import React, { useRef, useState, useEffect } from 'react';

type Coords = { x: number; y: number; };

interface CreepyAboutButtonProps {
  onClick?: (e: React.MouseEvent) => void;
  text?: string;
}

export function CreepyAboutButton({ onClick, text = "About Me" }: CreepyAboutButtonProps) {
  const eyesRef = useRef<HTMLSpanElement>(null);
  const [eyeCoords, setEyeCoords] = useState<Coords>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!eyesRef.current) return;
      
      const eyesRect = eyesRef.current.getBoundingClientRect();
      const eyesCenter = {
        x: eyesRect.left + eyesRect.width / 2,
        y: eyesRect.top + eyesRect.height / 2
      };
      
      const cursor = { x: e.clientX, y: e.clientY };
      const dx = cursor.x - eyesCenter.x;
      const dy = cursor.y - eyesCenter.y;
      const angle = Math.atan2(-dy, dx) + Math.PI / 2;
      
      const visionRangeX = 180;
      const visionRangeY = 75;
      const distance = Math.hypot(dx, dy);
      const x = (Math.sin(angle) * distance) / visionRangeX;
      const y = (Math.cos(angle) * distance) / visionRangeY;

      // Clamp between -1 and 1
      const clampedX = Math.max(-1, Math.min(1, x));
      const clampedY = Math.max(-1, Math.min(1, y));

      setEyeCoords({ x: clampedX, y: clampedY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const translateX = `${-50 + eyeCoords.x * 40}%`;
  const translateY = `${-50 + eyeCoords.y * 40}%`;
  const eyeStyle = { transform: `translate(${translateX}, ${translateY})` };

  return (
    <button 
      onClick={onClick}
      className="creepy-btn"
      type="button"
    >
      <span className="creepy-btn__eyes" ref={eyesRef}>
        <span className="creepy-btn__eye">
          <span className="creepy-btn__iris" style={eyeStyle}>
            <span className="creepy-btn__pupil"></span>
            <span className="creepy-btn__catchlight"></span>
          </span>
        </span>
        <span className="creepy-btn__eye">
          <span className="creepy-btn__iris" style={eyeStyle}>
            <span className="creepy-btn__pupil"></span>
            <span className="creepy-btn__catchlight"></span>
          </span>
        </span>
      </span>
      <span className="creepy-btn__cover">
        {text}
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
        </div>
      </span>

      <style>{`
        .creepy-btn {
          background-color: #E84855; 
          border-radius: 40px;
          color: white;
          cursor: pointer;
          min-width: 170px;
          outline: none;
          position: relative;
          -webkit-tap-highlight-color: transparent;
          font-family: inherit;
          border: none;
          padding: 0;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .creepy-btn__cover,
        .creepy-btn__eye {
          position: relative;
        }

        .creepy-btn__cover {
          background-color: #1D1D1F;
          border-radius: inherit;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 12px 16px 12px 32px;
          inset: 0;
          transform-origin: 20px 50%;
          transition: transform 0.4s cubic-bezier(0.65, 0, 0.35, 1);
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.2em;
        }

        /* The white of the eye */
        .creepy-btn__eye {
          animation: eye-blink 4s infinite;
          background: radial-gradient(circle at 50% 50%, #ffffff 40%, #e0e0e0 80%, #ccbbaa 100%);
          border-radius: 50%;
          overflow: hidden;
          width: 24px;
          height: 24px;
          box-shadow: inset 0 2px 5px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.2);
        }

        /* The colored iris */
        .creepy-btn__iris {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 13px;
          height: 13px;
          background: radial-gradient(circle at 50% 50%, #2997FF 0%, #1c2135 100%);
          border-radius: 50%;
          box-shadow: inset 0 0 3px rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* The black pupil */
        .creepy-btn__pupil {
          width: 5px;
          height: 5px;
          background-color: #000;
          border-radius: 50%;
        }

        /* The shiny light reflection */
        .creepy-btn__catchlight {
          position: absolute;
          top: 15%;
          left: 20%;
          width: 3px;
          height: 3px;
          background: white;
          border-radius: 50%;
          opacity: 0.9;
          box-shadow: 0 0 2px white;
        }

        .creepy-btn__eyes {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 6px;
          right: 20px;
          bottom: 12px;
          height: 24px;
        }

        .creepy-btn:hover .creepy-btn__cover {
          transform: rotate(-16deg) translateY(-2px);
          transition-timing-function: cubic-bezier(0.65, 0, 0.35, 1.65);
        }

        .creepy-btn:active .creepy-btn__cover {
          transform: rotate(0);
          transition-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
        }

        @keyframes eye-blink {
          0%, 92%, 100% {
            animation-timing-function: cubic-bezier(0.32, 0, 0.67, 0);
            transform: scaleY(1);
          }
          96% {
            animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
            transform: scaleY(0);
          }
        }
      `}</style>
    </button>
  );
}
