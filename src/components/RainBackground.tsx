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

    const baseDropCount = window.innerWidth < 768 ? 80 : 150;
    const dropCount = fast ? baseDropCount * 1.5 : baseDropCount;
    const baseWind = fast ? 1.0 : 0.2; // Sideways wind
    const baseGravity = fast ? 6 : 3;

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
        this.x = Math.random() * (width + 400) - 200; // Allow starting off-screen left due to wind
        this.y = initOnScreen ? Math.random() * height : -Math.random() * 200 - 100;
        this.length = Math.random() * 15 + 10 + (fast ? 10 : 0); // shorter drops to see them falling
        this.thickness = Math.random() * 1.5 + (fast ? 2.0 : 1.0); // very thick, visible drops
        this.speed = Math.random() * 2 + baseGravity; // gentle falling speed
        this.xSpeed = Math.random() * 0.5 + baseWind;
        this.opacity = Math.random() * 0.4 + 0.5; // highly visible
      }

      update() {
        this.y += this.speed;
        this.x += this.xSpeed;

        if (this.y > height + 50 || this.x > width + 100) {
          this.reset(false);
        }
      }

      draw() {
        if (!ctx) return;
        
        const tailX = this.x - this.xSpeed * (this.length / this.speed);
        const tailY = this.y - this.length;

        const grad = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
        grad.addColorStop(0, `rgba(120, 130, 140, 0)`);        // Transparent tail
        grad.addColorStop(0.7, `rgba(120, 130, 140, ${this.opacity * 0.5})`);
        grad.addColorStop(1, `rgba(160, 170, 180, ${this.opacity})`); // Brighter head

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(tailX, tailY);
        
        ctx.strokeStyle = grad;
        ctx.lineWidth = this.thickness;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    }

    function resize() {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
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
      // 70% chance of double/triple flash
      lightningOpacity = 0.5 + Math.random() * 0.4;
      if (Math.random() > 0.3) {
        setTimeout(() => { lightningOpacity = 0.4 + Math.random() * 0.4; }, 50 + Math.random() * 100);
      }
    };
    
    window.addEventListener('lightning-flash', handleLightning);

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      if (lightningOpacity > 0.01) {
        ctx.fillStyle = `rgba(255, 255, 255, ${lightningOpacity})`;
        ctx.fillRect(0, 0, width, height);
        lightningOpacity -= 0.05; // decay
      } else {
        lightningOpacity = 0;
      }

      for (const drop of drops) {
        drop.update();
        drop.draw();
      }
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
