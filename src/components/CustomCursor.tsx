import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface Point {
  x: number;
  y: number;
  time: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
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

const hexToRgba = (hex: string, alpha: number) => {
  if (hex.startsWith('rgb')) return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

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
  const particlesRef = useRef<Particle[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);

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

      // Spawn wobbly doodle particles based on speed
      const lastPoint = pointsRef.current[pointsRef.current.length - 2];
      let speed = 0;
      let vx = 0;
      let vy = 0;
      if (lastPoint) {
        vx = cx - lastPoint.x;
        vy = cy - lastPoint.y;
        speed = Math.hypot(vx, vy);
      }

      // Proportional particle spawning
      const spawnCount = Math.min(Math.floor(speed * 0.14) + 1, 4);
      
      const colors = [
        '#FFB7B2', // Peach/Pink
        '#FFDAC1', // Apricot
        '#C7CEEA', // Lavender Blue
        '#B5EAD7', // Mint Green
        '#FF9AA2', // Rose Pink
        '#E2F0CB', // Sage Green
      ];

      const types: ('star' | 'heart' | 'sparkle' | 'swirl' | 'circle')[] = [
        'star', 'heart', 'sparkle', 'swirl', 'circle'
      ];

      for (let i = 0; i < spawnCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 8;
        const px = cx + Math.cos(angle) * distance;
        const py = cy + Math.sin(angle) * distance;

        const pvx = vx * 0.1 + (Math.random() - 0.5) * 1.2;
        const pvy = vy * 0.1 + (Math.random() - 0.5) * 1.2;

        const size = Math.random() * 10 + 6; // slightly larger size for doodle details
        const color = colors[Math.floor(Math.random() * colors.length)];
        const maxLife = Math.random() * 45 + 30; // 30 to 75 frames for slow, hand-drawn look
        const type = types[Math.floor(Math.random() * types.length)];

        particlesRef.current.push({
          x: px,
          y: py,
          vx: pvx,
          vy: pvy,
          size,
          color,
          alpha: 1,
          life: 0,
          maxLife,
          type,
          angle: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.05,
        });
      }

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

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicked(true);

      const cx = e.clientX;
      const cy = e.clientY;

      // Spawn a wobbly ripple ring
      ripplesRef.current.push({
        x: cx,
        y: cy,
        radius: 4,
        maxRadius: Math.random() * 25 + 60, // 60 to 85px
        alpha: 1,
        life: 0,
        maxLife: 40,
      });

      // Spawn a burst of hand-drawn sparks and flares
      const colors = [
        '#FFB7B2', '#FFDAC1', '#C7CEEA', '#B5EAD7', '#FF9AA2', '#E2F0CB'
      ];

      const sparkCount = Math.floor(Math.random() * 5) + 12;
      for (let i = 0; i < sparkCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 2;
        const pvx = Math.cos(angle) * speed;
        const pvy = Math.sin(angle) * speed;

        const size = Math.random() * 6 + 5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const maxLife = Math.random() * 25 + 20;

        particlesRef.current.push({
          x: cx,
          y: cy,
          vx: pvx,
          vy: pvy,
          size,
          color,
          alpha: 1,
          life: 0,
          maxLife,
          type: 'spark',
          angle: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.12,
        });
      }
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

  // Canvas custom cursor rendering and particle trail loop
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

      // 1. Draw smooth ribbon trail (sketchy double pencil line effect)
      if (points.length > 1) {
        for (let i = 1; i < points.length; i++) {
          const p1 = points[i - 1];
          const p2 = points[i];
          
          const age = now - p2.time;
          const lifeRatio = Math.max(0, 1 - age / 500); // 1 at cursor, 0 at tail
          
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          
          // First fine sketch stroke
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(138, 127, 232, ${lifeRatio * 0.4})`;
          ctx.lineWidth = lifeRatio * 2.5;
          ctx.stroke();

          // Second offset fine stroke to simulate hand sketching
          ctx.beginPath();
          ctx.moveTo(p1.x + (Math.sin(p1.y * 0.1) * 0.8), p1.y + (Math.cos(p1.x * 0.1) * 0.8));
          ctx.lineTo(p2.x + (Math.sin(p2.y * 0.1) * 0.8), p2.y + (Math.cos(p2.x * 0.1) * 0.8));
          ctx.strokeStyle = `rgba(178, 190, 226, ${lifeRatio * 0.25})`;
          ctx.lineWidth = lifeRatio * 1.2;
          ctx.stroke();
        }
      }

      // 2. Update and draw Sketchy Doodle Particles
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        // Apply physics
        p.x += p.vx;
        p.y += p.vy;
        
        p.vx *= 0.96;
        p.vy *= 0.96;
        if (p.type === 'spark') {
          p.vy += 0.1; // gravity pull
        } else {
          p.vy -= 0.04; // float upward
          p.vx += (Math.random() - 0.5) * 0.1; // minor wind drift
        }

        p.alpha = 1 - p.life / p.maxLife;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.strokeStyle = hexToRgba(p.color, p.alpha);
        ctx.lineWidth = 1.2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const s = p.size * (0.4 + p.alpha * 0.6); // slight scale down as it fades

        if (p.type === 'star') {
          // Hand-drawn 5-point star
          ctx.beginPath();
          for (let step = 0; step < 5; step++) {
            const aOuter = (step * Math.PI * 2) / 5 - Math.PI / 2;
            const aInner = aOuter + Math.PI / 5;
            
            // Jitter for sketchy hand-made look
            const rOuter = s * (1 + (Math.sin(step * 1.5) * 0.08));
            const rInner = s * 0.4 * (1 + (Math.cos(step * 1.5) * 0.08));
            
            const ox = Math.cos(aOuter) * rOuter;
            const oy = Math.sin(aOuter) * rOuter;
            const ix = Math.cos(aInner) * rInner;
            const iy = Math.sin(aInner) * rInner;
            
            if (step === 0) ctx.moveTo(ox, oy);
            else ctx.lineTo(ox, oy);
            ctx.lineTo(ix, iy);
          }
          ctx.closePath();
          ctx.stroke();
          ctx.fillStyle = hexToRgba(p.color, p.alpha * 0.15); // soft color fill
          ctx.fill();
        } else if (p.type === 'heart') {
          // Hand-drawn heart
          ctx.beginPath();
          ctx.moveTo(0, -s * 0.2);
          // Left curve
          ctx.bezierCurveTo(-s * 0.6, -s * 0.8, -s * 1.1, -s * 0.3, 0, s * 0.7);
          // Right curve
          ctx.bezierCurveTo(s * 1.1, -s * 0.3, s * 0.6, -s * 0.8, 0, -s * 0.2);
          ctx.stroke();
          ctx.fillStyle = hexToRgba(p.color, p.alpha * 0.15);
          ctx.fill();
        } else if (p.type === 'sparkle') {
          // 4-point hand-drawn sparkle (+)
          ctx.beginPath();
          ctx.moveTo(-s, 0);
          ctx.quadraticCurveTo(0, 0, 0, -s);
          ctx.quadraticCurveTo(0, 0, s, 0);
          ctx.quadraticCurveTo(0, 0, 0, s);
          ctx.quadraticCurveTo(0, 0, -s, 0);
          ctx.stroke();
          ctx.fillStyle = hexToRgba(p.color, p.alpha * 0.1);
          ctx.fill();
        } else if (p.type === 'swirl') {
          // Sketchy swirl/spiral
          ctx.beginPath();
          for (let theta = 0; theta < Math.PI * 3.5; theta += 0.15) {
            const r = (s * theta) / (Math.PI * 3.5);
            const wobble = 1 + Math.sin(theta * 3) * 0.06;
            const px = Math.cos(theta) * r * wobble;
            const py = Math.sin(theta) * r * wobble;
            if (theta === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
        } else if (p.type === 'circle') {
          // Doodle circle with overlap
          ctx.beginPath();
          for (let theta = 0; theta < Math.PI * 2.15; theta += 0.15) {
            const r = s * (1 + Math.sin(theta * 4) * 0.05);
            const px = Math.cos(theta) * r;
            const py = Math.sin(theta) * r;
            if (theta === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
        } else if (p.type === 'spark') {
          // Click spark - tiny sketchy cross
          ctx.beginPath();
          ctx.moveTo(-s * 0.6, 0);
          ctx.lineTo(s * 0.6, 0);
          ctx.moveTo(0, -s * 0.6);
          ctx.lineTo(0, s * 0.6);
          ctx.stroke();
        }

        ctx.restore();
      }

      // 3. Update and draw wobbly concentric ripples
      const ripples = ripplesRef.current;
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.life++;

        if (r.life >= r.maxLife) {
          ripples.splice(i, 1);
          continue;
        }

        r.radius += (r.maxRadius - r.radius) * 0.08;
        r.alpha = 1 - r.life / r.maxLife;

        // Draw wobbly, sketchy outer ring
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

        // Secondary sketchy inner wobbly ring
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

      animationId = requestAnimationFrame(renderTrail);
    };

    animationId = requestAnimationFrame(renderTrail);
    return () => cancelAnimationFrame(animationId);
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
