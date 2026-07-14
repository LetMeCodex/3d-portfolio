// src/components/WeatherSystem.tsx
import React, { useState, useEffect } from "react";
import { CloudRain, Wind, X, Sparkles } from "lucide-react";
import { weatherAudio } from "../lib/audioFX";
import RainBackground from "./RainBackground";
import SakuraBackground from "./SakuraBackground";
import { motion, AnimatePresence } from "motion/react";
import { AestheticWeatherToggle } from "./ui/AestheticWeatherToggle";
import "./ui/SplashButton.css";

import { useSeason } from "../context/SeasonContext";

export function WeatherSystem() {
  const { activeEffect, setActiveEffect } = useSeason();

  const [lastMode, setLastMode] = useState<'sakura' | 'rain'>('sakura');
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    // Handle audio transitions
    if (activeEffect === "sakura") {
      weatherAudio.stopWind(); // Stop possible storm
      setTimeout(() => weatherAudio.playWind('gentle'), 50); // Small timeout to ensure old node clears if switching fast
      weatherAudio.stopRain();
    } else if (activeEffect === "rain") {
      weatherAudio.playRain();
      weatherAudio.stopWind();
      setTimeout(() => weatherAudio.playWind('storm'), 50);
    } else {
      weatherAudio.stopRain();
      weatherAudio.stopWind();
    }

    // Cleanup on unmount
    return () => {};
  }, [activeEffect]);

  return (
    <>
      {activeEffect === "sakura" && <SakuraBackground zIndex={40} aggressive={true} />}
      {activeEffect === "rain" && <RainBackground zIndex={40} fast={true} />}

      <div className="absolute top-24 right-6 md:top-28 md:right-12 z-50 flex flex-col items-end gap-2 pointer-events-auto">
        <AnimatePresence mode="wait">
          {activeEffect === "none" ? (
            <motion.button
              key="turn-on"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={() => {
                if (!confirming) {
                  setConfirming(true);
                  // Optional: reset after 3 seconds if they don't click
                  setTimeout(() => setConfirming(false), 3000);
                } else {
                  setActiveEffect(lastMode);
                  setConfirming(false);
                }
              }}
              className="splash-btn"
            >
              <span>{confirming ? "ARE YOU SURE?" : "UNVEIL"}</span>
            </motion.button>
          ) : (
            <motion.div
              key="toggle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-2 bg-white/40 backdrop-blur-md p-1.5 pr-2 rounded-[2.5rem] border border-white/20 shadow-xl"
            >
              <AestheticWeatherToggle 
                mode={activeEffect as 'sakura' | 'rain'} 
                onChange={(mode) => setActiveEffect(mode)} 
              />
              <button
                onClick={() => {
                  setLastMode(activeEffect as 'sakura' | 'rain');
                  setActiveEffect("none");
                }}
                className="p-2 rounded-full bg-black/5 hover:bg-black/10 text-gray-600 transition-all"
                title="Clear Weather"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
