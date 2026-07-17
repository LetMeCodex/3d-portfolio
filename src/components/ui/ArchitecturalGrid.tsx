import React, { useRef, useEffect } from 'react';

interface ArchitecturalGridProps {
  className?: string;
  opacity?: number;
}

export const ArchitecturalGrid: React.FC<ArchitecturalGridProps> = ({ 
  className = "", 
  opacity = 1 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const staticCanvas = document.createElement('canvas');
    let staticCtx: CanvasRenderingContext2D | null = null;
    let staticGridCacheValid = false;

    // Measure parent container to dynamically size the canvas
    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
      staticCanvas.width = width;
      staticCanvas.height = height;
      staticCtx = staticCanvas.getContext('2d');
      staticGridCacheValid = false;
    };
    
    // Initial size
    handleResize();
    window.addEventListener('resize', handleResize);

    const renderStaticGrid = () => {
      if (!staticCtx) return;
      staticCtx.clearRect(0, 0, width, height);

      // Clean warm paper background color
      staticCtx.fillStyle = '#faf8f5';
      staticCtx.fillRect(0, 0, width, height);

      // Draw vertical lines
      for (let gridX = 0; gridX < width + 40; gridX += 40) {
        const isMajor = gridX % 200 === 0;
        staticCtx.strokeStyle = isMajor ? 'rgba(207, 203, 192, 0.9)' : 'rgba(232, 230, 223, 0.75)';
        staticCtx.lineWidth = isMajor ? 1 : 0.5;
        staticCtx.beginPath();
        staticCtx.moveTo(gridX, 0);
        staticCtx.lineTo(gridX, height);
        staticCtx.stroke();
      }

      // Draw horizontal lines
      for (let gridY = 0; gridY < height + 40; gridY += 40) {
        const isMajor = gridY % 200 === 0;
        staticCtx.strokeStyle = isMajor ? 'rgba(207, 203, 192, 0.9)' : 'rgba(232, 230, 223, 0.75)';
        staticCtx.lineWidth = isMajor ? 1 : 0.5;
        staticCtx.beginPath();
        staticCtx.moveTo(0, gridY);
        staticCtx.lineTo(width, gridY);
        staticCtx.stroke();
      }

      // Draw little crosshairs (+) at major intersections
      staticCtx.strokeStyle = 'rgba(158, 153, 141, 0.8)';
      staticCtx.lineWidth = 1;
      const crossSize = 5;
      for (let gridX = 200; gridX < width; gridX += 200) {
        for (let gridY = 200; gridY < height; gridY += 200) {
          staticCtx.beginPath();
          staticCtx.moveTo(gridX - crossSize, gridY);
          staticCtx.lineTo(gridX + crossSize, gridY);
          staticCtx.moveTo(gridX, gridY - crossSize);
          staticCtx.lineTo(gridX, gridY + crossSize);
          staticCtx.stroke();
        }
      }

      staticGridCacheValid = true;
    };

    // Track mouse positioning globally (so lines warp even if elements are on top)
    const mouse = { x: -1000, y: -1000, active: false };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const handleMouseLeave = () => {
      mouse.active = false;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Track click ripples globally
    let rippleX = 0;
    let rippleY = 0;
    let rippleTime = -1;
    const rippleDuration = 45; // frames
    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      rippleX = e.clientX - rect.left;
      rippleY = e.clientY - rect.top;
      rippleTime = 0;
    };
    window.addEventListener('mousedown', handleMouseDown);

    // Initialize floating blueprint nodes
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }
    const particles: Particle[] = [];
    const particleCount = 12; // Moderate count to run multiple instances fast
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * (width || window.innerWidth),
        y: Math.random() * (height || window.innerHeight),
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1,
      });
    }

    // Warp distortion calculation
    const getDistortedPoint = (x: number, y: number) => {
      let dx = x - mouse.x;
      let dy = y - mouse.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      let offset = 0;

      // 1. Mouse magnetic warp
      if (mouse.active && dist < 260) {
        const force = Math.sin((1 - dist / 260) * Math.PI * 0.5);
        offset += force * -22; 
      }

      // 2. Click ripple shockwave warp
      if (rippleTime >= 0 && rippleTime < rippleDuration) {
        const rDx = x - rippleX;
        const rDy = y - rippleY;
        const rDist = Math.sqrt(rDx * rDx + rDy * rDy);
        const waveSpeed = 12; 
        const currentRadius = rippleTime * waveSpeed;
        const waveWidth = 80; 
        const distFromWave = Math.abs(rDist - currentRadius);

        if (distFromWave < waveWidth) {
          const force = Math.cos((distFromWave / waveWidth) * Math.PI * 0.5);
          const waveForce = force * 15 * (1 - rippleTime / rippleDuration);
          const angle = Math.atan2(rDy, rDx);
          return {
            x: x + Math.cos(angle) * waveForce,
            y: y + Math.sin(angle) * waveForce,
          };
        }
      }

      if (offset !== 0) {
        const angle = Math.atan2(dy, dx);
        return {
          x: x + Math.cos(angle) * offset,
          y: y + Math.sin(angle) * offset,
        };
      }

      return { x, y };
    };

    // Render loop
    const render = () => {
      if (width === 0 || height === 0) {
        handleResize();
      }

      // Update click ripple state
      const isRippleActive = rippleTime >= 0 && rippleTime < rippleDuration;
      if (isRippleActive) {
        rippleTime++;
      }

      // If no interactive mouse or ripple, draw the cached static grid in a single operation
      if (!mouse.active && !isRippleActive) {
        if (!staticGridCacheValid) {
          renderStaticGrid();
        }
        ctx.drawImage(staticCanvas, 0, 0);
      } else {
        ctx.clearRect(0, 0, width, height);

        // Clean warm paper background color
        ctx.fillStyle = '#faf8f5';
        ctx.fillRect(0, 0, width, height);

        // Draw minor and major grid lines with segment warping only when close to distortion triggers
        for (let gridX = 0; gridX < width + 40; gridX += 40) {
          const isMajor = gridX % 200 === 0;
          ctx.strokeStyle = isMajor ? 'rgba(207, 203, 192, 0.9)' : 'rgba(232, 230, 223, 0.75)';
          ctx.lineWidth = isMajor ? 1 : 0.5;

          const isNearMouse = mouse.active && Math.abs(gridX - mouse.x) < 260;

          ctx.beginPath();
          if (isNearMouse || isRippleActive) {
            for (let y = 0; y <= height + 20; y += 20) {
              const pt = getDistortedPoint(gridX, y);
              if (y === 0) ctx.moveTo(pt.x, pt.y);
              else ctx.lineTo(pt.x, pt.y);
            }
          } else {
            ctx.moveTo(gridX, 0);
            ctx.lineTo(gridX, height);
          }
          ctx.stroke();
        }

        for (let gridY = 0; gridY < height + 40; gridY += 40) {
          const isMajor = gridY % 200 === 0;
          ctx.strokeStyle = isMajor ? 'rgba(207, 203, 192, 0.9)' : 'rgba(232, 230, 223, 0.75)';
          ctx.lineWidth = isMajor ? 1 : 0.5;

          const isNearMouse = mouse.active && Math.abs(gridY - mouse.y) < 260;

          ctx.beginPath();
          if (isNearMouse || isRippleActive) {
            for (let x = 0; x <= width + 20; x += 20) {
              const pt = getDistortedPoint(x, gridY);
              if (x === 0) ctx.moveTo(pt.x, pt.y);
              else ctx.lineTo(pt.x, pt.y);
            }
          } else {
            ctx.moveTo(0, gridY);
            ctx.lineTo(width, gridY);
          }
          ctx.stroke();
        }

        // Draw little crosshairs (+) at major intersections
        ctx.strokeStyle = 'rgba(158, 153, 141, 0.8)';
        ctx.lineWidth = 1;
        const crossSize = 5;
        for (let gridX = 200; gridX < width; gridX += 200) {
          for (let gridY = 200; gridY < height; gridY += 200) {
            const isNearMouse = mouse.active && Math.hypot(gridX - mouse.x, gridY - mouse.y) < 260;
            const pt = (isNearMouse || isRippleActive) ? getDistortedPoint(gridX, gridY) : { x: gridX, y: gridY };
            ctx.beginPath();
            ctx.moveTo(pt.x - crossSize, pt.y);
            ctx.lineTo(pt.x + crossSize, pt.y);
            ctx.moveTo(pt.x, pt.y - crossSize);
            ctx.lineTo(pt.x, pt.y + crossSize);
            ctx.stroke();
          }
        }
      }

      // Draw floating blueprint nodes and mouse vectors
      particles.forEach((p) => {
        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Bouncing walls logic
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Distort particle position for display
        const pt = getDistortedPoint(p.x, p.y);

        // Draw particle dot
        ctx.fillStyle = 'rgba(182, 177, 165, 0.7)';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connect vectors to mouse if nearby
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 220) {
            ctx.strokeStyle = 'rgba(229, 139, 136, 0.22)'; 
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(pt.x, pt.y);
            ctx.stroke();

            // Display distance readout tag
            ctx.fillStyle = '#8c887d';
            ctx.font = '8px monospace';
            const label = `d:${Math.round(dist)}px`;
            ctx.fillText(label, pt.x + 6, pt.y - 4);
          }
        }
      });

      // Subtle mouse center coordinate target circle
      if (mouse.active) {
        ctx.strokeStyle = 'rgba(140, 136, 125, 0.25)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} 
      style={{ opacity }}
    />
  );
};
