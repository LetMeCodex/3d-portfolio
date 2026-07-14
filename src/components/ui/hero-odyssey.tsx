import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface ElasticHueSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
}

const ElasticHueSlider: React.FC<ElasticHueSliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 360,
  step = 1,
  label = 'Adjust Hue',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const progress = ((value - min) / (max - min));
  const thumbPosition = progress * 100;

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="scale-75 md:scale-100 relative w-full max-w-[200px] flex flex-col items-center" ref={sliderRef}>
      {label && <label htmlFor="hue-slider-native" className="font-mono text-[10px] uppercase tracking-widest text-[#aaa] mb-4">{label}</label>}
      <div className="relative w-full h-1 flex items-center">
        <input
          id="hue-slider-native"
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          className="absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer z-20"
          style={{ WebkitAppearance: 'none' }}
        />

        {/* Custom Track */}
        <div className="absolute left-0 w-full h-[1px] bg-white/10 z-0"></div>

        {/* Custom Fill */}
        <div
            className="absolute left-0 h-[1px] bg-[#FF69B4] z-10 transition-all duration-75"
            style={{ width: `${thumbPosition}%` }}
        ></div>

        {/* Custom Thumb */}
        <motion.div
          className="absolute top-1/2 -ml-2 -mt-2 w-4 h-4 rounded-full bg-black border border-[#FF69B4] shadow-[0_0_10px_rgba(255,105,180,0.5)] z-30 pointer-events-none"
          style={{ left: `${thumbPosition}%` }}
          animate={{ scale: isDragging ? 1.5 : 1, backgroundColor: isDragging ? '#FF69B4' : '#000' }}
          transition={{ type: "spring", stiffness: 500, damping: isDragging ? 20 : 30 }}
        />
      </div>

       <AnimatePresence mode="wait">
         <motion.div
           key={value}
           initial={{ opacity: 0, y: -5 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: 5 }}
           transition={{ duration: 0.2 }}
           className="font-mono text-[10px] text-white/50 mt-4"
         >
           {value}°
         </motion.div>
       </AnimatePresence>
    </div>
  );
};

export interface LightningProps {
  hue?: number;
  xOffset?: number;
  speed?: number;
  intensity?: number;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Lightning: React.FC<LightningProps> = ({
  hue = 320, // Default to pink-ish to fit aesthetics
  xOffset = 0,
  speed = 1.2,
  intensity = 0.8,
  size = 1.5,
  className,
  style
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const gl = canvas.getContext("webgl", { alpha: true });
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    const vertexShaderSource = `
      attribute vec2 aPosition;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform float uHue;
      uniform float uXOffset;
      uniform float uSpeed;
      uniform float uIntensity;
      uniform float uSize;
      
      #define OCTAVE_COUNT 5

      vec3 hsv2rgb(vec3 c) {
          vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
          return c.z * mix(vec3(1.0), rgb, c.y);
      }

      float hash11(float p) {
          p = fract(p * .1031);
          p *= p + 33.33;
          p *= p + p;
          return fract(p);
      }

      float hash12(vec2 p) {
          vec3 p3 = fract(vec3(p.xyx) * .1031);
          p3 += dot(p3, p3.yzx + 33.33);
          return fract((p3.x + p3.y) * p3.z);
      }

      mat2 rotate2d(float theta) {
          float c = cos(theta);
          float s = sin(theta);
          return mat2(c, -s, s, c);
      }

      float noise(vec2 p) {
          vec2 ip = floor(p);
          vec2 fp = fract(p);
          float a = hash12(ip);
          float b = hash12(ip + vec2(1.0, 0.0));
          float c = hash12(ip + vec2(0.0, 1.0));
          float d = hash12(ip + vec2(1.0, 1.0));
          
          vec2 t = smoothstep(0.0, 1.0, fp);
          return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
      }

      float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          for (int i = 0; i < OCTAVE_COUNT; ++i) {
              value += amplitude * noise(p);
              p *= rotate2d(0.45);
              p *= 2.0;
              amplitude *= 0.5;
          }
          return value;
      }

      void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
          vec2 uv = fragCoord / iResolution.xy;
          uv = 2.0 * uv - 1.0;
          uv.x *= iResolution.x / iResolution.y;
          uv.x += uXOffset;
          
          uv += 2.0 * fbm(uv * uSize + 0.8 * iTime * uSpeed) - 1.0;
          
          float dist = abs(uv.x);
          vec3 baseColor = hsv2rgb(vec3(uHue / 360.0, 0.7, 0.8));
          vec3 col = baseColor * pow(mix(0.0, 0.07, hash11(iTime * uSpeed)) / dist, 1.0) * uIntensity;
          col = pow(col, vec3(1.0));
          
          // Adding subtle fade at edges to blend with background
          float edgeFade = 1.0 - smoothstep(0.3, 1.0, abs(fragCoord.x / iResolution.x * 2.0 - 1.0));
          
          fragColor = vec4(col * edgeFade, col.r * 0.5 * edgeFade); // Output premultiplied alpha or additive look
      }

      void main() {
          mainImage(gl_FragColor, gl_FragCoord.xy);
      }
    `;

    const compileShader = (source: string, type: number): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking error:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      iResolution: gl.getUniformLocation(program, "iResolution"),
      iTime: gl.getUniformLocation(program, "iTime"),
      uHue: gl.getUniformLocation(program, "uHue"),
      uXOffset: gl.getUniformLocation(program, "uXOffset"),
      uSpeed: gl.getUniformLocation(program, "uSpeed"),
      uIntensity: gl.getUniformLocation(program, "uIntensity"),
      uSize: gl.getUniformLocation(program, "uSize"),
    };

    // Use additive blending for natural lightning look
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    let animationFrameId: number;
    const startTime = performance.now();
    let isVisible = true;
    
    const render = () => {
      if (!isVisible) return; // Pause rendering loop when not visible

      resizeCanvas();
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      
      gl.uniform2f(uniforms.iResolution, canvas.width, canvas.height);
      const currentTime = performance.now();
      gl.uniform1f(uniforms.iTime, (currentTime - startTime) / 1000.0);
      gl.uniform1f(uniforms.uHue, hue);
      gl.uniform1f(uniforms.uXOffset, xOffset);
      gl.uniform1f(uniforms.uSpeed, speed);
      gl.uniform1f(uniforms.uIntensity, intensity);
      gl.uniform1f(uniforms.uSize, size);
      
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver(([entry]) => {
      const wasVisible = isVisible;
      isVisible = entry.isIntersecting;
      // Restart loop if it became visible and wasn't before
      if (isVisible && !wasVisible) {
        render();
      }
    }, { rootMargin: "100px" });

    observer.observe(canvas);
    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [hue, xOffset, speed, intensity, size]);

  return <canvas ref={canvasRef} className={className || "w-full h-full relative mix-blend-screen"} style={style} />;
};

export const HeroOdysseySection: React.FC = () => {
  const [lightningHue, setLightningHue] = useState(320); // Hex Pinkish

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
  };

  return (
    <section className="relative w-full min-h-screen bg-black text-white overflow-hidden py-32 flex flex-col items-center justify-center border-t border-white/5">
      
      {/* Background Lightning Effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 z-0 flex justify-center items-center pointer-events-none"
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,105,180,0.05)_0%,_transparent_70%)] blur-3xl mix-blend-screen"></div>
        <div className="w-[120%] md:w-full h-full absolute opacity-60">
          <Lightning
            hue={lightningHue}
            speed={0.8}
            intensity={1.2}
            size={1.5}
            className="w-full h-full object-cover mix-blend-screen"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
        <div className="absolute inset-0 bg-gradient-to-l from-black via-transparent to-black" />
      </motion.div>

      {/* Main content layer */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto px-4 w-full"
      >
        <motion.div variants={itemVariants} className="mb-12">
            <ElasticHueSlider
              value={lightningHue}
              onChange={setLightningHue}
              label="Interactive WebGL Shaders"
            />
        </motion.div>

        <motion.div variants={itemVariants} className="relative inline-block mb-6">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#FF69B4] to-[#8bc34a] rounded-full blur opacity-20"></div>
          <div className="relative px-4 py-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#FF69B4]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#eee]">Next-Gen Graphics</span>
          </div>
        </motion.div>

        <motion.h2
          variants={itemVariants}
          className="font-serif italic text-4xl md:text-6xl lg:text-7xl leading-[1.1] mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60"
        >
          Lighting Up <br />
          <span className="not-italic font-sans font-light tracking-tight text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">The Future</span>
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="text-[#aaa] md:text-lg max-w-xl font-light leading-relaxed mb-12"
        >
          Fluid simulations and dynamic generative shaders rendered strictly in 100% native code. Adjust the lighting environment above.
        </motion.p>
        
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
          whileTap={{ scale: 0.98 }}
          className="group flex flex-col items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 backdrop-blur-md rounded-full transition-all"
        >
          <div className="flex items-center gap-3">
             <span className="font-sans text-sm tracking-wide text-white">Experience Deep Dive</span>
             <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center transform group-hover:translate-x-1 group-hover:rotate-[-45deg] transition-all">
                <ArrowRight className="w-3.5 h-3.5" />
             </div>
          </div>
        </motion.button>

      </motion.div>
    </section>
  );
};
