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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // On mobile, skip the entire canvas animation — use CSS grid pattern instead
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let isVisible = true;
    let isIdle = true;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    const staticCanvas = document.createElement('canvas');
    let staticCtx: CanvasRenderingContext2D | null = null;
    let staticGridCacheValid = false;

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
      staticCanvas.width = width;
      staticCanvas.height = height;
      staticCtx = staticCanvas.getContext('2d');
      staticGridCacheValid = false;
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);

    const renderStaticGrid = () => {
      if (!staticCtx) return;
      staticCtx.clearRect(0, 0, width, height);

      staticCtx.fillStyle = '#faf8f5';
      staticCtx.fillRect(0, 0, width, height);

      for (let gridX = 0; gridX < width + 40; gridX += 40) {
        const isMajor = gridX % 200 === 0;
        staticCtx.strokeStyle = isMajor ? 'rgba(207, 203, 192, 0.9)' : 'rgba(232, 230, 223, 0.75)';
        staticCtx.lineWidth = isMajor ? 1 : 0.5;
        staticCtx.beginPath();
        staticCtx.moveTo(gridX, 0);
        staticCtx.lineTo(gridX, height);
        staticCtx.stroke();
      }

      for (let gridY = 0; gridY < height + 40; gridY += 40) {
        const isMajor = gridY % 200 === 0;
        staticCtx.strokeStyle = isMajor ? 'rgba(207, 203, 192, 0.9)' : 'rgba(232, 230, 223, 0.75)';
        staticCtx.lineWidth = isMajor ? 1 : 0.5;
        staticCtx.beginPath();
        staticCtx.moveTo(0, gridY);
        staticCtx.lineTo(width, gridY);
        staticCtx.stroke();
      }

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

    // Track mouse positioning
    const mouse = { x: -1000, y: -1000, active: false };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
      
      // Mark as not idle, restart idle timer
      isIdle = false;
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        isIdle = true;
        mouse.active = false;
      }, 200);

      // Restart animation loop if it was paused
      if (isVisible && !animationFrameId) {
        render();
      }
    };
    const handleMouseLeave = () => {
      mouse.active = false;
      isIdle = true;
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // Track click ripples
    let rippleX = 0;
    let rippleY = 0;
    let rippleTime = -1;
    const rippleDuration = 45;
    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      rippleX = e.clientX - rect.left;
      rippleY = e.clientY - rect.top;
      rippleTime = 0;
      isIdle = false;
      if (isVisible && !animationFrameId) {
        render();
      }
    };
    window.addEventListener('mousedown', handleMouseDown);

    // Floating blueprint nodes
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }
    const particles: Particle[] = [];
    const particleCount = 12;
    
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

      if (mouse.active && dist < 260) {
        const force = Math.sin((1 - dist / 260) * Math.PI * 0.5);
        offset += force * -22; 
      }

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

    // IntersectionObserver to pause when not visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animationFrameId) {
          render();
        } else if (!isVisible && animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = 0;
        }
      },
      { threshold: 0 }
    );
    observer.observe(container);

    // Render loop
    const render = () => {
      if (!isVisible) {
        animationFrameId = 0;
        return;
      }

      if (width === 0 || height === 0) {
        handleResize();
      }

      const isRippleActive = rippleTime >= 0 && rippleTime < rippleDuration;
      if (isRippleActive) {
        rippleTime++;
      }

      // If idle (no mouse, no ripple), draw cached static grid and STOP the loop
      if (isIdle && !isRippleActive && !mouse.active) {
        if (!staticGridCacheValid) {
          renderStaticGrid();
        }
        ctx.drawImage(staticCanvas, 0, 0);

        // Update particles silently (no connection lines, no vectors)
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          ctx.fillStyle = 'rgba(182, 177, 165, 0.7)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });

        // Don't schedule next frame — loop pauses until mouse activity resumes
        animationFrameId = 0;
        return;
      }

      // Active mode: full interactive rendering
      if (!mouse.active && !isRippleActive) {
        if (!staticGridCacheValid) {
          renderStaticGrid();
        }
        ctx.drawImage(staticCanvas, 0, 0);
      } else {
        ctx.clearRect(0, 0, width, height);

        ctx.fillStyle = '#faf8f5';
        ctx.fillRect(0, 0, width, height);

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
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        const pt = getDistortedPoint(p.x, p.y);

        ctx.fillStyle = 'rgba(182, 177, 165, 0.7)';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

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

            ctx.fillStyle = '#8c887d';
            ctx.font = '8px monospace';
            const label = `d:${Math.round(dist)}px`;
            ctx.fillText(label, pt.x + 6, pt.y - 4);
          }
        }
      });

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

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      if (idleTimer) clearTimeout(idleTimer);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} style={{ opacity }}>
      {/* Mobile: static CSS grid pattern (zero JS cost). Desktop: animated canvas */}
      <div 
        className="absolute inset-0 md:hidden"
        style={{
          backgroundColor: '#faf8f5',
          backgroundImage: `
            linear-gradient(rgba(232, 230, 223, 0.75) 0.5px, transparent 0.5px),
            linear-gradient(90deg, rgba(232, 230, 223, 0.75) 0.5px, transparent 0.5px),
            linear-gradient(rgba(207, 203, 192, 0.9) 1px, transparent 1px),
            linear-gradient(90deg, rgba(207, 203, 192, 0.9) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px, 40px 40px, 200px 200px, 200px 200px',
        }}
      />
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 hidden md:block"
      />
    </div>
  );
};
