import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface Point {
  x: number;
  y: number;
  time: number;
}

export function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isArchitectMode, setIsArchitectMode] = useState(false);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [hoveredRect, setHoveredRect] = useState<DOMRect | null>(null);
  const [hoveredRadius, setHoveredRadius] = useState('50%');
  const [cursorText, setCursorText] = useState('');
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // HUD parameter states for selected component
  const [elementScale, setElementScale] = useState(1);
  const [elementHue, setElementHue] = useState(0);
  const [elementSat, setElementSat] = useState(100);
  const [elementDx, setElementDx] = useState(0);
  const [elementDy, setElementDy] = useState(0);

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

      // Scan target element for layout focus snapping (unless we are interacting with the HUD)
      const target = e.target as HTMLElement;
      if (target) {
        if (target.closest('.hud-panel') || target.closest('.architect-toggle')) return;

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
          // If we have an active selected element in architect mode, keep the box locked to it
          if (isArchitectMode && selectedElement) {
            const rect = selectedElement.getBoundingClientRect();
            setHoveredRect(rect);
            boxX.set(rect.left);
            boxY.set(rect.top);
            boxWidth.set(rect.width);
            boxHeight.set(rect.height);
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
  }, [isVisible, mouseX, mouseY, boxX, boxY, boxWidth, boxHeight, boxRadius, isArchitectMode, selectedElement]);

  // Global click interceptor when architect mode is active to select components
  useEffect(() => {
    if (!isArchitectMode) {
      setSelectedElement(null);
      return;
    }

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Don't intercept clicks inside the HUD or the toggle switch itself
      if (target.closest('.hud-panel') || target.closest('.architect-toggle')) return;

      e.preventDefault();
      e.stopPropagation();

      // Find component parent wrapper to manipulate
      const hoverTarget = target.closest('a, button, [role="button"], h1, h2, h3, p, img, canvas, .social-main, .w-[188px], .w-[228px], .hud-panel, input, select');
      if (hoverTarget) {
        const el = hoverTarget as HTMLElement;
        setSelectedElement(el);

        // Scan current CSS styles to initialize HUD controls
        const transform = el.style.transform;
        const scaleMatch = transform.match(/scale\(([^)]+)\)/);
        const translateMatch = transform.match(/translate\(([^px]+)px,\s*([^px]+)px\)/);
        setElementScale(scaleMatch ? parseFloat(scaleMatch[1]) : 1);
        setElementDx(translateMatch ? parseFloat(translateMatch[1]) : 0);
        setElementDy(translateMatch ? parseFloat(translateMatch[2]) : 0);

        const filter = el.style.filter;
        const hueMatch = filter.match(/hue-rotate\(([^deg]+)deg\)/);
        const satMatch = filter.match(/saturate\(([^%]+)%\)/);
        setElementHue(hueMatch ? parseFloat(hueMatch[1]) : 0);
        setElementSat(satMatch ? parseFloat(satMatch[1]) : 100);
      } else {
        setSelectedElement(null);
      }
    };

    window.addEventListener('click', handleGlobalClick, true);
    return () => {
      window.removeEventListener('click', handleGlobalClick, true);
    };
  }, [isArchitectMode]);

  // Direct mouse drag-to-position mechanics for selected component
  useEffect(() => {
    if (!selectedElement || !isArchitectMode) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let startDx = elementDx;
    let startDy = elementDy;

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.hud-panel') || target.closest('.architect-toggle')) return;

      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startDx = elementDx;
      startDy = elementDy;
      
      selectedElement.style.transition = 'none';
      document.body.style.userSelect = 'none';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = startDx + (e.clientX - startX);
      const dy = startDy + (e.clientY - startY);
      
      setElementDx(dx);
      setElementDy(dy);

      selectedElement.style.transform = `translate(${dx}px, ${dy}px) scale(${elementScale})`;
      
      const rect = selectedElement.getBoundingClientRect();
      setHoveredRect(rect);
      boxX.set(rect.left);
      boxY.set(rect.top);
      boxWidth.set(rect.width);
      boxHeight.set(rect.height);
    };

    const handleMouseUp = () => {
      if (isDragging) {
        isDragging = false;
        selectedElement.style.transition = '';
        document.body.style.userSelect = '';
      }
    };

    selectedElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      selectedElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [selectedElement, isArchitectMode, elementDx, elementDy, elementScale, boxX, boxY, boxWidth, boxHeight]);

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
      pointsRef.current = pointsRef.current.filter(p => now - p.time < 500);
      const points = pointsRef.current;

      if (points.length > 2) {
        for (let lineOffset = -1.5; lineOffset <= 1.5; lineOffset += 1.5) {
          ctx.beginPath();
          
          const grad = ctx.createLinearGradient(
            points[0].x, points[0].y, 
            points[points.length - 1].x, points[points.length - 1].y
          );
          grad.addColorStop(0, 'rgba(178, 190, 226, 0)');
          grad.addColorStop(0.5, 'rgba(229, 139, 136, 0.4)');
          grad.addColorStop(1, 'rgba(28, 33, 53, 0.65)');

          ctx.strokeStyle = grad;
          ctx.lineWidth = lineOffset === 0 ? 1 : 0.5;
          
          for (let i = 1; i < points.length; i++) {
            const p1 = points[i - 1];
            const p2 = points[i];

            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const len = Math.hypot(dx, dy);
            
            let nx = 0;
            let ny = 0;
            if (len > 0.1) {
              nx = -dy / len;
              ny = dx / len;
            }

            const scaleOffset = lineOffset * (1 + (len * 0.1));

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

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setElementScale(val);
    if (selectedElement) {
      selectedElement.style.transform = `translate(${elementDx}px, ${elementDy}px) scale(${val})`;
      const rect = selectedElement.getBoundingClientRect();
      setHoveredRect(rect);
      boxX.set(rect.left);
      boxY.set(rect.top);
      boxWidth.set(rect.width);
      boxHeight.set(rect.height);
    }
  };

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setElementHue(val);
    if (selectedElement) {
      selectedElement.style.filter = `hue-rotate(${val}deg) saturate(${elementSat}%)`;
    }
  };

  const handleSatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setElementSat(val);
    if (selectedElement) {
      selectedElement.style.filter = `hue-rotate(${elementHue}deg) saturate(${val}%)`;
    }
  };

  const handleReset = () => {
    setElementScale(1);
    setElementHue(0);
    setElementSat(100);
    setElementDx(0);
    setElementDy(0);
    if (selectedElement) {
      selectedElement.style.transform = '';
      selectedElement.style.filter = '';
      selectedElement.style.display = '';
      const rect = selectedElement.getBoundingClientRect();
      setHoveredRect(rect);
      boxX.set(rect.left);
      boxY.set(rect.top);
      boxWidth.set(rect.width);
      boxHeight.set(rect.height);
    }
  };

  const handleDelete = () => {
    if (selectedElement) {
      selectedElement.style.display = 'none';
      setSelectedElement(null);
      setHoveredRect(null);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden hidden md:block">
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
          borderColor: isArchitectMode ? '#34C759' : (hoveredRect ? '#E58B88' : 'rgba(28, 33, 53, 0.2)'),
          borderStyle: isArchitectMode ? 'dashed' : (hoveredRect ? 'solid' : 'dashed'),
          backgroundColor: isArchitectMode ? 'rgba(52, 199, 89, 0.02)' : (hoveredRect ? 'rgba(229, 139, 136, 0.03)' : 'rgba(0,0,0,0)'),
          boxShadow: hoveredRect ? '0 15px 35px rgba(229,139,136,0.1)' : 'none',
        }}
        transition={{
          type: 'spring',
          damping: 24,
          stiffness: 220,
        }}
        className="fixed left-0 top-0 border-2 z-40 pointer-events-none flex items-center justify-center"
      >
        {/* CAD Blueprint Corner Ticks */}
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
              {isArchitectMode ? 'ARCHITECT MODE' : `LOC: [${Math.round(hoveredRect.left)}, ${Math.round(hoveredRect.top)}]`} | DIM: [{Math.round(hoveredRect.width)}x{Math.round(hoveredRect.height)}]
            </motion.div>

            {/* Custom Tooltip text tag */}
            {cursorText && !isArchitectMode && (
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
        <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${isArchitectMode ? 'bg-[#34C759]' : 'bg-[#1c2135]'}`} />
        <div className="absolute top-[-6px] left-[5px] w-[1px] h-[5px] bg-[#1c2135]/60" />
        <div className="absolute bottom-[-6px] left-[5px] w-[1px] h-[5px] bg-[#1c2135]/60" />
        <div className="absolute left-[-6px] top-[5px] w-[5px] h-[1px] bg-[#1c2135]/60" />
        <div className="absolute right-[-6px] top-[5px] w-[5px] h-[1px] bg-[#1c2135]/60" />
      </motion.div>

      {/* Floating Architect Sandbox Mode Toggle */}
      <button
        onClick={() => setIsArchitectMode(!isArchitectMode)}
        className={`architect-toggle fixed bottom-6 left-6 z-[9999] flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-black/10 shadow-lg font-mono text-[9px] tracking-widest uppercase font-bold transition-all duration-500 hover:scale-105 active:scale-95 pointer-events-auto ${
          isArchitectMode 
            ? 'bg-[#1c2135] text-white border-white/20' 
            : 'bg-white/85 text-[#1c2135] backdrop-blur-md'
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${isArchitectMode ? 'bg-[#34C759] animate-pulse' : 'bg-black/30'}`} />
        {isArchitectMode ? "ARCHITECT: ON" : "ARCHITECT MODE"}
      </button>

      {/* Architect Control Panel callout */}
      {isArchitectMode && selectedElement && hoveredRect && (
        <div 
          className="hud-panel fixed bg-[#1c2135]/95 text-white font-mono text-[9px] p-4 rounded-2xl shadow-2xl border border-white/10 w-[180px] flex flex-col gap-3.5 backdrop-blur-md z-[10000] pointer-events-auto"
          style={{
            left: `${Math.min(window.innerWidth - 200, hoveredRect.right + 15)}px`,
            top: `${Math.min(window.innerHeight - 220, hoveredRect.top)}px`
          }}
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
            <span className="font-bold tracking-widest text-[#E58B88]">🛠️ COMPONENT HUD</span>
            <button 
              onClick={() => setSelectedElement(null)}
              className="text-white/40 hover:text-white font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {/* Scale Slider */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[7px] text-white/50">
                <span>SCALE</span>
                <span>{elementScale.toFixed(2)}x</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="2.0" 
                step="0.05" 
                value={elementScale} 
                onChange={handleScaleChange}
                className="accent-[#E58B88] w-full h-[2px] bg-white/15 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Hue Slider */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[7px] text-white/50">
                <span>COLOR HUE</span>
                <span>{elementHue}°</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="360" 
                value={elementHue} 
                onChange={handleHueChange}
                className="accent-[#B2BEE2] w-full h-[2px] bg-white/15 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Saturation Slider */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[7px] text-white/50">
                <span>SATURATION</span>
                <span>{elementSat}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="200" 
                value={elementSat} 
                onChange={handleSatChange}
                className="accent-[#E58B88] w-full h-[2px] bg-white/15 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button 
              onClick={handleReset}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/10 py-1.5 rounded text-[7px] font-bold transition-all uppercase tracking-widest cursor-pointer"
            >
              Reset
            </button>
            <button 
              onClick={handleDelete}
              className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 py-1.5 rounded text-[7px] font-bold transition-all uppercase tracking-widest cursor-pointer"
            >
              Delete
            </button>
          </div>

          <div className="text-[6.5px] text-white/30 border-t border-white/10 pt-1.5 leading-normal">
            DRAG THE ELEMENT DIRECTLY TO RE-POSITION IT ON THE CANVAS.
          </div>
        </div>
      )}
    </div>
  );
}
