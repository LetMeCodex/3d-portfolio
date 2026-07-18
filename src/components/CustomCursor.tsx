import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  colorRgb: string;
  alpha: number;
  life: number;
  maxLife: number;
  type: 'star' | 'heart' | 'sparkle' | 'swirl' | 'circle' | 'spark';
  angle: number;
  spin: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoverTargetRef = useRef<HTMLElement | null>(null);
  const [hoveredRect, setHoveredRect] = useState<DOMRect | null>(null);
  const [hoveredRadius, setHoveredRadius] = useState('50%');
  const [cursorText, setCursorText] = useState('');
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Precision coordinate values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Click reaction systems
  const particlesRef = useRef<Particle[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const isAnimatingRef = useRef(false);
  const animationIdRef = useRef<number>(0);

  // Smooth springs for trailing magnetic focus box
  const boxX = useSpring(mouseX, { damping: 25, stiffness: 200, mass: 0.5 });
  const boxY = useSpring(mouseY, { damping: 25, stiffness: 200, mass: 0.5 });
  const boxWidth = useSpring(24, { damping: 25, stiffness: 220 });
  const boxHeight = useSpring(24, { damping: 25, stiffness: 220 });
  const boxRadius = useSpring(9999, { damping: 25, stiffness: 220 });

  useEffect(() => {
    // Touch device detection bypass
    const isTouchDevice = () => {
      return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        ((navigator as any).msMaxTouchPoints > 0));
    };
    if (isTouchDevice()) return;

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

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const hoverTarget = target.closest('a, button, [role="button"], .cursor-pointer, input, select, [data-cursor]') as HTMLElement | null;

      if (hoverTarget !== hoverTargetRef.current) {
        hoverTargetRef.current = hoverTarget;
        if (hoverTarget) {
          const rect = hoverTarget.getBoundingClientRect();
          setHoveredRect(rect);
          
          const style = window.getComputedStyle(hoverTarget);
          setHoveredRadius(style.borderRadius || '8px');
          
          const text = hoverTarget.getAttribute('data-cursor') || '';
          setCursorText(text);

          boxX.set(rect.left);
          boxY.set(rect.top);
          boxWidth.set(rect.width);
          boxHeight.set(rect.height);
          
          const radiusNum = parseFloat(style.borderRadius);
          boxRadius.set(isNaN(radiusNum) ? 8 : radiusNum);
        } else {
          setHoveredRect(null);
          setCursorText('');
          
          boxWidth.set(24);
          boxHeight.set(24);
          boxRadius.set(9999);
        }
      }
    };

    const handleScroll = () => {
      if (hoverTargetRef.current) {
        const rect = hoverTargetRef.current.getBoundingClientRect();
        setHoveredRect(rect);
        boxX.set(rect.left);
        boxY.set(rect.top);
        boxWidth.set(rect.width);
        boxHeight.set(rect.height);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);

      const cx = e.clientX;
      const cy = e.clientY;
      mouseX.set(cx);
      mouseY.set(cy);

      // Snapped focus tracking
      if (hoverTargetRef.current) {
        const rect = hoverTargetRef.current.getBoundingClientRect();
        setHoveredRect(rect);
        boxX.set(rect.left);
        boxY.set(rect.top);
        boxWidth.set(rect.width);
        boxHeight.set(rect.height);
      } else {
        boxX.set(cx - 12);
        boxY.set(cy - 12);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicked(true);

      const cx = e.clientX;
      const cy = e.clientY;

      // Bypass cursor ripples and sparks when interacting with the Rubik's Cube widget
      const target = e.target as HTMLElement;
      if (target && target.closest('.the-cube-game, .ui__game')) {
        return;
      }

      // Spawn a wobbly ripple ring
      ripplesRef.current.push({
        x: cx,
        y: cy,
        radius: 4,
        maxRadius: Math.random() * 25 + 60,
        alpha: 1,
        life: 0,
        maxLife: 40,
      });

      // Spawn a burst of hand-drawn sparks
      const colorsRgb = [
        '255, 183, 178', '255, 218, 193', '199, 206, 234', '181, 234, 215', '255, 154, 162', '226, 240, 203'
      ];

      const sparkCount = Math.floor(Math.random() * 3) + 8;
      for (let i = 0; i < sparkCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 2;
        const pvx = Math.cos(angle) * speed;
        const pvy = Math.sin(angle) * speed;

        const size = Math.random() * 5 + 4;
        const colorRgb = colorsRgb[Math.floor(Math.random() * colorsRgb.length)];
        const maxLife = Math.random() * 20 + 15;

        particlesRef.current.push({
          x: cx,
          y: cy,
          vx: pvx,
          vy: pvy,
          size,
          colorRgb,
          alpha: 1,
          life: 0,
          maxLife,
          type: 'spark',
          angle: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.12,
        });
      }

      // Start canvas animation loop if not already running
      startCanvasLoop();
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

    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('resize', handleResize);
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);

    return () => {
      styleEl.remove();
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
    };
  }, [isVisible, mouseX, mouseY, boxX, boxY, boxWidth, boxHeight, boxRadius]);

  // Start the canvas animation loop only when there are particles/ripples to render
  const startCanvasLoop = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const renderTrail = () => {
      const canvas = canvasRef.current;
      if (!canvas) { isAnimatingRef.current = false; return; }
      const ctx = canvas.getContext('2d');
      if (!ctx) { isAnimatingRef.current = false; return; }

      const particles = particlesRef.current;
      const ripples = ripplesRef.current;

      // If nothing to render, stop the loop (saves CPU when idle)
      if (particles.length === 0 && ripples.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        isAnimatingRef.current = false;
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Update and draw Click Sparks
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy += 0.1;
        p.alpha = 1 - p.life / p.maxLife;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.strokeStyle = 'rgba(' + p.colorRgb + ',' + p.alpha + ')';
        ctx.lineWidth = 1.2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const s = p.size * (0.4 + p.alpha * 0.6);

        ctx.beginPath();
        ctx.moveTo(-s * 0.6, 0);
        ctx.lineTo(s * 0.6, 0);
        ctx.moveTo(0, -s * 0.6);
        ctx.lineTo(0, s * 0.6);
        ctx.stroke();

        ctx.restore();
      }

      // 2. Update and draw wobbly concentric ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.life++;

        if (r.life >= r.maxLife) {
          ripples.splice(i, 1);
          continue;
        }

        r.radius += (r.maxRadius - r.radius) * 0.08;
        r.alpha = 1 - r.life / r.maxLife;

        ctx.beginPath();
        for (let theta = 0; theta < Math.PI * 2.1; theta += 0.15) {
          const w = r.radius * (1 + Math.sin(theta * 6 + r.life * 0.1) * 0.03);
          const px = r.x + Math.cos(theta) * w;
          const py = r.y + Math.sin(theta) * w;
          if (theta === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = `rgba(138, 127, 232, ${r.alpha * 0.4})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        if (r.radius > 20) {
          ctx.beginPath();
          for (let theta = 0; theta < Math.PI * 2.1; theta += 0.15) {
            const w = (r.radius - 12) * (1 + Math.cos(theta * 5 - r.life * 0.15) * 0.04);
            const px = r.x + Math.cos(theta) * w;
            const py = r.y + Math.sin(theta) * w;
            if (theta === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.strokeStyle = `rgba(255, 133, 193, ${r.alpha * 0.25})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      animationIdRef.current = requestAnimationFrame(renderTrail);
    };

    animationIdRef.current = requestAnimationFrame(renderTrail);
  };

  // Cleanup on unmount
  useEffect(() => {
    const isTouchDevice = () => {
      return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        ((navigator as any).msMaxTouchPoints > 0));
    };
    if (isTouchDevice()) return;

    return () => {
      cancelAnimationFrame(animationIdRef.current);
      isAnimatingRef.current = false;
    };
  }, []);

  return (
    <div 
      style={{ opacity: isVisible ? 1 : 0 }}
      className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden hidden md:block transition-opacity duration-300"
    >
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
          borderColor: hoveredRect ? '#8A7FE8' : 'rgba(138, 127, 232, 0.25)',
          borderStyle: hoveredRect ? 'solid' : 'dashed',
          backgroundColor: hoveredRect ? 'rgba(138, 127, 232, 0.04)' : 'rgba(0,0,0,0)',
          boxShadow: hoveredRect ? '0 15px 35px rgba(138,127,232,0.15)' : 'none',
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
              className="absolute -top-7 left-0 font-mono text-[7px] tracking-widest text-[#8A7FE8] bg-[#FAF8F5] px-2 py-0.5 border border-[#8A7FE8]/20 rounded shadow-sm whitespace-nowrap uppercase font-bold"
            >
              LOC: [{Math.round(hoveredRect.left)}, {Math.round(hoveredRect.top)}] | DIM: [{Math.round(hoveredRect.width)}x{Math.round(hoveredRect.height)}]
            </motion.div>

            {/* Custom Tooltip text tag */}
            {cursorText && (
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute font-mono text-[6.5px] tracking-widest text-white bg-[#8A7FE8] px-1.5 py-0.5 rounded shadow-sm uppercase font-bold whitespace-nowrap"
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
        <div className="w-1.5 h-1.5 bg-[#8A7FE8] rounded-full" />

        {/* CAD Crosshairs */}
        <div className="absolute top-[-6px] left-[5px] w-[1px] h-[5px] bg-[#8A7FE8]/75" />
        <div className="absolute bottom-[-6px] left-[5px] w-[1px] h-[5px] bg-[#8A7FE8]/75" />
        <div className="absolute left-[-6px] top-[5px] w-[5px] h-[1px] bg-[#8A7FE8]/75" />
        <div className="absolute right-[-6px] top-[5px] w-[5px] h-[1px] bg-[#8A7FE8]/75" />
      </motion.div>
    </div>
  );
}
