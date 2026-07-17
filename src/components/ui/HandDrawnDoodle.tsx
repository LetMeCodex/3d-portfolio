import React, { useRef } from 'react';
import { motion } from 'framer-motion';

type DoodleType = 'scribble' | 'arrow' | 'sparkle' | 'circle' | 'underline' | 'tornado' | 'star' | 'swirl' | 'squiggle' | 'signature' | 'rose' | 'disha-signature' | 'burst' | 'spring' | 'zig-zag' | 'crown' | 'loop' | 'heart';

interface HandDrawnDoodleProps {
  type: DoodleType;
  className?: string;
  color?: string;
  delay?: number;
  duration?: number;
}

export const HandDrawnDoodle = ({ 
  type, 
  className = "", 
  color = "currentColor",
  delay = 0,
  duration = 0.5 
}: HandDrawnDoodleProps) => {
  
  // Hand-drawn wiggle animation disabled in favor of GPU-accelerated CSS keyframes
  const wiggleTransition = undefined;

  const viewportConfig = { once: true, margin: "200px" };

  const drawTransition = {
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: {
      duration: duration,
      delay: delay,
      ease: "easeInOut" as const
    }
  };

  const renderDoodle = () => {
    switch (type) {
      case 'tornado':
        return (
          <motion.svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <motion.path
              d="M50 20 C60 10, 80 30, 50 40 C20 50, 40 70, 60 60 C80 50, 60 30, 40 40 C20 50, 30 80, 50 70 C70 60, 50 40, 40 50"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={drawTransition} viewport={viewportConfig}
              animate={wiggleTransition}
            />
          </motion.svg>
        );
      case 'scribble':
        return (
          <motion.svg viewBox="0 0 100 40" className="w-full h-full" fill="none">
            <motion.path
              d="M5 20 C15 5, 25 35, 35 20 C45 5, 55 35, 65 20 C75 5, 85 35, 95 20"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={drawTransition} viewport={viewportConfig}
              animate={wiggleTransition}
            />
          </motion.svg>
        );
      case 'star':
        return (
          <motion.svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
            <motion.path 
              d="M20 2 L24 14 L38 14 L27 22 L31 34 L20 26 L9 34 L13 22 L2 14 L16 14 Z" 
              stroke={color} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={drawTransition} viewport={viewportConfig}
              animate={wiggleTransition}
            />
          </motion.svg>
        );
      case 'swirl':
        return (
          <motion.svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <motion.path
              d="M20 80 Q50 10 80 80 T20 20"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={drawTransition} viewport={viewportConfig}
              animate={wiggleTransition}
            />
          </motion.svg>
        );
      case 'squiggle':
        return (
          <motion.svg viewBox="0 0 100 40" className="w-full h-full" fill="none">
            <motion.path
              d="M0 20 C20 0, 30 40, 50 20 S80 0, 100 20"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={drawTransition} viewport={viewportConfig}
              animate={wiggleTransition}
            />
          </motion.svg>
        );
      case 'signature':
        return (
          <motion.svg viewBox="0 0 300 100" className="w-full h-full" fill="none">
            {/* Elegant Calligraphic Signature Path */}
            <motion.path
              d="M30 60 C50 20, 70 80, 90 40 C110 0, 130 90, 150 50 S190 10, 220 60 S260 80, 280 30 M50 85 Q150 75 250 85"
              stroke={color}
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={drawTransition} viewport={viewportConfig}
              animate={wiggleTransition}
            />
          </motion.svg>
        );
      case 'disha-signature':
        return (
          <motion.span 
            className="flex flex-col items-center justify-center relative py-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }} viewport={viewportConfig}
            transition={{ duration: 1, delay }}
          >
            <span 
              className="text-4xl md:text-5xl font-normal leading-none"
              style={{ 
                fontFamily: '"Playwrite IS", cursive',
                color: color,
                textShadow: '0 0 20px rgba(255,255,255,0.1)'
              }}
            >
              Disha Jain
            </span>
            <motion.svg viewBox="0 0 200 20" className="w-48 h-8 mt-[-10px]" fill="none" preserveAspectRatio="none">
              <motion.path
                d="M0 10 Q100 5 200 15"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.6 }} viewport={viewportConfig}
                transition={{ duration: 1.5, delay: delay + 0.5 }}
              />
            </motion.svg>
          </motion.span>
        );
      case 'rose':
        return (
          <motion.svg viewBox="0 0 250 400" className="w-full h-full" fill="none">
            {/* 
               ULTRA-HIGH-FIDELITY "BUMPER BOYS" GEOMETRIC ROSE
               Exactly recreating the photo's weight, hatching, and double-line sketching.
            */}
            <motion.g
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }} viewport={viewportConfig}
              transition={{ duration: 1.2, ease: "easeOut" }}
              animate={{ 
                rotate: [0, 1, -1, 0],
                x: [0, 2, -2, 0]
              }}
              style={{ originX: "125px", originY: "200px" }}
            >
              {/* --- ROSE HEAD --- */}
              {/* Central Core - Faceted tightly */}
              <motion.path d="M110 140 L125 120 L145 130 L135 155 Z" stroke={color} strokeWidth="1.2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={viewportConfig} transition={{ duration: 0.5 }} />
              <motion.path d="M112 142 L127 122 L147 132" stroke={color} strokeWidth="0.5" opacity="0.4" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={viewportConfig} transition={{ duration: 0.5, delay: 0.1 }} /> {/* Sketchy double line */}
              
              {/* Inner Petals - Sharp Hexagonal-ish facets */}
              <motion.path d="M125 120 L110 95 L90 110 L110 140" stroke={color} strokeWidth="1" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={viewportConfig} transition={{ duration: 0.6, delay: 0.2 }} />
              <motion.path d="M110 95 L140 85 L160 110 L145 130" stroke={color} strokeWidth="1" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={viewportConfig} transition={{ duration: 0.6, delay: 0.3 }} />
              
              {/* Dense Hatching for Shading (Right Side) */}
              <motion.g opacity="0.6">
                <motion.path d="M145 90 L155 100 M148 88 L158 98 M151 86 L161 96 M154 84 L164 94" stroke={color} strokeWidth="0.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={viewportConfig} transition={{ duration: 0.8, delay: 0.5 }} />
                <motion.path d="M160 110 L170 120 M163 108 L173 118 M166 106 L176 116" stroke={color} strokeWidth="0.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={viewportConfig} transition={{ duration: 0.8, delay: 0.6 }} />
              </motion.g>

              {/* Mid-Outer Petals - Bold geometric strokes */}
              <motion.path d="M90 110 L60 90 L85 60 L120 75 L140 85" stroke={color} strokeWidth="1.8" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={viewportConfig} transition={{ duration: 0.7, delay: 0.4 }} />
              <motion.path d="M160 110 L195 90 L180 50 L140 85" stroke={color} strokeWidth="1.8" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={viewportConfig} transition={{ duration: 0.7, delay: 0.5 }} />
              
              {/* Lower Petals - Large faceted blocks */}
              <motion.path d="M60 90 L35 130 L70 185 L110 170 L110 140" stroke={color} strokeWidth="2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={viewportConfig} transition={{ duration: 0.8, delay: 0.6 }} />
              <motion.path d="M195 90 L215 135 L180 185 L145 170 L145 130" stroke={color} strokeWidth="2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={viewportConfig} transition={{ duration: 0.8, delay: 0.7 }} />
              
              {/* Bottom Connection / Folding Petal */}
              <motion.path d="M70 185 L125 210 L180 185" stroke={color} strokeWidth="1.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={viewportConfig} transition={{ duration: 0.5, delay: 0.8 }} />

              {/* Top Petal - Faint background facets */}
              <motion.path d="M85 60 L125 35 L180 50" stroke={color} strokeWidth="0.8" opacity="0.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={viewportConfig} transition={{ duration: 0.5, delay: 0.9 }} />
              
              {/* Fine Shading Hatching (Left Side) */}
              <motion.g opacity="0.3">
                <motion.path d="M70 160 L60 170 M73 158 L63 168 M76 156 L66 166" stroke={color} strokeWidth="0.4" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={viewportConfig} transition={{ duration: 0.5, delay: 1 }} />
              </motion.g>
            </motion.g>

            {/* --- STEM & LEAVES --- */}
            {/* The Stem - Jittery, hand-drawn curve */}
            <motion.path
              d="M125 210 L115 260 L128 320 L118 390"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }} viewport={viewportConfig}
              transition={{ duration: 1, delay: 0.5 }}
            />

            {/* Pointy Diamond Leaves with Hatching */}
            <motion.g>
              {/* Left Mid Leaf */}
              <motion.path d="M118 250 L85 235 L70 270 L105 285 Z" stroke={color} strokeWidth="1.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={viewportConfig} transition={{ duration: 0.6, delay: 1.1 }} />
              <motion.path d="M85 245 L95 265 M82 250 L92 270" stroke={color} strokeWidth="0.5" opacity="0.4" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={viewportConfig} transition={{ duration: 0.4, delay: 1.3 }} />
              
              {/* Right Mid Leaf */}
              <motion.path d="M122 280 L155 265 L170 300 L135 315 Z" stroke={color} strokeWidth="1.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={viewportConfig} transition={{ duration: 0.6, delay: 1.2 }} />
              
              {/* Lower Left Leaf (Complex Diamond) */}
              <motion.path d="M120 330 L80 320 L60 365 L105 375 Z" stroke={color} strokeWidth="1.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={viewportConfig} transition={{ duration: 0.6, delay: 1.3 }} />
              
              {/* Very Bottom Leaves / Small Thorns */}
              <motion.path d="M118 360 L135 345 L145 370" stroke={color} strokeWidth="1" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={viewportConfig} transition={{ duration: 0.5, delay: 1.4 }} />
            </motion.g>
          </motion.svg>
        );
      case 'arrow':
        return (
          <motion.svg viewBox="0 0 100 60" className="w-full h-full" fill="none">
            <motion.path
              d="M10 30 Q50 10 90 30 M70 15 L90 30 L75 45"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={drawTransition} viewport={viewportConfig}
              animate={wiggleTransition}
            />
          </motion.svg>
        );
      case 'sparkle':
        return (
          <motion.svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
            <motion.path d="M20 5 L20 15 M35 20 L25 20 M20 35 L20 25 M5 20 L15 20" stroke={color} strokeWidth="2.5" strokeLinecap="round" initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1, transition: { delay } }} viewport={viewportConfig} animate={{ scale: [1, 1.2, 1], transition: { repeat: Infinity, duration: 1 } }} />
          </motion.svg>
        );
      case 'circle':
        return (
          <motion.svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <motion.path
              d="M10 50 C10 20, 90 20, 90 50 C90 80, 10 80, 15 55"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={drawTransition} viewport={viewportConfig}
              animate={wiggleTransition}
            />
          </motion.svg>
        );
      case 'underline':
        return (
          <motion.svg viewBox="0 0 200 20" className="w-full h-full" fill="none" preserveAspectRatio="none">
            <motion.path
              d="M0 10 Q50 5 100 10 Q150 15 200 10"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={drawTransition} viewport={viewportConfig}
              animate={wiggleTransition}
            />
          </motion.svg>
        );
      
      case 'burst':
        return (
          <motion.svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <motion.path d="M50 10 L50 30 M50 90 L50 70 M10 50 L30 50 M90 50 L70 50 M20 20 L35 35 M80 80 L65 65 M20 80 L35 65 M80 20 L65 35" stroke={color} strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0, opacity: 0 }} whileInView={drawTransition} viewport={viewportConfig} animate={wiggleTransition} />
          </motion.svg>
        );
      case 'spring':
        return (
          <motion.svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <motion.path d="M10 50 C 10 20, 30 20, 30 50 C 30 80, 50 80, 50 50 C 50 20, 70 20, 70 50 C 70 80, 90 80, 90 50" stroke={color} strokeWidth="2" strokeLinecap="round" initial={{ pathLength: 0, opacity: 0 }} whileInView={drawTransition} viewport={viewportConfig} animate={wiggleTransition} />
          </motion.svg>
        );
      case 'zig-zag':
        return (
          <motion.svg viewBox="0 0 100 40" className="w-full h-full" fill="none">
            <motion.path d="M5 20 L20 5 L35 35 L50 5 L65 35 L80 5 L95 20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0, opacity: 0 }} whileInView={drawTransition} viewport={viewportConfig} animate={wiggleTransition} />
          </motion.svg>
        );
      case 'crown':
        return (
          <motion.svg viewBox="0 0 100 80" className="w-full h-full" fill="none">
            <motion.path d="M10 60 L15 20 L35 40 L50 10 L65 40 L85 20 L90 60 Z" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0, opacity: 0 }} whileInView={drawTransition} viewport={viewportConfig} animate={wiggleTransition} />
            <motion.circle cx="15" cy="15" r="3" fill={color} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={viewportConfig} transition={{ delay: delay + 0.5 }} />
            <motion.circle cx="50" cy="5" r="4" fill={color} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={viewportConfig} transition={{ delay: delay + 0.5 }} />
            <motion.circle cx="85" cy="15" r="3" fill={color} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={viewportConfig} transition={{ delay: delay + 0.5 }} />
          </motion.svg>
        );
      case 'loop':
        return (
          <motion.svg viewBox="0 0 100 60" className="w-full h-full" fill="none">
            <motion.path d="M10 40 C 30 10, 70 10, 50 40 C 30 70, 70 70, 90 40" stroke={color} strokeWidth="2" strokeLinecap="round" initial={{ pathLength: 0, opacity: 0 }} whileInView={drawTransition} viewport={viewportConfig} animate={wiggleTransition} />
          </motion.svg>
        );
      case 'heart':
        return (
          <motion.svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <motion.path d="M50 80 C 20 50, 10 30, 25 15 C 40 0, 50 20, 50 20 C 50 20, 60 0, 75 15 C 90 30, 80 50, 50 80 Z" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0, opacity: 0 }} whileInView={drawTransition} viewport={viewportConfig} animate={wiggleTransition} />
          </motion.svg>
        );

      default:
        return null;
    }
  };

  const randomDelayRef = useRef(Math.random() * -2);
  const isSparkle = type === 'sparkle';

  return (
    <span className={`pointer-events-none select-none ${className}`}>
      <span 
        className={isSparkle ? 'doodle-pulse' : 'doodle-wiggle'} 
        style={{ 
          animationDelay: `${randomDelayRef.current}s`, 
          display: 'inline-block', 
          width: '100%', 
          height: '100%' 
        }}
      >
        {renderDoodle()}
      </span>
    </span>
  );
};
