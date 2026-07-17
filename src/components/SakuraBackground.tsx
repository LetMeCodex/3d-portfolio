// src/components/SakuraBackground.tsx
import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

interface SakuraBackgroundProps {
  className?: string;
  zIndex?: number;
  aggressive?: boolean;
}

export default function SakuraBackground({ className = "", zIndex = -1, aggressive = false }: SakuraBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let animationFrameId: number;

    const isMobile = window.innerWidth < 768;
    const settings = {
        bgColor: "transparent",
        minWind: aggressive ? 1.0 : 0.2,
        maxWind: aggressive ? 2.5 : 1.0,
        minSize: 10,
        maxSize: aggressive ? 35 : 25,
        emitterY: 0.15,
        emitterSpread: 0.85,
        gravity: aggressive ? 0.15 : 0.08, // Very gentle gravity
        turbulence: aggressive ? 0.8 : 0.4,
        rotationSpeed: aggressive ? 0.05 : 0.01,
        tumbleStrength: aggressive ? 0.6 : 0.2,
        staticTilt: 0,
        particleCount: isMobile ? (aggressive ? 50 : 20) : (aggressive ? 120 : 50),
        direction: -1
    };

    const cache = {
        minSize: 0,
        maxSize: 0,
        minWind: 0,
        maxWind: 0,
        tiltRad: 0
    };

    function updateCache() {
        cache.minSize = Math.min(settings.minSize, settings.maxSize);
        cache.maxSize = Math.max(settings.minSize, settings.maxSize);
        cache.minWind = Math.min(settings.minWind, settings.maxWind);
        cache.maxWind = Math.max(settings.minWind, settings.maxWind);
        cache.tiltRad = (settings.staticTilt * Math.PI) / 180;
    }

    function createDefaultImage() {
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = 128;
        tempCanvas.height = 128;
        const tCtx = tempCanvas.getContext("2d");
        if(tCtx) {
            tCtx.scale(2, 2);
            tCtx.beginPath();
            tCtx.moveTo(32, 5);
            tCtx.quadraticCurveTo(5, 32, 32, 59);
            tCtx.quadraticCurveTo(59, 32, 32, 5);
            tCtx.fillStyle = "#d66161";
            tCtx.fill();
            tCtx.strokeStyle = "#F20404";
            tCtx.lineWidth = 2;
            tCtx.stroke();
            tCtx.beginPath();
            tCtx.moveTo(32, 5);
            tCtx.lineTo(32, 59);
            tCtx.stroke();
        }
        const img = new Image();
        img.src = tempCanvas.toDataURL();
        return img;
    }

    const particleImage = createDefaultImage();

    function rotateVector(x: number, y: number, z: number, ax: number, ay: number, az: number) {
        let cos = Math.cos(az);
        let sin = Math.sin(az);
        const x1 = x * cos - y * sin;
        const y1 = x * sin + y * cos;
        const z1 = z;

        cos = Math.cos(ay);
        sin = Math.sin(ay);
        const x2 = x1 * cos + z1 * sin;
        const y2 = y1;
        const z2 = -x1 * sin + z1 * cos;

        cos = Math.cos(ax);
        sin = Math.sin(ax);

        return {
            x: x2,
            y: y2 * cos - z2 * sin,
            z: y2 * sin + z2 * cos
        };
    }

    class Particle {
        x: number = 0;
        y: number = 0;
        width: number = 0;
        height: number = 0;
        windFactor: number = 0;
        vx: number = 0;
        vy: number = 0;
        waveOffset: number = 0;
        angleZ: number = 0;
        spinZ: number = 0;
        angleX: number = 0;
        angleY: number = 0;
        spinX: number = 0;
        spinY: number = 0;
        image: HTMLImageElement = particleImage;

        constructor(initOnScreen = false) {
            this.reset(initOnScreen);
        }

        reset(initOnScreen = false) {
            this.image = particleImage;
            this.width = cache.minSize + Math.random() * (cache.maxSize - cache.minSize);
            this.height = this.width;

            const centerY = height * settings.emitterY;
            const spreadHeight = height * settings.emitterSpread;
            const minY = centerY - spreadHeight / 2;
            const maxY = centerY + spreadHeight / 2;

            this.y = minY + Math.random() * (maxY - minY);

            if (initOnScreen) {
                this.x = Math.random() * width;
            } else {
                this.x = settings.direction === -1
                    ? width + this.width + Math.random() * width
                    : -this.width - Math.random() * width;
            }

            const sizeFactor = (this.width - cache.minSize) / (cache.maxSize - cache.minSize || 1);
            this.windFactor = 1 - (sizeFactor * 0.5 + Math.random() * 0.5);
            this.windFactor = Math.max(0.1, Math.min(1, this.windFactor));

            this.vx = 0;
            this.vy = 0;
            this.waveOffset = Math.random() * Math.PI * 2;
            this.angleZ = Math.random() * Math.PI * 2;
            this.spinZ = (Math.random() - 0.5) * settings.rotationSpeed;
            this.angleX = 0;
            this.angleY = 0;
            this.spinX = (Math.random() - 0.5) * 0.1;
            this.spinY = (Math.random() - 0.5) * 0.1;
        }

        update() {
            const targetSpeed = cache.minWind + (cache.maxWind - cache.minWind) * this.windFactor;
            this.vx += (targetSpeed - this.vx) * 0.1;
            this.x += this.vx * settings.direction;

            const gravityMod = 1.5 - this.windFactor;
            this.vy += settings.gravity * 0.05 * gravityMod;

            const wave = Math.sin(this.x * 0.01 * settings.direction + this.waveOffset);
            this.vy += wave * settings.turbulence * 0.05;
            this.vy *= 0.98;
            this.y += this.vy;

            this.angleZ += this.spinZ + this.vx * 0.002;

            if (settings.tumbleStrength > 0) {
                this.angleX += this.spinX * settings.tumbleStrength;
                this.angleY += this.spinY * settings.tumbleStrength;
            }

            const buffer = 200;
            const outByX = settings.direction === -1 ? this.x < -buffer : this.x > width + buffer;

            if (outByX || this.y > height + buffer || this.y < -buffer) {
                this.reset(false);
            }
        }

        draw() {
            const vecU = rotateVector(1, 0, 0, this.angleX, this.angleY + cache.tiltRad, this.angleZ);
            const vecV = rotateVector(0, 1, 0, this.angleX, this.angleY + cache.tiltRad, this.angleZ);

            if(!ctx) return;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.transform(vecU.x, vecU.y, vecV.x, vecV.y, 0, 0);
            ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
            ctx.restore();
        }
    }

    function resize() {
        if(!canvas) return;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        if(ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < settings.particleCount; i++) {
            const particle = new Particle(false);
            particle.x += Math.random() * width * 1.5;
            particles.push(particle);
        }
    }

    function animate() {
        if(!ctx) return;
        ctx.clearRect(0, 0, width, height);

        for (const particle of particles) {
            particle.update();
            particle.draw();
        }

        animationFrameId = requestAnimationFrame(animate);
    }

    updateCache();
    resize();
    initParticles();
    animate();

    window.addEventListener("resize", resize);

    return () => {
        window.removeEventListener("resize", resize);
        cancelAnimationFrame(animationFrameId);
    };
  }, [aggressive]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className={`fixed top-0 left-0 w-full h-[100dvh] pointer-events-none ${className}`}
        style={{ zIndex }}
      />
      <AnimatePresence>
        {aggressive && (
          <motion.img
            initial={{ opacity: 0, x: 100, y: -50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 100, y: -50 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src="https://raw.githubusercontent.com/BlackStar1991/Pictures-for-sharing-/master/Japan/bg.png"
            alt="Sakura Branch"
            className="fixed top-0 right-0 h-[40vh] md:h-[60vh] w-auto object-contain pointer-events-none drop-shadow-2xl"
            style={{ zIndex }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
