import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface Point {
  x: number;
  y: number;
  time: number;
}

export function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredRect, setHoveredRect] = useState<DOMRect | null>(null);
  const [hoveredRadius, setHoveredRadius] = useState('50%');
  const [cursorText, setCursorText] = useState('');
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Precision coordinate values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Mouse trajectory points history for blueprint line drawings
  const pointsRef = useRef<Point[]>([]);

  // Smooth springs for trailing magnetic focus box
  const boxX = useSpring(mouseX, { damping: 25, stiffness: 200, mass: 0.5 });
  const boxY = useSpring(mouseY, { damping: 25, stiffness: 200, mass: 0.5 });
  const boxWidth = useSpring(24, { damping: 25, stiffness: 220 });
  const boxHeight = useSpring(24, { damping: 25, stiffness: 220 });
  const boxRadius = useSpring(9999, { damping: 25, stiffness: 220 });

  useEffect(() => {
    // Inject CSS to hide browser cursor on mouse devices
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      @media (pointer: fine) {
        html, body, a, button, select, input, textarea, [role="button"], .cursor-pointer {
          cursor: none !important;
        }
      }
    `;
    document.head.appendChild(styleEl);

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);

      const cx = e.clientX;
      const cy = e.clientY;
      mouseX.set(cx);
      mouseY.set(cy);

      // Track coordinates for calling technical lines trail
      pointsRef.current.push({ x: cx, y: cy, time: Date.now() });

      // Scan target element for layout focus snapping
      const target = e.target as HTMLElement;
      if (target) {
        const hoverTarget = target.closest('a, button, [role="button"], .cursor-pointer, input, select, [data-cursor]');
        if (hoverTarget) {
          const rect = hoverTarget.getBoundingClientRect();
          setHoveredRect(rect);
          
          // Get border radius styles dynamically for perfect box alignment
          const style = window.getComputedStyle(hoverTarget);
          setHoveredRadius(style.borderRadius || '8px');
          
          const text = (hoverTarget as HTMLElement).getAttribute('data-cursor') || '';
          setCursorText(text);

          // Snap trailing box directly to the button dimensions
          boxX.set(rect.left);
          boxY.set(rect.top);
          boxWidth.set(rect.width);
          boxHeight.set(rect.height);
          
          const radiusNum = parseFloat(style.borderRadius);
          boxRadius.set(isNaN(radiusNum) ? 8 : radiusNum);
        } else {
          setHoveredRect(null);
          setCursorText('');
          
          // Shrink box back into standard trailing circle
          boxX.set(cx - 12);
          boxY.set(cy - 12);
          boxWidth.set(24);
          boxHeight.set(24);
          boxRadius.set(9999);
        }
      }
    };

    const handleMouseDown = () => {
      setIsClicked(true);
    };

    const handleMouseUp = () => {
      setIsClicked(false);
    };

    const handleMouseLeaveWindow = () => {
      setIsVisible(false);
    };

    const handleMouseEnterWindow = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('resize', handleResize);
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);

    return () => {
      styleEl.remove();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
    };
  }, [isVisible, mouseX, mouseY, boxX, boxY, boxWidth, boxHeight, boxRadius]);

  // Canvas calligraphic parallel-line drafting trail loop
  useEffect(() => {
    let animationId: number;

    const renderTrail = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const now = Date.now();
      // Age points (500ms lifespan)
      pointsRef.current = pointsRef.current.filter(p => now - p.time < 500);
      const points = pointsRef.current;

      if (points.length > 2) {
        // Draw 3 fine parallel calligraphic wireframe lines (converging drafting pen effect)
        for (let lineOffset = -1.5; lineOffset <= 1.5; lineOffset += 1.5) {
          ctx.beginPath();
          
          // Color fading gradient along path
          const grad = ctx.createLinearGradient(
            points[0].x, points[0].y, 
            points[points.length - 1].x, points[points.length - 1].y
          );
          grad.addColorStop(0, 'rgba(178, 190, 226, 0)'); // fade trail start
          grad.addColorStop(0.5, 'rgba(229, 139, 136, 0.4)');
          grad.addColorStop(1, 'rgba(28, 33, 53, 0.65)'); // solid near cursor

          ctx.strokeStyle = grad;
          ctx.lineWidth = lineOffset === 0 ? 1 : 0.5; // middle line slightly more solid
          
          for (let i = 1; i < points.length; i++) {
            const p1 = points[i - 1];
            const p2 = points[i];

            // Direction vector to offset perpendicular lines
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const len = Math.hypot(dx, dy);
            
            let nx = 0;
            let ny = 0;
            if (len > 0.1) {
              nx = -dy / len;
              ny = dx / len;
            }

            const scaleOffset = lineOffset * (1 + (len * 0.1)); // converge/disperse based on speed

            const cx = (p2.x + p1.x) / 2 + nx * scaleOffset;
            const cy = (p2.y + p1.y) / 2 + ny * scaleOffset;

            if (i === 1) {
              ctx.moveTo(p1.x + nx * scaleOffset, p1.y + ny * scaleOffset);
            }
            ctx.quadraticCurveTo(p1.x + nx * scaleOffset, p1.y + ny * scaleOffset, cx, cy);
          }
          ctx.stroke();
        }
      }

      animationId = requestAnimationFrame(renderTrail);
    };

    animationId = requestAnimationFrame(renderTrail);
    return () => cancelAnimationFrame(animationId);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden hidden md:block">
      {/* Calligraphy Drafting Canvas Trail */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[9998]" />

      {/* Trailing Bounding Focus Box */}
      <motion.div
        style={{
          x: boxX,
          y: boxY,
          width: boxWidth,
          height: boxHeight,
          borderRadius: boxRadius,
        }}
        animate={{
          borderColor: hoveredRect ? '#E58B88' : 'rgba(28, 33, 53, 0.2)',
          borderStyle: hoveredRect ? 'solid' : 'dashed',
          backgroundColor: hoveredRect ? 'rgba(229, 139, 136, 0.03)' : 'rgba(0,0,0,0)',
          boxShadow: hoveredRect ? '0 15px 35px rgba(229,139,136,0.1)' : 'none',
        }}
        transition={{
          type: 'spring',
          damping: 24,
          stiffness: 220,
        }}
        className="fixed left-0 top-0 border-2 z-40 pointer-events-none flex items-center justify-center"
      >
        {/* CAD Blueprint Corner Ticks (Visible only when hovering over components) */}
        {hoveredRect && (
          <>
            <div className="absolute top-[-3px] left-[-3px] w-2 h-2 border-t-2 border-l-2 border-[#1c2135]/40" />
            <div className="absolute top-[-3px] right-[-3px] w-2 h-2 border-t-2 border-r-2 border-[#1c2135]/40" />
            <div className="absolute bottom-[-3px] left-[-3px] w-2 h-2 border-b-2 border-l-2 border-[#1c2135]/40" />
            <div className="absolute bottom-[-3px] right-[-3px] w-2 h-2 border-b-2 border-r-2 border-[#1c2135]/40" />

            {/* Scale/Coord Layout Tag */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute -top-7 left-0 font-mono text-[7px] tracking-widest text-[#1c2135] bg-[#FAF8F5] px-2 py-0.5 border border-[#E8E5F0] rounded shadow-sm whitespace-nowrap uppercase font-bold"
            >
              LOC: [{Math.round(hoveredRect.left)}, {Math.round(hoveredRect.top)}] | DIM: [{Math.round(hoveredRect.width)}x{Math.round(hoveredRect.height)}]
            </motion.div>

            {/* Custom Tooltip text tag */}
            {cursorText && (
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute font-mono text-[6.5px] tracking-widest text-white bg-[#1c2135] px-1.5 py-0.5 rounded shadow-sm uppercase font-bold whitespace-nowrap"
                style={{ bottom: '-18px' }}
              >
                {cursorText}
              </motion.span>
            )}
          </>
        )}
      </motion.div>

      {/* Precision CAD Rotating Crosshair Core */}
      <motion.div
        style={{ x: mouseX, y: mouseY }}
        animate={{
          scale: isClicked ? 0.85 : 1,
          rotate: 360,
        }}
        transition={{
          rotate: { duration: 16, repeat: Infinity, ease: 'linear' },
          scale: { type: 'spring', damping: 15, stiffness: 250 }
        }}
        className="absolute left-0 top-0 w-3 h-3 pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-50"
      >
        {/* Precision Core Dot */}
        <div className="w-1.5 h-1.5 bg-[#1c2135] rounded-full" />

        {/* CAD Crosshairs */}
        <div className="absolute top-[-6px] left-[5px] w-[1px] h-[5px] bg-[#1c2135]/60" />
        <div className="absolute bottom-[-6px] left-[5px] w-[1px] h-[5px] bg-[#1c2135]/60" />
        <div className="absolute left-[-6px] top-[5px] w-[5px] h-[1px] bg-[#1c2135]/60" />
        <div className="absolute right-[-6px] top-[5px] w-[5px] h-[1px] bg-[#1c2135]/60" />
      </motion.div>
    </div>
  );
}
