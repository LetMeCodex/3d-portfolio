// src/components/RainBackground.tsx
import React, { useEffect, useRef } from "react";

interface RainBackgroundProps {
  className?: string;
  zIndex?: number;
  fast?: boolean;
}

export default function RainBackground({ className = "", zIndex = -1, fast = false }: RainBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let drops: Drop[] = [];
    let animationFrameId: number;

    const isMobile = window.innerWidth < 768;
    // Drastically reduce drops on mobile for performance
    const baseDropCount = isMobile ? 40 : 150;
    const dropCount = fast ? baseDropCount * 1.5 : baseDropCount;
    const baseWind = fast ? 1.0 : 0.2;
    const baseGravity = fast ? 6 : 3;

    // Clamp DPR on mobile — render at 1x instead of retina resolution
    const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio, 2);

    class Drop {
      x: number = 0;
      y: number = 0;
      length: number = 0;
      speed: number = 0;
      xSpeed: number = 0;
      opacity: number = 0;
      thickness: number = 1;

      constructor() {
        this.reset(true);
      }

      reset(initOnScreen = false) {
        this.x = Math.random() * (width / dpr + 400) - 200;
        this.y = initOnScreen ? Math.random() * (height / dpr) : -Math.random() * 200 - 100;
        this.length = Math.random() * 15 + 10 + (fast ? 10 : 0);
        this.thickness = Math.random() * 1.5 + (fast ? 2.0 : 1.0);
        this.speed = Math.random() * 2 + baseGravity;
        this.xSpeed = Math.random() * 0.5 + baseWind;
        this.opacity = Math.random() * 0.4 + 0.5;
      }

      update() {
        this.y += this.speed;
        this.x += this.xSpeed;

        if (this.y > height / dpr + 50 || this.x > width / dpr + 100) {
          this.reset(false);
        }
      }
    }

    function resize() {
      if (!canvas) return;
      width = canvas.width = window.innerWidth * dpr;
      height = canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx!.scale(dpr, dpr);
    }

    function initDrops() {
      drops = [];
      for (let i = 0; i < dropCount; i++) {
        drops.push(new Drop());
      }
    }

    let lightningOpacity = 0;

    const handleLightning = () => {
      if (!fast) return;
      lightningOpacity = 0.5 + Math.random() * 0.4;
      if (Math.random() > 0.3) {
        setTimeout(() => { lightningOpacity = 0.4 + Math.random() * 0.4; }, 50 + Math.random() * 100);
      }
    };
    
    window.addEventListener('lightning-flash', handleLightning);

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width / dpr, height / dpr);

      if (lightningOpacity > 0.01) {
        ctx.fillStyle = `rgba(255, 255, 255, ${lightningOpacity})`;
        ctx.fillRect(0, 0, width / dpr, height / dpr);
        lightningOpacity -= 0.05;
      } else {
        lightningOpacity = 0;
      }

      for (const drop of drops) {
        drop.update();
      }

      ctx.lineCap = 'round';

      // Batch 1: Thin background rain
      ctx.beginPath();
      ctx.strokeStyle = fast ? 'rgba(160, 170, 180, 0.25)' : 'rgba(120, 130, 140, 0.2)';
      ctx.lineWidth = fast ? 1.2 : 0.8;
      for (let i = 0; i < drops.length; i += 2) {
        const drop = drops[i];
        const tailX = drop.x - drop.xSpeed * (drop.length / drop.speed);
        const tailY = drop.y - drop.length;
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(tailX, tailY);
      }
      ctx.stroke();

      // Batch 2: Thick foreground rain
      ctx.beginPath();
      ctx.strokeStyle = fast ? 'rgba(190, 200, 210, 0.45)' : 'rgba(150, 160, 170, 0.35)';
      ctx.lineWidth = fast ? 2.5 : 1.5;
      for (let i = 1; i < drops.length; i += 2) {
        const drop = drops[i];
        const tailX = drop.x - drop.xSpeed * (drop.length / drop.speed);
        const tailY = drop.y - drop.length;
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(tailX, tailY);
      }
      ctx.stroke();

      animationFrameId = requestAnimationFrame(animate);
    }

    resize();
    initDrops();
    animate();

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener('lightning-flash', handleLightning);
      cancelAnimationFrame(animationFrameId);
    };
  }, [fast]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 w-full h-[100dvh] pointer-events-none ${className}`}
      style={{ zIndex }}
    />
  );
}
