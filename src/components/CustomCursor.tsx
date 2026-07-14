import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  opacity: number;
}

export function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isClicked, setIsClicked] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  // Position of precision dot
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth elastic lag for trailing ring
  const ringX = useSpring(mouseX, { damping: 30, stiffness: 220, mass: 0.6 });
  const ringY = useSpring(mouseY, { damping: 30, stiffness: 220, mass: 0.6 });

  useEffect(() => {
    // Hide default cursor only if pointer device is fine (mouse)
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      @media (pointer: fine) {
        html, body, a, button, select, input, textarea, [role="button"], .cursor-pointer {
          cursor: none !important;
        }
      }
    `;
    document.head.appendChild(styleEl);

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      if (!target) return;

      // Detect hover on links, buttons, and custom triggers
      const hoverTarget = target.closest('a, button, [role="button"], .cursor-pointer, input, select, [data-cursor]');
      if (hoverTarget) {
        setIsHovered(true);
        const text = (hoverTarget as HTMLElement).getAttribute('data-cursor') || '';
        setCursorText(text);
      } else {
        setIsHovered(false);
        setCursorText('');
      }
    };

    const handleMouseLeaveWindow = () => {
      setIsVisible(false);
    };

    const handleMouseEnterWindow = () => {
      setIsVisible(true);
    };

    const handleMouseDown = () => {
      setIsClicked(true);
      
      // Explode star particles on click
      const newParticles = Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 2 * Math.PI) / 8 + (Math.random() - 0.5) * 0.4;
        const speed = 2.5 + Math.random() * 3.5;
        return {
          id: Date.now() + i + Math.random(),
          x: mouseX.get(),
          y: mouseY.get(),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: i % 2 === 0 ? '#E58B88' : '#B2BEE2',
          size: 4 + Math.random() * 6,
          opacity: 1
        };
      });
      setParticles(prev => [...prev, ...newParticles]);
    };

    const handleMouseUp = () => {
      setIsClicked(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);

    return () => {
      styleEl.remove();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
    };
  }, [isVisible, mouseX, mouseY]);

  // Physics animation loop for click burst particles
  useEffect(() => {
    let active = true;
    const updateParticles = () => {
      if (!active) return;
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.12, // subtle gravity pull
            opacity: p.opacity - 0.035
          }))
          .filter(p => p.opacity > 0)
      );
      requestAnimationFrame(updateParticles);
    };
    requestAnimationFrame(updateParticles);
    return () => {
      active = false;
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden hidden md:block">
      {/* Click explosion particles (Mini stars) */}
      {particles.map(p => (
        <span
          key={p.id}
          className="absolute flex items-center justify-center font-bold text-[10px]"
          style={{
            left: p.x,
            top: p.y,
            color: p.color,
            opacity: p.opacity,
            transform: `translate(-50%, -50%) scale(${p.size / 8})`,
            fontSize: `${p.size * 2}px`
          }}
        >
          ✦
        </span>
      ))}

      {/* Trailing Elastic Ring */}
      <motion.div
        style={{ x: ringX, y: ringY }}
        className="absolute left-0 top-0 w-8 h-8 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
      >
        <motion.div
          animate={{
            width: isHovered ? 64 : 32,
            height: isHovered ? 64 : 32,
            scale: isClicked ? 0.8 : 1,
            backgroundColor: isHovered ? 'rgba(229, 139, 136, 0.1)' : 'rgba(229, 139, 136, 0)',
            borderColor: isHovered ? '#E58B88' : 'rgba(229, 139, 136, 0.4)',
            borderStyle: isHovered ? 'solid' : 'dashed',
            rotate: isHovered ? 90 : 0
          }}
          transition={{
            type: 'spring',
            damping: 24,
            stiffness: 180,
            rotate: { duration: 1.2, ease: 'easeInOut', repeat: Infinity }
          }}
          className="w-full h-full rounded-full border-2 relative flex items-center justify-center"
        >
          {/* Typing log tooltip tag inside ring */}
          {isHovered && cursorText && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute font-mono text-[7px] tracking-widest text-[#1c2135] bg-white border border-[#E8E5F0] px-2 py-0.5 rounded-md shadow-sm uppercase font-bold whitespace-nowrap"
              style={{ top: '70px' }}
            >
              {cursorText}
            </motion.span>
          )}
        </motion.div>
      </motion.div>

      {/* Precision Tip Pointer Dot */}
      <motion.div
        style={{ x: mouseX, y: mouseY }}
        animate={{
          scale: isClicked ? 0.6 : 1,
          backgroundColor: isHovered ? '#E58B88' : '#1c2135'
        }}
        className="absolute left-0 top-0 w-2.5 h-2.5 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 bg-[#1c2135] shadow-sm z-50"
      />
    </div>
  );
}
